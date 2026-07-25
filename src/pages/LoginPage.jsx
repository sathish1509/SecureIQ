import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('analyst@secureiq.io');
  const [password, setPassword] = useState('SecureIQ2026!');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setErrorMsg(err.message || 'Invalid email or password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] py-8">
      <div className="max-w-[400px] w-full mx-auto">
        <div className="bg-surface border border-brandBorder rounded-md p-8 shadow-sm flex flex-col gap-6">
          {/* Logo & Header */}
          <div className="text-center">
            <Link to="/" className="font-heading font-bold text-xl tracking-wider text-brandText-main no-underline inline-block mb-3">
              <span className="text-brandText-main">SECURE</span>
              <span className="text-accentBlue">IQ</span>
            </Link>
            <h1 className="font-heading text-2xl font-semibold text-brandText-main">
              Sign In to SecureIQ
            </h1>
            <p className="text-sm text-brandText-muted mt-1">
              Enterprise threat intelligence platform
            </p>
          </div>

          {errorMsg && (
            <div className="bg-danger-bg border border-danger-border text-danger-text p-3 rounded-md text-xs font-semibold">
              {errorMsg}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-xs font-semibold text-brandText-secondary">
                Email Address
              </label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-10 px-3 font-body text-sm text-brandText-main bg-surface border border-brandBorder-strong rounded-md focus:outline-none focus:border-accentBlue focus:ring-2 focus:ring-accentBlue/20" 
                placeholder="security@organization.com" 
                required 
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-xs">
                <label htmlFor="password" className="font-semibold text-brandText-secondary">
                  Password
                </label>
                <a href="#" onClick={(e) => e.preventDefault()} className="font-mono text-accentBlue no-underline hover:underline">
                  Forgot password?
                </a>
              </div>
              <input 
                type="password" 
                id="password" 
                name="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-10 px-3 font-body text-sm text-brandText-main bg-surface border border-brandBorder-strong rounded-md focus:outline-none focus:border-accentBlue focus:ring-2 focus:ring-accentBlue/20" 
                placeholder="••••••••••••" 
                required 
              />
            </div>

            <div className="flex items-center justify-between text-xs my-1">
              <label className="flex items-center gap-2 cursor-pointer text-brandText-secondary select-none">
                <input type="checkbox" name="remember" defaultChecked className="accent-navy" />
                Remember me
              </label>
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="btn-primary h-10 w-full text-sm font-semibold flex items-center justify-center cursor-pointer disabled:opacity-60"
            >
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center text-center text-brandText-muted text-xs uppercase tracking-wider my-1 before:flex-1 before:border-b before:border-brandBorder-subtle before:mr-3 after:flex-1 after:border-b after:border-brandBorder-subtle after:ml-3">
            or
          </div>

          {/* Google SSO Button (Decorative) */}
          <button 
            type="button" 
            className="btn-secondary h-10 w-full bg-surface text-brandText-main border border-brandBorder-strong hover:bg-subtle flex items-center justify-center gap-2 text-sm font-medium cursor-pointer" 
            onClick={() => navigate('/dashboard')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" className="inline-block">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            Continue with Google
          </button>

          {/* Footer Subtext */}
          <div className="text-center text-xs text-brandText-muted mt-1">
            Don't have an account?{' '}
            <Link to="/register" className="text-accentBlue font-semibold no-underline hover:underline">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
