import React from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/survey');
  };

  return (
    <div 
      style={{ 
        position: 'relative',
        height: '100vh',
        width: '100vw',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden'
      }}
    >
      {/* Fullscreen Background */}
      <img 
        src="/leadin-MSOC_TeamImpact_Oct152021034-1.jpg"
        alt="Background"
        style={{ 
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: -1
        }}
      />

      {/* Logo */}
      <img 
        src="/TeamIMPACT_Logo_Standard.webp"
        alt="Logo"
        style={{ 
          position: 'absolute',
          top: '20px',
          right: '20px',
          width: '100px',   //changed this...................
          height: 'auto'
        }}
      />

      {/* Login Box (moved farther up & left) */}
      <div 
        style={{ 
          background: 'rgba(255,255,255,0.9)',
          padding: '40px',
          borderRadius: '12px',
          boxShadow: '0px 4px 12px rgba(0,0,0,0.3)',
          textAlign: 'center',
          maxWidth: '350px',
          width: '90%',
          transform: 'translate(-180px, -100px)', // further left & up
          zIndex: 1
        }}
      >
        <h1 style={{ marginBottom: '20px' }}>Login</h1>
        <form onSubmit={handleSubmit}>
          <input 
            type="email" 
            placeholder="Email" 
            style={{ 
              width: '100%', 
              marginBottom: '15px', 
              padding: '10px', 
              borderRadius: '6px',
              border: '1px solid #ccc'
            }} 
          />
          <input 
            type="password" 
            placeholder="Password" 
            style={{ 
              width: '100%', 
              marginBottom: '15px', 
              padding: '10px', 
              borderRadius: '6px',
              border: '1px solid #ccc'
            }} 
          />
          <button 
            type="submit" 
            style={{ 
              width: '100%', 
              padding: '12px',
              backgroundColor: '#007bff', 
              color: '#fff', 
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