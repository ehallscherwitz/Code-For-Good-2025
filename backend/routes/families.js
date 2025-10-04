const express = require('express');
const router = express.Router();


router.get('/', async (req, res) => {
  try {
    const { data, error } = await req.supabase.from('family').select('*');
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Get family by Supabase user_id
router.get('/user/:user_id', async (req, res) => {
  try {
    const { data, error } = await req.supabase
      .from('family')
      .select('*')
      .eq('user_id', req.params.user_id)
      .maybeSingle();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Family not found' });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:parent_id', async (req, res) => {
  try {
    const { data, error } = await req.supabase
      .from('family')
      .select('*')
      .eq('parent_id', req.params.parent_id)
      .single(); 

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


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
      .select(); 

    if (error) throw error;

    res.json(data[0]); 
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
