import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Sidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="bg-surface border border-brandBorder rounded-md p-4 shadow-sm flex flex-col gap-4 sticky top-20">
      <div>
        <div className="text-[12px] font-bold uppercase tracking-wider text-brandText-muted px-3 mb-1">
          Navigation
        </div>
        <nav className="flex flex-col gap-0.5">
          <NavLink 
            to="/dashboard" 
            className={({ isActive }) => 
              `sidebar-menu-item ${isActive ? 'active' : ''}`
            }
          >
            <span className="font-mono text-xs">[DB]</span> Dashboard
          </NavLink>
          <NavLink 
            to="/scanner" 
            className={({ isActive }) => 
              `sidebar-menu-item ${isActive ? 'active' : ''}`
            }
          >
            <span className="font-mono text-xs">[URL]</span> URL Scanner
          </NavLink>
          <NavLink 
            to="/history" 
            className={({ isActive }) => 
              `sidebar-menu-item ${isActive ? 'active' : ''}`
            }
          >
            <span className="font-mono text-xs">[HIS]</span> Scan History
          </NavLink>
          <NavLink 
            to="/report" 
            className={({ isActive }) => 
              `sidebar-menu-item ${isActive ? 'active' : ''}`
            }
          >
            <span className="font-mono text-xs">[REP]</span> Reports
          </NavLink>
          <NavLink 
            to="/threat-intel" 
            className={({ isActive }) => 
              `sidebar-menu-item ${isActive ? 'active' : ''}`
            }
          >
            <span className="font-mono text-xs">[INT]</span> Threat Intel
          </NavLink>
        </nav>
      </div>

      <div className="border-t border-brandBorder-subtle pt-3">
        <div className="text-[12px] font-bold uppercase tracking-wider text-brandText-muted px-3 mb-1">
          Account
        </div>
        <nav className="flex flex-col gap-0.5">
          <NavLink 
            to="/profile" 
            className={({ isActive }) => 
              `sidebar-menu-item ${isActive ? 'active' : ''}`
            }
          >
            <span className="font-mono text-xs">[USR]</span> Profile
          </NavLink>
          <NavLink 
            to="/settings" 
            className={({ isActive }) => 
              `sidebar-menu-item ${isActive ? 'active' : ''}`
            }
          >
            <span className="font-mono text-xs">[SET]</span> Settings
          </NavLink>
          <button 
            type="button"
            className="sidebar-menu-item text-danger-text hover:bg-danger-bg w-full text-left cursor-pointer border-none bg-transparent"
            onClick={handleLogout}
          >
            <span className="font-mono text-xs">[OUT]</span> Logout
          </button>

        </nav>
      </div>
    </aside>
  );
}
