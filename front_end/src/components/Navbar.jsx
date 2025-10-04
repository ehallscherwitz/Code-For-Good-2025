
"use client";
import { useState } from "react";
import { Calendar, Users, User, Bell } from "lucide-react";

const eventsItems = [
  { label: "All Events", href: "#", badge: "24" },
  { label: "Upcoming", href: "#", badge: "8" },
  { label: "Past Events", href: "#" },
  { label: "Drafts", href: "#", badge: "3" },
  { label: "Archived", href: "#" },
  { label: "Create New Event", href: "#", highlight: true },
];

const connectItems = [
  { label: "Messages", href: "#", badge: "12" },
  { label: "Connections", href: "#", badge: "156" },
  { label: "Invitations", href: "#", badge: "5" },
  { label: "Groups", href: "#" },
  { label: "Following", href: "#" },
  { label: "Followers", href: "#" },
];

const profileItems = [
  { label: "View Profile", href: "#" },
  { label: "Account Settings", href: "#" },
  { label: "Preferences", href: "#" },
  { label: "Notifications", href: "#" },
  { label: "Privacy", href: "#" },
  { label: "Sign Out", href: "#", highlight: true },
];

// Enhanced NavDropdown component with animations
const NavDropdown = ({ label, icon: Icon, items, isOpen, onToggle }) => (
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
        ':hover': {
          color: '#E4E4E7',
          backgroundColor: '#27272A'
        }
      }}
      onMouseEnter={(e) => {
        if (!isOpen) {
          e.target.style.color = '#E4E4E7';
          e.target.style.backgroundColor = '#27272A';
        }
      }}
      onMouseLeave={(e) => {
        if (!isOpen) {
          e.target.style.color = '#A1A1AA';
          e.target.style.backgroundColor = 'transparent';
        }
      }}
    >
      <Icon size={16} />
      {label}
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 0.2s ease-in-out'
        }}
      >
        <polyline points="6,9 12,15 18,9"></polyline>
      </svg>
    </button>
    
    {isOpen && (
      <>
        {/* Backdrop */}
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 40
          }}
          onClick={onToggle}
        />
        
        {/* Dropdown */}
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 8px)',
          left: 0,
          width: '256px',
          zIndex: 50,
          animation: 'dropdownSlideIn 0.2s ease-out',
          transformOrigin: 'top'
        }}>
          <div style={{
            borderRadius: '8px',
            border: '1px solid #3F3F46',
            backgroundColor: '#18181B',
            boxShadow: '0 10px 38px -10px rgba(0, 0, 0, 0.35), 0 10px 20px -15px rgba(0, 0, 0, 0.2)',
            overflow: 'hidden'
          }}>
            <div style={{
              maxHeight: '400px',
              overflowY: 'auto',
              padding: '8px'
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {items.map((item, index) => (
                  <a
                    key={index}
                    href={item.href}
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
                      transition: 'background-color 0.2s ease-in-out',
                      ':hover': {
                        backgroundColor: item.highlight ? 'rgba(96, 165, 250, 0.1)' : '#27272A'
                      }
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = item.highlight ? 'rgba(96, 165, 250, 0.1)' : '#27272A';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'transparent';
                    }}
                  >
                    <span>{item.label}</span>
                    {item.badge && (
                      <span style={{
                        padding: '2px 8px',
                        fontSize: '0.75rem',
                        borderRadius: '9999px',
                        backgroundColor: 'rgba(96, 165, 250, 0.2)',
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
        from {
          opacity: 0;
          transform: translateY(-8px) scale(0.95);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }
    `}</style>
  </div>
);

export default function Navbar() {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      left: 0,
      right: 0,
      width: '100vw',
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
        padding: '1rem 2rem',
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              height: '32px',
              width: '32px',
              borderRadius: '8px',
              backgroundColor: '#60A5FA'
            }} />
            <span style={{ fontSize: '1.125rem', fontWeight: '600', color: '#E4E4E7' }}>
              Dashboard
            </span>
          </div>

          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.25rem',
            '@media (max-width: 768px)': { display: 'none' }
          }}>
            <NavDropdown
              label="Events"
              icon={Calendar}
              items={eventsItems}
              isOpen={activeDropdown === "events"}
              onToggle={() => setActiveDropdown(activeDropdown === "events" ? null : "events")}
            />
            <NavDropdown
              label="Connect"
              icon={Users}
              items={connectItems}
              isOpen={activeDropdown === "connect"}
              onToggle={() => setActiveDropdown(activeDropdown === "connect" ? null : "connect")}
            />
            <NavDropdown
              label="Profile"
              icon={User}
              items={profileItems}
              isOpen={activeDropdown === "profile"}
              onToggle={() => setActiveDropdown(activeDropdown === "profile" ? null : "profile")}
            />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
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
                height: '32px',
                width: '32px',
                borderRadius: '50%',
                backgroundColor: profileDropdownOpen ? '#60A5FA' : '#3F3F46',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#E4E4E7',
                fontSize: '0.875rem',
                fontWeight: '500',
                transition: 'all 0.2s ease-in-out',
                border: '2px solid transparent',
                boxSizing: 'border-box',
                outline: profileDropdownOpen ? '2px solid #60A5FA' : 'none',
                outlineOffset: '2px'
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
              JD
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
                        John Doe
                      </div>
                      <div style={{ color: '#A1A1AA', fontSize: '0.75rem' }}>
                        john.doe@example.com
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div style={{ padding: '8px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        {[
                          { label: 'View Profile', icon: '👤' },
                          { label: 'Account Settings', icon: '⚙️' },
                          { label: 'Preferences', icon: '🎨' },
                          { label: 'Notifications', icon: '🔔' },
                          { label: 'Privacy', icon: '🔒' },
                          { label: 'Sign Out', icon: '🚪', highlight: true }
                        ].map((item, index) => (
                          <a
                            key={index}
                            href="#"
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
        </div>
      </div>
    </nav>
  );
}
