
"use client";
import { useState, useEffect } from "react";
import { Calendar, Users, Bell, Settings, Menu, X, Camera } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import TeamIMPACTLogo from "../assets/TeamIMPACT_Logo_Standard.webp";

const managementItems = [
          { label: "Events", to: "/events" },
          { label: "Schools", to: "/schools" },
          { label: "Athletes", to: "/athletes" },
          { label: "Families", to: "/families" },
          { label: "Alumni", to: "/alumni" },
          { label: "Dashboard", to: "/dashboard" },
        ];



// Enhanced NavDropdown component with animations
const NavDropdown = ({ label, icon: Icon, items, isOpen, onToggle }) => {
  const navigate = useNavigate(); // ✅ inside a block body

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={onToggle}
        style={{
          background: isOpen ? '#27272A' : 'transparent',
          border: 'none',
          color: isOpen ? '#E4E4E7' : '#A1A1AA',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.5rem 1rem',
          cursor: 'pointer',
          borderRadius: '6px',
          fontSize: '0.875rem',
          transition: 'all 0.2s ease-in-out',
        }}
        onMouseEnter={(e) => {
          if (!isOpen) {
            e.currentTarget.style.color = '#E4E4E7';
            e.currentTarget.style.backgroundColor = '#27272A';
          }
        }}
        onMouseLeave={(e) => {
          if (!isOpen) {
            e.currentTarget.style.color = '#A1A1AA';
            e.currentTarget.style.backgroundColor = 'transparent';
          }
        }}
      >
        <Icon size={16} />
        {label}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
             strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
             style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform .2s' }}>
          <polyline points="6,9 12,15 18,9"></polyline>
        </svg>
      </button>

      {isOpen && (
        <>
          <div style={{ position: 'fixed', inset: 0, zIndex: 40 }} onClick={onToggle} />
          <div style={{ position: 'absolute', top: 'calc(100% + 8px)', left: 0, width: '256px', zIndex: 50 }}>
            <div style={{ borderRadius: '8px', border: '1px solid #3F3F46', backgroundColor: '#18181B', overflow: 'hidden' }}>
              <div style={{ maxHeight: '400px', overflowY: 'auto', padding: '8px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {items.map((item, index) => (
                    <a
                      key={index}
                      href={item.href || item.to || '#'}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        color: item.highlight ? '#60A5FA' : '#E4E4E7',
                        textDecoration: 'none',
                        fontSize: '0.875rem',
                        fontWeight: item.highlight ? '500' : '400',
                      }}
                      onClick={(e) => {
                        if (item.to) {
                          e.preventDefault();
                          onToggle?.();
                          navigate(item.to);   // ✅ go to /create-event
                        }
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = item.highlight ? 'rgba(96,165,250,.1)' : '#27272A'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                    >
                      <span>{item.label}</span>
                      {item.badge && (
                        <span style={{
                          padding: '2px 8px',
                          fontSize: '0.75rem',
                          borderRadius: '9999px',
                          backgroundColor: 'rgba(96,165,250,.2)',
                          color: '#60A5FA',
                          fontWeight: '500'
                        }}>
                          {item.badge}
                        </span>
                      )}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <style jsx>{`
        @keyframes dropdownSlideIn {
          from { opacity: 0; transform: translateY(-8px) scale(0.95); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
};

export default function Navbar() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Handle window resize for responsive design
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      // Close mobile menu if screen becomes large
      if (window.innerWidth > 768) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth <= 768;

  const handleSignOut = async () => {
    try {
      await signOut();
      setProfileDropdownOpen(false);
      navigate('/login');
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  // Get user initials for fallback avatar
  const getUserInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  // Get user display name
  const getUserDisplayName = () => {
    if (!user) return 'Guest';
    return user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'User';
  };

  // Get user email
  const getUserEmail = () => {
    if (!user) return '';
    return user.email || '';
  };

  // Get user profile picture
  const getUserAvatar = () => {
    if (!user) return null;
    return user.user_metadata?.avatar_url || user.user_metadata?.picture || null;
  };

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      left: 0,
      right: 0,
      width: '100%',
      minHeight: '80px',
      height: 'auto',
      backgroundColor: '#18181B',
      borderBottom: '1px solid #27272A',
      zIndex: 1000,
      margin: 0,
      padding: 0,
      boxSizing: 'border-box'
    }}>
      <div style={{
        display: 'flex',
        minHeight: '80px',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: isMobile ? '1rem 0.5rem' : '1rem 2rem',
        width: '100%',
        margin: 0,
        boxSizing: 'border-box'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '1rem' : '2rem' }}>
          <button 
            onClick={() => navigate('/dashboard')}
            style={{ 
              display: 'flex', 
              alignItems: 'center',
              background: 'transparent',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              borderRadius: '6px',
              transition: 'opacity 0.2s ease-in-out'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '0.8';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '1';
            }}
          >
            <img 
              src={TeamIMPACTLogo} 
              alt="TeamIMPACT Logo" 
              style={{
                height: '72px',
                width: '72px',
                objectFit: 'contain'
              }} 
            />
          </button>

          {/* Desktop Navigation */}
          {!isMobile && (
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.25rem'
            }}>
              <button
                onClick={() => navigate('/create-event')}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#A1A1AA',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1rem',
                  cursor: 'pointer',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  transition: 'all 0.2s ease-in-out',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#E4E4E7';
                  e.currentTarget.style.backgroundColor = '#27272A';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#A1A1AA';
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <Calendar size={16} />
                Create an Event
              </button>
              <button
                onClick={() => navigate('/connect')}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#A1A1AA',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1rem',
                  cursor: 'pointer',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  transition: 'all 0.2s ease-in-out',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#E4E4E7';
                  e.currentTarget.style.backgroundColor = '#27272A';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#A1A1AA';
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <Users size={16} />
                Connect
              </button>
              <NavDropdown
                label="Management"
                icon={Settings}
                items={managementItems}
                isOpen={activeDropdown === "management"}
                onToggle={() => setActiveDropdown(activeDropdown === "management" ? null : "management")}
              />
              <button
                onClick={() => navigate('/scrapbook')}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#A1A1AA',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1rem',
                  cursor: 'pointer',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  transition: 'all 0.2s ease-in-out',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#E4E4E7';
                  e.currentTarget.style.backgroundColor = '#27272A';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#A1A1AA';
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <Camera size={16} />
                Scrapbook
              </button>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Mobile Hamburger Menu - moved to right side */}
          {isMobile && (
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#E4E4E7',
                padding: '0.5rem',
                cursor: 'pointer',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          )}

          {/* Desktop-only notifications and profile */}
          {!isMobile && (
            <>
              <button style={{
                position: 'relative',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '0.5rem',
                borderRadius: '6px'
              }}>
                <Bell size={20} style={{ color: '#E4E4E7' }} />
                <span style={{
                  position: 'absolute',
                  top: '2px',
                  right: '2px',
                  height: '8px',
                  width: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#60A5FA'
                }} />
              </button>

              <div style={{ position: 'relative' }}>
                <div 
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  style={{
                    height: '44px',
                    width: '44px',
                    borderRadius: '50%',
                    backgroundColor: profileDropdownOpen ? '#60A5FA' : '#3F3F46',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#E4E4E7',
                    fontSize: '1.1rem',
                    fontWeight: '500',
                    transition: 'all 0.2s ease-in-out',
                    border: '2px solid transparent',
                    boxSizing: 'border-box',
                    outline: profileDropdownOpen ? '2px solid #60A5FA' : 'none',
                    outlineOffset: '2px',
                    overflow: 'hidden'
                  }}
                  onMouseEnter={(e) => {
                    if (!profileDropdownOpen) {
                      e.target.style.backgroundColor = '#52525B';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!profileDropdownOpen) {
                      e.target.style.backgroundColor = '#3F3F46';
                    }
                  }}
                >
                  {getUserAvatar() ? (
                    <img 
                      src={getUserAvatar()} 
                      alt="Profile" 
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        borderRadius: '50%'
                      }}
                    />
                  ) : (
                    getUserInitials(getUserDisplayName())
                  )}
                </div>

                {profileDropdownOpen && (
                  <>
                    {/* Backdrop */}
                    <div 
                      style={{
                        position: 'fixed',
                        inset: 0,
                        zIndex: 40
                      }}
                      onClick={() => setProfileDropdownOpen(false)}
                    />
                    
                    {/* Profile Dropdown */}
                    <div style={{
                      position: 'absolute',
                      top: 'calc(100% + 8px)',
                      right: 0,
                      width: '200px',
                      zIndex: 50,
                      animation: 'dropdownSlideIn 0.2s ease-out',
                      transformOrigin: 'top right'
                    }}>
                      <div style={{
                        borderRadius: '8px',
                        border: '1px solid #3F3F46',
                        backgroundColor: '#18181B',
                        boxShadow: '0 10px 38px -10px rgba(0, 0, 0, 0.35), 0 10px 20px -15px rgba(0, 0, 0, 0.2)',
                        overflow: 'hidden'
                      }}>
                        {/* User Info Section */}
                        <div style={{
                          padding: '16px',
                          borderBottom: '1px solid #3F3F46',
                          backgroundColor: '#1A1A1A',
                          textAlign: 'center'
                        }}>
                          <div style={{ color: '#E4E4E7', fontSize: '0.875rem', fontWeight: '500', marginBottom: '4px' }}>
                            {getUserDisplayName()}
                          </div>
                          <div style={{ color: '#A1A1AA', fontSize: '0.75rem' }}>
                            {getUserEmail()}
                          </div>
                        </div>

                        {/* Menu Items */}
                        <div style={{ padding: '8px' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                            {[
                              { label: 'Account Settings', icon: '⚙️', to: '/profile' },
                              { label: 'Sign Out', icon: '🚪', highlight: true, action: handleSignOut }
                            ].map((item, index) => (
                              <a
                                key={index}
                                href={item.href || item.to || '#'}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '12px',
                                  padding: '8px 12px',
                                  borderRadius: '6px',
                                  color: item.highlight ? '#EF4444' : '#E4E4E7',
                                  textDecoration: 'none',
                                  fontSize: '0.875rem',
                                  fontWeight: item.highlight ? '500' : '400',
                                  transition: 'background-color 0.2s ease-in-out'
                                }}
                                onClick={(e) => {
                                  if (item.action) {
                                    e.preventDefault();
                                    item.action();
                                  } else if (item.to) {
                                    e.preventDefault();
                                    setProfileDropdownOpen(false);
                                    navigate(item.to);
                                  }
                                }}
                                onMouseEnter={(e) => {
                                  e.target.style.backgroundColor = item.highlight ? 'rgba(239, 68, 68, 0.1)' : '#27272A';
                                }}
                                onMouseLeave={(e) => {
                                  e.target.style.backgroundColor = 'transparent';
                                }}
                              >
                                <span style={{ width: '16px', textAlign: 'center' }}>{item.icon}</span>
                                <span>{item.label}</span>
                              </a>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobile && mobileMenuOpen && (
        <div style={{
          position: 'fixed',
          top: '80px', // Below the navbar
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: '#18181B',
          zIndex: 999,
          padding: '2rem',
          overflowY: 'auto'
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            maxWidth: '400px',
            margin: '0 auto'
          }}>
            {/* User Profile Section */}
            <div style={{
              padding: '1.5rem',
              backgroundColor: '#27272A',
              borderRadius: '12px',
              textAlign: 'center',
              marginBottom: '1rem'
            }}>
              <div style={{
                height: '60px',
                width: '60px',
                borderRadius: '50%',
                backgroundColor: '#3F3F46',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#E4E4E7',
                fontSize: '1.5rem',
                fontWeight: '500',
                margin: '0 auto 1rem auto',
                overflow: 'hidden'
              }}>
                {getUserAvatar() ? (
                  <img 
                    src={getUserAvatar()} 
                    alt="Profile" 
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      borderRadius: '50%'
                    }}
                  />
                ) : (
                  getUserInitials(getUserDisplayName())
                )}
              </div>
              <div style={{ color: '#E4E4E7', fontSize: '1.1rem', fontWeight: '500', marginBottom: '0.5rem' }}>
                {getUserDisplayName()}
              </div>
              <div style={{ color: '#A1A1AA', fontSize: '0.9rem' }}>
                {getUserEmail()}
              </div>
            </div>

            {/* Navigation Items */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem'
            }}>
              {[
                { label: 'Dashboard', icon: '🏠', to: '/dashboard' },
                { label: 'Create Event', icon: '📅', to: '/create-event' },
                { label: 'Connect', icon: '👥', to: '/connect' },
                { label: 'Scrapbook', icon: '📸', to: '/scrapbook' },
                { label: 'Events', icon: '🎯', to: '/events' },
                { label: 'Schools', icon: '🏫', to: '/schools' },
                { label: 'Athletes', icon: '🏃', to: '/athletes' },
                { label: 'Families', icon: '👨‍👩‍👧‍👦', to: '/families' },
                { label: 'Alumni', icon: '🎓', to: '/alumni' }
              ].map((item, index) => (
                <button
                  key={index}
                  onClick={() => {
                    navigate(item.to);
                    setMobileMenuOpen(false);
                  }}
                  style={{
                    background: 'transparent',
                    border: '1px solid #3F3F46',
                    color: '#E4E4E7',
                    padding: '1rem 1.5rem',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    textAlign: 'left',
                    transition: 'all 0.2s ease-in-out',
                    width: '100%'
                  }}
                  onMouseDown={(e) => {
                    e.currentTarget.style.backgroundColor = '#27272A';
                    e.currentTarget.style.borderColor = '#60A5FA';
                  }}
                  onMouseUp={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.borderColor = '#3F3F46';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.borderColor = '#3F3F46';
                  }}
                >
                  <span style={{ fontSize: '1.2rem', width: '24px', textAlign: 'center' }}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>

            {/* Account Actions */}
            <div style={{
              marginTop: '2rem',
              paddingTop: '2rem',
              borderTop: '1px solid #3F3F46',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem'
            }}>
              <button
                onClick={() => {
                  navigate('/profile');
                  setMobileMenuOpen(false);
                }}
                style={{
                  background: 'transparent',
                  border: '1px solid #3F3F46',
                  color: '#E4E4E7',
                  padding: '1rem 1.5rem',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  textAlign: 'left',
                  transition: 'all 0.2s ease-in-out',
                  width: '100%'
                }}
                onMouseDown={(e) => {
                  e.currentTarget.style.backgroundColor = '#27272A';
                  e.currentTarget.style.borderColor = '#60A5FA';
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.borderColor = '#3F3F46';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.borderColor = '#3F3F46';
                }}
              >
                <span style={{ fontSize: '1.2rem', width: '24px', textAlign: 'center' }}>⚙️</span>
                <span>Account Settings</span>
              </button>

              <button
                onClick={() => {
                  handleSignOut();
                  setMobileMenuOpen(false);
                }}
                style={{
                  background: 'transparent',
                  border: '1px solid #EF4444',
                  color: '#EF4444',
                  padding: '1rem 1.5rem',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  textAlign: 'left',
                  transition: 'all 0.2s ease-in-out',
                  width: '100%'
                }}
                onMouseDown={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <span style={{ fontSize: '1.2rem', width: '24px', textAlign: 'center' }}>🚪</span>
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
