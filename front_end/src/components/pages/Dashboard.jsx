import React, { useState, useEffect } from 'react';
import dashboardCarousel1 from '../../assets/dashboard_carhousel_1.webp';
import dashboardCarousel2 from '../../assets/dashboard_carhousel_2.png';
import dashboardCarousel3 from '../../assets/dashboard_carhousel_3.png';

const Dashboard = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  
  const carouselImages = [
    dashboardCarousel1,
    dashboardCarousel2,
    dashboardCarousel3
  ];

  // Handle window resize for responsive design
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth <= 768;

  // Auto-rotate images every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === carouselImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [carouselImages.length]);

  // Fetch real events from API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(''); // Clear any previous errors
        const response = await fetch('http://localhost:5000/api/events');
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        const data = await response.json();
        setEvents(data || []); // Ensure events is always an array
      } catch (err) {
        // Only set error for actual network/server errors, not for empty results
        if (err.message.includes('NetworkError') || err.message.includes('fetch')) {
          // If it's a network error, treat it as no events available
          setEvents([]);
          setError('');
        } else {
          setError(err.message);
        }
        console.error('Error fetching events:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Transform API events to display format
  const formatEventForDisplay = (event) => ({
    id: event.event_id,
    title: event.event_name || 'Untitled Event',
    category: event.event_type || 'General',
    date: new Date(event.event_date).toLocaleDateString('en-US', { 
      month: 'long', day: 'numeric', year: 'numeric' 
    }),
    time: event.event_time || 'TBD',
    location: event.event_location || 'TBD',
    participants: 'Open',
    description: event.event_description || ''
  });

  // Get upcoming events (assuming upcoming means future dates)
  const upcomingEvents = events
    .filter(event => {
      const eventDate = new Date(event.event_date);
      return eventDate >= new Date(); // Current date or future
    })
    .slice(0, 5) // Limit to 5 events
    .map(formatEventForDisplay);

  return (
    <>
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: '#ffffff',
        padding: '0'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          minHeight: 'calc(100vh - 60px)', // Adjust based on navbar height
          gap: '20px',
          padding: isMobile ? '10px' : '20px',
          maxWidth: '1400px',
          margin: '0 auto'
        }}>
          {/* Left Content Area */}
          <div style={{
            flex: isMobile ? 'none' : '2',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            textAlign: 'center',
            width: isMobile ? '100%' : 'auto'
          }}>
            {/* Welcome Section */}
            <div style={{textAlign: 'center'}}>
              <h1 style={{
                fontSize: isMobile ? '32px' : '48px',
                fontWeight: 'bold',
                color: '#000000',
                margin: '0 0 16px 0',
                lineHeight: '1.2'
              }}>
                Welcome Back
              </h1>
              <p style={{
                fontSize: isMobile ? '16px' : '18px',
                color: '#000000',
                margin: '0 0 24px 0',
                lineHeight: '1.5',
                width: '100%',
                textAlign: 'center',
                padding: isMobile ? '0 10px' : '0'
              }}>
                Connecting young athletes with college mentors to inspire, empower, and build lasting friendships.
              </p>
            </div>

            {/* Image Carousel */}
            <div style={{
              position: 'relative',
              width: '100%',
              height: isMobile ? '300px' : '500px',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
            }}>
              <img
                src={carouselImages[currentImageIndex]}
                alt={`Dashboard carousel ${currentImageIndex + 1}`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'opacity 0.5s ease-in-out'
                }}
              />
              
              {/* Carousel Indicators */}
              <div style={{
                position: 'absolute',
                bottom: '16px',
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                gap: '8px',
                
              }}>
                {carouselImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        border: 'none',
                        backgroundColor: index === currentImageIndex ? '#000000' : '#ffffff',
                        opacity: index === currentImageIndex ? 1 : 0.6,
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        padding: '0',
                        minWidth: '8px',
                        minHeight: '8px'
                      }}
                    />
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar - Upcoming Events */}
          <div style={{
            flex: isMobile ? 'none' : '1',
            maxWidth: isMobile ? '100%' : '400px',
            width: isMobile ? '100%' : 'auto'
          }}>
            <div style={{
              backgroundColor: '#f8f9fa',
              borderRadius: '12px',
              padding: isMobile ? '16px' : '24px',
              height: 'fit-content'
            }}>
              <h2 style={{
                fontSize: isMobile ? '20px' : '24px',
                fontWeight: 'bold',
                color: '#000000',
                margin: isMobile ? '0 0 16px 0' : '0 0 20px 0'
              }}>
                Upcoming Events
              </h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {loading ? (
                  <div style={{ textAlign: 'center', padding: '20px', color: '#6c757d' }}>
                    <div style={{ marginBottom: '10px' }}>Loading events...</div>
                    <div style={{ fontSize: '12px' }}>Fetching upcoming events...</div>
                  </div>
                ) : error ? (
                  <div style={{ 
                    backgroundColor: '#ffe6e6', 
                    border: '1px solid #ffcccc', 
                    color: '#d63031',
                    padding: '12px',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}>
                    Error loading events: {error}
                  </div>
                ) : upcomingEvents.length > 0 ? (
                  upcomingEvents.map((event, index) => (
                    <div key={event.id || index} style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '8px',
                    padding: '16px',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '8px'
                    }}>
                      <h3 style={{
                        fontSize: '16px',
                        fontWeight: 'bold',
                        color: '#000000',
                        margin: '0'
                      }}>
                        {event.title}
                      </h3>
                      <span style={{
                        backgroundColor: '#e9ecef',
                        color: '#000000',
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '500'
                      }}>
                        {event.category}
                      </span>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '14px', color: '#6c757d' }}>📅</span>
                        <span style={{ fontSize: '14px', color: '#000000' }}>{event.date}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '14px', color: '#6c757d' }}>🕐</span>
                        <span style={{ fontSize: '14px', color: '#000000' }}>{event.time}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '14px', color: '#6c757d' }}>📍</span>
                        <span style={{ fontSize: '14px', color: '#000000' }}>{event.location}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '14px', color: '#6c757d' }}>👥</span>
                        <span style={{ fontSize: '14px', color: '#000000' }}>{event.participants}</span>
                      </div>
                    </div>
                    </div>
                  ))
                ) : (
                  <div style={{ textAlign: 'center', padding: '20px', color: '#6c757d' }}>
                    <div style={{ fontSize: '16px', marginBottom: '8px' }}>No upcoming events</div>
                    <div style={{ fontSize: '12px' }}>Check back later for new events</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;