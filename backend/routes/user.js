const express = require('express');
const router = express.Router();

router.get('/users/:user_id/profile', async (req, res) => {
  try {
    const user_id = req.params.user_id;

    const [famQ, athQ] = await Promise.all([
      req.supabase.from('family').select('*').eq('user_id', user_id).maybeSingle(),
      req.supabase.from('athlete').select('*').eq('user_id', user_id).maybeSingle()
    ]);

    if (famQ.error) return res.status(500).json({ error: famQ.error.message });
    if (athQ.error) return res.status(500).json({ error: athQ.error.message });

    const family = famQ.data || null;
    const athlete = athQ.data || null;

    if (!family && !athlete) {
      return res.status(404).json({ error: 'No account found for this user_id' });
    }

    if (family && athlete) {
      return res.status(409).json({
        error: 'User has both family and athlete records',
        family_parent_id: family.parent_id,
        athlete_athlete_id: athlete.athlete_id
      });
    }

    if (family) {
      // If you also want team/school when a family has team_id set:
      let team = null;
      let school = null;
      if (family.team_id) {
        const teamQ = await req.supabase.from('team').select('*').eq('team_id', family.team_id).maybeSingle();
        if (teamQ.error) return res.status(500).json({ error: teamQ.error.message });
        team = teamQ.data || null;

        if (team?.school_id) {
          const schoolQ = await req.supabase.from('school').select('*').eq('id', team.school_id).maybeSingle();
          if (schoolQ.error) return res.status(500).json({ error: schoolQ.error.message });
          school = schoolQ.data || null;
        }
      }

      return res.json({
        user_id,
        role: 'family',
        parent_id: family.parent_id,
        profile: family,
        team,
        school
      });
    }

    // athlete
    let team = null;
    let school = null;

    if (athlete.team_id) {
      const teamQ = await req.supabase.from('team').select('*').eq('team_id', athlete.team_id).maybeSingle();
      if (teamQ.error) return res.status(500).json({ error: teamQ.error.message });
      team = teamQ.data || null;

      if (team?.school_id) {
        const schoolQ = await req.supabase.from('school').select('*').eq('id', team.school_id).maybeSingle();
        if (schoolQ.error) return res.status(500).json({ error: schoolQ.error.message });
        school = schoolQ.data || null;
      }
    }

    return res.json({
      user_id,
      role: 'athlete',
      athlete_id: athlete.athlete_id,
      profile: athlete,
      team,
      school
    });
  } catch (err) {
    return res.status(500).json({ error: err?.message || 'Internal error' });
  }
});

module.exports = router;
