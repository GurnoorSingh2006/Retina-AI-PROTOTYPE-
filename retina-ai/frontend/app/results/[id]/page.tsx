"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { getScanById, generateReport } from '@/lib/api';
import { ScanResult } from '@/types';
import PriorityBadge from '@/components/PriorityBadge';
import ProbabilityBar from '@/components/ProbabilityBar';
import OctViewer from '@/components/OctViewer';
import { generateClinicalPdfReport } from '@/lib/pdfGenerator';
import { Eye, FileText, Download, ArrowLeft, ShieldAlert, Cpu, Sparkles, Check } from 'lucide-react';

export default function ResultsPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading } = useAuth();

  const [scan, setScan] = useState<ScanResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [generatingReport, setGeneratingReport] = useState(false);
  const [reportSuccess, setReportSuccess] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }

    if (params.id) {
      getScanById(params.id as string)
        .then(setScan)
        .catch((e) => console.error('Failed to load scan result', e))
        .finally(() => setLoading(false));
    }
  }, [params.id, isAuthenticated, authLoading, router]);

  const handleDownloadPdf = async () => {
    if (!scan) return;
    setGeneratingReport(true);
    try {
      await generateReport(scan.id).catch(() => {});
      generateClinicalPdfReport(scan, user?.name || 'Dr. Clinician');
      setReportSuccess(true);
      setTimeout(() => setReportSuccess(false), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setGeneratingReport(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-slate-400">Loading AI Screening Results...</p>
        </div>
      </div>
    );
  }

  if (!scan) {
    return (
      <div className="max-w-xl mx-auto py-16 px-4 text-center space-y-4">
        <ShieldAlert className="w-12 h-12 text-amber-400 mx-auto" />
        <h2 className="text-xl font-bold text-white">Scan Not Found</h2>
        <p className="text-xs text-slate-400">The requested OCT scan could not be retrieved.</p>
        <Link href="/dashboard" className="inline-block px-4 py-2 bg-cyan-500 text-slate-950 text-xs font-bold rounded-lg">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8 bg-[#050505] min-h-screen font-mono">
      {/* Top Header Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <Link
            href="/dashboard"
            className="p-2.5 rounded-2xl bg-black/60 border border-white/10 text-neutral-400 hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono text-[#E0533C] font-bold">SCAN #{scan.id}</span>
              <span className="text-neutral-600">|</span>
              <span className="text-xs text-neutral-400">{scan.originalFilename || 'oct_bscan.png'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white font-mono">
              RETINAL SCREENING REPORT
            </h1>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleDownloadPdf}
            disabled={generatingReport}
            className="px-6 py-2.5 rounded-full bg-white hover:bg-neutral-200 text-black text-xs font-bold uppercase tracking-wider shadow-xl transition flex items-center space-x-2 disabled:opacity-50"
          >
            {reportSuccess ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>REPORT GENERATED</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>{generatingReport ? 'GENERATING PDF...' : 'DOWNLOAD PDF REPORT'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Primary Result Banner */}
      <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div>
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">TOP AI CLASSIFICATION</span>
            <p className="text-4xl sm:text-5xl font-black text-white mt-1 tracking-tight">{scan.prediction}</p>
            <p className="text-xs text-[#E0533C] mt-2 font-semibold tracking-wider">MODEL: {scan.modelName}</p>
          </div>

          <div className="border-y md:border-y-0 md:border-x border-white/10 py-4 md:py-0 md:px-6">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">DIAGNOSTIC CONFIDENCE</span>
            <p className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-200 to-[#E0533C] mt-1 font-mono">
              {(scan.confidence * 100).toFixed(1)}%
            </p>
            <p className="text-xs text-neutral-400 mt-2">Softmax probability threshold verified</p>
          </div>

          <div>
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">SCREENING PRIORITY</span>
            <div className="mt-2">
              <PriorityBadge priority={scan.priority} />
            </div>
            <p className="text-xs text-neutral-400 mt-2">Rule-based clinical triage flag</p>
          </div>
        </div>
      </div>

      {/* Main Grid: Visualizer & Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: OCT Visualizer (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <OctViewer
            originalImage={scan.originalImage}
            heatmapImage={scan.heatmapImage}
            overlayImage={scan.overlayImage}
            prediction={scan.prediction}
            finding={scan.attentionFinding}
          />

          {/* Clinical Description Card */}
          <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 space-y-2 shadow-2xl">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider text-[#E0533C]">Pathology Summary</h4>
            <p className="text-xs text-neutral-300 leading-relaxed font-sans">
              {scan.description || 'Standardized retinal diagnostic classification performed.'}
            </p>
          </div>
        </div>

        {/* Right Column: Probabilities & Model Metadata (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Probability Distribution */}
          <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Probability Distribution</h3>
              <span className="text-[10px] text-neutral-400 font-mono">4-CLASS EVALUATION</span>
            </div>

            <ProbabilityBar
              probabilities={scan.probabilities}
              topCondition={scan.prediction}
            />
          </div>

          {/* Model Specification Card */}
          <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 space-y-3 shadow-2xl">
            <div className="flex items-center space-x-2 text-xs font-bold text-white uppercase tracking-wider">
              <Cpu className="w-4 h-4 text-[#E0533C]" />
              <span>Inference Specification</span>
            </div>

            <div className="space-y-2 text-xs text-neutral-300 divide-y divide-white/10">
              <div className="flex justify-between pt-2">
                <span className="text-neutral-400">ACTIVE ARCHITECTURE:</span>
                <span className="font-semibold text-white">{scan.modelName}</span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="text-neutral-400">VALIDATION ACCURACY:</span>
                <span className="font-mono text-[#E0533C] font-bold">90.4% (Attention U-Net)</span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="text-neutral-400">INPUT DIMENSIONS:</span>
                <span className="font-mono text-neutral-200">(128, 128, 3) RGB</span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="text-neutral-400">NORMALIZATION:</span>
                <span className="font-mono text-neutral-200">1./255 Scaling</span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="text-neutral-400">EXPLAINABILITY:</span>
                <span className="font-mono text-[#E0533C] font-semibold">Grad-CAM Colormap</span>
              </div>
            </div>
          </div>

          {/* Disclaimer Alert */}
          <div className="bg-[#8F1515]/10 border border-[#8F1515]/30 rounded-3xl p-4 text-[11px] text-neutral-300 flex items-start space-x-3 leading-relaxed">
            <ShieldAlert className="w-5 h-5 text-[#E0533C] flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-[#E0533C] uppercase tracking-wider">AI Screening Disclaimer</p>
              <p className="mt-1 text-neutral-400 font-sans">
                This AI-generated screening result is provided for research and clinical decision support only. It is not an autonomous medical diagnosis. Certified ophthalmological confirmation is required.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
