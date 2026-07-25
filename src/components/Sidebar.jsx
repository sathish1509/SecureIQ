import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Sidebar() {
  const { isAdmin, logout } = useAuth();
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
            to="/email-scanner" 
            className={({ isActive }) => 
              `sidebar-menu-item ${isActive ? 'active' : ''}`
            }
          >
            <span className="font-mono text-xs">[EML]</span> Email Scanner
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
          {isAdmin && (
            <NavLink 
              to="/admin" 
              className={({ isActive }) => 
                `sidebar-menu-item ${isActive ? 'active' : ''}`
              }
            >
              <span className="font-mono text-xs">[ADM]</span> Admin Portal
            </NavLink>
          )}
          <NavLink 
            to="/login" 
            className="sidebar-menu-item text-danger-text hover:bg-danger-bg"
            onClick={logout}
          >
            <span className="font-mono text-xs">[OUT]</span> Logout
          </NavLink>
        </nav>
      </div>
    </aside>
  );
}
