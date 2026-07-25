import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Import Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import UrlScannerPage from './pages/UrlScannerPage';
import ScanReportPage from './pages/ScanReportPage';
import EmailScannerPage from './pages/EmailScannerPage';
import HistoryPage from './pages/HistoryPage';
import ThreatIntelPage from './pages/ThreatIntelPage';
import ExtensionPopupPage from './pages/ExtensionPopupPage';
import NotificationsPage from './pages/NotificationsPage';
import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/ProfilePage';
import AboutPage from './pages/AboutPage';
import ComingSoonPage from './pages/ComingSoonPage';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-page font-body text-brandText-main">
          <Navbar />

          <main className="flex-1 max-w-[1400px] w-full mx-auto p-6 lg:p-8">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/landing" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/scanner" element={<UrlScannerPage />} />
              <Route path="/report" element={<ScanReportPage />} />
              <Route path="/report/:scanId" element={<ScanReportPage />} />
              <Route path="/email-scanner" element={<EmailScannerPage />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="/threat-intel" element={<ThreatIntelPage />} />
              <Route path="/extension" element={<ExtensionPopupPage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/coming-soon" element={<ComingSoonPage />} />
              <Route path="*" element={<ComingSoonPage />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}
