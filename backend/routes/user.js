const express = require('express');
const router = express.Router();

router.get('/users/:user_id/profile', async (req, res) => {
  const user_id = req.params.user_id;
  console.log('[GET /users/:user_id/profile] start', { user_id });

  console.time(`profile_${user_id}`);
  try {
    console.log('[profile] querying family and athlete by user_id');

    const [famQ, athQ] = await Promise.all([
      req.supabase.from('family').select('*').eq('user_id', user_id).maybeSingle(),
      req.supabase.from('athlete').select('*').eq('user_id', user_id).maybeSingle()
    ]);

    if (famQ.error) {
      console.error('[profile] family query error', { error: famQ.error.message });
      console.timeEnd(`profile_${user_id}`);
      return res.status(500).json({ error: famQ.error.message });
    }
    if (athQ.error) {
      console.error('[profile] athlete query error', { error: athQ.error.message });
      console.timeEnd(`profile_${user_id}`);
      return res.status(500).json({ error: athQ.error.message });
    }

    const family = famQ.data || null;
    const athlete = athQ.data || null;

    console.log('[profile] query results', {
      hasFamily: !!family,
      hasAthlete: !!athlete,
      family_parent_id: family?.parent_id || null,
      athlete_athlete_id: athlete?.athlete_id || null
    });

    if (!family && !athlete) {
      console.warn('[profile] no account found for user_id', { user_id });
      console.timeEnd(`profile_${user_id}`);
      return res.status(404).json({ error: 'No account found for this user_id' });
    }

    if (family && athlete) {
      console.warn('[profile] both family and athlete records exist for user_id', {
        user_id,
        family_parent_id: family.parent_id,
        athlete_athlete_id: athlete.athlete_id
      });
      console.timeEnd(`profile_${user_id}`);
      return res.status(409).json({
        error: 'User has both family and athlete records',
        family_parent_id: family.parent_id,
        athlete_athlete_id: athlete.athlete_id
      });
    }

    if (family) {
      console.log('[profile] resolving team/school for family', {
        user_id,
        parent_id: family.parent_id,
        team_id: family.team_id || null
      });

      let team = null;
      let school = null;

      if (family.team_id) {
        const teamQ = await req.supabase
          .from('team')
          .select('*')
          .eq('team_id', family.team_id)
          .maybeSingle();

        if (teamQ.error) {
          console.error('[profile] team fetch error (family)', {
            team_id: family.team_id,
            error: teamQ.error.message
          });
          console.timeEnd(`profile_${user_id}`);
          return res.status(500).json({ error: teamQ.error.message });
        }
        team = teamQ.data || null;
        console.log('[profile] team resolved (family)', {
          team_id: team?.team_id || null,
          team_name: team?.team_name || null,
          school_id: team?.school_id || null
        });

        if (team?.school_id) {
          const schoolQ = await req.supabase
            .from('school')
            .select('*')
            .eq('id', team.school_id)
            .maybeSingle();

          if (schoolQ.error) {
            console.error('[profile] school fetch error (family)', {
              school_id: team.school_id,
              error: schoolQ.error.message
            });
            console.timeEnd(`profile_${user_id}`);
            return res.status(500).json({ error: schoolQ.error.message });
          }
          school = schoolQ.data || null;
          console.log('[profile] school resolved (family)', {
            school_id: school?.id || null,
            school_name: school?.name || null
          });
        }
      } else {
        console.log('[profile] family has no team_id', { parent_id: family.parent_id });
      }

      console.log('[profile] responding (family)', {
        user_id,
        parent_id: family.parent_id,
        team_id: team?.team_id || null,
        school_id: school?.id || null
      });
      console.timeEnd(`profile_${user_id}`);

      return res.json({
        user_id,
        role: 'family',
        parent_id: family.parent_id,
        profile: family,
        team,
        school
      });
    }

    console.log('[profile] resolving team/school for athlete', {
      user_id,
      athlete_id: athlete.athlete_id,
      team_id: athlete.team_id || null
    });

    let team = null;
    let school = null;

    if (athlete.team_id) {
      const teamQ = await req.supabase
        .from('team')
        .select('*')
        .eq('team_id', athlete.team_id)
        .maybeSingle();

      if (teamQ.error) {
        console.error('[profile] team fetch error (athlete)', {
          team_id: athlete.team_id,
          error: teamQ.error.message
        });
        console.timeEnd(`profile_${user_id}`);
        return res.status(500).json({ error: teamQ.error.message });
      }
      team = teamQ.data || null;
      console.log('[profile] team resolved (athlete)', {
        team_id: team?.team_id || null,
        team_name: team?.team_name || null,
        school_id: team?.school_id || null
      });

      if (team?.school_id) {
        const schoolQ = await req.supabase
          .from('school')
          .select('*')
          .eq('id', team.school_id)
          .maybeSingle();

        if (schoolQ.error) {
          console.error('[profile] school fetch error (athlete)', {
            school_id: team.school_id,
            error: schoolQ.error.message
          });
          console.timeEnd(`profile_${user_id}`);
          return res.status(500).json({ error: schoolQ.error.message });
        }
        school = schoolQ.data || null;
        console.log('[profile] school resolved (athlete)', {
          school_id: school?.id || null,
          school_name: school?.name || null
        });
      }
    } else {
      console.log('[profile] athlete has no team_id', { athlete_id: athlete.athlete_id });
    }

    console.log('[profile] responding (athlete)', {
      user_id,
      athlete_id: athlete.athlete_id,
      team_id: team?.team_id || null,
      school_id: school?.id || null
    });
    console.timeEnd(`profile_${user_id}`);

    return res.json({
      user_id,
      role: 'athlete',
      athlete_id: athlete.athlete_id,
      profile: athlete,
      team,
      school
    });
  } catch (err) {
    console.error('[profile] unhandled error', { user_id, error: err?.message });
    console.timeEnd(`profile_${user_id}`);
    return res.status(500).json({ error: err?.message || 'Internal error' });
  }
});

module.exports = router;
