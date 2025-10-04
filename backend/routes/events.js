const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { data, error } = await req.supabase.from('event').select('*');
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/family/:family_id', async (req, res) => {
  try {
    const { data, error } = await req.supabase.from('event').select('*').eq('parent_id', req.params.family_id);
    if (error) throw error;
    res.json(data); 
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/athlete/:athlete_id', async (req, res) => {
  try {
    const { data, error } = await req.supabase.from('event').select('*').eq('athlete_id', req.params.athlete_id);
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:event_id', async (req, res) => {
  try {
    const eventId = req.params.event_id;
    const { data, error } = await req.supabase.from('event').select('*').eq('event_id', eventId);
    if (error) throw error;
    
    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    res.json(data[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const {
      title,
      description,
      event_date,
      event_time,
      location,
      event_type,
      attendees,
      special_notes,
      contact_email,
      parent_id,
      athlete_id
    } = req.body;

    if (!title || !description || !event_date || !event_time || !location) {
      return res.status(400).json({ 
        error: 'Missing required fields: title, description, event_date, event_time, location' 
      });
    }

    const eventData = {
      event_name: title,
      event_description: description,
      event_date,
      event_time,
      event_location: location,
      event_status: 'active',
      event_type: event_type || null,
      parent_id: parent_id || null,
      athlete_id: athlete_id || null,
      team_id: null // Can be set later if needed
    };

    const { data, error } = await req.supabase.from('event').insert([eventData]).select();

    if (error) throw error;

    res.status(201).json({
      message: 'Event created successfully',
      event: data[0]
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:event_id', async (req, res) => {
  try {
    const eventId = req.params.event_id;
    const updates = req.body;

    delete updates.event_id;

    const { data, error } = await req.supabase
      .from('event')
      .update(updates)
      .eq('event_id', eventId)
      .select();

    if (error) throw error;

    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json({
      message: 'Event updated successfully',
      event: data[0]
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:event_id', async (req, res) => {
  try {
    const eventId = req.params.event_id;
    
    const { error } = await req.supabase.from('event').delete().eq('event_id', eventId);
    
    if (error) throw error;

    res.json({ message: 'Event deleted successfully' });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;