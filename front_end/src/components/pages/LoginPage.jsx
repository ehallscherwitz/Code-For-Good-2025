


import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const LoginPage = () => {
  const navigate = useNavigate();
  const { signInWithGoogle, user, loading } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // List your public image paths here (rooted at /)
  const slides = useMemo(
    () => ["/image1.jpg", "/image1.webp", "/image3.webp", "/image4.jpg"],
    []
  );

  // Preload images once
  useEffect(() => {
    slides.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, [slides]);

  // Cycle index for crossfade
  const [index, setIndex] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 6000); // change slide every 6s
    return () => clearInterval(intervalRef.current);
  }, [slides.length]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');

    try {
      if (isSignUp) {
        // Signup logic - for demo purposes, we'll redirect to survey
        alert("Registration successful! Please complete your profile.");
        navigate("/survey");
      } else {
        // Login logic - navigate to dashboard after successful login
        navigate("/dashboard");
      }
    } catch (err) {
      setError("Login failed. Please try again.");
      console.error('Auth error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsGoogleLoading(true);
      await signInWithGoogle();
      // Redirect to home page after successful login
      navigate("/");
    } catch (error) {
      console.error('Sign-in failed:', error);
      alert('Sign-in failed. Please try again.');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  // Note: Removed automatic redirect for already authenticated users
  // Users should only be redirected after successful login action

  // Show loading state while checking auth
  if (loading) {
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
          <p>Loading...</p>
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div
      style={{
        position: "relative",
        height: "100vh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      {/* Fullscreen Background Slideshow */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          zIndex: -1,
        }}
      >
        {slides.map((src, i) => (
          <img
            key={src}
            src={src}
            alt="" // decorative background
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "opacity 1.5s ease-in-out",
              opacity: i === index ? 1 : 0,
            }}
          />
        ))}
        {/* Optional: subtle overlay to keep form readable */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom right, rgba(0,0,0,0.25), rgba(0,0,0,0.35))",
          }}
        />
      </div>

      {/* Logo */}
      <img
        src="/TeamIMPACT_Logo_Standard.webp"
        alt="Logo"
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          width: "100px",
          height: "auto",
        }}
      />

      {/* Form Box */}
      <div
        style={{
          background: "rgba(255, 255, 255, 0.68)",
          padding: "40px",
          borderRadius: "12px",
          boxShadow: "0px 4px 12px rgba(0,0,0,0.3)",
          textAlign: "center",
          maxWidth: "350px",
          width: "90%",
          transform: "translate(-180px, -100px)",
          zIndex: 1,
          backdropFilter: "saturate(1.1) blur(2px)",
        }}
      >
        <h1 style={{ marginBottom: "20px" }}>
          {isSignUp ? "Sign Up" : "Login"}
        </h1>

        {error && (
          <div style={{
            marginBottom: "15px",
            padding: "10px",
            backgroundColor: "#ffe6e6",
            border: "1px solid #ffcccc",
            borderRadius: "6px",
            color: "#d63031",
            fontSize: "14px"
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {isSignUp && (
            <input
              name="fullName"
              type="text"
              placeholder="Full Name"
              style={{
                width: "100%",
                marginBottom: "15px",
                padding: "10px",
                borderRadius: "6px",
                border: "1px solid #ccc",
              }}
              required
            />
          )}

          <input
            name="email"
            type="email"
            placeholder="Email"
            style={{
              width: "100%",
              marginBottom: "15px",
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #ccc",
            }}
            required
          />
          <input
            name="password"
            type="password"
            placeholder={isSignUp ? "Create Password" : "Password"}
            style={{
              width: "100%",
              marginBottom: "15px",
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #ccc",
            }}
            required
          />
          {isSignUp && (
            <input
              name="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              style={{
                width: "100%",
              marginBottom: "15px",
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              }}
              required
            />
          )}

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: "100%",
              padding: "12px",
              backgroundColor: isLoading ? "#6d8db3aa" : "#6d8db3ff",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: isLoading ? "not-allowed" : "pointer",
              fontWeight: "bold",
              marginBottom: "15px"
            }}
          >
            {isLoading ? "Processing..." : (isSignUp ? "Create Account" : "Login")}
          </button>
        </form>

        {/* Google Sign-In Button */}
        <div style={{ marginTop: "20px", marginBottom: "15px" }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "10px",
            color: "#666"
          }}>
            <div style={{ flex: 1, height: "1px", backgroundColor: "#ddd" }}></div>
            <span style={{ padding: "0 15px", fontSize: "14px" }}>or</span>
            <div style={{ flex: 1, height: "1px", backgroundColor: "#ddd" }}></div>
          </div>
          
          <button
            onClick={handleGoogleSignIn}
            disabled={isGoogleLoading}
            style={{
              width: "100%",
              padding: "12px",
              backgroundColor: "#fff",
              color: "#333",
              border: "1px solid #ddd",
              borderRadius: "6px",
              cursor: isGoogleLoading ? "not-allowed" : "pointer",
              fontWeight: "500",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              opacity: isGoogleLoading ? 0.7 : 1,
              transition: "all 0.3s ease"
            }}
            onMouseOver={(e) => {
              if (!isGoogleLoading) {
                e.target.style.backgroundColor = "#f9f9f9";
                e.target.style.borderColor = "#ccc";
              }
            }}
            onMouseOut={(e) => {
              if (!isGoogleLoading) {
                e.target.style.backgroundColor = "#fff";
                e.target.style.borderColor = "#ddd";
              }
            }}
          >
            {isGoogleLoading ? (
              <>
                <div style={{
                  width: "16px",
                  height: "16px",
                  border: "2px solid #ddd",
                  borderTop: "2px solid #6d8db3ff",
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite"
                }}></div>
                Signing in...
              </>
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </>
            )}
          </button>
        </div>

        <p style={{ marginTop: "15px" }}>
          {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            style={{
              background: "none",
              border: "none",
              color: "#007bff",
              cursor: "pointer",
              textDecoration: "underline",
            }}
          >
            {isSignUp ? "Login" : "Sign Up"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
