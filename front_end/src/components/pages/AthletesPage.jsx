import React, { useState, useEffect } from 'react';
import { User, Users, GraduationCap, Mail, Phone, MapPin, Plus } from 'lucide-react';

const AthletesPage = () => {
  const [athletes, setAthletes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAthlete, setSelectedAthlete] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    fetchAthletes();
  }, []);

  const fetchAthletes = async () => {
    try {
      setLoading(true);
      setError(''); // Clear any previous errors
      const response = await fetch('http://localhost:5000/api/athletes');
      if (!response.ok) {
        throw new Error('Failed to fetch athletes');
      }
      const data = await response.json();
      setAthletes(data || []);
    } catch (err) {
      // If it's a network error, use dummy data instead
      if (err.message.includes('NetworkError') || err.message.includes('fetch')) {
        setAthletes(getDummyAthletes());
        setError('');
      } else {
        setError(err.message);
      }
      console.error('Error fetching athletes:', err);
    } finally {
      setLoading(false);
    }
  };

  const getDummyAthletes = () => [
    {
      athlete_id: 'athlete-1',
      athlete_name: 'Sarah Johnson',
      athlete_email: 'sarah.johnson@bu.edu',
      phone_number: '(617) 555-0101',
      athlete_address: '123 Commonwealth Ave, Boston, MA 02215',
      graduation_year: '2025',
      team_id: 'team-1',
      updated_at: new Date().toISOString()
    },
    {
      athlete_id: 'athlete-2',
      athlete_name: 'Michael Chen',
      athlete_email: 'michael.chen@northeastern.edu',
      phone_number: '(617) 555-0102',
      athlete_address: '456 Huntington Ave, Boston, MA 02115',
      graduation_year: '2026',
      team_id: 'team-2',
      updated_at: new Date().toISOString()
    },
    {
      athlete_id: 'athlete-3',
      athlete_name: 'Emily Rodriguez',
      athlete_email: 'emily.rodriguez@harvard.edu',
      phone_number: '(617) 555-0103',
      athlete_address: '789 Harvard Yard, Cambridge, MA 02138',
      graduation_year: '2024',
      team_id: 'team-3',
      updated_at: new Date().toISOString()
    },
    {
      athlete_id: 'athlete-4',
      athlete_name: 'David Kim',
      athlete_email: 'david.kim@mit.edu',
      phone_number: '(617) 555-0104',
      athlete_address: '321 Massachusetts Ave, Cambridge, MA 02139',
      graduation_year: '2025',
      team_id: 'team-1',
      updated_at: new Date().toISOString()
    },
    {
      athlete_id: 'athlete-5',
      athlete_name: 'Jessica Williams',
      athlete_email: 'jessica.williams@tufts.edu',
      phone_number: '(617) 555-0105',
      athlete_address: '654 College Ave, Medford, MA 02155',
      graduation_year: '2026',
      team_id: 'team-2',
      updated_at: new Date().toISOString()
    },
    {
      athlete_id: 'athlete-6',
      athlete_name: 'Alex Thompson',
      athlete_email: 'alex.thompson@bc.edu',
      phone_number: '(617) 555-0106',
      athlete_address: '987 Chestnut Hill, MA 02467',
      graduation_year: '2024',
      team_id: 'team-3',
      updated_at: new Date().toISOString()
    }
  ];

  const filteredAthletes = athletes.filter(athlete =>
    athlete.athlete_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    athlete.athlete_email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteAthlete = async (athleteId) => {
    if (window.confirm('Are you sure you want to delete this athlete?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/athletes/${athleteId}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          setAthletes(athletes.filter(a => a.athlete_id !== athleteId));
          alert('Athlete deleted successfully');
        } else {
          alert('Failed to delete athlete');
        }
      } catch (error) {
        console.error('Error deleting athlete:', error);
        alert('Error deleting athlete');
      }
    }
  };

  const AthleteCard = ({ athlete }) => (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{athlete.athlete_name}</h3>
            <p className="text-sm text-gray-500">{athlete.graduation_year}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedAthlete(athlete)}
            className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md text-sm hover:bg-blue-200"
          >
            View
          </button>
          <button
            onClick={() => handleDeleteAthlete(athlete.athlete_id)}
            className="px-3 py-1 bg-red-100 text-red-700 rounded-md text-sm hover:bg-red-200"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="space-y-2">
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
          <span className="text-sm">{athlete.athlete_address || 'No address'}</span>
        </div>
      </div>
    </div>
  );

  const AthleteModal = ({ athlete, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-bold text-gray-900">{athlete.athlete_name}</h2>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Contact Information</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">{athlete.athlete_email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">{athlete.phone_number}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">{athlete.athlete_address || 'No address'}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-2">Academic Information</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">Graduation Year: {athlete.graduation_year}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">Team ID: {athlete.team_id || 'Not assigned'}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">Additional Details</h3>
            <div className="text-sm text-gray-600">
              <p>Last updated: {new Date(athlete.updated_at).toLocaleDateString()}</p>
              <p>Athlete ID: <code className="bg-gray-200 px-1 rounded">{athlete.athlete_id}</code></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const AddAthleteForm = ({ onClose }) => {
    const [formData, setFormData] = useState({
      athlete_name: '',
      athlete_email: '',
      phone_number: '',
      athlete_address: '',
      graduation_year: '',
      team_id: ''
    });
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
      e.preventDefault();
      setSubmitting(true);

      try {
        const response = await fetch('http://localhost:5000/api/athletes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          const newAthlete = await response.json();
          setAthletes([...athletes, newAthlete]);
          setFormData({
            athlete_name: '',
            athlete_email: '',
            phone_number: '',
            athlete_address: '',
            graduation_year: '',
            team_id: ''
          });
          onClose();
          alert('Athlete added successfully!');
        } else {
          alert('Failed to add athlete');
        }
      } catch (error) {
        console.error('Error adding athlete:', error);
        alert('Error adding athlete');
      } finally {
        setSubmitting(false);
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Add New Athlete</h2>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input
                  type="text"
                  required
                  value={formData.athlete_name}
                  onChange={(e) => setFormData({...formData, athlete_name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input
                  type="email"
                  required
                  value={formData.athlete_email}
                  onChange={(e) => setFormData({...formData, athlete_email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={formData.phone_number}
                  onChange={(e) => setFormData({...formData, phone_number: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
                <input
                  type="text"
                  required
                  value={formData.athlete_address}
                  onChange={(e) => setFormData({...formData, athlete_address: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Graduation Year *</label>
                <input
                  type="number"
                  required
                  min="2024"
                  max="2030"
                  value={formData.graduation_year}
                  onChange={(e) => setFormData({...formData, graduation_year: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {submitting ? 'Adding...' : 'Add Athlete'}
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
              <h1 className="text-3xl font-bold text-gray-900">Athletes Management</h1>
              <button
                onClick={() => setShowAddForm(true)}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                <Plus className="w-4 h-4" />
                Add Athlete
              </button>
            </div>
            <p className="text-gray-600 mb-6">
              Manage athlete profiles and track graduation status
            </p>
            
            {/* Search */}
            <div className="max-w-md">
              <input
                type="text"
                placeholder="Search athletes by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading athletes...</p>
              </div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
              <p className="text-red-600">Error: {error}</p>
              <button 
                onClick={fetchAthletes}
                className="text-red-600 underline mt-2"
              >
                Try again
              </button>
            </div>
          ) : filteredAthletes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAthletes.map((athlete) => (
                <AthleteCard key={athlete.athlete_id} athlete={athlete} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">No athletes found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm ? 
                  `No athletes match your search "${searchTerm}"` :
                  'Add some athletes to get started!'
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

        {/* Modals */}
        {selectedAthlete && (
          <AthleteModal 
            athlete={selectedAthlete} 
            onClose={() => setSelectedAthlete(null)} 
          />
        )}

        {showAddForm && (
          <AddAthleteForm onClose={() => setShowAddForm(false)} />
        )}
      </div>
    </>
  );
};

export default AthletesPage;
