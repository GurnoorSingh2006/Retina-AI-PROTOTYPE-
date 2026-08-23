"use client";

import React, { useEffect, useState } from 'react';
import { getModelsData } from '@/lib/api';
import { ModelDetail } from '@/types';
import { Layers, Cpu, CheckCircle2, ArrowRight, ShieldCheck, Sparkles, BookOpen } from 'lucide-react';

const STATIC_MODELS: ModelDetail[] = [
  {
    id: "attention-unet",
    name: "Attention U-Net",
    tag: "Production Champion",
    category: "Gated Attention",
    architecture: "4-Stage Contracting & Expansive U-Net with Gated Attention Modules",
    reported_accuracy: 90.4,
    input_shape: "(128, 128, 3)",
    params: "~31.4M",
    purpose: "Directs convolutional attention specifically to pathological macular anomalies (intraretinal fluid cavities, drusen summits, subretinal membranes) while suppressing irrelevant peripheral noise.",
    status: "PRODUCTION ACTIVE",
    loss: "categorical_crossentropy",
    optimizer: "Adam (lr=0.0001)"
  },
  {
    id: "res-unet",
    name: "Residual U-Net (ResU-Net)",
    tag: "Research Model",
    category: "Deep Residual",
    architecture: "Deep Residual U-Net with Skip Additions and Transposed Convolutions",
    reported_accuracy: 90.5,
    input_shape: "(128, 128, 3)",
    params: "~28.2M",
    purpose: "Evaluates residual identity mappings within encoder-decoder stages to preserve high-frequency gradient flow during backpropagation.",
    status: "RESEARCH BENCHMARK",
    loss: "binary_crossentropy / categorical",
    optimizer: "Adam"
  },
  {
    id: "unet-residual-blocks",
    name: "U-Net with Residual Blocks",
    tag: "Research Model",
    category: "Residual Skip",
    architecture: "U-Net Encoder-Decoder with Residual Block Blocks",
    reported_accuracy: 88.6,
    input_shape: "(128, 128, 3)",
    params: "~19.8M",
    purpose: "Tests residual convolutions across skip stages to enhance boundary preservation in macular segmentation.",
    status: "RESEARCH BENCHMARK",
    loss: "categorical_crossentropy",
    optimizer: "Adam"
  },
  {
    id: "unet-increased-filters",
    name: "U-Net with Increased Filters",
    tag: "Research Model",
    category: "Capacity Scaled",
    architecture: "High-Capacity U-Net (128-1024 Filter Stacks)",
    reported_accuracy: 86.8,
    input_shape: "(128, 128, 3)",
    params: "~34.1M",
    purpose: "Explores higher dimensional channel representations across early and deep convolutional stages.",
    status: "RESEARCH BENCHMARK",
    loss: "categorical_crossentropy",
    optimizer: "Adam"
  },
  {
    id: "unet-dropout",
    name: "U-Net with Dropout Regularization",
    tag: "Research Model",
    category: "Regularized",
    architecture: "U-Net with 0.2 / 0.5 Dropout Rates",
    reported_accuracy: 85.8,
    input_shape: "(128, 128, 3)",
    params: "~15.2M",
    purpose: "Mitigates overfitting on minority sub-classes through stochastic feature dropout.",
    status: "RESEARCH BENCHMARK",
    loss: "categorical_crossentropy",
    optimizer: "Adam"
  },
  {
    id: "baseline-unet",
    name: "Baseline U-Net",
    tag: "Research Model",
    category: "Baseline Segmenter",
    architecture: "Standard Symmetric 4-Level Contracting & Expansive Path",
    reported_accuracy: 85.0,
    input_shape: "(128, 128, 3)",
    params: "~14.8M",
    purpose: "Foundational encoder-decoder architecture providing baseline performance benchmark.",
    status: "RESEARCH BENCHMARK",
    loss: "categorical_crossentropy",
    optimizer: "Adam (lr=0.0001)"
  },
  {
    id: "fcn",
    name: "Fully Convolutional Network (FCN)",
    tag: "Research Model",
    category: "All-Convolutional",
    architecture: "5 Conv Blocks + 1x1 Conv + Global Average Pooling",
    reported_accuracy: 85.0,
    input_shape: "(128, 128, 3)",
    params: "1,572,548 (6.00 MB)",
    purpose: "Eliminates dense layers via Global Average Pooling to reduce parameter overhead while maintaining spatial awareness.",
    status: "RESEARCH BENCHMARK",
    loss: "categorical_crossentropy",
    optimizer: "Adam (lr=0.0001)"
  },
  {
    id: "deep-cnn",
    name: "Deep CNN (Sequential)",
    tag: "Research Model",
    category: "Initial Baseline",
    architecture: "4 Conv Blocks (32->256) + BatchNorm + Flatten + Dense(512)",
    reported_accuracy: 74.0,
    input_shape: "(128, 128, 3)",
    params: "5,111,492 (19.50 MB)",
    purpose: "Initial benchmark convolutional model demonstrating need for advanced skip-connected architectures.",
    status: "RESEARCH BENCHMARK",
    loss: "categorical_crossentropy",
    optimizer: "Adam (lr=0.0001)"
  }
];

