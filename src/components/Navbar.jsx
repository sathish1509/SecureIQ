import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { isLoggedIn, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };


  return (
    <header className="bg-surface border-b border-brandBorder h-14 sticky top-0 z-50">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-8 h-full flex items-center justify-between gap-4">
        {/* Brand Logo & Tag */}
        <div className="flex items-center gap-3 shrink-0">
          <Link to="/" className="font-heading font-bold text-lg tracking-wider text-brandText-main no-underline whitespace-nowrap">
            <span className="text-navy">SECURE</span><span className="text-accentBlue">IQ</span>
          </Link>
          <span className="text-xs font-mono font-medium text-brandText-muted bg-subtle px-2 py-0.5 border border-brandBorder-subtle rounded-sm whitespace-nowrap hidden sm:inline-block">
            Threat Engine v1.0
          </span>
        </div>
        
        {/* Navigation Links */}
        <nav className="hidden lg:flex items-center gap-5 shrink-0">
          <NavLink 
            to="/" 
            className={({ isActive }) => 
              `text-sm font-medium py-1.5 border-b-2 no-underline whitespace-nowrap transition-colors ${
                isActive ? 'text-accentBlue border-accentBlue' : 'text-brandText-secondary border-transparent hover:text-brandText-main'
              }`
            }
          >
            Home
          </NavLink>
          <NavLink 
            to="/scanner" 
            className={({ isActive }) => 
              `text-sm font-medium py-1.5 border-b-2 no-underline whitespace-nowrap transition-colors ${
                isActive ? 'text-accentBlue border-accentBlue' : 'text-brandText-secondary border-transparent hover:text-brandText-main'
              }`
            }
          >
            URL Scanner
          </NavLink>
          <NavLink 
            to="/dashboard" 
            className={({ isActive }) => 
              `text-sm font-medium py-1.5 border-b-2 no-underline whitespace-nowrap transition-colors ${
                isActive ? 'text-accentBlue border-accentBlue' : 'text-brandText-secondary border-transparent hover:text-brandText-main'
              }`
            }
          >
            Dashboard
          </NavLink>
          <NavLink 
            to="/threat-intel" 
            className={({ isActive }) => 
              `text-sm font-medium py-1.5 border-b-2 no-underline whitespace-nowrap transition-colors ${
                isActive ? 'text-accentBlue border-accentBlue' : 'text-brandText-secondary border-transparent hover:text-brandText-main'
              }`
            }
          >
            Threat Intel
          </NavLink>
          <NavLink 
            to="/about" 
            className={({ isActive }) => 
              `text-sm font-medium py-1.5 border-b-2 no-underline whitespace-nowrap transition-colors ${
                isActive ? 'text-accentBlue border-accentBlue' : 'text-brandText-secondary border-transparent hover:text-brandText-main'
              }`
            }
          >
            Docs & Help
          </NavLink>
        </nav>

        {/* Status & Auth Action Buttons */}
        <div className="flex items-center gap-3 text-xs font-medium text-brandText-muted shrink-0">
          <div className="flex items-center gap-2 whitespace-nowrap">
            <span className="w-2 h-2 rounded-full bg-safe-fill shadow-[0_0_0_2px_rgba(16,185,129,0.2)]"></span>
            <span className="hidden xl:inline">Engine Live</span>
          </div>

          {isLoggedIn ? (
            <div className="flex items-center gap-3 pl-3 border-l border-brandBorder shrink-0">
              <Link to="/profile" className="flex items-center gap-2 text-xs font-semibold text-brandText-main hover:text-accentBlue no-underline whitespace-nowrap">
                <div className="w-7 h-7 shrink-0 bg-navy text-white rounded-full flex items-center justify-center font-bold text-[11px] leading-none">
                  {user.avatar}
                </div>
                <span className="hidden sm:inline text-xs font-semibold whitespace-nowrap">{user.name}</span>
              </Link>
              <button onClick={handleLogout} className="btn-outline btn-sm whitespace-nowrap">
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 pl-3 border-l border-brandBorder shrink-0">
              <Link to="/login" className="btn-outline btn-sm whitespace-nowrap">Login</Link>
              <Link to="/login" className="btn-primary btn-sm whitespace-nowrap">Get Started</Link>
            </div>
          )}

        </div>
      </div>
    </header>
  );
}
