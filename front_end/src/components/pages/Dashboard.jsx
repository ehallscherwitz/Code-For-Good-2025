import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import dashboardCarousel1 from '../../assets/dashboard_carhousel_1.webp';
import dashboardCarousel2 from '../../assets/dashboard_carhousel_2.png';
import dashboardCarousel3 from '../../assets/dashboard_carhousel_3.png';

const API_BASE = import.meta?.env?.VITE_API_BASE || 'http://localhost:5000';

const Dashboard = () => {
  const { getAccessToken, loading: authLoading } = useAuth();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [events, setEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [eventsError, setEventsError] = useState('');

  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState('');

  const [linkedList, setLinkedList] = useState([]); // athletes for family, families for athlete
  const [linkedLoading, setLinkedLoading] = useState(false);

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const carouselImages = useMemo(() => [dashboardCarousel1, dashboardCarousel2, dashboardCarousel3], []);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const isMobile = windowWidth <= 768;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === carouselImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);
    return () => clearInterval(interval);
  }, [carouselImages.length]);

  // Fetch upcoming events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setEventsLoading(true);
        setEventsError('');
        const response = await fetch(`${API_BASE}/api/events`);
        if (!response.ok) throw new Error('Failed to fetch events');
        const data = await response.json();
        setEvents(Array.isArray(data) ? data : []);
      } catch (err) {
        // Treat network/server issues as "no events"
        setEvents([]);
        setEventsError('');
        console.error('Error fetching events:', err);
      } finally {
        setEventsLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // Fetch profile (/api/me/profile) to know role + team + school
  useEffect(() => {
    const loadProfile = async () => {
      try {
        setProfileLoading(true);
        setProfileError('');
        const token = await getAccessToken();
        const res = await fetch(`${API_BASE}/api/me/profile`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!res.ok) {
          const msg = await res.text().catch(() => '');
          throw new Error(msg || `Profile request failed: ${res.status}`);
        }
        const json = await res.json();
        setProfile(json || null);
      } catch (e) {
        setProfile(null);
        setProfileError(e.message || 'Failed to load profile');
      } finally {
        setProfileLoading(false);
      }
    };
    if (!authLoading) loadProfile();
  }, [authLoading, getAccessToken]);

  // Optionally pull linked entities based on role and team_id
  useEffect(() => {
    const loadLinked = async () => {
      if (!profile?.team?.team_id) {
        setLinkedList([]);
        return;
      }
      setLinkedLoading(true);
      try {
        const token = await getAccessToken();

        // If role === 'family', try to list athletes on same team
        // If role === 'athlete', try to list families assigned to same team
        // These endpoints are optional; if they 404, we just skip listing.
        let url = '';
        if (profile.role === 'family') {
          url = `${API_BASE}/api/teams/${profile.team.team_id}/athletes`;
        } else if (profile.role === 'athlete') {
          url = `${API_BASE}/api/teams/${profile.team.team_id}/families`;
        } else {
          setLinkedList([]);
          setLinkedLoading(false);
          return;
        }

        const res = await fetch(url, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
        if (!res.ok) {
          // If route not available, quietly ignore
          setLinkedList([]);
          setLinkedLoading(false);
          return;
        }
        const data = await res.json().catch(() => []);
        setLinkedList(Array.isArray(data) ? data : []);
      } catch (e) {
        setLinkedList([]);
      } finally {
        setLinkedLoading(false);
      }
    };

    if (profile && !profileLoading) loadLinked();
  }, [profile, profileLoading, getAccessToken]);

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

  const upcomingEvents = events
    .filter(event => new Date(event.event_date) >= new Date())
    .slice(0, 5)
    .map(formatEventForDisplay);

  const PairingCard = () => {
    if (profileLoading) {
      return (
        <div style={pairingCardStyle}>
          <h2 style={pairingTitleStyle}>Your Pairing</h2>
          <div style={{ color: '#6c757d', fontSize: 14 }}>Loading your profile…</div>
        </div>
      );
    }
    if (profileError || !profile) {
      return (
        <div style={pairingCardStyle}>
          <h2 style={pairingTitleStyle}>Your Pairing</h2>
          <div style={{ color: '#6c757d', fontSize: 14 }}>
            No profile found. Please complete your signup form.
          </div>
        </div>
      );
    }

    const roleLabel = profile.role === 'family' ? 'Family' : profile.role === 'athlete' ? 'Athlete' : 'User';
    const teamName = profile.team?.team_name || 'Not assigned';
    const schoolName = profile.school?.name || 'Unknown School';

    return (
      <div style={pairingCardStyle}>
        <h2 style={pairingTitleStyle}>Your Pairing</h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={rowStyle}>
            <span style={labelChip}>Role</span>
            <span style={valueText}>{roleLabel}</span>
          </div>
          <div style={rowStyle}>
            <span style={labelChip}>Team</span>
            <span style={valueText}>{teamName}</span>
          </div>
          <div style={rowStyle}>
            <span style={labelChip}>School</span>
            <span style={valueText}>{schoolName}</span>
          </div>

          {profile.role === 'family' && (
            <div style={{ marginTop: 8 }}>
              <div style={subHeader}>Athletes on your team</div>
              {linkedLoading ? (
                <div style={mutedText}>Loading athletes…</div>
              ) : linkedList.length > 0 ? (
                <ul style={listReset}>
                  {linkedList.map((a) => (
                    <li key={a.athlete_id} style={pillItem}>
                      <span style={{ fontWeight: 600 }}>{a.athlete_name}</span>
                      {a.athlete_email ? <span style={pillMeta}> · {a.athlete_email}</span> : null}
                    </li>
                  ))}
                </ul>
              ) : (
                <div style={mutedText}>No athletes listed yet.</div>
              )}
            </div>
          )}

          {profile.role === 'athlete' && (
            <div style={{ marginTop: 8 }}>
              <div style={subHeader}>Families paired to your team</div>
              {linkedLoading ? (
                <div style={mutedText}>Loading families…</div>
              ) : linkedList.length > 0 ? (
                <ul style={listReset}>
                  {linkedList.map((f) => (
                    <li key={f.parent_id} style={pillItem}>
                      <span style={{ fontWeight: 600 }}>{f.parent_name}</span>
                      {f.children?.name ? <span style={pillMeta}> · Child: {f.children.name}</span> : null}
                    </li>
                  ))}
                </ul>
              ) : (
                <div style={mutedText}>No families listed yet.</div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(255, 255, 255, 0.95) 40%, rgba(168, 85, 247, 0.15) 100%)',
        padding: '0'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          minHeight: 'calc(100vh - 60px)',
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
                background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
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

          <div style={{ position: 'relative', width: '100%', height: isMobile ? '300px' : '500px', borderRadius: 12, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
            <img
              src={carouselImages[currentImageIndex]}
              alt={`Dashboard carousel ${currentImageIndex + 1}`}
              style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'opacity 0.5s ease-in-out' }}
            />
            <div style={{ position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 8 }}>
              {carouselImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    border: 'none',
                    backgroundColor: index === currentImageIndex ? '#000' : '#fff',
                    opacity: index === currentImageIndex ? 1 : 0.6,
                    cursor: 'pointer',
                    transition: 'all .3s ease',
                    padding: 0,
                    minWidth: 8,
                    minHeight: 8
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
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              padding: isMobile ? '16px' : '24px',
              height: 'fit-content',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              border: '1px solid rgba(0, 0, 0, 0.05)'
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
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
                    border: '1px solid rgba(0, 0, 0, 0.05)',
                    transition: 'all 0.2s ease-in-out',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)';
                    e.currentTarget.style.transform = 'translateY(0px)';
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

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 14, color: '#6c757d' }}>📅</span>
                        <span style={{ fontSize: 14, color: '#000' }}>{event.date}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 14, color: '#6c757d' }}>🕐</span>
                        <span style={{ fontSize: 14, color: '#000' }}>{event.time}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 14, color: '#6c757d' }}>📍</span>
                        <span style={{ fontSize: 14, color: '#000' }}>{event.location}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 14, color: '#6c757d' }}>👥</span>
                        <span style={{ fontSize: 14, color: '#000' }}>{event.participants}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ textAlign: 'center', padding: 20, color: '#6c757d' }}>
                  <div style={{ fontSize: 16, marginBottom: 8 }}>No upcoming events</div>
                  <div style={{ fontSize: 12 }}>Check back later for new events</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/** Styles */
const pairingCardStyle = {
  backgroundColor: '#f8f9fa',
  borderRadius: 12,
  padding: 20,
  height: 'fit-content',
  boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
};

const pairingTitleStyle = {
  fontSize: 22,
  fontWeight: 'bold',
  color: '#000',
  margin: '0 0 12px 0'
};

const rowStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 10
};

const labelChip = {
  background: '#e9ecef',
  color: '#000',
  borderRadius: 999,
  fontSize: 12,
  padding: '4px 10px',
  fontWeight: 600,
  minWidth: 68,
  textAlign: 'center'
};

const valueText = {
  color: '#000',
  fontSize: 14,
  fontWeight: 600
};

const subHeader = {
  color: '#000',
  fontWeight: 700,
  marginBottom: 8
};

const mutedText = {
  color: '#6c757d',
  fontSize: 14
};

const listReset = {
  listStyle: 'none',
  padding: 0,
  margin: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: 8
};

const pillItem = {
  background: '#fff',
  border: '1px solid #e9ecef',
  borderRadius: 10,
  padding: '10px 12px',
  display: 'flex',
  alignItems: 'center',
  gap: 6
};

const pillMeta = {
  color: '#6c757d',
  fontSize: 12
};

export default Dashboard;
