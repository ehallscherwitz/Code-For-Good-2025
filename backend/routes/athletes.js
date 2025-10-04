const express = require('express');

const router = express.Router();


router.get('/', async (req, res) => {
    try {
      const { data, error } = await req.supabase.from('ATHLETE').select('*');
      if (error) throw error;
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});

router.get('/school/:school_id', async(req, res)=>{
    try{
        const {data, error} = await req.supabase.from('ATHLETE').select('*').eq('school_id', req.params.school_id);
        if (error){
            throw error;
        }
        res.json(data);
    }catch (error){
        res.status(500).json({error: error.message});
    }
});


router.get('/team/:team_id', async(req, res)=>{
    try{
        const {data, error} = await req.supabase.from('ATHLETE').select('*').eq('team_id', req.params.team_id);
        if (error){
            throw error;
        }
        res.json(data);
    }catch (error){
        res.status(500).json({error: error.message});
    }
});


router.get('/:athlete_id', async(req, res) =>{
    try{
        const athlete_id = req.params.athlete_id;
        const {data, error} = await req.supabase.from('ATHLETE').select('*').eq('athlete_id', athlete_id);
        
        if (error){
            throw error;
        }
        
        res.json(data[0]);
        
    }catch (error){
        res.status(500).json({error: error.message});
    }
});


router.post('/', async(req, res) =>{
    try{
        const {athlete_name, team_id, phone_number, athlete_email, athlete_address, athlete_number, graduation_year} = req.body;
        
        const {data, error} = await req.supabase.from('ATHLETE').insert({
            athlete_name, 
            team_id, 
            phone_number:'+1' +req.body.phone,
            athlete_email, 
            athlete_address, 
            athlete_number, 
            graduation_year
        });

        if (error){
            throw error;
        }

        res.json(data);

    }catch (error){
        res.status(500).json({error: error.message});
    }
});





router.delete('/:athlete_id', async (req, res) => {
    try {
      const { error } = await req.supabase.from('ATHLETE').delete().eq('athlete_id', req.params.athlete_id);
      if (error) throw error;
      res.json({ message: 'Athlete deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});

module.exports = router;