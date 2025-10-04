const express = require('express');
const router = express.Router();

// GET all families
router.get('/', async (req, res) => {
  try {
    const { data, error } = await req.supabase.from('family').select('*');
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET one family by parent_id
router.get('/:parent_id', async (req, res) => {
  try {
    const { data, error } = await req.supabase
      .from('family')
      .select('*')
      .eq('parent_id', req.params.parent_id)
      .single(); // ensures one row or error

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new family
router.post('/', async (req, res) => {
  try {
    const {
      parent_name,
      parent_email,
      parent_phone_number,
      location,
      children
    } = req.body;

    const { data, error } = await req.supabase
      .from('family')
      .insert([{
        parent_name,
        parent_email,
        parent_phone_number,
        location: location || {},
        children: children || {}
      }])
      .select(); // return inserted row

    if (error) throw error;

    res.json(data[0]); // return the inserted family
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
