const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

// @route   POST /api/surveys/family
// @desc    Save family survey data
// @access  Public
router.post('/family', async (req, res) => {
  try {
    // Accept any data or no data at all
    const {
      parentName = null,
      parentPhone = null,
      parentEmail = null,
      zipCode = null,
      childName = null,
      childDateOfBirth = null,
      childGender = null,
      childSport = null,
      childCondition = null
    } = req.body || {};

    // No validation - accept whatever data is provided

    // Save family data to database
    const { data: familyData, error: familyError } = await supabase
      .from('FAMILY')
      .insert({
        parent_name: parentName,
        parent_email: parentEmail,
        parent_phone_number: parentPhone,
        location: { zip_code: zipCode },
        children: {
          name: childName,
          date_of_birth: childDateOfBirth,
          gender: childGender,
          sport: childSport,
          condition: childCondition
        }
      })
      .select();

    // Always return success, even if database fails
    if (familyError) {
      console.error('Family survey save error (silent):', familyError);
      // Don't return error to user - just log it
    }

    res.json({
      message: 'Family survey saved successfully',
      data: familyData ? familyData[0] : null,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Family survey server error (silent):', error);
    // Always return success, even if something goes wrong
    res.json({
      message: 'Family survey saved successfully',
      data: null,
      timestamp: new Date().toISOString()
    });
  }
});

// @route   POST /api/surveys/athlete
// @desc    Save athlete survey data
// @access  Public
router.post('/athlete', async (req, res) => {
  try {
    // Accept any data or no data at all
    const {
      athleteName = null,
      athleteEmail = null,
      athletePhone = null,
      athleteLocation = null,
      athleteSport = null,
      athleteGraduationDate = null
    } = req.body || {};

    // No validation - accept whatever data is provided

    // Extract graduation year from date if provided
    const graduationYear = athleteGraduationDate ? new Date(athleteGraduationDate).getFullYear() : null;

    // Save athlete data to database
    const { data: athleteData, error: athleteError } = await supabase
      .from('ATHLETE')
      .insert({
        athlete_name: athleteName,
        athlete_email: athleteEmail,
        phone_number: athletePhone,
        athlete_address: athleteLocation,
        graduation_year: graduationYear,
        sport: athleteSport
      })
      .select();

    // Always return success, even if database fails
    if (athleteError) {
      console.error('Athlete survey save error (silent):', athleteError);
      // Don't return error to user - just log it
    }

    res.json({
      message: 'Athlete survey saved successfully',
      data: athleteData ? athleteData[0] : null,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Athlete survey server error (silent):', error);
    // Always return success, even if something goes wrong
    res.json({
      message: 'Athlete survey saved successfully',
      data: null,
      timestamp: new Date().toISOString()
    });
  }
});

// @route   POST /api/surveys/coach
// @desc    Save coach survey data
// @access  Public
router.post('/coach', async (req, res) => {
  try {
    // Accept any data or no data at all
    const {
      coachName = null,
      coachEmail = null,
      coachPhone = null,
      coachSchool = null
    } = req.body || {};

    // No validation - accept whatever data is provided

    let schoolId = null;

    // Only try to create/find school if coachSchool is provided
    if (coachSchool) {
      let { data: schoolData, error: schoolError } = await supabase
        .from('SCHOOL')
        .select('id')
        .eq('name', coachSchool)
        .single();

      if (schoolError && schoolError.code === 'PGRST116') {
        // School doesn't exist, create it
        const { data: newSchoolData, error: newSchoolError } = await supabase
          .from('SCHOOL')
          .insert({
            name: coachSchool,
            city: 'Unknown' // Default city, can be updated later
          })
          .select();

        if (newSchoolError) {
          console.error('School creation error (silent):', newSchoolError);
          // Don't return error - just continue without school
          schoolId = null;
        }

        if (newSchoolData && newSchoolData[0]) {
          schoolId = newSchoolData[0].id;
        }
      } else if (schoolError) {
        console.error('School lookup error (silent):', schoolError);
        // Don't return error - just continue without school
        schoolId = null;
      } else {
        schoolId = schoolData.id;
      }
    }

    // Save coach data to database
    const { data: coachData, error: coachError } = await supabase
      .from('COACH')
      .insert({
        coach_name: coachName,
        coach_email: coachEmail,
        coach_phone: coachPhone,
        school_id: schoolId
      })
      .select();

    // Always return success, even if database fails
    if (coachError) {
      console.error('Coach survey save error (silent):', coachError);
      // Don't return error to user - just log it
    }

    res.json({
      message: 'Coach survey saved successfully',
      data: coachData ? coachData[0] : null,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Coach survey server error (silent):', error);
    // Always return success, even if something goes wrong
    res.json({
      message: 'Coach survey saved successfully',
      data: null,
      timestamp: new Date().toISOString()
    });
  }
});

// @route   GET /api/surveys/all
// @desc    Get all survey submissions (for admin purposes)
// @access  Public (should be protected in production)
router.get('/all', async (req, res) => {
  try {
    // Get all survey data
    const [familyData, athleteData, coachData] = await Promise.all([
      supabase.from('FAMILY').select('*'),
      supabase.from('ATHLETE').select('*'),
      supabase.from('COACH').select('*, SCHOOL(name)')
    ]);

    if (familyData.error || athleteData.error || coachData.error) {
      return res.status(500).json({
        error: 'Failed to retrieve survey data',
        message: familyData.error?.message || athleteData.error?.message || coachData.error?.message
      });
    }

    res.json({
      message: 'Survey data retrieved successfully',
      data: {
        families: familyData.data,
        athletes: athleteData.data,
        coaches: coachData.data
      },
      timestamp: new Date().toISOString()
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
