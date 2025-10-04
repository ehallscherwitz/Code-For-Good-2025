const supabase = require('../config/supabase');

// User model for Supabase
class User {
  constructor(userData) {
    this.id = userData.id;
    this.email = userData.email;
    this.name = userData.user_metadata?.full_name || userData.user_metadata?.name;
    this.avatar = userData.user_metadata?.avatar_url;
    this.provider = userData.app_metadata?.provider;
    this.created_at = userData.created_at;
    this.updated_at = userData.updated_at;
  }

  // Get user profile with role information
  static async getProfile(userId) {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select(`
          *,
          athletes(*),
          coaches(*),
          families(*)
        `)
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Error fetching user profile:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in getProfile:', error);
      return null;
    }
  }

  // Create user profile after role selection
  static async createProfile(userId, profileData) {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .insert({
          user_id: userId,
          role: profileData.role,
          first_name: profileData.first_name,
          last_name: profileData.last_name,
          phone: profileData.phone,
          date_of_birth: profileData.date_of_birth,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating user profile:', error);
        throw error;
      }

      // Create role-specific profile
      if (profileData.role === 'athlete') {
        await this.createAthleteProfile(userId, profileData.athlete_data);
      } else if (profileData.role === 'coach') {
        await this.createCoachProfile(userId, profileData.coach_data);
      } else if (profileData.role === 'family') {
        await this.createFamilyProfile(userId, profileData.family_data);
      }

      return data;
    } catch (error) {
      console.error('Error in createProfile:', error);
      throw error;
    }
  }

  // Create athlete profile
  static async createAthleteProfile(userId, athleteData) {
    const { data, error } = await supabase
      .from('athletes')
      .insert({
        user_id: userId,
        sport: athleteData.sport,
        position: athleteData.position,
        team: athleteData.team,
        jersey_number: athleteData.jersey_number,
        experience_level: athleteData.experience_level,
        goals: athleteData.goals,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating athlete profile:', error);
      throw error;
    }

    return data;
  }

  // Create coach profile
  static async createCoachProfile(userId, coachData) {
    const { data, error } = await supabase
      .from('coaches')
      .insert({
        user_id: userId,
        sport: coachData.sport,
        coaching_level: coachData.coaching_level,
        team: coachData.team,
        experience_years: coachData.experience_years,
        certifications: coachData.certifications || [],
        specialties: coachData.specialties || [],
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating coach profile:', error);
      throw error;
    }

    return data;
  }

  // Create family profile
  static async createFamilyProfile(userId, familyData) {
    const { data, error } = await supabase
      .from('families')
      .insert({
        user_id: userId,
        relationship: familyData.relationship,
        emergency_contact: familyData.emergency_contact,
        address: familyData.address,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating family profile:', error);
      throw error;
    }

    return data;
  }

  // Check if user has completed profile setup
  static async isProfileComplete(userId) {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('id, role')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        return false;
      }

      return !!data;
    } catch (error) {
      return false;
    }
  }

  // Get user role
  static async getUserRole(userId) {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        return null;
      }

      return data?.role || null;
    } catch (error) {
      return null;
    }
  }

  // Update user profile
  static async updateProfile(userId, profileData) {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update({
          first_name: profileData.first_name,
          last_name: profileData.last_name,
          phone: profileData.phone,
          date_of_birth: profileData.date_of_birth,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        console.error('Error updating user profile:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in updateProfile:', error);
      throw error;
    }
  }
}

module.exports = User;
