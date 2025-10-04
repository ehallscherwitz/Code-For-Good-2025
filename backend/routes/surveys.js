const express = require('express');
const router = express.Router();

const norm = {
  phone: (s) => (s || '').replace(/[^\d]/g, ''),
  yearFromDate: (s) => {
    if (!s) return null;
    const d = new Date(s);
    return isNaN(d.getTime()) ? null : d.getFullYear();
  },
  trim: (s) => (typeof s === 'string' ? s.trim() : s),
};

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

    const { data: family, error: familyError } = await req.supabase
      .from('family')
      .insert([{
        parent_name: norm.trim(parentName),
        parent_email: norm.trim(parentEmail),
        parent_phone_number: norm.phone(parentPhone),
        location: { zip_code: norm.trim(zipCode) },
        children: {
          name: norm.trim(childName),
          birth_date: childDateOfBirth,
          gender: norm.trim(childGender),
          sport: norm.trim(childSport),
          medical_conditions: childCondition || null
        }
      }])
      .select('parent_id, parent_name, location, children')
      .single();

    if (familyError) {
      return res.status(500).json({
        error: 'Failed to create family',
        details: familyError.message
      });
    }

    res.status(200).json({
      message: 'Family survey submitted successfully',
      parent_id: family.parent_id,
      data: family
    });
  } catch (error) {
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
      athleteGraduationDate,
      athleteGraduationYear
    } = req.body;

    if (!athleteName || !athleteEmail || !athletePhone || !athleteSchool || !athleteSport) {
      return res.status(400).json({
        error: 'Missing required fields: athleteName, athleteEmail, athletePhone, athleteSchool, athleteSport'
      });
    }

    const gradYear = Number.isInteger(athleteGraduationYear)
      ? athleteGraduationYear
      : norm.yearFromDate(athleteGraduationDate) || new Date().getFullYear() + 2;

    const schoolName = norm.trim(athleteSchool);

    let { data: schoolRow, error: schoolErr } = await req.supabase
      .from('school')
      .select('id, name, location')
      .ilike('name', schoolName)
      .maybeSingle();
    if (schoolErr) throw schoolErr;

    if (!schoolRow) {
      const loc = (() => {
        if (athleteLocation && typeof athleteLocation === 'string') {
          const [city, state] = athleteLocation.split(',').map(s => s.trim());
          const obj = {};
          if (city) obj.city = city;
          if (state) obj.state = state;
          return obj;
        }
        return {};
      })();

      const createSchool = await req.supabase
        .from('school')
        .insert([{ name: schoolName, location: loc }])
        .select('id, name, location')
        .single();
      if (createSchool.error) throw createSchool.error;
      schoolRow = createSchool.data;
    }

    const school_id = schoolRow.id;
    const sport = norm.trim(athleteSport);

    let { data: teamRow, error: teamErr } = await req.supabase
      .from('team')
      .select('team_id, team_name, sport, school_id')
      .eq('school_id', school_id)
      .ilike('sport', sport)
      .maybeSingle();
    if (teamErr) throw teamErr;

    if (!teamRow) {
      const teamName = `${schoolRow.name} ${sport}`;
      const createTeam = await req.supabase
        .from('team')
        .insert([{ team_name: teamName, sport, school_id }])
        .select('team_id, team_name, sport, school_id')
        .single();
      if (createTeam.error) throw createTeam.error;
      teamRow = createTeam.data;
    }

    const team_id = teamRow.team_id;

    const { data: athlete, error: athleteError } = await req.supabase
      .from('athlete')
      .insert([{
        athlete_name: norm.trim(athleteName),
        athlete_email: norm.trim(athleteEmail),
        phone_number: norm.phone(athletePhone),
        athlete_address: norm.trim(athleteLocation) || '',
        graduation_year: gradYear,
        team_id
      }])
      .select('athlete_id, team_id')
      .single();

    if (athleteError) {
      return res.status(500).json({
        error: 'Failed to create athlete',
        details: athleteError.message
      });
    }

    res.status(201).json({
      message: 'Athlete survey submitted successfully',
      athlete_id: athlete.athlete_id,
      team_id,
      school_id
    });
  } catch (error) {
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

    const { data: coach, error: coachError } = await req.supabase
      .from('coach')
      .insert([{
        coach_name: coachName,
        coach_email: coachEmail,
        coach_phone: norm.phone(coachPhone),
        school_name: coachSchool,
        coach_location: coachLocation
      }])
      .select('coach_id, coach_name, coach_email, coach_phone, school_name, coach_location')
      .single();

    if (coachError) {
      return res.status(500).json({
        error: 'Failed to create coach',
        details: coachError.message
      });
    }

    res.status(201).json({
      message: 'Coach survey submitted successfully',
      coach_id: coach.coach_id,
      data: coach
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to process coach survey',
      details: error.message
    });
  }
});

router.get('/all', async (req, res) => {
  try {
    const [{ data: familyData, error: familyError }, { data: athleteData, error: athleteError }, { data: coachData, error: coachError }] =
      await Promise.all([
        req.supabase.from('family').select('*'),
        req.supabase.from('athlete').select('*'),
        req.supabase.from('coach').select('*')
      ]);

    if (familyError || athleteError || coachError) {
      return res.status(500).json({
        error: 'Failed to retrieve survey data',
        message: familyError?.message || athleteError?.message || coachError?.message
      });
    }

    res.status(200).json({
      message: 'Survey data retrieved successfully',
      data: {
        families: familyData || [],
        athletes: athleteData || [],
        coaches: coachData || []
      }
    });
  } catch (error) {
    res.status(500).json({
      error: 'Server error retrieving surveys',
      message: error.message
    });
  }
});

module.exports = router;
