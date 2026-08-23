"use client";

import React, { useState } from 'react';
import { Eye, Layers, Sparkles } from 'lucide-react';

interface Props {
  originalImage?: string;
  heatmapImage?: string;
  overlayImage?: string;
  prediction?: string;
  finding?: string;
}

export default function OctViewer({ originalImage, heatmapImage, overlayImage, prediction, finding }: Props) {
  const [activeTab, setActiveTab] = useState<'overlay' | 'heatmap' | 'original'>('overlay');

  const getCurrentImage = () => {
    if (activeTab === 'original') return originalImage || overlayImage;
    if (activeTab === 'heatmap') return heatmapImage || overlayImage;
    return overlayImage || originalImage;
  };

  return (
    <div className="bg-black/40 backdrop-blur-xl rounded-3xl border border-white/10 p-6 space-y-4 font-mono shadow-2xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center space-x-2 tracking-wider uppercase">
            <Layers className="w-4 h-4 text-[#E0533C]" />
            <span>OCT Visualizer & Attention Map</span>
          </h3>
          <p className="text-xs text-neutral-400 font-mono">Grad-CAM spatial activation highlighting salient biomarkers</p>
        </div>

        <div className="inline-flex rounded-full bg-black/80 p-1 border border-white/10">
          <button
            onClick={() => setActiveTab('original')}
            className={`px-3.5 py-1 text-xs font-mono tracking-wider rounded-full transition ${
              activeTab === 'original'
                ? 'bg-white/20 text-white shadow'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            ORIGINAL
          </button>
          <button
            onClick={() => setActiveTab('heatmap')}
            className={`px-3.5 py-1 text-xs font-mono tracking-wider rounded-full transition ${
              activeTab === 'heatmap'
                ? 'bg-[#8F1515]/40 text-[#E0533C] border border-[#8F1515]/60 shadow'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            HEATMAP
          </button>
          <button
            onClick={() => setActiveTab('overlay')}
            className={`px-3.5 py-1 text-xs font-mono tracking-wider rounded-full transition ${
              activeTab === 'overlay'
                ? 'bg-white text-black font-bold shadow'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            OVERLAY
          </button>
        </div>
      </div>

      <div className="relative aspect-[4/3] w-full max-h-[380px] bg-black rounded-2xl overflow-hidden border border-white/10 flex items-center justify-center group shadow-2xl">
        {getCurrentImage() ? (
          <img
            src={getCurrentImage()}
            alt="OCT Scan View"
            className="w-full h-full object-contain transition-all duration-300"
          />
        ) : (
          <div className="text-center p-6 text-neutral-600">
            <Eye className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-xs">No scan image available</p>
          </div>
        )}

        <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-[10px] font-mono text-neutral-300 flex items-center space-x-1.5 uppercase tracking-wider">
          <Sparkles className="w-3 h-3 text-[#E0533C]" />
          <span>{activeTab} View</span>
        </div>
      </div>

      {finding && (
        <div className="bg-[#8F1515]/15 border border-[#8F1515]/40 rounded-2xl p-4 flex items-start space-x-3">
          <div className="w-6 h-6 rounded-lg bg-[#8F1515]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
            <Sparkles className="w-3.5 h-3.5 text-[#E0533C]" />
          </div>
          <div className="space-y-0.5">
            <p className="text-xs font-bold text-[#E0533C] tracking-wider uppercase">Model Attention Rationale</p>
            <p className="text-xs text-neutral-300 leading-relaxed font-sans">{finding}</p>
          </div>
        </div>
      )}
    </div>
  );
}
