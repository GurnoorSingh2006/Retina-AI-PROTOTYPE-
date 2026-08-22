"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { getUserScans, deleteScan } from '@/lib/api';
import { ScanSummary, Condition, Priority } from '@/types';
import PriorityBadge from '@/components/PriorityBadge';
import { Eye, Search, Filter, Trash2, ArrowUpDown, Clock, Plus, AlertCircle } from 'lucide-react';

export default function HistoryPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();

  const [scans, setScans] = useState<ScanSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCondition, setFilterCondition] = useState<string>('ALL');
  const [filterPriority, setFilterPriority] = useState<string>('ALL');

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }

    if (isAuthenticated) {
      getUserScans()
        .then(setScans)
        .catch((e) => console.error(e))
        .finally(() => setLoading(false));
    }
  }, [isAuthenticated, authLoading, router]);

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to remove this scan record?')) return;
    try {
      await deleteScan(id);
      setScans((prev) => prev.filter((s) => s.id !== id));
    } catch (e: any) {
      alert('Failed to delete scan: ' + e.message);
    }
  };

  const filteredScans = scans.filter((scan) => {
    const matchesSearch =
      scan.id.toString().includes(searchTerm) ||
      (scan.originalFilename && scan.originalFilename.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCondition = filterCondition === 'ALL' || scan.prediction === filterCondition;
    const matchesPriority = filterPriority === 'ALL' || scan.priority === filterPriority;
    return matchesSearch && matchesCondition && matchesPriority;
  });

  if (authLoading || loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-8 h-8 border-2 border-[#8F1515] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-neutral-400">Loading Scan Archives...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8 bg-[#050505] min-h-screen font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-[10px] font-bold text-[#E0533C] uppercase tracking-widest">SCAN ARCHIVES</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">Scan History & Archives</h1>
          <p className="text-xs text-neutral-400 mt-1">Review, filter, and access previous OCT evaluations.</p>
        </div>

        <Link
          href="/analyze"
          className="inline-flex items-center space-x-2 px-6 py-3 rounded-full bg-white hover:bg-neutral-200 text-black font-bold text-xs uppercase tracking-wider shadow-xl transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>NEW ANALYSIS</span>
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-4 flex flex-col md:flex-row items-center gap-3 shadow-2xl">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Scan ID or filename..."
            className="w-full bg-black/60 border border-white/10 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#8F1515] transition"
          />
        </div>

        {/* Condition Filter */}
        <div className="flex items-center space-x-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-neutral-500 hidden sm:block" />
          <select
            value={filterCondition}
            onChange={(e) => setFilterCondition(e.target.value)}
            className="bg-black/60 border border-white/10 rounded-2xl px-4 py-2.5 text-xs text-neutral-300 focus:outline-none focus:border-[#8F1515] w-full md:w-auto"
          >
            <option value="ALL">All Conditions</option>
            <option value="NORMAL">NORMAL</option>
            <option value="DME">DME</option>
            <option value="DRUSEN">DRUSEN</option>
            <option value="CNV">CNV</option>
          </select>

          {/* Priority Filter */}
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="bg-black/60 border border-white/10 rounded-2xl px-4 py-2.5 text-xs text-neutral-300 focus:outline-none focus:border-[#8F1515] w-full md:w-auto"
          >
            <option value="ALL">All Priorities</option>
            <option value="HIGH">HIGH</option>
            <option value="REVIEW">REVIEW</option>
            <option value="LOW">LOW</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-black/60 border-b border-white/10 text-neutral-400 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-5">Scan ID</th>
                <th className="py-3.5 px-5">Filename</th>
                <th className="py-3.5 px-5">Condition</th>
                <th className="py-3.5 px-5">Confidence</th>
                <th className="py-3.5 px-5">Screening Priority</th>
                <th className="py-3.5 px-5">Model</th>
                <th className="py-3.5 px-5">Timestamp</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-neutral-300">
              {filteredScans.length > 0 ? (
                filteredScans.map((scan) => (
                  <tr key={scan.id} className="hover:bg-white/5 transition">
                    <td className="py-4 px-5 font-mono font-bold text-[#E0533C]">#{scan.id}</td>
                    <td className="py-4 px-5 font-mono text-neutral-400">{scan.originalFilename || 'oct_scan.png'}</td>
                    <td className="py-4 px-5 font-bold text-white">{scan.prediction}</td>
                    <td className="py-4 px-5 font-mono">{(scan.confidence * 100).toFixed(1)}%</td>
                    <td className="py-4 px-5">
                      <PriorityBadge priority={scan.priority} />
                    </td>
                    <td className="py-4 px-5 text-neutral-400">{scan.modelName}</td>
                    <td className="py-4 px-5 text-neutral-400">{new Date(scan.createdAt).toLocaleString()}</td>
                    <td className="py-4 px-5 text-right space-x-2">
                      <Link
                        href={`/results/${scan.id}`}
                        className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white text-neutral-200 hover:text-black font-semibold transition text-[11px] uppercase tracking-wider"
                      >
                        Results
                      </Link>
                      <button
                        onClick={() => handleDelete(scan.id)}
                        className="p-1.5 rounded-full text-neutral-500 hover:text-[#E0533C] hover:bg-[#8F1515]/20 transition"
                        title="Delete Record"
                      >
                        <Trash2 className="w-3.5 h-3.5 inline" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="text-center py-16 text-neutral-500">
                    <p>No matching scan records found.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
