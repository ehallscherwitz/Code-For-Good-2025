import React from 'react';
import Navbar from '../Navbar';

const Dashboard = () => {
  return (
    <>
      <Navbar />
      <div style={{ padding: '20px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>Dashboard</h1>
      <p style={{ textAlign: 'center', marginBottom: '30px' }}>This is the dashboard page component.</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ 
          backgroundColor: '#f8f9fa', 
          padding: '20px', 
          borderRadius: '8px', 
          border: '1px solid #dee2e6',
          textAlign: 'center'
        }}>
          <h3 style={{ color: '#007bff', marginBottom: '10px' }}>Total Users</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '0' }}>1,234</p>
        </div>
        
        <div style={{ 
          backgroundColor: '#f8f9fa', 
          padding: '20px', 
          borderRadius: '8px', 
          border: '1px solid #dee2e6',
          textAlign: 'center'
        }}>
          <h3 style={{ color: '#28a745', marginBottom: '10px' }}>Active Sessions</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '0' }}>456</p>
        </div>
        
        <div style={{ 
          backgroundColor: '#f8f9fa', 
          padding: '20px', 
          borderRadius: '8px', 
          border: '1px solid #dee2e6',
          textAlign: 'center'
        }}>
          <h3 style={{ color: '#ffc107', marginBottom: '10px' }}>Pending Tasks</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '0' }}>23</p>
        </div>
        
        <div style={{ 
          backgroundColor: '#f8f9fa', 
          padding: '20px', 
          borderRadius: '8px', 
          border: '1px solid #dee2e6',
          textAlign: 'center'
        }}>
          <h3 style={{ color: '#dc3545', marginBottom: '10px' }}>Issues</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '0' }}>7</p>
        </div>
      </div>
      
      <div style={{ marginTop: '30px', textAlign: 'center' }}>
        <h3>Recent Activity</h3>
        <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'left' }}>
          <ul style={{ listStyle: 'none', padding: '0' }}>
            <li style={{ padding: '10px', borderBottom: '1px solid #eee' }}>User John Doe logged in</li>
            <li style={{ padding: '10px', borderBottom: '1px solid #eee' }}>New survey response received</li>
            <li style={{ padding: '10px', borderBottom: '1px solid #eee' }}>Profile updated by Jane Smith</li>
            <li style={{ padding: '10px', borderBottom: '1px solid #eee' }}>System backup completed</li>
          </ul>
        </div>
      </div>
      </div>
    </>
  );
};

export default Dashboard;
