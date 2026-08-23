"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { getDashboardStats } from '@/lib/api';
import { DashboardStats } from '@/types';
import PriorityBadge from '@/components/PriorityBadge';
import { Eye, Activity, AlertTriangle, CheckCircle, FileText, Upload, ArrowRight, Sparkles } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';

export default function DashboardPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }

    if (isAuthenticated) {
      getDashboardStats()
        .then(setStats)
        .catch((e) => console.error(e))
        .finally(() => setLoading(false));
    }
  }, [isAuthenticated, authLoading, router]);

  if (authLoading || loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-slate-400">Loading Clinical Dashboard...</p>
        </div>
      </div>
    );
  }

  const chartData = stats?.conditionDistribution
    ? [
        { name: 'NORMAL', count: stats.conditionDistribution.NORMAL || 0, color: '#10B981' },
        { name: 'DME', count: stats.conditionDistribution.DME || 0, color: '#F59E0B' },
        { name: 'DRUSEN', count: stats.conditionDistribution.DRUSEN || 0, color: '#F97316' },
        { name: 'CNV', count: stats.conditionDistribution.CNV || 0, color: '#EF4444' },
      ]
    : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8 bg-[#050505] min-h-screen font-mono">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-[10px] font-bold text-[#E0533C] uppercase tracking-widest">SCREENING DASHBOARD</span>
            <span className="text-[10px] bg-[#8F1515]/20 text-[#E0533C] border border-[#8F1515]/40 px-2 py-0.5 rounded-full font-bold uppercase">ATTENTION U-NET ACTIVE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">Welcome, {user?.name}</h1>
          <p className="text-xs text-neutral-400 mt-1">Review active scans, priority alerts, and recent patient analyses.</p>
        </div>
        <div className="flex items-center space-x-3 self-start sm:self-auto">
          <Link
            href="/pathologies"
            className="inline-flex items-center space-x-2 px-5 py-3 rounded-full bg-black/60 hover:bg-white/10 text-white border border-white/20 font-bold text-xs uppercase tracking-wider transition"
          >
            <span>DISEASES GUIDE</span>
          </Link>
          <Link
            href="/analyze"
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-full bg-white hover:bg-neutral-200 text-black font-bold text-xs uppercase tracking-wider shadow-xl transition"
          >
            <Upload className="w-4 h-4" />
            <span>UPLOAD NEW OCT</span>
          </Link>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 space-y-2 shadow-2xl">
          <div className="flex items-center justify-between text-neutral-400 text-xs">
            <span className="tracking-wider uppercase text-[10px] font-bold">TOTAL SCANS</span>
            <Eye className="w-4 h-4 text-white" />
          </div>
          <p className="text-3xl font-black text-white font-mono">{stats?.totalScans || 0}</p>
          <p className="text-[10px] text-neutral-400">Evaluated retinal B-scans</p>
        </div>

        <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 space-y-2 shadow-2xl">
          <div className="flex items-center justify-between text-neutral-400 text-xs">
            <span className="tracking-wider uppercase text-[10px] font-bold text-[#E0533C]">HIGH PRIORITY ALERTS</span>
            <AlertTriangle className="w-4 h-4 text-[#E0533C]" />
          </div>
          <p className="text-3xl font-black text-[#E0533C] font-mono">{stats?.highPriorityScans || 0}</p>
          <p className="text-[10px] text-neutral-400">CNV or high-fluid DME detected</p>
        </div>

        <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 space-y-2 shadow-2xl">
          <div className="flex items-center justify-between text-neutral-400 text-xs">
            <span className="tracking-wider uppercase text-[10px] font-bold text-emerald-400">NORMAL RESULTS</span>
            <CheckCircle className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-3xl font-black text-emerald-400 font-mono">{stats?.normalScans || 0}</p>
          <p className="text-[10px] text-neutral-400">Intact stratified retina</p>
        </div>

        <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 space-y-2 shadow-2xl">
          <div className="flex items-center justify-between text-neutral-400 text-xs">
            <span className="tracking-wider uppercase text-[10px] font-bold">REPORTS GENERATED</span>
            <FileText className="w-4 h-4 text-neutral-300" />
          </div>
          <p className="text-3xl font-black text-neutral-200 font-mono">{stats?.reportsGenerated || 0}</p>
          <p className="text-[10px] text-neutral-400">Clinical PDF summaries</p>
        </div>
      </div>

      {/* Activity Chart & Recent Analyses */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 space-y-4 shadow-2xl flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Condition Distribution</h3>
            <p className="text-[11px] text-neutral-400">Total detected cases by diagnostic class</p>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" stroke="#525252" fontSize={10} fontStyle="bold" />
                <YAxis stroke="#525252" fontSize={10} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#050505', borderColor: '#333333', borderRadius: '12px', fontSize: '11px', color: '#fff' }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="text-[10px] text-neutral-400 text-center uppercase tracking-wider">DATA REFLECTS USER SCAN HISTORY</div>
        </div>

        <div className="lg:col-span-2 bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 space-y-4 shadow-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Recent Analyses</h3>
              <p className="text-[11px] text-neutral-400">Latest OCT screenings evaluated by Attention U-Net</p>
            </div>
            <Link href="/history" className="text-xs text-[#E0533C] hover:underline flex items-center space-x-1 uppercase tracking-wider font-bold">
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            {stats?.recentScans && stats.recentScans.length > 0 ? (
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-neutral-400 font-bold uppercase tracking-wider text-[10px]">
                    <th className="pb-3">Scan ID</th>
                    <th className="pb-3">Condition</th>
                    <th className="pb-3">Confidence</th>
                    <th className="pb-3">Priority</th>
                    <th className="pb-3">Date</th>
                    <th className="pb-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-neutral-300">
                  {stats.recentScans.map((scan) => (
                    <tr key={scan.id} className="hover:bg-white/5 transition">
                      <td className="py-3.5 font-mono text-[#E0533C] font-bold">#{scan.id}</td>
                      <td className="py-3.5 font-bold text-white">{scan.prediction}</td>
                      <td className="py-3.5 font-mono">{(scan.confidence * 100).toFixed(1)}%</td>
                      <td className="py-3.5">
                        <PriorityBadge priority={scan.priority} />
                      </td>
                      <td className="py-3.5 text-neutral-400">
                        {new Date(scan.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 text-right">
                        <Link
                          href={`/results/${scan.id}`}
                          className="px-3.5 py-1 rounded-full bg-white/10 hover:bg-white text-neutral-200 hover:text-black font-semibold transition text-[11px] tracking-wider uppercase"
                        >
                          View Results
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-12 text-neutral-400 space-y-3">
                <Eye className="w-8 h-8 mx-auto opacity-30" />
                <p className="text-xs">No scan history recorded yet.</p>
                <Link
                  href="/analyze"
                  className="inline-block px-5 py-2 rounded-full bg-[#8F1515]/20 text-[#E0533C] border border-[#8F1515]/40 text-xs font-bold uppercase tracking-wider"
                >
                  Run First OCT Analysis
                </Link>
              </div>
            )}
          </div>

          <div className="pt-3 flex items-center justify-between text-[10px] text-neutral-400 border-t border-white/10 uppercase tracking-wider">
            <span>Model: Attention U-Net (90.4% Accuracy)</span>
            <span>Grad-CAM Explainability Enabled</span>
          </div>
        </div>
      </div>
    </div>
  );
}
