import React from 'react';
import { Priority } from '@/types';
import { AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react';

export default function PriorityBadge({ priority }: { priority: Priority | string }) {
  if (priority === 'HIGH') {
    return (
      <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-[#8F1515]/20 text-[#E0533C] border border-[#8F1515]/50 uppercase tracking-wider">
        <AlertTriangle className="w-3.5 h-3.5" />
        <span>HIGH PRIORITY</span>
      </span>
    );
  }
  if (priority === 'REVIEW') {
    return (
      <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-amber-500/15 text-amber-400 border border-amber-500/40 uppercase tracking-wider">
        <AlertCircle className="w-3.5 h-3.5" />
        <span>CLINICAL REVIEW</span>
      </span>
    );
  }
  return (
    <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/40 uppercase tracking-wider">
      <CheckCircle className="w-3.5 h-3.5" />
      <span>LOW RISK (NORMAL)</span>
    </span>
  );
}