export default function ModelsPage() {
  const [models, setModels] = useState<ModelDetail[]>(STATIC_MODELS);

  useEffect(() => {
    getModelsData()
      .then((res) => {
        if (res.models && res.models.length > 0) {
          setModels(res.models);
        }
      })
      .catch((e) => console.error(e));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8 bg-[#050505] min-h-screen font-mono">
      {/* Header */}
      <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
        <div className="flex items-center space-x-2 text-[#E0533C] text-[10px] font-bold uppercase tracking-widest mb-2">
          <Layers className="w-3.5 h-3.5" />
          <span>MODEL ARCHITECTURE LAB</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white font-mono">
          RETINAL DEEP LEARNING ARCHITECTURES
        </h1>
        <p className="text-xs text-neutral-400 mt-2 max-w-3xl leading-relaxed font-sans">
          Explore all 8 neural network architectures evaluated in the research study. Attention U-Net serves as the active production model for clinical screening and Grad-CAM spatial localization.
        </p>
      </div>

      {/* Model Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {models.map((model) => {
          const isProduction = model.status.includes('PRODUCTION');
          return (
            <div
              key={model.id}
              className={`rounded-3xl p-7 space-y-5 transition-all flex flex-col justify-between backdrop-blur-xl ${
                isProduction
                  ? 'bg-black/60 border-2 border-[#8F1515] shadow-2xl shadow-[#8F1515]/20'
                  : 'bg-black/40 border border-white/10'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] font-bold px-3 py-1 rounded-full border uppercase tracking-wider ${
                      isProduction
                        ? 'bg-[#8F1515]/30 text-[#E0533C] border-[#8F1515]/60'
                        : 'bg-white/5 text-neutral-400 border-white/10'
                    }`}
                  >
                    {model.status}
                  </span>
                  <span className="font-mono text-sm font-bold text-white bg-black/80 px-3 py-1 rounded-full border border-white/15">
                    {model.reported_accuracy}% ACCURACY
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white font-mono">{model.name}</h3>
                  <p className="text-xs text-[#E0533C] font-semibold mt-0.5 uppercase tracking-wider">{model.category}</p>
                </div>

                <p className="text-xs text-neutral-300 leading-relaxed bg-black/60 p-4 rounded-2xl border border-white/5 font-sans">
                  {model.purpose}
                </p>
              </div>

              {/* Specs Table */}
              <div className="space-y-2 text-xs text-neutral-400 border-t border-white/10 pt-4 divide-y divide-white/5 font-mono">
                <div className="flex justify-between pt-1.5">
                  <span className="text-[11px] uppercase">ARCHITECTURE:</span>
                  <span className="font-medium text-neutral-200 text-right max-w-[60%] line-clamp-1">{model.architecture}</span>
                </div>
                <div className="flex justify-between pt-1.5">
                  <span className="text-[11px] uppercase">PARAMETERS:</span>
                  <span className="text-neutral-200">{model.params}</span>
                </div>
                <div className="flex justify-between pt-1.5">
                  <span className="text-[11px] uppercase">INPUT SHAPE:</span>
                  <span className="text-neutral-200">{model.input_shape}</span>
                </div>
                <div className="flex justify-between pt-1.5">
                  <span className="text-[11px] uppercase">LOSS FUNCTION:</span>
                  <span className="text-neutral-200">{model.loss}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
