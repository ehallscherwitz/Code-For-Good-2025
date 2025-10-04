const express = require('express');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
      const { data, error } = await req.supabase.from('school').select('*');
      if (error) throw error;
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });


  router.get('/:id', async(req, res) =>{
    try{
        id =req.params.id;
        const {data, error} = await req.supabase.from('school').select('*').eq('id', id);
        if (error){

            throw error;
        }

        res.json(data);

    }catch (error){

        res.status(500).json({error: error.message});
    }
});


  

  router.delete('/:id', async (req, res) => {
    try {
      const { error } = await req.supabase.from('school').delete().eq('id', req.params.id);
      if (error) throw error;
      res.json({ message: 'School deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  module.exports = router;