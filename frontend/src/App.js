import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/Login';
import StudentDashboard from './pages/StudentDashboard';
import FindProfessor from './pages/FindProfessor';
import ProfessorProfile from './pages/ProfessorProfile';
import CampusMap from './pages/CampusMap';
import RequestMeeting from './pages/RequestMeeting';
import Notifications from './pages/Notifications';
import AIAssistant from './pages/AIAssistant';
import ProfessorDashboard from './pages/ProfessorDashboard';
import ManageAvailability from './pages/ManageAvailability';
import MeetingRequests from './pages/MeetingRequests';
import LocationPrivacy from './pages/LocationPrivacy';
import AttendanceTracker from './pages/AttendanceTracker';
import Analytics from './pages/Analytics';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/find" element={<FindProfessor />} />
        <Route path="/student/professor/:id" element={<ProfessorProfile />} />
        <Route path="/student/map" element={<CampusMap />} />
        <Route path="/student/request" element={<RequestMeeting />} />
        <Route path="/student/notifications" element={<Notifications />} />
        <Route path="/student/ai" element={<AIAssistant />} />
        <Route path="/professor/dashboard" element={<ProfessorDashboard />} />
        <Route path="/professor/availability" element={<ManageAvailability />} />
        <Route path="/professor/requests" element={<MeetingRequests />} />
        <Route path="/professor/location" element={<LocationPrivacy />} />
        <Route path="/professor/attendance" element={<AttendanceTracker />} />
        <Route path="/professor/analytics" element={<Analytics />} />
      </Routes>
    </Router>
  );
}

export default App;