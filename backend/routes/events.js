const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { data, error } = await req.supabase.from('EVENT').select('*');
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/family/:family_id', async (req, res) => {
  try {
    const { data, error } = await req.supabase.from('EVENT').select('*').eq('parent_id', req.params.family_id);
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/athlete/:athlete_id', async (req, res) => {
  try {
    const { data, error } = await req.supabase.from('EVENT').select('*').eq('athlete_id', req.params.athlete_id);
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:event_id', async (req, res) => {
  try {
    const eventId = req.params.event_id;
    const { data, error } = await req.supabase.from('EVENT').select('*').eq('event_id', eventId);
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

    if (!title || !event_date || !event_time || !location) {
      return res.status(400).json({ 
        error: 'Missing required fields: title, event_date, event_time, location' 
      });
    }

    const eventData = {
      title,
      description: description || null,
      event_date,
      event_time,
      location,
      event_type: event_type || 'other',
      attendees: attendees || 'matched',
      special_notes: special_notes || null,
      contact_email: contact_email || null,
      parent_id: parent_id || null,
      athlete_id: athlete_id || null
    };

    const { data, error } = await req.supabase.from('EVENT').insert([eventData]).select();

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
      .from('EVENT')
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
    
    const { error } = await req.supabase.from('EVENT').delete().eq('event_id', eventId);
    
    if (error) throw error;

    res.json({ message: 'Event deleted successfully' });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;