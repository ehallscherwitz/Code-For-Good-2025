import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout';
import MainPage from './components/MainPage';
import LoginPage from './components/pages/LoginPage';
import Profile from './components/pages/Profile';
import SurveyForm from './components/pages/SurveyForm';
import Dashboard from './components/pages/Dashboard';
import CreateEventPage from './components/pages/CreateEventPage';
import AuthCallback from './components/pages/AuthCallback';
import SchoolsPage from './components/pages/SchoolsPage';
import AthletesPage from './components/pages/AthletesPage';
import FamiliesPage from './components/pages/FamiliesPage';
import AlumniPage from './components/pages/AlumniPage';
import EventsPage from './components/pages/EventsPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={
              <Layout showNavbar={false} fullscreen={true}>
                <LoginPage />
              </Layout>
            } />
            <Route path="/auth/callback" element={
              <Layout showNavbar={false} fullscreen={true}>
                <AuthCallback />
              </Layout>
            } />
            <Route path="/" element={
              <Layout>
                <MainPage />
              </Layout>
            } />
            <Route path="/profile" element={
              <Layout>
                <Profile />
              </Layout>
            } />
            <Route path="/survey" element={
              <Layout fullscreen={true}>
                <SurveyForm />
              </Layout>
            } />
            <Route path="/dashboard" element={
              <Layout>
                <Dashboard />
              </Layout>
            } />
            <Route path="/create-event" element={
              <Layout>
                <CreateEventPage />
              </Layout>
            } />
            <Route path="/schools" element={
              <Layout>
                <SchoolsPage />
              </Layout>
            } />
            <Route path="/athletes" element={
              <Layout>
                <AthletesPage />
              </Layout>
            } />
            <Route path="/families" element={
              <Layout>
                <FamiliesPage />
              </Layout>
            } />
            <Route path="/alumni" element={
              <Layout>
                <AlumniPage />
              </Layout>
            } />
            <Route path="/events" element={
              <Layout>
                <EventsPage />
              </Layout>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;