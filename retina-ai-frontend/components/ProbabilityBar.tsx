import React from 'react';
import { Condition, Probabilities } from '@/types';

interface Props {
  probabilities: Probabilities;
  topCondition?: Condition;
}

const CONDITION_COLORS: Record<Condition, { bg: string; fill: string; text: string }> = {
  NORMAL: { bg: 'bg-emerald-950/40', fill: 'bg-emerald-500', text: 'text-emerald-400' },
  DME: { bg: 'bg-[#8F1515]/30', fill: 'bg-[#E0533C]', text: 'text-[#E0533C]' },
  DRUSEN: { bg: 'bg-amber-950/40', fill: 'bg-amber-400', text: 'text-amber-400' },
  CNV: { bg: 'bg-[#8F1515]/40', fill: 'bg-[#8F1515]', text: 'text-[#8F1515]' },
};

export default function ProbabilityBar({ probabilities, topCondition }: Props) {
  const classes: Condition[] = ['NORMAL', 'DME', 'DRUSEN', 'CNV'];

  return (
    <div className="space-y-3 font-mono">
      {classes.map((cls) => {
        const prob = probabilities ? (probabilities[cls] || 0) : 0;
        const percent = (prob * 100).toFixed(1);
        const isTop = topCondition === cls;
        const color = CONDITION_COLORS[cls];

        return (
          <div key={cls} className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <span className={`font-bold tracking-wider ${isTop ? color.text : 'text-neutral-300'}`}>
                  {cls}
                </span>
                {isTop && (
                  <span className="text-[9px] px-2 py-0.5 bg-[#8F1515]/20 text-[#E0533C] border border-[#8F1515]/50 rounded-full font-bold uppercase tracking-wider">
                    PRIMARY MATCH
                  </span>
                )}
              </div>
              <span className="font-mono text-neutral-300 font-bold">{percent}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-black/60 border border-white/10 overflow-hidden">
              <div
                className={`h-full ${color.fill} transition-all duration-700 ease-out shadow-[0_0_10px_currentColor]`}
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
