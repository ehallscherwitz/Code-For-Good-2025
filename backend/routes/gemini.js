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

    console.log(`Processing recommendations for family_id: ${familyId}`);
    
    // 1) Load family
    const { data: family, error: famErr } = await supabase
      .from("family")
      .select("parent_id, location, children, team_id")
      .eq("parent_id", familyId)
      .single();
    
    console.log(`Family data loaded:`, { family, familyId });
    
    if (famErr || !family) {
      console.log(`Family not found for ID: ${familyId}`);
      return res.status(404).json({ error: "Family not found" });
    }

    // 2) Load schools and teams
    const { data: schools, error: schoolsErr } = await supabase
      .from("school")
      .select("id, name, location");
    if (schoolsErr) {
      console.log(`Error loading schools:`, schoolsErr);
      throw schoolsErr;
    }

    console.log(`Schools loaded: ${schools?.length || 0} schools`);

    if (!schools || schools.length === 0) {
      console.log(`No schools found in database`);
      return res.json({
        success: true,
        family_id: familyId,
        school_ids: [],
        selected_team_id: null,
        recommendations: [],
        reason: "No schools in DB"
      });
    }

    const { data: teamsRaw, error: teamsErr } = await supabase
      .from("team")
      .select("team_id, team_name, sport, school_id");
    if (teamsErr) {
      console.log(`Error loading teams:`, teamsErr);
      throw teamsErr;
    }

    const teams = teamsRaw || [];
    console.log(`Teams loaded: ${teams.length} teams`);
    
    const teamsBySchool = new Map();
    for (const t of teams) {
      if (!teamsBySchool.has(t.school_id)) teamsBySchool.set(t.school_id, []);
      teamsBySchool.get(t.school_id).push({
        team_id: t.team_id,
        team_name: t.team_name,
        sport: t.sport
      });
    }
    
    console.log(`Teams organized by school:`, Object.fromEntries(teamsBySchool));

    const candidates = schools.map((s) => ({
      school_id: s.id,
      school_name: s.name,
      school_location: s.location || {},
      teams: teamsBySchool.get(s.id) || []
    }));
    
    console.log(`Candidates prepared for AI ranking:`, candidates.length, 'schools');

    // 3) Deterministic Gemini call for the TOP 3 school_ids
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

    console.log(`Calling Gemini AI with ${candidates.length} schools...`);
    
    // NOTE: Node 18+ has global fetch. If not, import('node-fetch')
    const resp = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    let top3;
    if (!resp.ok) {
      console.log(`Gemini API call failed:`, resp.status, resp.statusText);
      top3 = candidates.slice(0, 3).map((c) => c.school_id);
      console.log(`Falling back to first 3 schools:`, top3);
    } else {
      const gem = await resp.json();
      const text = gem?.candidates?.[0]?.content?.parts?.[0]?.text ?? "[]";
      console.log(`Gemini response:`, text);
      try {
        const parsed = JSON.parse(text);
        top3 = Array.isArray(parsed) ? parsed : candidates.slice(0, 3).map((c) => c.school_id);
        console.log(`AI selected top 3 schools:`, top3);
      } catch (parseErr) {
        console.log(`Failed to parse Gemini response:`, parseErr);
        top3 = candidates.slice(0, 3).map((c) => c.school_id);
      }
    }

    // 4) Sanitize top3 against known schools
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
    
    console.log(`Final school rankings validated:`, finalIds);

    // 5) Choose a TEAM for the top-ranked school
    const topSchoolId = finalIds[0] || null;
    console.log(`Top-ranked school ID: ${topSchoolId}`);
    let selectedTeamId = null;

    if (topSchoolId) {
      const schoolTeams = teamsBySchool.get(topSchoolId) || [];
      console.log(`Available teams for top school ${topSchoolId}:`, schoolTeams);

      const childInterests = [];
      
      if (family.children) {
        console.log(`Analyzing child interests from family data:`, family.children);
        
        if (Array.isArray(family.children)) {
          for (const c of family.children) {
            if (c?.sport) childInterests.push(String(c.sport).toLowerCase());
            if (c?.childSport) childInterests.push(String(c.childSport).toLowerCase());
          }
        } else if (typeof family.children === "object") {
          if (family.children.childSport) childInterests.push(String(family.children.childSport).toLowerCase());
          if (family.children.sport) childInterests.push(String(family.children.sport).toLowerCase());
          if (Array.isArray(family.children.interests)) {
            for (const i of family.children.interests) childInterests.push(String(i).toLowerCase());
          }
        }
      }
      
       console.log(`Extracted child sport interests:`, childInterests);

      const match = schoolTeams.find(t =>
        childInterests.some(i => i && t.sport && String(t.sport).toLowerCase().includes(i))
      );

      console.log(`Team matching result:`, { match, interestMatch: !!match });

      selectedTeamId = (match?.team_id) || (schoolTeams[0]?.team_id) || null;
      console.log(`Final team selection:`, selectedTeamId);

      if (selectedTeamId) {
        console.log(`Updating family ${familyId} with team_id: ${selectedTeamId}`);
        
        const { error: upErr } = await supabase
          .from("family")
          .update({ team_id: selectedTeamId })
          .eq("parent_id", familyId);

        if (upErr) {
          console.log(`Failed to update family with team_id:`, upErr);
          return res.json({
            success: true,
            family_id: familyId,
            school_ids: finalIds,
            selected_team_id: null,
            recommendations: [{ id: topSchoolId }],
            reason: `Selected team computed but failed to persist: ${upErr.message}`
          });
        }
        
        console.log(`Successfully updated family ${familyId} with team_id ${selectedTeamId}`);
      } else {
        console.log(`No team selected for family ${familyId}`);
      }
    }

    console.log(`Fetching school details for UI...`);
    const { data: detailsRaw } = await supabase
      .from("school")
      .select("*")
      .in("id", finalIds);

    const byId = new Map((detailsRaw || []).map((r) => [r.id, r]));
    const details = finalIds.map((id) => byId.get(id)).filter(Boolean);

    console.log(`Recommendation complete. Returning response:`, {
      success: true,
      family_id: familyId,
      school_ids: finalIds,
      selected_team_id: selectedTeamId,
      recommendations_count: details.length
    });

    return res.json({
      success: true,
      family_id: familyId,
      school_ids: finalIds,
      selected_team_id: selectedTeamId,
      recommendations: details
    });
  } catch (error) {
    console.log(`Error in recommendation process:`, error.message);
    console.log(`Full error stack:`, error);
    return res.status(500).json({ error: error.message || "Internal error" });
  }
});

module.exports = router;
