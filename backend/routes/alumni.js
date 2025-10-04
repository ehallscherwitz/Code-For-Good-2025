const express = require('express');
const router = express.Router();

// GET all alumni
router.get('/', async (req, res) => {
  try {
    const { data, error } = await req.supabase.from('alumni').select('*');
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET alumni by graduation year (⚠️ only works if column exists in alumni table)
router.get('/year/:year', async (req, res) => {
  try {
    const { data, error } = await req.supabase
      .from('alumni')
      .select('*')
      .eq('graduation_year', req.params.year);
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Promote graduated athletes to alumni
router.post('/promote-graduates', async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();

    // Fetch athletes who graduated before current year
    const { data: graduatedAthletes, error: fetchError } = await req.supabase
      .from('athlete')
      .select('*')
      .lt('graduation_year', currentYear);

    if (fetchError) throw fetchError;

    if (!graduatedAthletes || graduatedAthletes.length === 0) {
      return res.status(404).json({ message: 'No graduated athletes found' });
    }

    // Map athletes into alumni rows
    const alumniData = graduatedAthletes.map((athlete) => ({
      alumni_name: athlete.athlete_name,
      alumni_email: athlete.athlete_email,
      alumni_phone_number: athlete.phone_number.toString(),
      location: athlete.athlete_address
        ? { address: athlete.athlete_address }
        : {}
    }));

    // Insert new alumni
    const { data: newAlumni, error: insertError } = await req.supabase
      .from('alumni')
      .insert(alumniData)
      .select();

    if (insertError) throw insertError;

    res.json({
      message: `Successfully promoted ${newAlumni?.length || 0} athletes to alumni`,
      alumni: newAlumni,
      promoted_count: graduatedAthletes.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Check who is ready for promotion
router.get('/check-graduates', async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();

    const { data: graduatedAthletes, error } = await req.supabase
      .from('athlete')
      .select('athlete_id, athlete_name, graduation_year, athlete_email')
      .lt('graduation_year', currentYear);

    if (error) throw error;

    res.json({
      message: `${graduatedAthletes.length} athletes are ready for promotion`,
      athletes: graduatedAthletes,
      current_year: currentYear,
      ready_for_alumni: graduatedAthletes.length > 0
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add a new alumni manually
router.post('/', async (req, res) => {
  try {
    const {
      alumni_name,
      alumni_email,
      alumni_phone_number,
      location
    } = req.body;

    const { data, error } = await req.supabase.from('alumni').insert({
      alumni_name,
      alumni_email,
      alumni_phone_number,
      location: location || {}
    }).select();

    if (error) throw error;

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete alumni
router.delete('/:alumni_id', async (req, res) => {
  try {
    const { error } = await req.supabase
      .from('alumni')
      .delete()
      .eq('alumni_id', req.params.alumni_id);

    if (error) throw error;
    res.json({ message: 'Alumni deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
