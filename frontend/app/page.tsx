"use client";

import React, { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Menu, X } from 'lucide-react';

const ANALYSIS_ROUTE = "/analyze";

export default function CinematicHomePage() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Scroll state & Ref for RAF
  const [scrollProgress, setScrollProgress] = useState(0);
  const scrollProgressRef = useRef(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Mouse Parallax coordinates
  const mousePos = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
  const [cursorHover, setCursorHover] = useState<'default' | 'open' | 'explore'>('default');
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // Video scale calculation based on scroll progression (0% to 100%)
  const getVideoScale = (p: number) => {
    if (p < 0.1) return 1.0;
    if (p < 0.35) return 1.0 + (p - 0.1) * 0.35;
    if (p < 0.65) return 1.08 + (p - 0.35) * 0.35;
    if (p < 0.85) return 1.18 + (p - 0.65) * 0.5;
    return 1.28;
  };

  // Video Opacity calculation - Always high so the eye video is visible through all cards
  const getVideoOpacity = () => {
    if (scrollProgress < 0.45) return 0.95;
    if (scrollProgress < 0.65) return 0.85;
    if (scrollProgress < 0.85) return 0.75;
    return 0.65;
  };

  useEffect(() => {
    // Detect touch device
    if (typeof window !== 'undefined') {
      setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
    }

    const video = videoRef.current;
    if (video) {
      video.muted = true;
      video.play().catch(() => {});
    }

    let ticking = false;

    // Scroll listener with video time scrubbing synchronization (runs cleanly without re-binding)
    const handleScroll = () => {
      if (!containerRef.current) return;
      const totalScrollable = containerRef.current.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;
      const progress = Math.min(Math.max(currentScroll / (totalScrollable || 1), 0), 1);
      scrollProgressRef.current = progress;

      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollProgress(progress);
          ticking = false;
        });
        ticking = true;
      }

      // Sync video currentTime to scroll position smoothly
      if (video && video.duration && !isNaN(video.duration)) {
        const targetTime = progress * video.duration;
        // Only set if diff is significant to prevent stutter
        if (Math.abs(video.currentTime - targetTime) > 0.05) {
          video.currentTime = targetTime;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // Mouse movement for parallax & custom cursor
    const handleMouseMove = (e: MouseEvent) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      mousePos.current.targetX = (e.clientX - centerX) / centerX;
      mousePos.current.targetY = (e.clientY - centerY) / centerY;
      setCursorPos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Smooth RAF loop for video parallax
    let rafId: number;
    const animateParallax = () => {
      mousePos.current.x += (mousePos.current.targetX - mousePos.current.x) * 0.05;
      mousePos.current.y += (mousePos.current.targetY - mousePos.current.y) * 0.05;

      if (videoRef.current && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const xOffset = mousePos.current.x * 12;
        const yOffset = mousePos.current.y * 12;
        videoRef.current.style.transform = `translate3d(${xOffset}px, ${yOffset}px, 0) scale(${getVideoScale(scrollProgressRef.current)})`;
      }

      rafId = requestAnimationFrame(animateParallax);
    };

    rafId = requestAnimationFrame(animateParallax);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, []); // Run ONCE on mount

  return (
    <div ref={containerRef} className="relative bg-[#050505] text-[#F5F5F0] min-h-[750vh] font-sans selection:bg-[#8F1515] selection:text-white">
      {/* Film Grain Texture Overlay */}
      <div className="fixed inset-0 z-40 pointer-events-none film-grain" />

      {/* Custom Cursor (Desktop Only) */}
      {!isTouchDevice && (
        <div
          className={`fixed pointer-events-none z-50 transition-transform duration-100 ease-out -translate-x-1/2 -translate-y-1/2 flex items-center justify-center font-mono text-[9px] tracking-widest uppercase ${
            cursorHover !== 'default'
              ? 'w-16 h-16 rounded-full bg-white text-black font-bold shadow-2xl scale-100'
              : 'w-2.5 h-2.5 rounded-full bg-white scale-100'
          }`}
          style={{
            left: `${cursorPos.x}px`,
            top: `${cursorPos.y}px`,
            transitionProperty: 'width, height, background-color, transform, opacity',
          }}
        >
          {cursorHover === 'open' && 'OPEN'}
          {cursorHover === 'explore' && 'EXPLORE'}
        </div>
      )}

      {/* MINIMAL NAVBAR (Reveals when scroll > 0.45) */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 px-6 sm:px-12 py-6 flex items-center justify-between transition-all duration-700 ${
          scrollProgress > 0.45
            ? 'opacity-100 translate-y-0 backdrop-blur-md bg-black/30 border-b border-white/10'
            : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
      >
        <Link
          href="/"
          onMouseEnter={() => setCursorHover('explore')}
          onMouseLeave={() => setCursorHover('default')}
          className="flex items-center space-x-2 text-xs font-mono font-bold tracking-widest text-[#F5F5F0] uppercase"
        >
          <span className="w-2 h-2 rounded-full bg-[#8F1515] animate-ping inline-block" />
          <span>RETINA AI</span>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center space-x-8 text-[11px] font-mono tracking-widest uppercase text-neutral-300">
          <button
            onClick={() => {
              const el = document.getElementById('editorial-detect');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="hover:text-white transition"
          >
            HOW IT WORKS
          </button>
          <button
            onClick={() => {
              const el = document.getElementById('editorial-about');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="hover:text-white transition"
          >
            ABOUT
          </button>
          <button
            onClick={() => router.push(ANALYSIS_ROUTE)}
            onMouseEnter={() => setCursorHover('open')}
            onMouseLeave={() => setCursorHover('default')}
            className="px-4 py-2 rounded-full bg-white text-black font-semibold hover:bg-neutral-200 transition tracking-wider flex items-center space-x-1 shadow-lg"
          >
            <span>ANALYZE</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </nav>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-neutral-400 hover:text-white"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-[#050505]/95 backdrop-blur-xl flex flex-col items-center justify-center space-y-8 text-center font-mono text-sm tracking-widest uppercase md:hidden">
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              router.push(ANALYSIS_ROUTE);
            }}
            className="text-white text-lg font-bold py-2 border-b border-[#8F1515] flex items-center justify-center space-x-2"
          >
            <span>START ANALYSIS</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              const el = document.getElementById('editorial-detect');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="text-neutral-400 hover:text-white py-2"
          >
            HOW IT WORKS
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              const el = document.getElementById('editorial-about');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="text-neutral-400 hover:text-white py-2"
          >
            ABOUT
          </button>
        </div>
      )}

      {/* STICKY CINEMATIC VIEWPORT (Fixed Fullscreen Canvas) */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center pointer-events-none">
        
        {/* HERO EYE VIDEO (Synchronized to Scroll) */}
        <div className="absolute inset-0 w-full h-full overflow-hidden flex items-center justify-center bg-black">
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            loop
            preload="auto"
            className="w-full h-full object-cover object-center transition-opacity duration-500 ease-out will-change-transform"
            style={{
              opacity: getVideoOpacity(),
              filter: `contrast(1.1) brightness(${scrollProgress > 0.45 ? 0.85 : 1})`,
            }}
          >
            <source src="/eye.mp4" type="video/mp4" />
          </video>

          {/* Transparent Vignette Gradients */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50 pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-black/10 to-black/60 pointer-events-none" />
        </div>

        {/* ========================================================================= */}
        {/* SCENE 01: DARKNESS (0% to 15%) */}
        {/* ========================================================================= */}
        <div
          className={`absolute inset-0 flex flex-col items-center justify-center text-center px-4 transition-all duration-700 ${
            scrollProgress < 0.16
              ? 'opacity-100 scale-100 pointer-events-auto'
              : 'opacity-0 scale-95 pointer-events-none'
          }`}
        >
          {scrollProgress < 0.08 ? (
            <div className="space-y-4 drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)]">
              <h1 className="text-4xl sm:text-7xl md:text-8xl lg:text-9xl font-black uppercase tracking-tighter text-[#F5F5F0] leading-none">
                CLOSE YOUR EYES.
              </h1>
              <p className="font-mono text-xs sm:text-sm text-neutral-300 tracking-widest uppercase">
                for a moment.
              </p>
              <div className="pt-12">
                <span className="font-mono text-[10px] text-neutral-300 tracking-widest uppercase animate-pulse">
                  SCROLL TO ENTER
                </span>
              </div>
            </div>
          ) : (
            <div className="space-y-4 drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)]">
              <h2 className="text-4xl sm:text-7xl md:text-8xl lg:text-9xl font-black uppercase tracking-tighter text-white leading-none">
                NOW LOOK CLOSER.
              </h2>
              <p className="font-mono text-xs sm:text-sm text-[#E0533C] tracking-widest uppercase font-semibold">
                ENTERING OPTICAL COHERENCE
              </p>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* SCENE 04: RETINAL INTELLIGENCE (45% to 65%) */}
        {/* ========================================================================= */}
        <div
          className={`absolute inset-0 p-8 sm:p-14 flex flex-col justify-between font-mono text-[10px] sm:text-xs tracking-widest uppercase text-neutral-300 transition-all duration-700 ${
            scrollProgress >= 0.42 && scrollProgress < 0.65
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-4 pointer-events-none'
          }`}
        >
          {/* Top Row */}
          <div className="flex items-center justify-between border-b border-white/20 pb-4 drop-shadow-md">
            <div className="flex items-center space-x-2 text-white font-bold">
              <span className="w-2 h-2 rounded-full bg-[#8F1515] animate-ping" />
              <span>RETINA AI // SYSTEM-01</span>
            </div>
            <div className="text-right text-[#E0533C] font-semibold animate-subtle-pulse">
              RETINAL ANALYSIS INITIALIZING...
            </div>
          </div>

          {/* Center Subtle Grid Frame */}
          <div className="self-center w-64 sm:w-80 h-64 sm:h-80 border border-white/20 rounded-full flex items-center justify-center relative shadow-[0_0_30px_rgba(0,0,0,0.5)]">
            <div className="w-full h-[1px] bg-white/20 absolute top-1/2 left-0" />
            <div className="h-full w-[1px] bg-white/20 absolute left-1/2 top-0" />
            <div className="w-24 h-24 border border-[#8F1515]/60 rounded-full animate-pulse" />
            <span className="text-[9px] text-neutral-300 absolute bottom-3">FOVEAL APERTURE LOCK</span>
          </div>

          {/* Bottom Row */}
          <div className="flex items-center justify-between border-t border-white/20 pt-4 drop-shadow-md">
            <div className="flex items-center space-x-2 text-neutral-200">
              <span>OPTICAL SYSTEM: ACTIVE</span>
            </div>
            <div className="text-white font-bold animate-pulse">
              SCROLL TO ANALYZE
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SCENE 05: AI SCAN & HEATMAP (65% to 80%) */}
        {/* ========================================================================= */}
        <div
          className={`absolute inset-0 flex items-center justify-center p-6 transition-all duration-700 ${
            scrollProgress >= 0.65 && scrollProgress < 0.81
              ? 'opacity-100'
              : 'opacity-0 pointer-events-none'
          }`}
        >
          {/* Moving Laser Scan Line */}
          <div className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#8F1515] to-transparent animate-retinal-scan shadow-[0_0_20px_#8F1515]" />

          {/* Explainable AI Heatmap Soft Gradient Overlay */}
          <div
            className={`absolute inset-0 transition-opacity duration-1000 pointer-events-none ${
              scrollProgress > 0.72 ? 'opacity-60' : 'opacity-0'
            }`}
            style={{
              background: 'radial-gradient(circle at 50% 50%, rgba(143, 21, 21, 0.45) 0%, rgba(224, 83, 60, 0.25) 35%, transparent 70%)',
            }}
          />

          {/* Fully Transparent Glass Diagnostic HUD */}
          <div className="max-w-md w-full bg-black/25 backdrop-blur-sm border border-white/20 p-6 rounded-2xl font-mono text-[10px] sm:text-xs text-neutral-200 space-y-3 z-10 shadow-[0_0_40px_rgba(0,0,0,0.7)]">
            <div className="flex justify-between items-center pb-2 border-b border-white/20">
              <span className="text-white font-bold">EXPLAINABLE GRAD-CAM INFERENCE</span>
              <span className="text-[#E0533C] font-semibold">ATTENTION U-NET</span>
            </div>

            <div className="space-y-1.5 text-neutral-300">
              <div className="flex justify-between">
                <span>VESSEL STRUCTURE</span>
                <span className="text-white font-semibold">........ DETECTED</span>
              </div>
              <div className="flex justify-between">
                <span>MACULAR REGION</span>
                <span className="text-white font-semibold">.......... DETECTED</span>
              </div>
              <div className="flex justify-between">
                <span>OPTIC DISC</span>
                <span className="text-white font-semibold">.............. DETECTED</span>
              </div>
              <div className="flex justify-between">
                <span>ANOMALY PATTERN</span>
                <span className="text-[#E0533C] font-bold">......... {scrollProgress > 0.74 ? 'VERIFIED' : 'SCANNING'}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-white/20 flex justify-between items-center text-xs">
              <span className="text-neutral-300">CONFIDENCE PROFILE:</span>
              <span className="text-white font-bold font-mono">90.4% ACCURACY</span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SCENE 06: THE INSIGHT ("WE SEE WHAT YOU DON'T.") (80% to 90%) */}
        {/* ========================================================================= */}
        <div
          className={`absolute inset-0 flex flex-col items-center justify-center text-center px-4 transition-all duration-700 bg-black/20 backdrop-blur-[1px] ${
            scrollProgress >= 0.81 && scrollProgress < 0.91
              ? 'opacity-100 scale-100'
              : 'opacity-0 scale-95 pointer-events-none'
          }`}
        >
          <div className="max-w-5xl mx-auto space-y-4 drop-shadow-[0_4px_30px_rgba(0,0,0,0.9)]">
            <p className="font-mono text-[10px] sm:text-xs text-[#E0533C] tracking-widest uppercase font-semibold">
              // THE STATEMENT
            </p>
            <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase tracking-tight text-white leading-none flex flex-wrap justify-center gap-x-4 sm:gap-x-6 gap-y-2">
              <span className="inline-block">WE</span>
              <span className="inline-block">SEE</span>
              <span className="inline-block">WHAT</span>
              <span className="inline-block">YOU</span>
              <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-100 to-[#E0533C]">
                DON&apos;T.
              </span>
            </h2>
            <p className="font-mono text-xs text-neutral-300 max-w-md mx-auto pt-4">
              Sub-visual biomarker detection through gated attention architectures.
            </p>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SCENE 07: RETINA AI HERO IDENTITY (90% to 100%) */}
        {/* ========================================================================= */}
        <div
          className={`absolute inset-0 flex flex-col items-center justify-center text-center px-4 transition-all duration-700 bg-black/30 backdrop-blur-[2px] ${
            scrollProgress >= 0.91
              ? 'opacity-100 scale-100 pointer-events-auto'
              : 'opacity-0 scale-95 pointer-events-none'
          }`}
        >
          <div className="max-w-4xl mx-auto space-y-8 drop-shadow-[0_4px_30px_rgba(0,0,0,0.9)]">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-white/20 bg-black/30 backdrop-blur-md text-neutral-300 font-mono text-[10px] tracking-widest uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[#8F1515]" />
              <span>AI-POWERED RETINAL ANALYSIS</span>
            </div>

            <h1 className="text-6xl sm:text-8xl md:text-9xl lg:text-[11rem] font-black uppercase tracking-tighter text-white leading-none">
              RETINA <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8F1515] to-[#E0533C]">AI</span>
            </h1>

            <p className="text-sm sm:text-lg text-neutral-300 max-w-xl mx-auto leading-relaxed">
              Transform complex optical coherence tomography B-scans into intelligent, explainable clinical insights.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => router.push(ANALYSIS_ROUTE)}
                onMouseEnter={() => setCursorHover('open')}
                onMouseLeave={() => setCursorHover('default')}
                className="w-full sm:w-auto px-10 py-4 rounded-full bg-white text-black font-bold text-sm tracking-widest uppercase hover:scale-105 hover:bg-[#F5F5F0] transition-all duration-300 shadow-2xl flex items-center justify-center space-x-2 group"
              >
                <span>START ANALYSIS</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => {
                  const el = document.getElementById('editorial-detect');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                onMouseEnter={() => setCursorHover('explore')}
                onMouseLeave={() => setCursorHover('default')}
                className="w-full sm:w-auto px-8 py-4 rounded-full border border-white/30 bg-black/20 backdrop-blur-sm text-neutral-200 hover:text-white hover:border-white/60 text-xs font-mono tracking-widest uppercase transition-all duration-300"
              >
                EXPLORE RESEARCH
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* SCENE 08: SECONDARY EDITORIAL SECTIONS (Continuous Scrolling Below Canvas) */}
      {/* ========================================================================= */}
      <div className="relative z-20 bg-black/75 backdrop-blur-xl border-t border-white/10">
        
        {/* Section 01: DETECT */}
        <section
          id="editorial-detect"
          className="min-h-screen max-w-7xl mx-auto px-6 sm:px-12 py-32 flex flex-col justify-center border-b border-white/10"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-baseline">
            <div className="lg:col-span-3 font-mono text-5xl sm:text-7xl font-bold text-[#E0533C]">
              01
            </div>
            <div className="lg:col-span-9 space-y-6">
              <h2 className="text-5xl sm:text-7xl md:text-8xl font-black uppercase tracking-tighter text-white leading-tight">
                DETECT
              </h2>
              <p className="text-xl sm:text-2xl text-neutral-300 font-light max-w-2xl leading-relaxed">
                Identify micro-pathological patterns within retinal optical coherence tomography with 90.4% Attention U-Net accuracy.
              </p>
              <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs text-neutral-300">
                <div className="p-5 border border-white/10 bg-black/30 backdrop-blur-md rounded-xl hover:border-emerald-500/40 transition">
                  <span className="text-white font-bold block mb-1 text-sm">NORMAL</span>
                  <span className="text-neutral-400">Stratified RPE</span>
                </div>
                <div className="p-5 border border-white/10 bg-black/30 backdrop-blur-md rounded-xl hover:border-[#E0533C]/40 transition">
                  <span className="text-[#E0533C] font-bold block mb-1 text-sm">DME</span>
                  <span className="text-neutral-400">Cystoid Cavities</span>
                </div>
                <div className="p-5 border border-white/10 bg-black/30 backdrop-blur-md rounded-xl hover:border-amber-400/40 transition">
                  <span className="text-amber-400 font-bold block mb-1 text-sm">DRUSEN</span>
                  <span className="text-neutral-400">Sub-RPE Deposits</span>
                </div>
                <div className="p-5 border border-white/10 bg-black/30 backdrop-blur-md rounded-xl hover:border-[#8F1515]/40 transition">
                  <span className="text-[#8F1515] font-bold block mb-1 text-sm">CNV</span>
                  <span className="text-neutral-400">Neovascular Mass</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 02: EXPLAIN */}
        <section
          id="editorial-explain"
          className="min-h-screen max-w-7xl mx-auto px-6 sm:px-12 py-32 flex flex-col justify-center border-b border-white/10"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-baseline">
            <div className="lg:col-span-3 font-mono text-5xl sm:text-7xl font-bold text-[#E0533C]">
              02
            </div>
            <div className="lg:col-span-9 space-y-6">
              <h2 className="text-5xl sm:text-7xl md:text-8xl font-black uppercase tracking-tighter text-white leading-tight">
                EXPLAIN
              </h2>
              <p className="text-xl sm:text-2xl text-neutral-300 font-light max-w-2xl leading-relaxed">
                Visualize exact spatial regions influencing the AI. Grad-CAM colormaps eliminate the black box of medical diagnosis.
              </p>
              <div className="pt-6 font-mono text-xs text-neutral-300 space-y-3 max-w-xl bg-black/30 backdrop-blur-md border border-white/10 p-6 rounded-2xl">
                <div className="flex justify-between border-b border-white/10 pb-2.5">
                  <span className="text-neutral-400">ACTIVATION MAP</span>
                  <span className="text-white font-semibold">GRADIENT-WEIGHTED CLASS ACTIVATION</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-2.5">
                  <span className="text-neutral-400">RESOLUTION</span>
                  <span className="text-white font-semibold">(128, 128, 3) STANDARDIZED</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-neutral-400">TRANSPARENCY</span>
                  <span className="text-[#E0533C] font-bold">CLINICIAN VERIFIABLE</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 03: UNDERSTAND */}
        <section
          id="editorial-about"
          className="min-h-screen max-w-7xl mx-auto px-6 sm:px-12 py-32 flex flex-col justify-center border-b border-white/10"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-baseline">
            <div className="lg:col-span-3 font-mono text-5xl sm:text-7xl font-bold text-[#E0533C]">
              03
            </div>
            <div className="lg:col-span-9 space-y-6">
              <h2 className="text-5xl sm:text-7xl md:text-8xl font-black uppercase tracking-tighter text-white leading-tight">
                UNDERSTAND
              </h2>
              <p className="text-xl sm:text-2xl text-neutral-300 font-light max-w-2xl leading-relaxed">
                Turn complex optical data into immediate, clear visual insights and clinical-grade screening reports.
              </p>
              <div className="pt-8">
                <button
                  onClick={() => router.push(ANALYSIS_ROUTE)}
                  onMouseEnter={() => setCursorHover('open')}
                  onMouseLeave={() => setCursorHover('default')}
                  className="px-8 py-4 rounded-full bg-white text-black font-bold text-xs font-mono tracking-widest uppercase hover:scale-105 transition-all shadow-xl flex items-center space-x-2"
                >
                  <span>LAUNCH RETINA AI STUDIO</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Editorial Minimal Footer */}
        <footer className="max-w-7xl mx-auto px-6 sm:px-12 py-16 flex flex-col sm:flex-row items-center justify-between gap-6 font-mono text-[11px] text-neutral-400 uppercase tracking-widest">
          <div>
            RETINA AI (c) 2026 // WE SEE WHAT YOU DON&apos;T.
          </div>
          <div className="flex items-center space-x-6">
            <Link href="/analytics" className="hover:text-white transition">DATASET</Link>
            <Link href="/models" className="hover:text-white transition">MODEL LAB</Link>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-[#E0533C] hover:text-white transition"
            >
              BACK TO TOP
            </button>
          </div>
        </footer>

      </div>
    </div>
  );
}
