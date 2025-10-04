import React, { useState, useEffect } from 'react';
import { User, Users, GraduationCap, Mail, Phone, MapPin, Plus, AlertCircle, MessageCircle } from 'lucide-react';

const AlumniPage = () => {
  const [alumni, setAlumni] = useState([]);
  const [graduatedAthletes, setGraduatedAthletes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAlumni, setSelectedAlumni] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [promoting, setPromoting] = useState(false);

  useEffect(() => {
    fetchAlumniData();
  }, []);

  const fetchAlumniData = async () => {
    try {
      setLoading(true);
      setError(''); // Clear any previous errors
      
      // Fetch alumni
      const alumniResponse = await fetch('http://localhost:5000/api/alumni');
      if (alumniResponse.ok) {
        const alumniData = await alumniResponse.json();
        setAlumni(alumniData || []);
      }

      // Check for athletes ready to graduate
      const graduatesResponse = await fetch('http://localhost:5000/api/alumni/check-graduates');
      if (graduatesResponse.ok) {
        const graduatesData = await graduatesResponse.json();
        setGraduatedAthletes(graduatesData.athletes || []);
      }
    } catch (err) {
      // If it's a network error, use dummy data instead
      if (err.message.includes('NetworkError') || err.message.includes('fetch')) {
        setAlumni(getDummyAlumni());
        setGraduatedAthletes(getDummyGraduatedAthletes());
        setError('');
      } else {
        setError(err.message);
      }
      console.error('Error fetching alumni data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getDummyAlumni = () => [
    {
      alumni_id: 'alumni-1',
      alumni_name: 'John Smith',
      alumni_email: 'john.smith@alumni.bu.edu',
      alumni_phone_number: '(617) 555-0301',
      location: 'Boston, MA',
      updated_at: new Date().toISOString()
    },
    {
      alumni_id: 'alumni-2',
      alumni_name: 'Sarah Davis',
      alumni_email: 'sarah.davis@alumni.northeastern.edu',
      alumni_phone_number: '(617) 555-0302',
      location: 'Cambridge, MA',
      updated_at: new Date().toISOString()
    },
    {
      alumni_id: 'alumni-3',
      alumni_name: 'Michael Wilson',
      alumni_email: 'michael.wilson@alumni.harvard.edu',
      alumni_phone_number: '(617) 555-0303',
      location: 'Medford, MA',
      updated_at: new Date().toISOString()
    },
    {
      alumni_id: 'alumni-4',
      alumni_name: 'Emily Johnson',
      alumni_email: 'emily.johnson@alumni.mit.edu',
      alumni_phone_number: '(617) 555-0304',
      location: 'Boston, MA',
      updated_at: new Date().toISOString()
    }
  ];

  const getDummyGraduatedAthletes = () => [
    {
      athlete_name: 'Alex Rodriguez',
      athlete_email: 'alex.rodriguez@bu.edu',
      graduation_year: '2023'
    },
    {
      athlete_name: 'Maria Gonzalez',
      athlete_email: 'maria.gonzalez@northeastern.edu',
      graduation_year: '2023'
    }
  ];

  const promoteAthletesToAlumni = async () => {
    if (graduatedAthletes.length === 0) {
      alert('No athletes are ready for promotion.');
      return;
    }

    if (window.confirm(`Promote ${graduatedAthletes.length} graduated athletes to alumni?`)) {
      try {
        setPromoting(true);
        const response = await fetch('http://localhost:5000/api/alumni/promote-graduates', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const result = await response.json();
          alert(`Successfully promoted ${result.promoted_count} athletes to alumni!`);
          
          // Refresh data
          fetchAlumniData();
        } else {
          alert('Failed to promote athletes to alumni');
        }
      } catch (error) {
        console.error('Error promoting athletes:', error);
        alert('Error promoting athletes to alumni');
      } finally {
        setPromoting(false);
      }
    }
  };

  const filteredAlumni = alumni.filter(member =>
    member.alumni_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.alumni_email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const AlumniCard = ({ member }) => (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow relative">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{member.alumni_name}</h3>
            <p className="text-sm text-gray-500">Alumni</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedAlumni(member)}
            className="px-3 py-1 bg-purple-100 text-purple-700 rounded-md text-sm hover:bg-purple-200"
          >
            View
          </button>
          <button
            onClick={() => {
              if (window.confirm('Delete this alumni member?')) {
                // Implement delete functionality if needed
                alert('Delete functionality would be implemented here');
              }
            }}
            className="px-3 py-1 bg-red-100 text-red-700 rounded-md text-sm hover:bg-red-200"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-gray-600">
          <Mail className="w-4 h-4" />
          <span className="text-sm">{member.alumni_email}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <Phone className="w-4 h-4" />
          <span className="text-sm">{member.alumni_phone_number}</span>
        </div>
      </div>

      {/* Message button positioned at bottom right */}
      <div className="absolute bottom-4 right-4">
        <button
          onClick={() => alert('Message functionality would be implemented here')}
          className="px-3 py-1 bg-green-100 text-green-700 rounded-md text-sm hover:bg-green-200 flex items-center gap-1 shadow-sm"
          title="Send Message"
        >
          <MessageCircle className="w-4 h-4" />
          Message
        </button>
      </div>
    </div>
  );

  const AlumniModal = ({ member, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-bold text-gray-900">{member.alumni_name}</h2>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Contact Information</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">{member.alumni_email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">{member.alumni_phone_number}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">
                    {member.location ? JSON.stringify(member.location) : 'No location data'}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Status Information</h3>
              <div className="text-sm text-gray-600">
                <p>Last updated: {new Date(member.updated_at).toLocaleDateString()}</p>
                <p>Alumni ID: <code className="bg-gray-200 px-1 rounded">{member.alumni_id}</code></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const GraduatedAthletesCard = ({ athlete }) => (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-3">
      <div className="flex items-center gap-3">
        <AlertCircle className="w-5 h-5 text-yellow-600" />
        <div className="flex-1">
          <h4 className="font-medium text-gray-900">{athlete.athlete_name}</h4>
          <p className="text-sm text-gray-600">
            Graduation Year: {athlete.graduation_year} • {athlete.athlete_email}
          </p>
        </div>
      </div>
    </div>
  );

  const AddAlumniForm = ({ onClose }) => {
    const [formData, setFormData] = useState({
      alumni_name: '',
      alumni_email: '',
      alumni_phone_number: '',
      location: ''
    });
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
      e.preventDefault();
      setSubmitting(true);

      try {
        const response = await fetch('http://localhost:5000/api/alumni', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          const newAlumni = await response.json();
          setAlumni([...alumni, newAlumni[0]]);
          setFormData({
            alumni_name: '',
            alumni_email: '',
            alumni_phone_number: '',
            location: ''
          });
          onClose();
          alert('Alumni added successfully!');
        } else {
          alert('Failed to add alumni');
        }
      } catch (error) {
        console.error('Error adding alumni:', error);
        alert('Error adding alumni');
      } finally {
        setSubmitting(false);
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Add New Alumni</h2>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input
                  type="text"
                  required
                  value={formData.alumni_name}
                  onChange={(e) => setFormData({...formData, alumni_name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input
                  type="email"
                  required
                  value={formData.alumni_email}
                  onChange={(e) => setFormData({...formData, alumni_email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={formData.alumni_phone_number}
                  onChange={(e) => setFormData({...formData, alumni_phone_number: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="City, State or address"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
                >
                  {submitting ? 'Adding...' : 'Add Alumni'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-900">Alumni Management</h1>
              <button
                onClick={() => setShowAddForm(true)}
                className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
              >
                <Plus className="w-4 h-4" />
                Add Alumni
              </button>
            </div>
            <p className="text-gray-600 mb-6">
              Manage alumni profiles and graduation status
            </p>
            
            {/* Graduation Promotion Section */}
            {graduatedAthletes.length > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium text-yellow-900">
                      {graduatedAthletes.length} athlete{graduatedAthletes.length !== 1 ? 's' : ''} ready for alumni promotion
                    </h3>
                    <p className="text-sm text-yellow-700">
                      Athletes who have graduated before {new Date().getFullYear()} are ready to be promoted to alumni status.
                    </p>
                  </div>
                  <button
                    onClick={promoteAthletesToAlumni}
                    disabled={promoting}
                    className="bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700 disabled:opacity-50"
                  >
                    {promoting ? 'Promoting...' : 'Promote to Alumni'}
                  </button>
                </div>
                <div className="mt-3 max-h-40 overflow-y-auto">
                  {graduatedAthletes.map((athlete, index) => (
                    <GraduatedAthletesCard key={index} athlete={athlete} />
                  ))}
                </div>
              </div>
            )}
            
            {/* Search */}
            <div className="max-w-md">
              <input
                type="text"
                placeholder="Search alumni by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading alumni...</p>
              </div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
              <p className="text-red-600">Error: {error}</p>
              <button 
                onClick={fetchAlumniData}
                className="text-red-600 underline mt-2"
              >
                Try again
              </button>
            </div>
          ) : filteredAlumni.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAlumni.map((member) => (
                <AlumniCard key={member.alumni_id} member={member} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <GraduationCap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">No alumni found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm ? 
                  `No alumni match your search "${searchTerm}"` :
                  'Add some alumni members to get started!'
                }
              </p>
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="text-purple-600 hover:text-purple-700 underline"
                >
                  Clear search
                </button>
              )}
            </div>
          )}
        </div>

        {/* Modals */}
        {selectedAlumni && (
          <AlumniModal 
            member={selectedAlumni} 
            onClose={() => setSelectedAlumni(null)} 
          />
        )}

        {showAddForm && (
          <AddAlumniForm onClose={() => setShowAddForm(false)} />
        )}
      </div>
    </>
  );
};

export default AlumniPage;
