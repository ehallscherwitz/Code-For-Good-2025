const express = require('express');
const router = express.Router();

// Handle survey submissions for different account types
router.post('/family', async (req, res) => {
  try {
    const {
      parentName,
      parentPhone,
      parentEmail,
      zipCode,
      childName,
      childDateOfBirth,
      childGender,
      childSport,
      childCondition
    } = req.body;

    // Create family record in database
    const { data: family, error: familyError } = await req.supabase
      .from('family')
      .insert([{
        parent_name: parentName,
        parent_email: parentEmail,
        parent_phone_number: parentPhone,
        location: { zip_code: zipCode },
        children: {
          name: childName,
          birth_date: childDateOfBirth,
          gender: childGender,
          sport: childSport,
          medical_conditions: childCondition || null
        }
      }])
      .select();

    if (familyError) {
      console.error('Family creation error:', familyError);
      return res.status(500).json({ 
        error: 'Failed to create family', 
        details: familyError.message 
      });
    }

    res.json({
      message: 'Family survey submitted successfully',
      family_id: family[0].parent_id,
      data: family[0]
    });

  } catch (error) {
    console.error('Survey submission error:', error);
    res.status(500).json({ 
      error: 'Failed to process family survey',
      details: error.message 
    });
  }
});

router.post('/athlete', async (req, res) => {
  try {
    const {
      athleteName,
      athleteEmail,
      athletePhone,
      athleteSchool,
      athleteLocation,
      athleteSport,
      athleteGraduationDate
    } = req.body;

    // Create athlete record in database
    const { data: athlete, error: athleteError } = await req.supabase
      .from('athlete')
      .insert([{
        athlete_name: athleteName,
        athlete_email: athleteEmail,
        phone_number: '+1' + athletePhone.replace(/\D/g, ''), // Clean and format phone
        athlete_school: athleteSchool,
        athlete_address: athleteLocation,
        graduation_year: new Date(athleteGraduationDate).getFullYear(),
        sport: athleteSport
      }])
      .select();

    if (athleteError) {
      console.error('Athlete creation error:', athleteError);
      return res.status(500).json({ 
        error: 'Failed to create athlete', 
        details: athleteError.message 
      });
    }

    res.json({
      message: 'Athlete survey submitted successfully',
      athlete_id: athlete[0].athlete_id,
      data: athlete[0]
    });

  } catch (error) {
    console.error('Survey submission error:', error);
    res.status(500).json({ 
      error: 'Failed to process athlete survey',
      details: error.message 
    });
  }
});

router.post('/coach', async (req, res) => {
  try {
    const {
      coachName,
      coachEmail,
      coachPhone,
      coachSchool,
      coachLocation
    } = req.body;

    // Create coach record in database
    const { data: coach, error: coachError } = await req.supabase
      .from('coach')
      .insert([{
        coach_name: coachName,
        coach_email: coachEmail,
        coach_phone: '+1' + coachPhone.replace(/\D/g, ''), // Clean and format phone
        school_name: coachSchool,
        coach_location: coachLocation
      }])
      .select();

    if (coachError) {
      console.error('Coach creation error:', coachError);
      return res.status(500).json({ 
        error: 'Failed to create coach', 
        details: coachError.message 
      });
    }

    res.json({
      message: 'Coach survey submitted successfully',
      coach_id: coach[0].coach_id,
      data: coach[0]
    });

  } catch (error) {
    console.error('Survey submission error:', error);
    res.status(500).json({ 
      error: 'Failed to process coach survey',
      details: error.message 
    });
  }
});

// Get all survey submissions
router.get('/all', async (req, res) => {
  try {
    // Get family data
    const { data: familyData, error: familyError } = await req.supabase
      .from('family')
      .select('*');

    // Get athlete data
    const { data: athleteData, error: athleteError } = await req.supabase
      .from('athlete')
      .select('*');

    // Get coach data
    const { data: coachData, error: coachError } = await req.supabase
      .from('coach')
      .select('*');

    if (familyError || athleteError || coachError) {
      return res.status(500).json({
        error: 'Failed to retrieve survey data',
        message: familyError?.message || athleteError?.message || coachError?.message
      });
    }

    res.json({
      message: 'Survey data retrieved successfully',
      data: {
        families: familyData,
        athletes: athleteData,
        coaches: coachData
      }
    });

  } catch (error) {
    console.error('Get surveys server error:', error);
    res.status(500).json({
      error: 'Server error retrieving surveys',
      message: error.message
    });
  }
});

module.exports = router;