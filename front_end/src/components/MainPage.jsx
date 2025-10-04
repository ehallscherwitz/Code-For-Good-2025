import React from 'react';
import { Link } from 'react-router-dom';

const MainPage = () => {
  const buttonStyle = {
    display: 'block',
    width: '200px',
    padding: '15px 20px',
    margin: '10px auto',
    backgroundColor: '#007bff',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '8px',
    textAlign: 'center',
    fontSize: '16px',
    fontWeight: 'bold',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease'
  };

  const hoverStyle = {
    backgroundColor: '#0056b3'
  };

  return (
    <div style={{ 
      padding: '40px 20px', 
      textAlign: 'center',
      minHeight: '100vh',
      backgroundColor: '#f8f9fa'
    }}>
      <h1 style={{ 
        marginBottom: '10px', 
        color: '#333',
        fontSize: '2.5rem'
      }}>
        Welcome to Our App
      </h1>
      <p style={{ 
        marginBottom: '40px', 
        color: '#666',
        fontSize: '1.2rem'
      }}>
        Choose a page to navigate to:
      </p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', maxWidth: '1000px', margin: '0 auto' }}>
        <Link to="/login" style={buttonStyle}>
          🔐 Login Page
        </Link>
        <Link to="/profile" style={buttonStyle}>
          👤 Profile
        </Link>
        <Link to="/survey" style={buttonStyle}>
          📝 Survey Form
        </Link>
        <Link to="/dashboard" style={buttonStyle}>
          📊 Dashboard
        </Link>
        <Link to="/schools" style={buttonStyle}>
          🏫 Schools
        </Link>
        <Link to="/athletes" style={buttonStyle}>
          🏃 Athletes
        </Link>
        <Link to="/families" style={buttonStyle}>
          👨‍👩‍👧‍👦 Families
        </Link>
        <Link to="/alumni" style={buttonStyle}>
          🎓 Alumni
        </Link>
        <Link to="/events" style={buttonStyle}>
          📋 Events
        </Link>
        <Link to="/create-event" style={buttonStyle}>
          📅 Create Event
        </Link>
      </div>
      
      <div style={{ 
        marginTop: '50px', 
        padding: '20px',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        maxWidth: '500px',
        margin: '50px auto 0'
      }}>
        <h3 style={{ color: '#333', marginBottom: '15px' }}>Navigation Instructions</h3>
        <p style={{ color: '#666', lineHeight: '1.6' }}>
          Click any of the buttons above to navigate to different pages. 
          Each page contains sample content and functionality to demonstrate 
          the routing system.
        </p>
      </div>
    </div>
  );
};

export default MainPage;
