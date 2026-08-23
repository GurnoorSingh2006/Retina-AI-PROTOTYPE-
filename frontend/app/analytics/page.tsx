"use client";

import React, { useEffect, useState } from 'react';
import { getAnalyticsData } from '@/lib/api';
import { Database, BarChart2, Cpu, TrendingUp, Layers, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, PieChart, Pie, Legend } from 'recharts';

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAnalyticsData()
      .then(setData)
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, []);

  const modelComparison = [
    { name: 'Deep CNN', accuracy: 74.0, loss: 0.6899, type: 'Baseline', color: '#64748B' },
    { name: 'FCN', accuracy: 85.0, loss: 0.4936, type: 'Convolutional', color: '#0EA5E9' },
    { name: 'Baseline U-Net', accuracy: 85.0, loss: 0.4070, type: 'Encoder-Decoder', color: '#38BDF8' },
    { name: 'U-Net + Dropout', accuracy: 85.8, loss: 0.3850, type: 'Regularized', color: '#2DD4BF' },
    { name: 'U-Net + Filters', accuracy: 86.8, loss: 0.3620, type: 'Capacity Scaled', color: '#14B8A6' },
    { name: 'U-Net + Res Blocks', accuracy: 88.6, loss: 0.3410, type: 'Residual Variant', color: '#10B981' },
    { name: 'ResU-Net (Eval)', accuracy: 90.5, loss: 0.3124, type: 'Deep Residual', color: '#06B6D4' },
    { name: 'Attention U-Net', accuracy: 90.4, loss: 0.2980, type: 'Champion (Production)', color: '#0891B2' },
  ];

  const datasetPie = [
    { name: 'NORMAL (26,315)', value: 26315, color: '#10B981' },
    { name: 'DME (11,347)', value: 11347, color: '#F59E0B' },
    { name: 'DRUSEN (8,616)', value: 8616, color: '#F97316' },
    { name: 'CNV (37,215)', value: 37215, color: '#EF4444' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8 bg-[#050505] min-h-screen font-mono">
      {/* Header */}
      <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
        <div className="flex items-center space-x-2 text-[#E0533C] text-[10px] font-bold uppercase tracking-widest mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>RESEARCH & MACHINE LEARNING OVERVIEW</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white font-mono">
          MODEL BENCHMARKS & DATASET ANALYTICS
        </h1>
        <p className="text-xs text-neutral-400 mt-2 max-w-3xl leading-relaxed font-sans">
          Comprehensive empirical results directly sourced from the research Colab notebook (<code>Major project.ipynb</code>), tracking the architectural evolution from initial CNN baselines to high-capacity Attention U-Nets.
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 space-y-1.5 shadow-2xl">
          <span className="text-[10px] uppercase tracking-wider font-bold text-neutral-400">TOTAL DATASET SCANS</span>
          <p className="text-3xl font-black text-white font-mono">83,493</p>
          <p className="text-[10px] text-neutral-400">OCT2017 Retinal B-scans</p>
        </div>

        <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 space-y-1.5 shadow-2xl">
          <span className="text-[10px] uppercase tracking-wider font-bold text-[#E0533C]">CHAMPION MODEL</span>
          <p className="text-2xl font-black text-[#E0533C]">Attention U-Net</p>
          <p className="text-[10px] text-neutral-400">Spatial Attention Gates</p>
        </div>

        <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 space-y-1.5 shadow-2xl">
          <span className="text-[10px] uppercase tracking-wider font-bold text-emerald-400">PEAK TEST ACCURACY</span>
          <p className="text-3xl font-black text-emerald-400 font-mono">90.5%</p>
          <p className="text-[10px] text-neutral-400">ResU-Net Evaluation</p>
        </div>

        <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 space-y-1.5 shadow-2xl">
          <span className="text-[10px] uppercase tracking-wider font-bold text-neutral-400">STANDARD INPUT DIMENSIONS</span>
          <p className="text-2xl font-black text-neutral-200 font-mono">(128, 128, 3)</p>
          <p className="text-[10px] text-neutral-400">RGB Normalized 1./255</p>
        </div>
      </div>

      {/* Model Benchmark Accuracy Chart */}
      <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 space-y-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-white/10">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Reported Test Accuracy Across Architectures</h3>
            <p className="text-xs text-neutral-400">Comparison of 8 model iterations trained on identical OCT partitions</p>
          </div>
          <span className="text-[10px] text-[#E0533C] bg-[#8F1515]/20 border border-[#8F1515]/40 px-3 py-1 rounded-full font-mono font-bold uppercase tracking-wider self-start sm:self-auto">
            Source: Major project.ipynb
          </span>
        </div>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={modelComparison} margin={{ top: 20, right: 20, left: 0, bottom: 40 }}>
              <XAxis dataKey="name" stroke="#525252" fontSize={10} angle={-25} textAnchor="end" interval={0} />
              <YAxis domain={[65, 95]} stroke="#525252" fontSize={10} />
              <Tooltip
                formatter={(val: any) => [`${val}%`, 'Test Accuracy']}
                contentStyle={{ backgroundColor: '#050505', borderColor: '#333333', borderRadius: '12px', fontSize: '11px', color: '#fff' }}
              />
              <Bar dataKey="accuracy" radius={[6, 6, 0, 0]}>
                {modelComparison.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Dataset Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Dataset Distribution Pie (5 cols) */}
        <div className="lg:col-span-5 bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 space-y-4 shadow-2xl flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">OCT2017 Class Distribution</h3>
            <p className="text-[11px] text-neutral-400">Original dataset composition (83,493 scans total)</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={datasetPie}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={45}
                  paddingAngle={4}
                >
                  {datasetPie.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any) => [val.toLocaleString(), 'Images']}
                  contentStyle={{ backgroundColor: '#050505', borderColor: '#333333', borderRadius: '12px', fontSize: '11px', color: '#fff' }}
                />
                <Legend wrapperStyle={{ fontSize: '10px', color: '#a3a3a3' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[10px] text-neutral-400 text-center uppercase tracking-wider">Dataset downsampled in notebook for balanced class evaluation</p>
        </div>

        {/* Data Preprocessing & Training Methodology (7 cols) */}
        <div className="lg:col-span-7 bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 space-y-4 shadow-2xl flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Data Engineering & Training Pipeline</h3>
            <p className="text-[11px] text-neutral-400">Standardized pipeline specifications from the Colab notebook</p>
          </div>

          <div className="space-y-3 text-xs text-neutral-300">
            <div className="p-4 rounded-2xl bg-black/60 border border-white/10">
              <span className="font-bold text-[#E0533C] uppercase tracking-wider">1. Balanced Dataset Downsampling:</span>
              <p className="text-neutral-400 mt-1 font-sans">
                Downsampled original 83,493 scans into balanced partitions (<code>NORMAL: 6230</code>, <code>DME: 2690</code>, <code>DRUSEN: 2042</code>, <code>CNV: 8829</code>) to mitigate dominant class bias.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-black/60 border border-white/10">
              <span className="font-bold text-[#E0533C] uppercase tracking-wider">2. Data Augmentation & Normalization:</span>
              <p className="text-neutral-400 mt-1 font-sans">
                Applied <code>rotation_range=40</code>, <code>width_shift=0.2</code>, <code>height_shift=0.2</code>, <code>shear_range=0.2</code>, <code>zoom_range=0.2</code>, <code>horizontal_flip=True</code>, and <code>rescale=1./255</code>.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-black/60 border border-white/10">
              <span className="font-bold text-[#E0533C] uppercase tracking-wider">3. Adaptive Callbacks & Convergence:</span>
              <p className="text-neutral-400 mt-1 font-sans">
                Utilized <code>ReduceLROnPlateau(factor=0.2, patience=5, min_lr=1e-5)</code> and <code>EarlyStopping(patience=10, restore_best_weights=True)</code> for optimal generalization.
              </p>
            </div>
          </div>

          <div className="pt-3 flex items-center justify-between text-[10px] text-neutral-400 border-t border-white/10 uppercase tracking-wider">
            <span>Hardware: TPU / GPU Accelerated Training</span>
            <span>Loss: Categorical Cross-Entropy</span>
          </div>
        </div>
      </div>
    </div>
  );
}
