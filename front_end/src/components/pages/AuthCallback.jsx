import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth callback error:', error);
          setError(error.message);
          setLoading(false);
          return;
        }

        if (data.session) {
          // User is authenticated, redirect to dashboard
          navigate('/dashboard');
        } else {
          // No session found, redirect to login
          navigate('/login');
        }
      } catch (err) {
        console.error('Unexpected error:', err);
        setError('An unexpected error occurred');
        setLoading(false);
      }
    };

    handleAuthCallback();
  }, [navigate]);

  if (error) {
    return (
      <div style={{
        position: "relative",
        height: "100vh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f5f5"
      }}>
        <div style={{
          textAlign: "center",
          padding: "40px",
          background: "white",
          borderRadius: "12px",
          boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
          maxWidth: "400px"
        }}>
          <h2 style={{ color: "#dc3545", marginBottom: "20px" }}>Authentication Error</h2>
          <p style={{ color: "#666", marginBottom: "30px" }}>{error}</p>
          <button
            onClick={() => navigate('/login')}
            style={{
              padding: "12px 24px",
              backgroundColor: "#6d8db3ff",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "500"
            }}
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      position: "relative",
      height: "100vh",
      width: "100vw",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#f5f5f5"
    }}>
      <div style={{
        textAlign: "center",
        padding: "40px",
        background: "white",
        borderRadius: "12px",
        boxShadow: "0px 4px 12px rgba(0,0,0,0.1)"
      }}>
        <div style={{
          width: "40px",
          height: "40px",
          border: "4px solid #f3f3f3",
          borderTop: "4px solid #6d8db3ff",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
          margin: "0 auto 20px"
        }}></div>
        <p>Completing sign-in...</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
};

export default AuthCallback;
