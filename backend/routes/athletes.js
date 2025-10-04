const express = require('express');
const router = express.Router();


router.get('/', async (req, res) => {
  try {
    const { data, error } = await req.supabase
      .from('athlete')
      .select('*');

    if (error) throw error;
    res.json(data || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.get('/school/:school_id', async (req, res) => {
  try {
    const schoolId = req.params.school_id;

    const { data, error } = await req.supabase
      .from('athlete')
      .select(`
        athlete_id,
        athlete_name,
        team_id,
        phone_number,
        athlete_email,
        athlete_address,
        updated_at,
        graduation_year,
        team:team_id (
          team_id,
          team_name,
          sport,
          school_id
        )
      `)
      .eq('team.school_id', schoolId);

    if (error) throw error;
    res.json(data || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.get('/team/:team_id', async (req, res) => {
  try {
    const { data, error } = await req.supabase
      .from('athlete')
      .select('*')
      .eq('team_id', req.params.team_id);

    if (error) throw error;
    res.json(data || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.get('/:athlete_id', async (req, res) => {
  try {
    const { data, error } = await req.supabase
      .from('athlete')
      .select('*')
      .eq('athlete_id', req.params.athlete_id)
      .maybeSingle();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Athlete not found' });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.post('/', async (req, res) => {
  try {
    const {
      athlete_name,
      team_id,
      phone_number,
      athlete_email,
      athlete_address,
      graduation_year
    } = req.body;


    const digits = String(phone_number ?? '').replace(/[^\d]/g, '');
    const phoneNum = digits ? Number(digits) : null;

    const insertPayload = {
      athlete_name,
      team_id: team_id || null,
      phone_number: phoneNum,
      athlete_email,
      athlete_address,
      graduation_year: typeof graduation_year === 'number'
        ? graduation_year
        : Number(graduation_year) || null
    };

    const { data, error } = await req.supabase
      .from('athlete')
      .insert(insertPayload)
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.delete('/:athlete_id', async (req, res) => {
  try {
    const { error } = await req.supabase
      .from('athlete')
      .delete()
      .eq('athlete_id', req.params.athlete_id);

    if (error) throw error;
    res.json({ message: 'Athlete deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
