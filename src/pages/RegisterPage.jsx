import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (password.length < 8) {
      setErrorMsg('Password must be at least 8 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);

    try {
      await register(email, password);
      navigate('/dashboard');
    } catch (err) {
      setErrorMsg(err.message || 'Registration failed.');
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
              Create Account
            </h1>
            <p className="text-sm text-brandText-muted mt-1">
              Join the SecureIQ Threat Intelligence Platform
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
              <label htmlFor="reg-email" className="text-xs font-semibold text-brandText-secondary">
                Work Email Address
              </label>
              <input 
                type="email" 
                id="reg-email" 
                name="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-10 px-3 font-body text-sm text-brandText-main bg-surface border border-brandBorder-strong rounded-md focus:outline-none focus:border-accentBlue focus:ring-2 focus:ring-accentBlue/20" 
                placeholder="analyst@organization.com" 
                required 
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="reg-password" className="text-xs font-semibold text-brandText-secondary">
                Password (min 8 chars)
              </label>
              <input 
                type="password" 
                id="reg-password" 
                name="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-10 px-3 font-body text-sm text-brandText-main bg-surface border border-brandBorder-strong rounded-md focus:outline-none focus:border-accentBlue focus:ring-2 focus:ring-accentBlue/20" 
                placeholder="••••••••••••" 
                required 
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="reg-confirm-password" className="text-xs font-semibold text-brandText-secondary">
                Confirm Password
              </label>
              <input 
                type="password" 
                id="reg-confirm-password" 
                name="confirmPassword" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="h-10 px-3 font-body text-sm text-brandText-main bg-surface border border-brandBorder-strong rounded-md focus:outline-none focus:border-accentBlue focus:ring-2 focus:ring-accentBlue/20" 
                placeholder="••••••••••••" 
                required 
              />
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="btn-primary h-10 w-full text-sm font-semibold flex items-center justify-center cursor-pointer disabled:opacity-60 mt-2"
            >
              {isSubmitting ? 'Creating Account...' : 'Register Account'}
            </button>
          </form>

          {/* Footer Subtext */}
          <div className="text-center text-xs text-brandText-muted mt-1">
            Already have an account?{' '}
            <Link to="/login" className="text-accentBlue font-semibold no-underline hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
