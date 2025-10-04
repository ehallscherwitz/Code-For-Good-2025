import React, { useState, useEffect } from 'react';
import { Users, MessageCircle, UserPlus, Search, Heart, Trophy, MapPin, Phone, Mail } from 'lucide-react';

const ConnectPage = () => {
  const [userRole, setUserRole] = useState('family'); // Default to family
  const [searchTerm, setSearchTerm] = useState('');

  // Get user role from localStorage (set during survey completion)
  useEffect(() => {
    try {
      const profileData = localStorage.getItem('ti_profile_v1');
      if (profileData) {
        const parsed = JSON.parse(profileData);
        setUserRole(parsed.role || 'family');
      }
    } catch (error) {
      console.error('Error reading user role:', error);
    }
  }, []);

  // Dummy data for families (from FamiliesPage)
  const dummyFamilies = [
    {
      parent_id: 'family-1',
      parent_name: 'Jennifer Martinez',
      parent_email: 'jennifer.martinez@email.com',
      parent_phone_number: '(617) 555-0201',
      location: 'Boston, MA',
      children: {
        name: 'Carlos Martinez',
        sport: 'Basketball',
        gender: 'male',
        birth_date: '2010-05-15',
        medical_conditions: 'None'
      }
    },
    {
      parent_id: 'family-2',
      parent_name: 'Robert Johnson',
      parent_email: 'robert.johnson@email.com',
      parent_phone_number: '(617) 555-0202',
      location: 'Cambridge, MA',
      children: {
        name: 'Sophie Johnson',
        sport: 'Soccer',
        gender: 'female',
        birth_date: '2012-08-22',
        medical_conditions: 'Asthma - inhaler needed'
      }
    },
    {
      parent_id: 'family-3',
      parent_name: 'Maria Garcia',
      parent_email: 'maria.garcia@email.com',
      parent_phone_number: '(617) 555-0203',
      location: 'Medford, MA',
      children: {
        name: 'Diego Garcia',
        sport: 'Swimming',
        gender: 'male',
        birth_date: '2009-12-03',
        medical_conditions: 'None'
      }
    },
    {
      parent_id: 'family-4',
      parent_name: 'James Wilson',
      parent_email: 'james.wilson@email.com',
      parent_phone_number: '(617) 555-0204',
      location: 'Chestnut Hill, MA',
      children: {
        name: 'Emma Wilson',
        sport: 'Tennis',
        gender: 'female',
        birth_date: '2011-03-18',
        medical_conditions: 'None'
      }
    }
  ];

  // Dummy data for athletes (from AthletesPage)
  const dummyAthletes = [
    {
      athlete_id: 'athlete-1',
      athlete_name: 'Sarah Johnson',
      athlete_email: 'sarah.johnson@bu.edu',
      phone_number: '(617) 555-0101',
      athlete_address: '123 Commonwealth Ave, Boston, MA 02215',
      graduation_year: '2025',
      team_id: 'team-1'
    },
    {
      athlete_id: 'athlete-2',
      athlete_name: 'Michael Chen',
      athlete_email: 'michael.chen@northeastern.edu',
      phone_number: '(617) 555-0102',
      athlete_address: '456 Huntington Ave, Boston, MA 02115',
      graduation_year: '2026',
      team_id: 'team-2'
    },
    {
      athlete_id: 'athlete-3',
      athlete_name: 'Emily Rodriguez',
      athlete_email: 'emily.rodriguez@harvard.edu',
      phone_number: '(617) 555-0103',
      athlete_address: '789 Harvard Yard, Cambridge, MA 02138',
      graduation_year: '2024',
      team_id: 'team-3'
    },
    {
      athlete_id: 'athlete-4',
      athlete_name: 'David Kim',
      athlete_email: 'david.kim@mit.edu',
      phone_number: '(617) 555-0104',
      athlete_address: '321 Massachusetts Ave, Cambridge, MA 02139',
      graduation_year: '2025',
      team_id: 'team-1'
    }
  ];

  // Filter data based on search term
  const filteredFamilies = dummyFamilies.filter(family =>
    family.parent_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    family.children.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    family.children.sport.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAthletes = dummyAthletes.filter(athlete =>
    athlete.athlete_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    athlete.athlete_email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const FamilyCard = ({ family }) => (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
          <Heart className="w-6 h-6 text-green-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{family.parent_name}</h3>
          <p className="text-sm text-gray-500">Family</p>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-gray-600">
          <Mail className="w-4 h-4" />
          <span className="text-sm">{family.parent_email}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <Phone className="w-4 h-4" />
          <span className="text-sm">{family.parent_phone_number}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <MapPin className="w-4 h-4" />
          <span className="text-sm">{family.location}</span>
        </div>
      </div>

      <div className="bg-gray-50 p-3 rounded-lg mb-4">
        <h4 className="font-medium text-gray-900 mb-2">Child Information</h4>
        <p className="text-sm text-gray-600">
          <strong>{family.children.name}</strong> - {family.children.sport}
        </p>
        <p className="text-xs text-gray-500">
          {family.children.gender} • Born: {new Date(family.children.birth_date).toLocaleDateString()}
        </p>
      </div>

      <button className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors">
        Connect with Family
      </button>
    </div>
  );

  const AthleteCard = ({ athlete }) => (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
          <Trophy className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{athlete.athlete_name}</h3>
          <p className="text-sm text-gray-500">Student Athlete</p>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-gray-600">
          <Mail className="w-4 h-4" />
          <span className="text-sm">{athlete.athlete_email}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <Phone className="w-4 h-4" />
          <span className="text-sm">{athlete.phone_number}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <MapPin className="w-4 h-4" />
          <span className="text-sm">{athlete.athlete_address}</span>
        </div>
      </div>

      <div className="bg-gray-50 p-3 rounded-lg mb-4">
        <h4 className="font-medium text-gray-900 mb-2">Academic Info</h4>
        <p className="text-sm text-gray-600">
          Graduation Year: {athlete.graduation_year}
        </p>
        <p className="text-xs text-gray-500">
          Team ID: {athlete.team_id}
        </p>
      </div>

      <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
        Connect with Athlete
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Connect</h1>
          <p className="text-gray-600 mb-6">
            {userRole === 'athlete' 
              ? 'Connect with families and find your perfect Team IMPACT match'
              : 'Connect with student athletes and build meaningful relationships'
            }
          </p>
          
          {/* Search */}
          <div className="max-w-md">
            <input
              type="text"
              placeholder={`Search ${userRole === 'athlete' ? 'families' : 'athletes'}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {userRole === 'athlete' ? (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Available Families ({filteredFamilies.length})
              </h2>
              <p className="text-sm text-gray-600">
                Connect with families looking for student athlete mentors
              </p>
            </div>

            {filteredFamilies.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredFamilies.map((family) => (
                  <FamilyCard key={family.parent_id} family={family} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">No families found</h3>
                <p className="text-gray-600">
                  {searchTerm ? `No families match your search "${searchTerm}"` : 'No families available at the moment.'}
                </p>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Available Athletes ({filteredAthletes.length})
              </h2>
              <p className="text-sm text-gray-600">
                Connect with student athletes who can mentor your child
              </p>
            </div>

            {filteredAthletes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAthletes.map((athlete) => (
                  <AthleteCard key={athlete.athlete_id} athlete={athlete} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">No athletes found</h3>
                <p className="text-gray-600">
                  {searchTerm ? `No athletes match your search "${searchTerm}"` : 'No athletes available at the moment.'}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ConnectPage;
