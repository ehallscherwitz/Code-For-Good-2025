import React, { useState, useEffect } from 'react';
import Navbar from '../Navbar';
import dashboardCarousel1 from '../../assets/dashboard_carhousel_1.webp';
import dashboardCarousel2 from '../../assets/dashboard_carhousel_2.png';
import dashboardCarousel3 from '../../assets/dashboard_carhousel_3.png';

const Dashboard = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const carouselImages = [
    dashboardCarousel1,
    dashboardCarousel2,
    dashboardCarousel3
  ];

  // Auto-rotate images every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === carouselImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [carouselImages.length]);

  const upcomingEvents = [
    {
      title: "Basketball Skills Workshop",
      category: "Basketball",
      date: "March 15, 2025",
      time: "2:00 PM - 4:00 PM",
      location: "Community Sports Center",
      participants: "12 participants"
    },
    {
      title: "Swimming & Adaptive Aquatics",
      category: "Swimming",
      date: "March 18, 2025",
      time: "10:00 AM - 12:00 PM",
      location: "University Pool",
      participants: "8 participants"
    }
  ];

  return (
    <>
      <Navbar />
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: '#ffffff',
        padding: '0'
      }}>
        <div style={{
          display: 'flex',
          minHeight: 'calc(100vh - 60px)', // Adjust based on navbar height
          gap: '20px',
          padding: '20px',
          maxWidth: '1400px',
          margin: '0 auto'
        }}>
          {/* Left Content Area */}
          <div style={{
            flex: '2',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            textAlign: 'center'
          }}>
            {/* Welcome Section */}
            <div style={{textAlign: 'center'}}>
              <h1 style={{
                fontSize: '48px',
                fontWeight: 'bold',
                color: '#000000',
                margin: '0 0 16px 0',
                lineHeight: '1.2'
              }}>
                Welcome Back
              </h1>
              <p style={{
                fontSize: '18px',
                color: '#000000',
                margin: '0 0 24px 0',
                lineHeight: '1.5',
                width: '100%',
                textAlign: 'center'
              }}>
                Connecting young athletes with college mentors to inspire, empower, and build lasting friendships.
              </p>
            </div>

            {/* Image Carousel */}
            <div style={{
              position: 'relative',
              width: '100%',
              height: '500px',
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
            flex: '1',
            maxWidth: '400px'
          }}>
            <div style={{
              backgroundColor: '#f8f9fa',
              borderRadius: '12px',
              padding: '24px',
              height: 'fit-content'
            }}>
              <h2 style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#000000',
                margin: '0 0 20px 0'
              }}>
                Upcoming Events
              </h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {upcomingEvents.map((event, index) => (
                  <div key={index} style={{
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
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;