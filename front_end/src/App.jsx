import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './components/MainPage';
import LoginPage from './components/pages/LoginPage';
import Profile from './components/pages/Profile';
import SurveyForm from './components/pages/SurveyForm';
import Dashboard from './components/pages/Dashboard';
import CreateEventPage from "./components/pages/CreateEventPage.jsx";
import './App.css';


function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/survey" element={<SurveyForm />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create-event" element={<CreateEventPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App
