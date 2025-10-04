import React, { useState, useEffect } from 'react';
import Navbar from '../Navbar';
import { Calendar, MapPin, Users, Clock, Eye, Edit, Trash2, Plus } from 'lucide-react';

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/events');
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      const data = await response.json();
      // Sort events by date
      const sortedEvents = data.sort((a, b) => new Date(a.event_date) - new Date(b.event_date));
      setEvents(sortedEvents);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = (event.event_name || 'Untitled Event')
      .toLowerCase()
      .includes(searchTerm.toLowerCase()) ||
      (event.event_location || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterType === 'all') return matchesSearch;
    if (filterType === 'upcoming') {
      return matchesSearch && new Date(event.event_date) >= new Date();
    }
    if (filterType === 'past') {
      return matchesSearch && new Date(event.event_date) < new Date();
    }
    if (filterType === 'today') {
      const eventDate = new Date(event.event_date);
      const today = new Date();
      return matchesSearch && 
        eventDate.getFullYear() === today.getFullYear() &&
        eventDate.getMonth() === today.getMonth() &&
        eventDate.getDate() === today.getDate();
    }
    return matchesSearch && event.event_type === filterType;
  });

  const handleDeleteEvent = async (eventId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/events/${eventId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setEvents(events.filter(e => e.event_id !== eventId));
        alert('Event deleted successfully');
      } else {
        alert('Failed to delete event');
      }
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Error deleting event');
    }
    setShowDeleteConfirm(null);
  };

  const EventCard = ({ event }) => {
    const isUpcoming = new Date(event.event_date) >= new Date();
    const isPast = new Date(event.event_date) < new Date();
    
    return (
      <div className={`bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow ${
        isPast ? 'opacity-75' : ''
      }`}>
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-semibold text-gray-900">
                {event.event_name || 'Untitled Event'}
              </h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                isUpcoming 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-gray-100 text-gray-700'
              }`}>
                {isUpcoming ? 'Upcoming' : 'Past'}
              </span>
              {event.event_type && (
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                  {event.event_type}
                </span>
              )}
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">
                  {new Date(event.event_date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
              
              {event.event_time && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">{event.event_time}</span>
                </div>
              )}
              
              {event.event_location && (
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{event.event_location}</span>
                </div>
              )}
            </div>
              
            {event.event_description && (
              <p className="text-sm text-gray-600 mt-3 line-clamp-2">
                {event.event_description}
              </p>
            )}
          </div>
          
          <div className="flex gap-2 ml-4">
            <button
              onClick={() => setSelectedEvent(event)}
              className="p-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
              title="View Details"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={() => alert('Edit functionality would be implemented here')}
              className="p-2 bg-green-100 text-green-700 rounded-md hover:bg-green-200"
              title="Edit Event"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowDeleteConfirm(event.event_id)}
              className="p-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200"
              title="Delete Event"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  const EventModal = ({ event, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {event.event_name || 'Untitled Event'}
            </h2>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Event Information</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">{new Date(event.event_date).toLocaleDateString()}</span>
                  </div>
                  {event.event_time && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">{event.event_time}</span>
                    </div>
                  )}
                  {event.event_location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">{event.event_location}</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-2">Event Details</h3>
                <div className="space-y-2">
                  <div className="text-sm text-gray-600">Status: {event.event_status || 'Active'}</div>
                </div>
              </div>
            </div>

            {event.event_description && (
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Description</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{event.event_description}</p>
              </div>
            )}

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Additional Information</h3>
              <div className="text-sm text-gray-600">
                <p>Event ID: <code className="bg-gray-200 px-1 rounded">{event.event_id}</code></p>
                <p>Created: {new Date(event.event_created_at).toLocaleDateString()} at {new Date(event.event_created_at).toLocaleTimeString()}</p>
                {event.event_updated_at && (
                  <p>Last updated: {new Date(event.event_updated_at).toLocaleDateString()} at {new Date(event.event_updated_at).toLocaleTimeString()}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const DeleteConfirmModal = ({ eventId, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Delete Event</h2>
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete this event? This action cannot be undone.
          </p>
          
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={() => handleDeleteEvent(eventId)}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-900">Events Management</h1>
              <button
                onClick={() => window.open('/create-event', '_blank')}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                <Plus className="w-4 h-4" />
                Create Event
              </button>
            </div>
            <p className="text-gray-600 mb-6">
              Manage and view all events in your Team IMPACT network
            </p>
            
            {/* Filters and Search */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 max-w-md">
                <input
                  type="text"
                  placeholder="Search events by title or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex gap-2">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Events</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="today">Today</option>
                  <option value="past">Past</option>
                  <option value="game">Games</option>
                  <option value="practice">Practice</option>
                  <option value="meetup">Meetups</option>
                  <option value="celebration">Celebrations</option>
                  <option value="other">Other</option>
                </select>
                
                <button
                  onClick={fetchEvents}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                >
                  Refresh
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading events...</p>
              </div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
              <p className="text-red-600">Error: {error}</p>
              <button 
                onClick={fetchEvents}
                className="text-red-600 underline mt-2"
              >
                Try again
              </button>
            </div>
          ) : filteredEvents.length > 0 ? (
            <>
              <div className="flex justify-between items-center MB-6">
                <p className="text-gray-600">
                  Showing {filteredEvents.length} of {events.length} events
                  {filterType !== 'all' && ` (${filterType})`}
                  {searchTerm && ` matching "${searchTerm}"`}
                </p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredEvents.map((event) => (
                  <EventCard key={event.event_id} event={event} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">No events found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || filterType !== 'all' ? 
                  `No events match your ${searchTerm ? 'search' : 'filter'} criteria` :
                  'No events have been created yet.'
                }
              </p>
              {(searchTerm || filterType !== 'all') && (
                <button 
                  onClick={() => {
                    setSearchTerm('');
                    setFilterType('all');
                  }}
                  className="text-blue-600 hover:text-blue-700 underline"
                >
                  Clear filters
                </button>
              )}
            </div>
          )}
        </div>

        {/* Modals */}
        {selectedEvent && (
          <EventModal 
            event={selectedEvent} 
            onClose={() => setSelectedEvent(null)} 
          />
        )}

        {showDeleteConfirm && (
          <DeleteConfirmModal 
            eventId={showDeleteConfirm}
            onClose={() => setShowDeleteConfirm(null)} 
          />
        )}
      </div>
    </>
  );
};

export default EventsPage;
