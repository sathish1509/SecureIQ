import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Import Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import UrlScannerPage from './pages/UrlScannerPage';
import ScanReportPage from './pages/ScanReportPage';
import HistoryPage from './pages/HistoryPage';

import ThreatIntelPage from './pages/ThreatIntelPage';
import ExtensionPopupPage from './pages/ExtensionPopupPage';
import NotificationsPage from './pages/NotificationsPage';
import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/ProfilePage';
import AboutPage from './pages/AboutPage';
import ComingSoonPage from './pages/ComingSoonPage';

function ProtectedRoute({ children }) {
  const { isLoggedIn } = useAuth();
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function PublicOnlyRoute({ children }) {
  const { isLoggedIn } = useAuth();
  if (isLoggedIn) {
    return <Navigate to="/scanner" replace />;
  }
  return children;
}

function RootRedirect() {
  const { isLoggedIn } = useAuth();
  if (isLoggedIn) {
    return <Navigate to="/scanner" replace />;
  }
  return <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-page font-body text-brandText-main">
          <Navbar />

          <main className="flex-1 max-w-[1400px] w-full mx-auto p-6 lg:p-8">
            <Routes>
              {/* Root Redirect */}
              <Route path="/" element={<RootRedirect />} />

              {/* Public Auth Route */}
              <Route path="/login" element={<PublicOnlyRoute><LoginPage /></PublicOnlyRoute>} />
              <Route path="/landing" element={<LandingPage />} />
              <Route path="/about" element={<AboutPage />} />

              {/* Protected Application Routes - Accessible only after Login */}
              <Route path="/scanner" element={<ProtectedRoute><UrlScannerPage /></ProtectedRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
              <Route path="/report" element={<ProtectedRoute><ScanReportPage /></ProtectedRoute>} />
              <Route path="/history" element={<ProtectedRoute><HistoryPage /></ProtectedRoute>} />

              <Route path="/threat-intel" element={<ProtectedRoute><ThreatIntelPage /></ProtectedRoute>} />
              <Route path="/extension" element={<ProtectedRoute><ExtensionPopupPage /></ProtectedRoute>} />
              <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

              {/* Fallback */}
              <Route path="/coming-soon" element={<ComingSoonPage />} />
              <Route path="*" element={<RootRedirect />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}
