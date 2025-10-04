


import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSignUp) {
      alert("Account created successfully!");
      setIsSignUp(false);
    } else {
      navigate("/survey");
    }
  };

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

        <form onSubmit={handleSubmit}>
          {isSignUp && (
            <input
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
            style={{
              width: "100%",
              padding: "12px",
              backgroundColor: "#6d8db3ff",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            {isSignUp ? "Create Account" : "Login"}
          </button>
        </form>

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
