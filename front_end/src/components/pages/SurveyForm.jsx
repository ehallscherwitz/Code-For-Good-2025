import React from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault(); // prevent page refresh
    // You can add login validation here if needed
    navigate('/survey'); // go to SurveyForm.jsx
  };

  return (
    <div 
      style={{ 
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden'
      }}
    >
      {/* Fullscreen background image */}
      <img 
        src="/Go-team-600x450-1.webp"
        alt="Background"
        style={{ 
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          objectFit: 'cover',
          zIndex: -1
        }}
      />

      {/* Logo in the top-right */}
      <img 
        src="/TeamIMPACT_Logo_Standard.webp"
        alt="Logo"
        style={{ 
          position: 'absolute',
          top: '20px',
          right: '20px',
          width: '100px',
          height: 'auto'
        }}
      />

      {/* Login form */}
      <div 
        style={{ 
          background: 'rgba(255, 255, 255, 0.9)', 
          padding: '30px',
          borderRadius: '12px',
          boxShadow: '0px 4px 12px rgba(0,0,0,0.2)',
          textAlign: 'center',
          zIndex: 1,
          width: '100%',
          maxWidth: '350px'
        }}
      >
        <h1 style={{ marginBottom: '20px' }}>Login</h1>
        <form style={{ width: '100%' }} onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <input 
              type="email" 
              placeholder="Email" 
              style={{ 
                width: '100%', 
                padding: '10px',
                borderRadius: '6px',
                border: '1px solid #ccc'
              }}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <input 
              type="password" 
              placeholder="Password" 
              style={{ 
                width: '100%', 
                padding: '10px',
                borderRadius: '6px',
                border: '1px solid #ccc'
              }}
            />
          </div>
          <button 
            type="submit" 
            style={{ 
              width: '100%', 
              padding: '12px',
              backgroundColor: '#007bff', 
              color: 'white', 
              border: 'none', 
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
