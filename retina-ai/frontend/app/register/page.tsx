"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { Eye, UserPlus, Lock, Mail, User, AlertCircle } from 'lucide-react';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('CLINICIAN');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Registration failed.');
      }

      login(data.token, data.user);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration error occurred.');
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
          <h1 className="text-2xl font-black tracking-tight text-white uppercase font-mono">CLINICIAN REGISTRATION</h1>
          <p className="text-xs text-neutral-400 font-mono">Join the OCTalyze Screening Network</p>
        </div>

        {error && (
          <div className="bg-[#8F1515]/15 border border-[#8F1515]/40 rounded-xl p-3 text-xs text-[#E0533C] flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
          <div className="space-y-1.5">
            <label className="text-neutral-300 font-semibold tracking-wider uppercase text-[11px]">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Dr. Alex Rivera"
                className="w-full bg-black/60 border border-white/10 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#8F1515] transition"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-neutral-300 font-semibold tracking-wider uppercase text-[11px]">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex.rivera@hospital.org"
                className="w-full bg-black/60 border border-white/10 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#8F1515] transition"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-neutral-300 font-semibold tracking-wider uppercase text-[11px]">Password (min. 6 chars)</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full bg-black/60 border border-white/10 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#8F1515] transition"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-neutral-300 font-semibold tracking-wider uppercase text-[11px]">Clinical Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full bg-black/60 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#8F1515] transition"
            >
              <option value="CLINICIAN">Retinal Clinician / Ophthalmologist</option>
              <option value="RESEARCHER">AI / Medical Researcher</option>
              <option value="OPTOMETRIST">Optometrist</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-full bg-white hover:bg-neutral-200 text-black font-bold text-xs tracking-widest uppercase shadow-xl transition flex items-center justify-center space-x-2 disabled:opacity-50 mt-2"
          >
            {loading ? (
              <span>Creating account...</span>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>Create Account</span>
              </>
            )}
          </button>
        </form>

        <p className="text-center text-xs text-neutral-400 font-mono">
          Already registered?{' '}
          <Link href="/login" className="text-[#E0533C] hover:underline font-semibold">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
