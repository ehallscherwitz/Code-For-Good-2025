const express = require("express");
const router = express.Router();
const supabase = require("../config/supabase");

const MODEL = process.env.GEMINI_MODEL || "gemini-1.5-flash";

router.post("/family/:family_id", async (req, res) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "GEMINI_API_KEY missing" });
    }

    const familyId = req.params.family_id;

    const { data: family, error: famErr } = await supabase
      .from("family")
      .select("parent_id, location, children")
      .eq("parent_id", familyId)
      .single();
    if (famErr || !family) {
      return res.status(404).json({ error: "Family not found" });
    }

    const { data: schools, error: schoolsErr } = await supabase
      .from("school")
      .select("id, name, location");
    if (schoolsErr) throw schoolsErr;
    if (!schools || schools.length === 0) {
      return res.json({
        success: true,
        family_id: familyId,
        recommendations: [],
        reason: "No schools in DB"
      });
    }

    const { data: teamsRaw, error: teamsErr } = await supabase
      .from("team")
      .select("team_id, team_name, sport, school_id");
    if (teamsErr) throw teamsErr;
    const teams = teamsRaw || [];

    const teamsBySchool = new Map();
    for (const t of teams) {
      if (!teamsBySchool.has(t.school_id)) teamsBySchool.set(t.school_id, []);
      teamsBySchool.get(t.school_id).push({
        team_id: t.team_id,
        team_name: t.team_name,
        sport: t.sport
      });
    }

    const candidates = schools.map((s) => ({
      school_id: s.id,
      school_name: s.name,
      school_location: s.location || {},
      teams: teamsBySchool.get(s.id) || []
    }));

    const instruction = `
You are a deterministic ranking function.

Task:
Given (A) family info (location + children JSON) and (B) candidate schools (location + teams),
return EXACTLY the top 3 school_ids as a JSON array (no extra text).

Ranking rubric:
1) Safety/compatibility from children JSON (e.g., cold-sensitive → avoid ice hockey contexts; chlorine allergy → avoid swimming).
2) Location fit if comparable fields exist (city/state/zip) between family and school.
3) Sports breadth as tie-breaker; if still tied, alphabetical by school_name.
If data is insufficient to distinguish, pick the first 3 schools as provided.

Return STRICT JSON ONLY:
["school_id_1","school_id_2","school_id_3"]
`.trim();

    const payload = {
      family: { location: family.location || {}, children: family.children || {} },
      candidates
    };

    const body = {
      contents: [
        { role: "user", parts: [{ text: instruction }] },
        { role: "user", parts: [{ text: JSON.stringify(payload) }] }
      ],
      generationConfig: {
        response_mime_type: "application/json",
        temperature: 0
      }
    };

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${process.env.GEMINI_API_KEY}`;
    const resp = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    if (!resp.ok) {
      const txt = await resp.text();
      const fallback = candidates.slice(0, 3).map((c) => c.school_id);
      return res.json({
        success: true,
        family_id: familyId,
        school_ids: fallback,
        recommendations: await (async () => {
          const { data: details } = await supabase.from("school").select("*").in("id", fallback);
          return details || [];
        })(),
        reason: `Gemini error; defaulted to first 3. ${txt.slice(0, 200)}`
      });
    }

    const gem = await resp.json();
    const text = gem?.candidates?.[0]?.content?.parts?.[0]?.text ?? "[]";

    let top3;
    try {
      top3 = JSON.parse(text);
      if (!Array.isArray(top3)) throw new Error("Not an array");
    } catch {
      top3 = candidates.slice(0, 3).map((c) => c.school_id);
    }

    const validIds = new Set(candidates.map((c) => c.school_id));
    const filtered = top3.filter((id) => validIds.has(id));
    const deduped = [...new Set(filtered)];
    const finalIds =
      deduped.length >= 3
        ? deduped.slice(0, 3)
        : [
            ...deduped,
            ...candidates
              .map((c) => c.school_id)
              .filter((id) => !deduped.includes(id))
              .slice(0, 3 - deduped.length)
          ];

    const { data: detailsRaw, error: detailErr } = await supabase
      .from("school")
      .select("*")
      .in("id", finalIds);
    if (detailErr) throw detailErr;

    const byId = new Map((detailsRaw || []).map((r) => [r.id, r]));
    const details = finalIds.map((id) => byId.get(id)).filter(Boolean);

    return res.json({
      success: true,
      family_id: familyId,
      school_ids: finalIds,
      recommendations: details
    });
  } catch (error) {
    return res.status(500).json({ error: error.message || "Internal error" });
  }
});

module.exports = router;
