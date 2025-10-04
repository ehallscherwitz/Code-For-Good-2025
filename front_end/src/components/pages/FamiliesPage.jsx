import React, { useState, useEffect } from 'react';
import { User, Users, Mail, Phone, MapPin, Plus, Baby } from 'lucide-react';

const FamiliesPage = () => {
  const [families, setFamilies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFamily, setSelectedFamily] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    fetchFamilies();
  }, []);

  const fetchFamilies = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/families');
      if (!response.ok) {
        throw new Error('Failed to fetch families');
      }
      const data = await response.json();
      setFamilies(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching families:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredFamilies = families.filter(family =>
    family.parent_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    family.parent_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (family.children && family.children.name && 
     family.children.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleDeleteFamily = async (familyId) => {
    // Note: Delete endpoint not available in current backend, but structure for it
    alert('Delete functionality would be implemented here');
  };

  const FamilyCard = ({ family }) => (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{family.parent_name}</h3>
            <p className="text-sm text-gray-500">Family</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedFamily(family)}
            className="px-3 py-1 bg-green-100 text-green-700 rounded-md text-sm hover:bg-green-200"
          >
            View
          </button>
          <button
            onClick={() => handleDeleteFamily(family.parent_id)}
            className="px-3 py-1 bg-red-100 text-red-700 rounded-md text-sm hover:bg-red-200"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-gray-600">
          <Mail className="w-4 h-4" />
          <span className="text-sm">{family.parent_email}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <Phone className="w-4 h-4" />
          <span className="text-sm">{family.parent_phone_number}</span>
        </div>
        {family.children && family.children.name && (
          <div className="flex items-center gap-2 text-gray-600">
            <Baby className="w-4 h-4" />
            <span className="text-sm">Child: {family.children.name}</span>
          </div>
        )}
        {family.children && family.children.sport && (
          <div className="flex items-center gap-2 text-gray-600 text-sm">
            <span className="ml-6">🏃 {family.children.sport}</span>
          </div>
        )}
      </div>
    </div>
  );

  const FamilyModal = ({ family, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-bold text-gray-900">{family.parent_name}</h2>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Parent Information</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">{family.parent_name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">{family.parent_email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">{family.parent_phone_number}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-2">Child Information</h3>
              {family.children ? (
                <div className="space-y-2">
                  {family.children.name && (
                    <div className="flex items-center gap-2">
                      <Baby className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">{family.children.name}</span>
                    </div>
                  )}
                  {family.children.sport && (
                    <div className="text-sm text-gray-600">Sport: {family.children.sport}</div>
                  )}
                  {family.children.gender && (
                    <div className="text-sm text-gray-600">Gender: {family.children.gender}</div>
                  )}
                  {family.children.birth_date && (
                    <div className="text-sm text-gray-600">
                      Birth Date: {new Date(family.children.birth_date).toLocaleDateString()}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-sm text-gray-500">No child information</div>
              )}
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">Additional Details</h3>
            <div className="text-sm text-gray-600">
              <p>Last updated: {new Date(family.更新的_at).toLocaleDateString()}</p>
              <p>Family ID: <code className="bg-gray-200 px-1 rounded">{family.parent_id}</code></p>
              {family.location && (
                <div className="mt-2">
                  <p>Location: {JSON.stringify(family.location)}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const AddFamilyForm = ({ onClose }) => {
    const [formData, setFormData] = useState({
      parent_name: '',
      parent_email: '',
      parent_phone_number: '',
      location: '',
      children: {
        name: '',
        sport: '',
        gender: '',
        birth_date: '',
        medical_conditions: ''
      }
    });
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
      e.preventDefault();
      setSubmitting(true);

      try {
        const response = await fetch('http://localhost:5000/api/families', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          const newFamily = await response.json();
          setFamilies([...families, newFamily]);
          setFormData({
            parent_name: '',
            parent_email: '',
            parent_phone_number: '',
            location: '',
            children: {
              name: '',
              sport: '',
              gender: '',
              birth_date: '',
              medical_conditions: ''
            }
          });
          onClose();
          alert('Family added successfully!');
        } else {
          alert('Failed to add family');
        }
      } catch (error) {
        console.error('Error adding family:', error);
        alert('Error adding family');
      } finally {
        setSubmitting(false);
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Add New Family</h2>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Parent Information */}
              <div className="border-b pb-4 mb-4">
                <h3 className="font-medium text-gray-900 mb-3">Parent Information</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.parent_name}
                      onChange={(e) => setFormData({...formData, parent_name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                    <input
                      type="email"
                      required
                      value={formData.parent_email}
                      onChange={(e) => setFormData({...formData, parent_email: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="mt-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                  <input
                    type="tel"
                    required
                    value={formData.parent_phone_number}
                    onChange={(e) => setFormData({...formData, parent_phone_number: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="mt-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="City, State or ZIP code"
                  />
                </div>
              </div>

              {/* Child Information */}
              <div className="border-b pb-4 mb-4">
                <h3 className="font-medium text-gray-900 mb-3">Child Information</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Child Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.children.name}
                      onChange={(e) => setFormData({
                        ...formData, 
                        children: {...formData.children, name: e.target.value}
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sport *</label>
                    <input
                      type="text"
                      required
                      value={formData.children.sport}
                      onChange={(e) => setFormData({
                        ...formData, 
                        children: {...formData.children, sport: e.target.value}
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Basketball, Soccer"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                    <select
                      value={formData.children.gender}
                      onChange={(e) => setFormData({
                        ...formData, 
                        children: {...formData.children, gender: e.target.value}
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="non-binary">Non-binary</option>
                      <option value="prefer-not-to-say">Prefer not to say</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Birth Date</label>
                    <input
                      type="date"
                      value={formData.children.birth_date}
                      onChange={(e) => setFormData({
                        ...formData, 
                        children: {...formData.children, birth_date: e.target.value}
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="mt-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Medical Conditions</label>
                  <textarea
                    value={formData.children.medical_conditions}
                    onChange={(e) => setFormData({
                      ...formData, 
                      children: {...formData.children, medical_conditions: e.target.value}
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows="3"
                    placeholder="Any medical conditions or special needs..."
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                >
                  {submitting ? 'Adding...' : 'Add Family'}
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
              <h1 className="text-3xl font-bold text-gray-900">Families Management</h1>
              <button
                onClick={() => setShowAddForm(true)}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
              >
                <Plus className="w-4 h-4" />
                Add Family
              </button>
            </div>
            <p className="text-gray-600 mb-6">
              Manage family profiles and child information
            </p>
            
            {/* Search */}
            <div className="max-w-md">
              <input
                type="text"
                placeholder="Search families by name or child..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading families...</p>
              </div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
              <p className="text-red-600">Error: {error}</p>
              <button 
                onClick={fetchFamilies}
                className="text-red-600 underline mt-2"
              >
                Try again
              </button>
            </div>
          ) : filteredFamilies.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFamilies.map((family) => (
                <FamilyCard key={family.parent_id} family={family} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">No families found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm ? 
                  `No families match your search "${searchTerm}"` :
                  'Add some families to get started!'
                }
              </p>
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="text-green-600 hover:text-green-700 underline"
                >
                  Clear search
                </button>
              )}
            </div>
          )}
        </div>

        {/* Modals */}
        {selectedFamily && (
          <FamilyModal 
            family={selectedFamily} 
            onClose={() => setSelectedFamily(null)} 
          />
        )}

        {showAddForm && (
          <AddFamilyForm onClose={() => setShowAddForm(false)} />
        )}
      </div>
    </>
  );
};

export default FamiliesPage;
