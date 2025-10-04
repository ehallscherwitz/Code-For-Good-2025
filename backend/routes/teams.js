const express = require('express');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
      const { data, error } = await req.supabase.from('team').select('*');
      if (error) throw error;
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });


  router.get('/:id', async(req, res) =>{
    try{
        id =req.params.id;
        const {data, error} = await req.supabase.from('team').select('*').eq('team_id', id);
        if (error){

            throw error;
        }

        res.json(data);

    }catch (error){

        res.status(500).json({error: error.message});
    }
    });


    router.post('/', async(req, res) =>{



        try{

            const {team_name, school_id, sport} = req.body;

            const {data, error} = await req.supabase.from('team').insert({team_name, school_id, sport});

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
          const { error } = await req.supabase.from('team').delete().eq('team_id', req.params.id);
          if (error) throw error;
          res.json({ message: 'Team deleted successfully' });
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
      });
  
  module.exports = router;