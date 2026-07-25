import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    login();
    navigate('/dashboard');
  };

  const handleGoogleLogin = () => {
    login();
    navigate('/dashboard');
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="max-w-[420px] mx-auto w-full my-8">
        <div className="bg-surface border border-brandBorder rounded-md p-8 shadow-sm flex flex-col gap-6">
          <div className="text-center">
            <Link to="/" className="font-heading font-bold text-xl tracking-wider text-brandText-main no-underline inline-block mb-3">
              <span className="text-navy">SECURE</span><span className="text-accentBlue">IQ</span>
            </Link>
            <h1 className="font-heading text-2xl font-semibold text-brandText-main">Welcome Back</h1>
            <p className="text-sm text-brandText-muted mt-1">Sign in to access your security analytics & dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-xs font-semibold text-brandText-secondary">Email Address</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                className="h-10 px-3 font-body text-sm text-brandText-main bg-surface border border-brandBorder-strong rounded-md focus:outline-none focus:border-accentBlue focus:ring-2 focus:ring-accentBlue/20" 
                placeholder="security@organization.com" 
                required 
                defaultValue="analyst@secureiq.io"
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs">
                <label htmlFor="password" className="font-semibold text-brandText-secondary">Password</label>
                <Link to="/coming-soon" className="font-mono text-accentBlue no-underline">Forgot password?</Link>
              </div>
              <input 
                type="password" 
                id="password" 
                name="password" 
                className="h-10 px-3 font-body text-sm text-brandText-main bg-surface border border-brandBorder-strong rounded-md focus:outline-none focus:border-accentBlue focus:ring-2 focus:ring-accentBlue/20" 
                placeholder="••••••••••••" 
                required 
                defaultValue="SecureIQ2026!"
              />
            </div>

            <div className="flex items-center justify-between text-xs mb-2">
              <label className="flex items-center gap-2 cursor-pointer text-brandText-secondary">
                <input type="checkbox" name="remember" defaultChecked className="accent-navy" />
                Remember this device for 30 days
              </label>
            </div>

            <button type="submit" className="btn-primary btn-lg w-full">Sign In to SecureIQ</button>
          </form>

          <div className="flex items-center text-center text-brandText-muted text-xs uppercase tracking-wider my-1 before:flex-1 before:border-b before:border-brandBorder-subtle before:mr-3 after:flex-1 after:border-b after:border-brandBorder-subtle after:ml-3">
            Or continue with
          </div>

          <button 
            type="button" 
            className="btn-secondary btn-lg w-full bg-surface text-brandText-main border border-brandBorder-strong hover:bg-subtle" 
            onClick={handleGoogleLogin}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" className="mr-2 inline-block"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/></svg>
            Continue with Google
          </button>

          <div className="text-center text-sm text-brandText-muted mt-2">
            Don't have an account? <Link to="/coming-soon" className="text-accentBlue font-semibold no-underline">Request Enterprise Trial</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
