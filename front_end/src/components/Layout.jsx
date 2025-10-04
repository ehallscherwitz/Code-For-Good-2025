import React from 'react';
import Navbar from './Navbar';

const Layout = ({ children, showNavbar = true, fullscreen = false }) => {
  if (fullscreen) {
    return (
      <>
        {showNavbar && <Navbar />}
        {children}
      </>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      {showNavbar && <Navbar />}
      <main style={{ paddingTop: showNavbar ? '0' : '0' }}>
        {children}
      </main>
    </div>
  );
};

export default Layout;
