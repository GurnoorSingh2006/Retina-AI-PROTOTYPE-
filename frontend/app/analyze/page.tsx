"use client";

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { uploadAndAnalyzeScan } from '@/lib/api';
import { Eye, Upload, FileImage, AlertCircle, Sparkles, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';

const ANALYSIS_STEPS = [
  'Validating & Uploading OCT Scan...',
  'Preprocessing to (128, 128, 3) & Normalizing (1./255)...',
  'Executing Attention U-Net Inference...',
  'Computing Grad-CAM Spatial Heatmap...',
  'Structuring Clinical Probabilities & Rationale...',
];

export default function AnalyzePage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string>('');
  const [analyzing, setAnalyzing] = useState<boolean>(false);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    setError('');
    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid PNG, JPG, or JPEG OCT image.');
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      setError('Image file exceeds the 20MB limit.');
      return;
    }
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleRunAnalysis = async () => {
    if (!selectedFile) return;

    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    setAnalyzing(true);
    setCurrentStepIndex(0);
    setError('');

    // Progressive step interval
    const stepTimer = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < ANALYSIS_STEPS.length - 1) return prev + 1;
        return prev;
      });
    }, 600);

    try {
      const result = await uploadAndAnalyzeScan(selectedFile);
      clearInterval(stepTimer);
      router.push(`/results/${result.id}`);
    } catch (err: any) {
      clearInterval(stepTimer);
      setError(err.message || 'Inference pipeline failed.');
      setAnalyzing(false);
    }
  };

  const loadSample = async (type: string) => {
    // Generate synthetic sample canvas matching selected pathology
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Dark background
    ctx.fillStyle = '#10141e';
    ctx.fillRect(0, 0, 128, 128);

    // Retinal Layer Base
    ctx.fillStyle = '#4a5568';
    ctx.fillRect(0, 45, 128, 40);

    // RPE Layer
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 75);

    if (type === 'NORMAL') {
      ctx.quadraticCurveTo(64, 60, 128, 75);
    } else if (type === 'DME') {
      ctx.quadraticCurveTo(64, 75, 128, 75);
      // Fluid pockets
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(50, 60, 8, 0, Math.PI * 2);
      ctx.arc(75, 58, 6, 0, Math.PI * 2);
      ctx.fill();
    } else if (type === 'DRUSEN') {
      ctx.lineTo(30, 75);
      ctx.lineTo(45, 65);
      ctx.lineTo(60, 75);
      ctx.lineTo(85, 68);
      ctx.lineTo(100, 75);
      ctx.lineTo(128, 75);
    } else if (type === 'CNV') {
      ctx.quadraticCurveTo(64, 75, 128, 75);
      // Subretinal hyperreflective membrane
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(50, 70, 30, 10);
    }
    ctx.stroke();

    canvas.toBlob((blob) => {
      if (blob) {
        const sampleFile = new File([blob], `sample_${type.toLowerCase()}_oct.png`, { type: 'image/png' });
        handleFileSelect(sampleFile);
      }
    }, 'image/png');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 w-full space-y-8 bg-[#050505] min-h-screen">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#8F1515]/20 border border-[#8F1515]/40 text-[#E0533C] text-[10px] font-mono tracking-widest uppercase">
          <Eye className="w-3.5 h-3.5" />
          <span>CLINICAL SCREENING STUDIO</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white font-mono">
          UPLOAD RETINAL OCT SCAN
        </h1>
        <p className="text-xs text-neutral-400 max-w-lg mx-auto font-mono">
          Upload an Optical Coherence Tomography B-scan for instant classification, Grad-CAM attention localization, and automated report generation.
        </p>
      </div>

      {error && (
        <div className="bg-[#8F1515]/15 border border-[#8F1515]/40 rounded-2xl p-4 text-xs text-[#E0533C] flex items-start space-x-3 font-mono">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">ANALYSIS ERROR</p>
            <p className="text-neutral-300 mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* Upload Box */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => !previewUrl && fileInputRef.current?.click()}
        className={`relative rounded-3xl border border-dashed p-8 sm:p-12 text-center transition-all ${
          previewUrl
            ? 'border-[#8F1515]/60 bg-black/40 backdrop-blur-xl'
            : 'border-white/15 hover:border-[#8F1515]/60 bg-black/30 backdrop-blur-md cursor-pointer hover:shadow-[0_0_30px_rgba(143,21,21,0.2)]'
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
          accept="image/png, image/jpeg, image/jpg"
          className="hidden"
        />

        {previewUrl ? (
          <div className="space-y-6">
            <div className="relative aspect-[4/3] max-w-md mx-auto rounded-2xl overflow-hidden border border-white/20 bg-black shadow-2xl">
              <img src={previewUrl} alt="Preview" className="w-full h-full object-contain" />
              <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-mono text-[#E0533C] border border-[#8F1515]/50 tracking-wider uppercase font-semibold">
                SCAN LOADED
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 font-mono">
              <button
                onClick={() => {
                  setSelectedFile(null);
                  setPreviewUrl(null);
                }}
                disabled={analyzing}
                className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-neutral-300 text-xs tracking-wider uppercase transition border border-white/10"
              >
                CHANGE IMAGE
              </button>

              <button
                onClick={handleRunAnalysis}
                disabled={analyzing}
                className="px-8 py-3 rounded-full bg-white hover:bg-neutral-200 text-black text-xs font-bold tracking-widest uppercase shadow-xl transition flex items-center space-x-2 disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4 text-[#8F1515]" />
                <span>START ATTENTION U-NET SCREENING</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-[#8F1515]/20 border border-[#8F1515]/40 flex items-center justify-center mx-auto text-[#E0533C] shadow-xl shadow-[#8F1515]/20">
              <Upload className="w-7 h-7" />
            </div>
            <div>
              <p className="text-base font-bold text-white font-mono uppercase tracking-wider">Drop your OCT scan here</p>
              <p className="text-xs text-neutral-400 font-mono mt-1">Supports high-res PNG, JPG, or JPEG retinal B-scans</p>
            </div>
            <button
              type="button"
              className="px-6 py-2.5 rounded-full bg-black/60 hover:bg-black/90 text-neutral-200 font-mono text-xs border border-white/20 hover:border-white/40 tracking-wider uppercase transition"
            >
              BROWSE LOCAL FILES
            </button>
          </div>
        )}
      </div>

      {/* Analyzing Progress Overlay */}
      {analyzing && (
        <div className="bg-black/60 backdrop-blur-xl border border-[#8F1515]/60 rounded-3xl p-6 space-y-4 shadow-2xl">
          <div className="flex items-center justify-between font-mono">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-[#E0533C] border-t-transparent rounded-full animate-spin" />
              <span className="text-xs font-bold text-white tracking-wider uppercase">AI Inference in Progress</span>
            </div>
            <span className="text-xs font-bold text-[#E0533C]">{Math.round(((currentStepIndex + 1) / ANALYSIS_STEPS.length) * 100)}%</span>
          </div>

          <div className="w-full h-2 bg-black rounded-full overflow-hidden border border-white/10">
            <div
              className="h-full bg-gradient-to-r from-[#8F1515] to-[#E0533C] transition-all duration-500 shadow-[0_0_10px_#8F1515]"
              style={{ width: `${((currentStepIndex + 1) / ANALYSIS_STEPS.length) * 100}%` }}
            />
          </div>

          <p className="text-xs text-neutral-300 font-mono tracking-wider">
            {ANALYSIS_STEPS[currentStepIndex]}
          </p>
        </div>
      )}

      {/* Quick Sample Selector */}
      <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 space-y-4 font-mono">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-white tracking-wider uppercase">Quick Test: Load Sample OCT Scans</span>
          <span className="text-[10px] text-neutral-500 tracking-wider">1-CLICK EVALUATION</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { id: 'NORMAL', label: 'Healthy Retina', color: 'hover:border-emerald-500/50 hover:bg-emerald-950/20 text-emerald-400' },
            { id: 'DME', label: 'Diabetic Edema', color: 'hover:border-[#E0533C]/50 hover:bg-[#8F1515]/20 text-[#E0533C]' },
            { id: 'DRUSEN', label: 'Drusen Deposits', color: 'hover:border-amber-500/50 hover:bg-amber-950/20 text-amber-400' },
            { id: 'CNV', label: 'Neovascular CNV', color: 'hover:border-[#8F1515]/50 hover:bg-[#8F1515]/20 text-[#8F1515]' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => loadSample(item.id)}
              type="button"
              className={`p-4 rounded-2xl bg-black/60 border border-white/10 text-left transition flex flex-col justify-between space-y-1.5 ${item.color}`}
            >
              <span className="text-xs font-bold text-white tracking-wider">{item.id}</span>
              <span className="text-[10px] text-neutral-400">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
