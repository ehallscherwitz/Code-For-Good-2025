const express = require('express');
const router = express.Router();

// Get random scrapbook images
router.get('/', async (req, res) => {
  try {
    const { data, error } = await req.supabase
      .from('scrapbook_images')
      .select('*')
      .order('uploaded_at', { ascending: false })
      .limit(10);

    if (error) throw error;

    // Shuffle and take 5 random images
    const shuffled = data.sort(() => 0.5 - Math.random());
    const randomImages = shuffled.slice(0, 5);
    
    res.json(randomImages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all scrapbook images (for admin purposes)
router.get('/all', async (req, res) => {
  try {
    const { data, error } = await req.supabase
      .from('scrapbook_images')
      .select('*')
      .order('uploaded_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get image metadata by ID
router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await req.supabase
      .from('scrapbook_images')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete image (users can only delete their own)
router.delete('/:id', async (req, res) => {
  try {
    const { data, error } = await req.supabase
      .from('scrapbook_images')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;
    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
