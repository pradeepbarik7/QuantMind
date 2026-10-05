import React, { useState } from 'react';
import {
  Shield,
  Lock,
  Mail,
  User,
  ArrowRight,
  Eye,
  EyeOff,
  CheckCircle2,
  Sparkles,
  Zap,
  Cpu,
  BarChart3,
  UserCheck,
  ShieldAlert,
  Key,
  Copy,
} from 'lucide-react';
import { UserProfile, UserRole } from '../../types';
import { MOCK_USERS } from '../../data/mockMarketData';

interface AuthScreenProps {
  onLoginSuccess: (user: UserProfile) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLoginSuccess }) => {
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('user@quantmind.io');
  const [password, setPassword] = useState('user123');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<UserRole>('user');
  const [affiliation, setAffiliation] = useState('Standard Trading & Behavioral Bias Analysis');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    if (authMode === 'signup' && !fullName) {
      setErrorMsg('Please enter your full name.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);

      // Match preset users or determine role
      const matched = MOCK_USERS.find(
        (u) => u.email.toLowerCase() === email.toLowerCase()
      );

      let finalRole: UserRole = role;
      let finalName = fullName;
      let finalAffiliation = affiliation;

      if (matched) {
        finalRole = matched.role;
        finalName = matched.name;
        finalAffiliation = matched.affiliation;
      } else {
        if (email.toLowerCase().includes('admin')) {
          finalRole = 'admin';
        } else {
          finalRole = authMode === 'signup' ? role : 'user';
        }
        if (!finalName) {
          finalName = email.split('@')[0].toUpperCase();
        }
      }

      const user: UserProfile = {
        id: matched?.id || `usr-${Date.now()}`,
        name: finalName,
        email: email,
        role: finalRole,
        affiliation: finalAffiliation || 'Quantitative Research Laboratory',
        lastActive: 'Just now',
      };
      onLoginSuccess(user);
    }, 500);
  };

  const handleQuickDemoLogin = (preset: typeof MOCK_USERS[0]) => {
    setEmail(preset.email);
    setPassword(preset.passwordHint || 'quant123');
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess(preset);
    }, 350);
  };

  const handleFillCredentials = (moduleType: 'user' | 'admin') => {
    if (moduleType === 'user') {
      setEmail('user@quantmind.io');
      setPassword('user123');
    } else {
      setEmail('admin@quantmind.io');
      setPassword('admin123');
    }
  };

  const copyToClipboard = (text: string, keyName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(keyName);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center px-4 py-8 relative overflow-hidden">
      {/* Background subtle ambient glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-5xl relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Col: Project Briefing & Value Proposition */}
        <div className="lg:col-span-5 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 p-6 sm:p-7 flex flex-col justify-between space-y-6 shadow-xl">
          <div className="space-y-4">
            {/* Wordmark Branding */}
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
                <Zap className="w-3.5 h-3.5" />
                <span>Final-Year B.Tech Capstone Project</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2 pt-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>QuantMind</span>
              </h1>
              <p className="text-xs text-emerald-400 font-mono font-medium">
                Systematic Bias Mitigation Framework
              </p>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              An AI-based quantitative trading analysis platform designed to eliminate emotional human biases
              (fear, greed, panic selling) by synthesizing market-regime detection, machine learning forecasts,
              and news sentiment into disciplined execution signals.
            </p>

            <div className="pt-2 space-y-2 text-xs text-slate-300">
              <div className="flex items-center gap-2.5">
                <div className="p-1 rounded bg-slate-800 text-sky-400">
                  <Cpu className="w-3.5 h-3.5" />
                </div>
                <span>Hidden Markov Model (HMM) Regime Detection</span>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="p-1 rounded bg-slate-800 text-emerald-400">
                  <BarChart3 className="w-3.5 h-3.5" />
                </div>
                <span>XGBoost Multi-Factor Directional Alpha</span>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="p-1 rounded bg-slate-800 text-purple-400">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <span>FinBERT Institutional NLP Sentiment</span>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="p-1 rounded bg-slate-800 text-amber-400">
                  <Shield className="w-3.5 h-3.5" />
                </div>
                <span>Rigorous Behavioral Bias Shield & Risk Rules</span>
              </div>
            </div>
          </div>

          {/* Academic Prototype Notice */}
          <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 text-[11px] text-slate-400 space-y-1">
            <div className="font-semibold text-slate-300 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>Academic Prototype Notice</span>
            </div>
            <p>
              Decision-support prototype for Review-II viva. Non-custodial simulation with zero broker integration or real-money execution.
            </p>
          </div>
        </div>

        {/* Right Col: Login / Signup Form with Module Credentials Callout */}
        <div className="lg:col-span-7 rounded-2xl bg-slate-900/90 border border-slate-800 p-6 sm:p-7 flex flex-col justify-between shadow-2xl space-y-5">
          <div className="space-y-4">
            {/* Header Switcher */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h2 className="text-lg font-bold text-white tracking-tight">
                  {authMode === 'login' ? 'System Authentication' : 'Create Researcher Account'}
                </h2>
                <p className="text-xs text-slate-400">
                  Select User Module or Admin Module credentials below to access.
                </p>
              </div>

              {/* Mode Toggle Button */}
              <div className="flex items-center p-0.5 bg-slate-950 border border-slate-800 rounded text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('login');
                    setErrorMsg(null);
                  }}
                  className={`px-3 py-1 rounded font-medium transition-colors cursor-pointer ${
                    authMode === 'login' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('signup');
                    setErrorMsg(null);
                  }}
                  className={`px-3 py-1 rounded font-medium transition-colors cursor-pointer ${
                    authMode === 'signup' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Sign Up
                </button>
              </div>
            </div>

            {/* Error Notification */}
            {errorMsg && (
              <div className="p-3 rounded-lg bg-rose-950/60 border border-rose-500/40 text-xs text-rose-300">
                {errorMsg}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {authMode === 'signup' && (
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-300">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="e.g. Dr. Rajesh Sharma"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/60 transition-colors"
                    />
                  </div>
                </div>
              )}

              {/* Email */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    placeholder="user@quantmind.io or admin@quantmind.io"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/60 transition-colors font-mono"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-medium text-slate-300">Password</label>
                  {authMode === 'login' && (
                    <span className="text-[11px] text-slate-400 font-mono">
                      (user123 or admin123)
                    </span>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-9 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/60 transition-colors font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Signup Role Selection */}
              {authMode === 'signup' && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-300">Access Role</label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value as UserRole)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                    >
                      <option value="user">User (Trader / Analyst)</option>
                      <option value="admin">Admin (System Governance)</option>
                      <option value="reviewer">Reviewer / Examiner</option>
                      <option value="student">Student Researcher</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-300">Department / Affiliation</label>
                    <input
                      type="text"
                      placeholder="e.g. Dept of Quantitative Finance"
                      value={affiliation}
                      onChange={(e) => setAffiliation(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              )}

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-950/50"
              >
                <span>
                  {isLoading
                    ? 'Authenticating...'
                    : authMode === 'login'
                    ? 'Sign In to Workspace'
                    : 'Register & Enter Workspace'}
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

          {/* Explicit Credentials of BOTH User Module and Admin Module */}
          <div className="pt-3 border-t border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-emerald-400" />
                <span>Demo Access Credentials (Click to 1-Click Login):</span>
              </span>
              <span className="text-[10px] text-slate-500 font-mono">Instant Access</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* 1. USER MODULE CREDENTIAL CARD */}
              <div
                onClick={() => handleQuickDemoLogin(MOCK_USERS[0])}
                className="p-3 rounded-lg bg-slate-950 hover:bg-slate-850/80 border border-slate-800 hover:border-emerald-500/50 transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-xs group-hover:text-emerald-300 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{MOCK_USERS[0].name}</span>
                    </span>
                    {/* Updated to USER badge as requested */}
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase bg-emerald-950 text-emerald-400 border border-emerald-500/40">
                      USER
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-400 mt-1">
                    User Module · Trading & Analytics
                  </div>

                  {/* Credentials Callout */}
                  <div className="mt-2 p-2 rounded bg-slate-900 border border-slate-800 text-[11px] font-mono space-y-0.5 text-slate-300">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Email:</span>
                      <span className="text-emerald-400">user@quantmind.io</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Pass:</span>
                      <span className="text-white">user123</span>
                    </div>
                  </div>
                </div>

                <div className="mt-2 pt-2 border-t border-slate-850 flex items-center justify-between text-[10px] text-slate-400">
                  <span className="text-emerald-400 group-hover:underline">Click to 1-Click Login</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFillCredentials('user');
                    }}
                    className="text-slate-400 hover:text-white underline cursor-pointer"
                  >
                    Auto-fill Form
                  </button>
                </div>
              </div>

              {/* 2. ADMIN MODULE CREDENTIAL CARD */}
              <div
                onClick={() => handleQuickDemoLogin(MOCK_USERS[1])}
                className="p-3 rounded-lg bg-slate-950 hover:bg-slate-850/80 border border-slate-800 hover:border-purple-500/50 transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-xs group-hover:text-purple-300 flex items-center gap-1.5">
                      <ShieldAlert className="w-3.5 h-3.5 text-purple-400" />
                      <span>{MOCK_USERS[1].name}</span>
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase bg-purple-950 text-purple-400 border border-purple-500/40">
                      ADMIN
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-400 mt-1">
                    Admin Module · System Governance
                  </div>

                  {/* Credentials Callout */}
                  <div className="mt-2 p-2 rounded bg-slate-900 border border-slate-800 text-[11px] font-mono space-y-0.5 text-slate-300">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Email:</span>
                      <span className="text-purple-400">admin@quantmind.io</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Pass:</span>
                      <span className="text-white">admin123</span>
                    </div>
                  </div>
                </div>

                <div className="mt-2 pt-2 border-t border-slate-850 flex items-center justify-between text-[10px] text-slate-400">
                  <span className="text-purple-400 group-hover:underline">Click to 1-Click Login</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFillCredentials('admin');
                    }}
                    className="text-slate-400 hover:text-white underline cursor-pointer"
                  >
                    Auto-fill Form
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
