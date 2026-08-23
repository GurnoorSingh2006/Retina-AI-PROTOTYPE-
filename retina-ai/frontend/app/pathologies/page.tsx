"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Eye, AlertTriangle, CheckCircle2, AlertCircle, ShieldAlert, ArrowRight, BookOpen, Activity, Sparkles, HelpCircle } from 'lucide-react';

interface DiseaseInfo {
  id: string;
  name: string;
  shortName: string;
  tagline: string;
  badgeColor: string;
  badgeText: string;
  simpleExplanation: string;
  analogy: string;
  octAppearance: string;
  commonSymptoms: string[];
  causes: string[];
  urgency: string;
  actionRequired: string;
}

const DISEASES: DiseaseInfo[] = [
  {
    id: "NORMAL",
    name: "Normal & Healthy Retina",
    shortName: "NORMAL",
    tagline: "Intact, stratified retinal layers with a natural foveal depression.",
    badgeColor: "bg-emerald-950/40 text-emerald-400 border-emerald-800/60",
    badgeText: "LOW RISK / HEALTHY",
    simpleExplanation: "A completely healthy retina where light is focused sharply without any swelling, fluid leakage, or debris. All 10 microscopic retinal cell layers lie in smooth, parallel stripes.",
    analogy: "Like a smooth, unwrinkled film inside a camera capturing clear, crisp photographs.",
    octAppearance: "Smooth, continuous horizontal layers with a gentle, natural dip in the center (the fovea). No dark fluid bubbles or bumpy elevations.",
    commonSymptoms: [
      "Sharp, clear central and peripheral vision",
      "Accurate color perception and normal contrast",
      "No dark spots, wavy lines, or distortion"
    ],
    causes: [
      "Healthy ocular circulation and normal intraocular pressure",
      "Absence of diabetic microvascular damage or age-related degeneration"
    ],
    urgency: "Routine Screening",
    actionRequired: "Standard annual ophthalmological check-ups to maintain healthy baseline."
  },
  {
    id: "DME",
    name: "Diabetic Macular Edema (DME)",
    shortName: "DME",
    tagline: "Fluid buildup and swelling inside the retina caused by diabetes.",
    badgeColor: "bg-[#8F1515]/20 text-[#E0533C] border-[#8F1515]/50",
    badgeText: "HIGH PRIORITY",
    simpleExplanation: "High blood sugar levels damage the tiny delicate blood vessels in the back of the eye. These weakened capillaries leak fluid and blood into the central retina (macula), causing it to swell up like a wet sponge.",
    analogy: "Like a soaked sponge swelling up under water — when the retina swells, the light sensors cannot focus properly, resulting in blurry or distorted vision.",
    octAppearance: "Dark, cyst-like fluid cavities (black circles or bubbles) trapped between retinal layers, accompanied by visible thickening and swelling of the central retina.",
    commonSymptoms: [
      "Blurred or double vision that fluctuates throughout the day",
      "Straight lines appearing wavy or crooked (metamorphopsia)",
      "Colors appearing faded, washed out, or dull",
      "Difficulty reading small text or recognizing faces"
    ],
    causes: [
      "Prolonged high blood sugar levels (Type 1 or Type 2 Diabetes)",
      "Elevated blood pressure (hypertension) and high cholesterol",
      "Diabetic retinopathy progressing to microvascular leakage"
    ],
    urgency: "Prompt Clinical Attention",
    actionRequired: "Anti-VEGF intravitreal injections, retinal laser therapy, and tight glycemic blood sugar management."
  },
  {
    id: "DRUSEN",
    name: "Drusen (Dry Age-Related Macular Degeneration)",
    shortName: "DRUSEN",
    tagline: "Fatty protein waste deposits accumulating under the retina.",
    badgeColor: "bg-amber-950/40 text-amber-400 border-amber-800/60",
    badgeText: "CLINICAL REVIEW",
    simpleExplanation: "As the eye ages, cellular waste products (fats and proteins) aren't cleared away effectively. They form tiny yellow pebble-like deposits called drusen underneath the retinal pigment epithelium layer.",
    analogy: "Like tiny pebbles trapped beneath a smooth rug — they create small bumps and disruptions on the surface over time.",
    octAppearance: "Convex nodular bumps and dome-shaped elevations pushing up the bottom retinal layer (RPE), making the normally straight lines appear wavy.",
    commonSymptoms: [
      "Often zero symptoms in early stages (found only during routine OCT scans)",
      "Mild blurriness when reading in dim lighting",
      "A small blurry or gray spot in the very center of your field of view",
      "Difficulty adapting to changes from bright sunlight to dim indoor rooms"
    ],
    causes: [
      "Natural aging process (most common in adults over age 55)",
      "Genetic predisposition and family history of macular degeneration",
      "Smoking, poor cardiovascular health, and lack of antioxidant nutrients"
    ],
    urgency: "Monitoring & Review",
    actionRequired: "Regular OCT monitoring every 6-12 months using Amsler grid self-tests, dietary antioxidants (AREDS2 vitamins), and lifestyle changes."
  },
  {
    id: "CNV",
    name: "Choroidal Neovascularization (Wet AMD)",
    shortName: "CNV",
    tagline: "Abnormal, fragile new blood vessels growing beneath the retina.",
    badgeColor: "bg-[#8F1515]/30 text-[#E0533C] border-[#8F1515]/60",
    badgeText: "CRITICAL / URGENT",
    simpleExplanation: "In response to oxygen starvation, the eye grows abnormal new blood vessels under the retina. These vessels are fragile and easily break, leaking blood and fluid directly into the retinal tissue, causing rapid central vision damage.",
    analogy: "Like tree roots aggressively bursting through a concrete sidewalk and cracking the foundation from underneath.",
    octAppearance: "A prominent thick, bright (hyperreflective) mass breaking through Bruch's membrane, frequently surrounded by dark fluid pooling above and below the retinal layers.",
    commonSymptoms: [
      "Sudden, dramatic onset of distorted vision (e.g., straight doorframes look bent)",
      "A dark, gray, or blank blind spot directly in the center of your sight",
      "Rapid decline in reading ability or seeing fine facial details",
      "Objects appearing smaller or further away than they actually are"
    ],
    causes: [
      "Advanced wet Age-Related Macular Degeneration (Wet AMD)",
      "High pathological myopia (extreme near-sightedness)",
      "Ocular trauma, severe histoplasmosis, or angioid streaks"
    ],
    urgency: "Immediate Emergency Referral",
    actionRequired: "Urgent anti-VEGF eye injections (e.g., Aflibercept, Ranibizumab) administered by a retinal specialist within days to prevent permanent vision loss."
  }
];

