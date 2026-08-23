"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { Eye, Activity, History, FileText, LogOut, LogIn, UserPlus } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout, isAuthenticated } = useAuth();

  if (pathname === '/') return null;

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: Activity, authRequired: true },
    { href: '/analyze', label: 'Analyze OCT', icon: Eye, authRequired: true },
    { href: '/history', label: 'History', icon: History, authRequired: true },
    { href: '/reports', label: 'Reports', icon: FileText, authRequired: true },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#050505]/80 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#8F1515] to-[#E0533C] p-[1px] shadow-lg shadow-[#8F1515]/30 group-hover:shadow-[#8F1515]/60 transition-all">
            <div className="w-full h-full bg-[#050505] rounded-[11px] flex items-center justify-center">
              <Eye className="w-4 h-4 text-[#E0533C]" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-base tracking-tighter text-white">
                RETINA<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8F1515] to-[#E0533C]">AI</span>
              </span>
              <span className="text-[9px] font-mono font-bold bg-[#8F1515]/20 text-[#E0533C] border border-[#8F1515]/40 px-1.5 py-0.2 rounded">STUDIO</span>
            </div>
            <p className="text-[9px] font-mono text-neutral-400 hidden sm:block tracking-widest uppercase">WE SEE WHAT YOU DON&apos;T</p>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center space-x-1 font-mono text-xs">
          {navLinks.map((item) => {
            if (item.authRequired && !isAuthenticated) return null;
            const Icon = item.icon;
            const active = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs tracking-wider transition-all ${
                  active
                    ? 'bg-[#8F1515]/20 text-white border border-[#8F1515]/60 shadow-[0_0_15px_rgba(143,21,21,0.25)]'
                    : 'text-neutral-300 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Auth / Profile CTA */}
        <div className="flex items-center space-x-3 font-mono text-xs">
          {isAuthenticated ? (
            <div className="flex items-center space-x-3">
              <div className="hidden lg:block text-right">
                <p className="text-xs font-semibold text-white">{user?.name}</p>
                <p className="text-[10px] text-[#E0533C] uppercase tracking-wider">{user?.role || 'Clinician'}</p>
              </div>
              <button
                onClick={logout}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs text-neutral-300 hover:text-red-400 bg-white/5 hover:bg-red-500/10 border border-white/10 hover:border-red-500/30 transition-all"
                title="Logout"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">LOGOUT</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link
                href="/login"
                className="flex items-center space-x-1 px-3 py-1.5 rounded-full text-xs text-neutral-300 hover:text-white hover:bg-white/5 transition tracking-wider"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>LOGIN</span>
              </Link>
              <Link
                href="/register"
                className="flex items-center space-x-1.5 px-4 py-1.5 rounded-full text-xs font-semibold bg-white hover:bg-neutral-200 text-black shadow-lg shadow-white/10 transition-all tracking-wider"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>REGISTER</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
