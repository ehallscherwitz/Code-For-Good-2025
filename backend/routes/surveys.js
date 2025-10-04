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
      .from('FAMILY')
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
      athleteLocation,
      athleteSport,
      athleteGraduationDate
    } = req.body;

    // Create athlete record in database
    const { data: athlete, error: athleteError } = await req.supabase
      .from('ATHLETE')
      .insert([{
        athlete_name: athleteName,
        athlete_email: athleteEmail,
        phone_number: '+1' + athletePhone.replace(/\D/g, ''), // Clean and format phone
        athlete_address: athleteLocation,
        athlete_number: null, // Can be set later
        graduation_year: new Date(athleteGraduationDate).getFullYear()
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
      coachSchool
    } = req.body;

    // For now, we'll just log coach data since there's no coaches table
    // In the future, you might want to create a COACHES table
    
    console.log('Coach survey data:', {
      name: coachName,
      email: coachEmail,
      phone: coachPhone,
      school: coachSchool
    });

    res.json({
      message: 'Coach survey submitted successfully',
      note: 'Coach information logged. Contact administrative team for account setup.'
    });

  } catch (error) {
    console.error('Survey submission error:', error);
    res.status(500).json({ 
      error: 'Failed to process coach survey',
      details: error.message 
    });
  }
});

module.exports = router;
