"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { getUserReports } from '@/lib/api';
import { ReportItem } from '@/types';
import { generateClinicalPdfReport } from '@/lib/pdfGenerator';
import PriorityBadge from '@/components/PriorityBadge';
import { FileText, Download, Eye, CheckCircle, ShieldAlert, ArrowRight } from 'lucide-react';

export default function ReportsPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();

  const [reports, setReports] = useState<ReportItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }

    if (isAuthenticated) {
      getUserReports()
        .then(setReports)
        .catch((e) => console.error(e))
        .finally(() => setLoading(false));
    }
  }, [isAuthenticated, authLoading, router]);

  const handleDownload = (report: ReportItem) => {
    if (report.scanData) {
      generateClinicalPdfReport(report.scanData, user?.name || 'Dr. Clinician');
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-slate-400">Loading Clinical Reports Archive...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8 bg-[#050505] min-h-screen font-mono">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-[10px] font-bold text-[#E0533C] uppercase tracking-widest">CLINICAL ARCHIVES</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">Clinical Screening Reports</h1>
          <p className="text-xs text-neutral-400 mt-1">Generated diagnostic summaries with full probability profiles.</p>
        </div>
      </div>

      {reports.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((rpt) => (
            <div key={rpt.id} className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 space-y-4 shadow-2xl flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-[#E0533C]">{rpt.reportNumber}</span>
                  <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800/60 px-2.5 py-0.5 rounded-full font-bold uppercase">
                    {rpt.status}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white font-mono uppercase">
                    {rpt.scanData?.prediction || 'Retinal Scan'}
                  </h3>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Scan ID #{rpt.scanId} - {(rpt.scanData?.confidence ? rpt.scanData.confidence * 100 : 0).toFixed(1)}% Confidence
                  </p>
                </div>

                <p className="text-xs text-neutral-300 line-clamp-3 leading-relaxed bg-black/60 p-3.5 rounded-2xl border border-white/5 font-sans">
                  {rpt.clinicalSummary}
                </p>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-2">
                <Link
                  href={`/results/${rpt.scanId}`}
                  className="px-4 py-1.5 rounded-full bg-white/10 hover:bg-white text-neutral-200 hover:text-black text-xs font-semibold uppercase tracking-wider transition"
                >
                  View Scan
                </Link>

                <button
                  onClick={() => handleDownload(rpt)}
                  className="px-4 py-1.5 rounded-full bg-white hover:bg-neutral-200 text-black text-xs font-bold uppercase tracking-wider transition flex items-center space-x-1.5 shadow-lg"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-16 text-center space-y-4 shadow-2xl">
          <FileText className="w-12 h-12 text-neutral-600 mx-auto" />
          <h3 className="text-lg font-bold text-white uppercase tracking-wider">No PDF Reports Generated Yet</h3>
          <p className="text-xs text-neutral-400 max-w-sm mx-auto">
            Analyze an OCT scan and click &quot;Download PDF Report&quot; to save and archive formal clinical screening summaries.
          </p>
          <Link
            href="/analyze"
            className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-full bg-white text-black font-bold text-xs uppercase tracking-wider hover:bg-neutral-200 transition shadow-xl"
          >
            <span>Analyze First Scan</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}
    </div>
  );
}
