"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { Eye, LogIn, Lock, Mail, AlertCircle, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Login failed. Please verify credentials.');
      }

      login(data.token, data.user);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Unable to connect to authentication server.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setEmail('demo.clinician@octalyze.org');
    setPassword('Clinician2026!');
    setError('');
    setLoading(true);

    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Dr. Sarah Lin (Retinal Specialist)',
          email: 'demo.clinician@octalyze.org',
          password: 'Clinician2026!',
          role: 'CLINICIAN',
        }),
      }).catch(() => {});

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'demo.clinician@octalyze.org',
          password: 'Clinician2026!',
        }),
      });

      const data = await res.json();
      if (data.token) {
        login(data.token, data.user);
        router.push('/dashboard');
      } else {
        throw new Error(data.message || 'Failed demo authentication.');
      }
    } catch (err: any) {
      setError('Demo login: ' + (err.message || 'Error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-16 bg-[#050505] relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#8F1515]/10 blur-[140px] pointer-events-none rounded-full" />

      <div className="w-full max-w-md bg-black/40 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 space-y-6 shadow-2xl relative z-10">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#8F1515]/20 border border-[#8F1515]/40 flex items-center justify-center mx-auto shadow-lg shadow-[#8F1515]/20">
            <Eye className="w-6 h-6 text-[#E0533C]" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white uppercase font-mono">CLINICIAN PORTAL</h1>
          <p className="text-xs text-neutral-400 font-mono">Sign in to access OCT screening tools & reports</p>
        </div>

        {error && (
          <div className="bg-[#8F1515]/15 border border-[#8F1515]/40 rounded-xl p-3 text-xs text-[#E0533C] flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
          <div className="space-y-1.5">
            <label className="text-neutral-300 font-semibold tracking-wider uppercase text-[11px]">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="clinician@hospital.org"
                className="w-full bg-black/60 border border-white/10 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#8F1515] transition"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-neutral-300 font-semibold tracking-wider uppercase text-[11px]">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full bg-black/60 border border-white/10 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#8F1515] transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-full bg-white hover:bg-neutral-200 text-black font-bold text-xs tracking-widest uppercase shadow-xl transition flex items-center justify-center space-x-2 disabled:opacity-50 mt-2"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </>
            )}
          </button>
        </form>

        <div className="relative border-t border-white/10 pt-4 font-mono text-xs">
          <button
            onClick={handleDemoLogin}
            disabled={loading}
            type="button"
            className="w-full py-2.5 rounded-full bg-[#8F1515]/15 hover:bg-[#8F1515]/25 border border-[#8F1515]/40 text-[#E0533C] font-semibold text-xs tracking-wider transition flex items-center justify-center space-x-2"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>1-Click Demo Login</span>
          </button>
        </div>

        <p className="text-center text-xs text-neutral-400 font-mono">
          Do not have an account?{' '}
          <Link href="/register" className="text-[#E0533C] hover:underline font-semibold">
            Register Clinician
          </Link>
        </p>
      </div>
    </div>
  );
}