export default function PathologiesPage() {
  const [selectedDisease, setSelectedDisease] = useState<string>('DME');

  const current = DISEASES.find((d) => d.id === selectedDisease) || DISEASES[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-10 bg-[#050505] min-h-screen font-mono">
      {/* Header Banner */}
      <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl space-y-3">
        <div className="flex items-center space-x-2 text-[#E0533C] text-[10px] font-bold uppercase tracking-widest">
          <BookOpen className="w-4 h-4" />
          <span>CLINICAL GUIDE IN PLAIN ENGLISH</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white font-mono">
          RETINAL DISEASES EXPLAINED
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400 max-w-3xl leading-relaxed font-sans">
          Understand the four primary conditions diagnosed by OCTalyze. Learn how each disease develops, what it looks like on an optical coherence tomography (OCT) scan, and what action is required.
        </p>
      </div>

      {/* Disease Quick Navigation Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {DISEASES.map((item) => {
          const active = item.id === selectedDisease;
          return (
            <button
              key={item.id}
              onClick={() => setSelectedDisease(item.id)}
              className={`p-4 sm:p-5 rounded-2xl text-left transition-all flex flex-col justify-between space-y-2 border ${
                active
                  ? 'bg-black/80 border-[#8F1515] shadow-xl shadow-[#8F1515]/20 ring-1 ring-[#8F1515]'
                  : 'bg-black/40 border-white/10 hover:border-white/20 hover:bg-white/5'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-white tracking-wider font-mono">{item.shortName}</span>
                <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase border ${item.badgeColor}`}>
                  {item.badgeText.split('/')[0]}
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 font-sans line-clamp-1">{item.name}</p>
            </button>
          );
        })}
      </div>

      {/* Selected Disease Deep Dive Card */}
      <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-10 space-y-8 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <span className="text-xs font-bold text-[#E0533C] tracking-widest font-mono uppercase">CONDITION OVERVIEW</span>
              <span className={`text-[10px] px-3 py-0.5 rounded-full font-bold uppercase border ${current.badgeColor}`}>
                {current.badgeText}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white font-mono uppercase">{current.name}</h2>
            <p className="text-xs text-neutral-300 font-sans mt-1">{current.tagline}</p>
          </div>

          <Link
            href="/analyze"
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full bg-white hover:bg-neutral-200 text-black text-xs font-bold font-mono tracking-wider uppercase transition shadow-xl self-start sm:self-auto"
          >
            <span>Test {current.shortName} Scan</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 2-Column Core Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Plain English & Analogy (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-black/60 border border-white/10 rounded-2xl p-6 space-y-2">
              <h3 className="text-xs font-bold text-[#E0533C] uppercase tracking-wider font-mono flex items-center space-x-2">
                <Sparkles className="w-4 h-4" />
                <span>What Is It in Simple Terms?</span>
              </h3>
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-sans">
                {current.simpleExplanation}
              </p>
            </div>

            <div className="bg-black/60 border border-white/10 rounded-2xl p-6 space-y-2">
              <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider font-mono flex items-center space-x-2">
                <HelpCircle className="w-4 h-4" />
                <span>Everyday Analogy</span>
              </h3>
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-sans italic">
                &ldquo;{current.analogy}&rdquo;
              </p>
            </div>

            <div className="bg-black/60 border border-white/10 rounded-2xl p-6 space-y-2">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center space-x-2">
                <Eye className="w-4 h-4 text-[#E0533C]" />
                <span>What Doctors See on the OCT Scan</span>
              </h3>
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-sans">
                {current.octAppearance}
              </p>
            </div>
          </div>

          {/* Right Column: Symptoms, Causes, Action (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Symptoms Card */}
            <div className="bg-black/60 border border-white/10 rounded-2xl p-6 space-y-3 font-mono">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Common Patient Symptoms</h3>
              <ul className="space-y-2 text-xs text-neutral-300 font-sans">
                {current.commonSymptoms.map((symptom, i) => (
                  <li key={i} className="flex items-start space-x-2">
                    <span className="text-[#E0533C] mt-0.5">•</span>
                    <span>{symptom}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Root Causes */}
            <div className="bg-black/60 border border-white/10 rounded-2xl p-6 space-y-3 font-mono">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Underlying Causes & Risks</h3>
              <ul className="space-y-2 text-xs text-neutral-300 font-sans">
                {current.causes.map((cause, i) => (
                  <li key={i} className="flex items-start space-x-2">
                    <span className="text-amber-400 mt-0.5">•</span>
                    <span>{cause}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Clinical Action */}
            <div className="bg-[#8F1515]/15 border border-[#8F1515]/40 rounded-2xl p-6 space-y-2 font-mono">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-[#E0533C] uppercase tracking-wider">CLINICAL ACTION</span>
                <span className="text-[10px] font-bold text-neutral-400">{current.urgency}</span>
              </div>
              <p className="text-xs text-neutral-300 font-sans leading-relaxed">
                {current.actionRequired}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Side-by-Side Comparison Matrix */}
      <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <div>
          <h3 className="text-base font-bold text-white font-mono uppercase tracking-wider">4-Class Quick Comparison Table</h3>
          <p className="text-xs text-neutral-400 font-mono">Side-by-side breakdown for rapid clinician and patient reference</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-white/10 text-neutral-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="pb-3 px-4">Condition</th>
                <th className="pb-3 px-4">What Happens?</th>
                <th className="pb-3 px-4">Key OCT Sign</th>
                <th className="pb-3 px-4">Urgency Tier</th>
                <th className="pb-3 px-4 text-right">Standard Treatment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-neutral-300">
              {DISEASES.map((d) => (
                <tr key={d.id} className="hover:bg-white/5 transition">
                  <td className="py-4 px-4 font-bold text-white font-mono">
                    <span className="text-[#E0533C]">{d.shortName}</span>
                    <span className="block text-[10px] text-neutral-400 font-sans">{d.name}</span>
                  </td>
                  <td className="py-4 px-4 font-sans text-neutral-300 max-w-[200px]">{d.simpleExplanation}</td>
                  <td className="py-4 px-4 font-sans text-neutral-300 max-w-[200px]">{d.octAppearance}</td>
                  <td className="py-4 px-4">
                    <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase border ${d.badgeColor}`}>
                      {d.badgeText}
                    </span>
                  </td>
                  <td className="py-4 px-4 font-sans text-neutral-300 text-right max-w-[180px]">{d.actionRequired}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
