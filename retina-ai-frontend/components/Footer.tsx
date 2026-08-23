"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Eye, ShieldAlert } from 'lucide-react';

export default function Footer() {
  const pathname = usePathname();
  if (pathname === '/') return null;
  return (
    <footer className="bg-[#050505] border-t border-white/10 text-neutral-400 text-xs py-12 mt-auto font-mono">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-1 space-y-3 font-sans">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-lg bg-[#8F1515]/20 border border-[#8F1515]/40 flex items-center justify-center">
                <Eye className="w-4 h-4 text-[#E0533C]" />
              </div>
              <span className="font-bold text-white tracking-tighter text-sm">
                RETINA<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8F1515] to-[#E0533C]">AI</span>
              </span>
            </div>
            <p className="text-neutral-400 text-xs leading-relaxed">
              Explainable AI-powered Optical Coherence Tomography (OCT) retinal screening platform utilizing Attention U-Net and Grad-CAM spatial attention maps.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-widest mb-3 text-[#E0533C]">CONDITIONS</h4>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li className="hover:text-white transition">NORMAL (Healthy Retina)</li>
              <li className="hover:text-white transition">DME (Diabetic Macular Edema)</li>
              <li className="hover:text-white transition">DRUSEN (Intermediate AMD)</li>
              <li className="hover:text-white transition">CNV (Neovascularization)</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-widest mb-3 text-[#E0533C]">PLATFORM</h4>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li><Link href="/dashboard" className="hover:text-white transition">Screening Dashboard</Link></li>
              <li><Link href="/analyze" className="hover:text-white transition">OCT Scan Studio</Link></li>
              <li><Link href="/history" className="hover:text-white transition">Patient History Archive</Link></li>
              <li><Link href="/reports" className="hover:text-white transition">Clinical PDF Reports</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-widest mb-3 text-[#E0533C]">CLINICAL NOTICE</h4>
            <div className="bg-black/40 p-3.5 rounded-xl border border-white/10 text-[11px] text-neutral-400 leading-normal flex items-start space-x-2.5">
              <ShieldAlert className="w-4 h-4 text-[#E0533C] flex-shrink-0 mt-0.5" />
              <span>
                RetinaAI is an AI-assisted screening research tool. Predictions and attention heatmaps do not constitute medical diagnoses. All clinical decisions must be validated by certified ophthalmologists.
              </span>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-neutral-400 text-[11px] tracking-wider">
          <p>RETINA AI (c) 2026 // WE SEE WHAT YOU DON&apos;T.</p>
          <div className="flex items-center space-x-6">
            <Link href="/analyze" className="hover:text-white transition">SCAN STUDIO</Link>
            <Link href="/dashboard" className="hover:text-white transition">DASHBOARD</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
