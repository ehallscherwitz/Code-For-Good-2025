import React, { useState, useEffect } from 'react';
import { MapPin, Calendar, Users } from 'lucide-react';

const SchoolsPage = () => {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSchool, setSelectedSchool] = useState(null);

  useEffect(() => {
    fetchSchools();
  }, []);

  const fetchSchools = async () => {
    try {
      setLoading(true);
      setError(''); // Clear any previous errors
      const response = await fetch('http://localhost:5000/api/schools');
      if (!response.ok) {
        throw new Error('Failed to fetch schools');
      }
      const data = await response.json();
      setSchools(data || []);
    } catch (err) {
      // If it's a network error, use dummy data instead
      if (err.message.includes('NetworkError') || err.message.includes('fetch')) {
        setSchools(getDummySchools());
        setError('');
      } else {
        setError(err.message);
      }
      console.error('Error fetching schools:', err);
    } finally {
      setLoading(false);
    }
  };

  const getDummySchools = () => [
    {
      id: 'school-1',
      name: 'Boston University',
      location: {
        city: 'Boston',
        state: 'MA',
        zip_code: '02215'
      }
    },
    {
      id: 'school-2', 
      name: 'Northeastern University',
      location: {
        city: 'Boston',
        state: 'MA',
        zip_code: '02115'
      }
    },
    {
      id: 'school-3',
      name: 'Harvard University',
      location: {
        city: 'Cambridge',
        state: 'MA',
        zip_code: '02138'
      }
    },
    {
      id: 'school-4',
      name: 'MIT',
      location: {
        city: 'Cambridge',
        state: 'MA',
        zip_code: '02139'
      }
    },
    {
      id: 'school-5',
      name: 'Tufts University',
      location: {
        city: 'Medford',
        state: 'MA',
        zip_code: '02155'
      }
    },
    {
      id: 'school-6',
      name: 'Boston College',
      location: {
        city: 'Chestnut Hill',
        state: 'MA',
        zip_code: '02467'
      }
    }
  ];

  const filteredSchools = schools.filter(school =>
    school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    JSON.stringify(school.location).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const SchoolCard = ({ school }) => (
    <div 
      className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => setSelectedSchool(school)}
    >
      <h3 className="text-xl font-bold text-gray-900 mb-2">{school.name}</h3>
      
      <div className="flex items-center text-gray-600 mb-4">
        <MapPin className="w-4 h-4 mr-2" />
        <span className="text-sm">
          {school.location?.city ? `${school.location.city}, ${school.location.state || 'Unknown'}` : 'Location not available'}
        </span>
      </div>

      <div className="flex items-center text-gray-600 mb-4">
        <Calendar className="w-4 h-4 mr-2" />
        <span className="text-sm">
          {school.location?.zip_code ? `ZIP: ${school.location.zip_code}` : 'ZIP not available'}
        </span>
      </div>

      <button 
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
        onClick={(e) => {
          e.stopPropagation();
          // Handle school selection/enrollment
          alert(`Selected ${school.name}! (Feature coming soon)`);
        }}
      >
        View Details
      </button>
    </div>
  );

  const SchoolModal = ({ school, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-bold text-gray-900">{school.name}</h2>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex items-center text-gray-600">
              <MapPin className="w-5 h-5 mr-3" />
              <div>
                <p className="font-medium">Location</p>
                <p className="text-sm">
                  {school.location ? JSON.stringify(school.location, null, 2) : 'No location data'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center text-gray-600">
              <Calendar className="w-5 h-5 mr-3" />
              <div>
                <p className="font-medium">School ID</p>
                <p className="text-sm font-mono text-gray-800">{school.id}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="font-medium text-gray-900 mb-2">About This School</h3>
            <p className="text-gray-600 text-sm">
              {school.location ? 
                `Located in ${school.location.city || 'an undisclosed city'}, this school offers various sports teams and programs for student athletes.` :
                'Location information is being updated. Contact the school directly for more details.'
              }
            </p>
          </div>

          <div className="flex space-x-3">
            <button 
              className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition-colors"
              onClick={() => alert('School application feature coming soon!')}
            >
              Apply to School
            </button>
            <button 
              className="flex-1 bg-green-600 text-white py-3 px-6 rounded-md hover:bg-green-700 transition-colors"
              onClick={() => alert('Get school recommendations based on your profile!')}
            >
              Get Recommendations
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading schools...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-background">
        {/* Hero */}
        <div className="relative bg-secondary text-secondary-foreground">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3DfA%3D&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center opacity-20" />
          <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl text-balance">
                Schools Directory
              </h1>
              <p className="mt-4 text-lg text-secondary-foreground/90 max-w-2xl mx-auto text-pretty">
                Explore schools and find the perfect match for your athletic goals
              </p>
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            
            {/* Search */}
            <div className="max-w-md">
              <input
                type="text"
                placeholder="Search schools by name or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {error ? (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
              <p className="text-red-600">Error: {error}</p>
              <button 
                onClick={fetchSchools}
                className="text-red-600 underline mt-2"
              >
                Try again
              </button>
            </div>
          ) : null}

          {/* Results Summary */}
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-600">
              Found {filteredSchools.length} school{filteredSchools.length !== 1 ? 's' : ''}
              {searchTerm && ` matching "${searchTerm}"`}
            </p>
            
            {schools.length > 0 && (
              <div className="flex items-center text-gray-500 text-sm">
                <Users className="w-4 h-4 mr-1" />
                {schools.length} total schools
              </div>
            )}
          </div>

          {/* Schools Grid */}
          {filteredSchools.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSchools.map((school) => (
                <SchoolCard key={school.id} school={school} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">No schools found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm ? 
                  `No schools match your search "${searchTerm}"` :
                  'No schools are available at the moment.'
                }
              </p>
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="text-blue-600 hover:text-blue-700 underline"
                >
                  Clear search
                </button>
              )}
            </div>
          )}
        </div>

        {/* School Modal */}
        {selectedSchool && (
          <SchoolModal 
            school={selectedSchool} 
            onClose={() => setSelectedSchool(null)} 
          />
        )}
      </div>
    </>
  );
};

export default SchoolsPage;
