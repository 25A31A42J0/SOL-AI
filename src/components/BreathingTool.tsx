import React, { useState, useEffect } from "react";
import { Play, Pause, RotateCcw, Wind, Sparkles } from "lucide-react";

type BreathingTechnique = "4-7-8" | "box" | "calm";

interface TechniqueConfig {
  name: string;
  desc: string;
  phases: { name: string; duration: number; text: string; scale: number }[];
}

const TECHNIQUES: Record<BreathingTechnique, TechniqueConfig> = {
  "4-7-8": {
    name: "4-7-8 Relaxing Breath",
    desc: "Natural tranquilizer for the nervous system; ideal for anxiety and sleep.",
    phases: [
      { name: "Inhale", duration: 4, text: "Breathe in gently through your nose", scale: 1.35 },
      { name: "Hold", duration: 7, text: "Hold the stillness calmly", scale: 1.35 },
      { name: "Exhale", duration: 8, text: "Release with a slow, smooth sigh", scale: 0.9 },
    ],
  },
  box: {
    name: "Box Breathing (4-4-4-4)",
    desc: "Navy SEAL technique used to reset focus, ground racing panic, and restore balance.",
    phases: [
      { name: "Inhale", duration: 4, text: "Inhale deeply into your belly", scale: 1.3 },
      { name: "Hold", duration: 4, text: "Hold gently", scale: 1.3 },
      { name: "Exhale", duration: 4, text: "Exhale fully and smoothly", scale: 0.95 },
      { name: "Pause", duration: 4, text: "Rest in the calm space", scale: 0.95 },
    ],
  },
  calm: {
    name: "5-5 Coherent Heart Breathing",
    desc: "Balances heart rate variability and creates emotional calm.",
    phases: [
      { name: "Inhale", duration: 5, text: "Inhale with warmth and ease", scale: 1.3 },
      { name: "Exhale", duration: 5, text: "Exhale and let your shoulders drop", scale: 0.9 },
    ],
  },
};

export const BreathingTool: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const [selectedTech, setSelectedTech] = useState<BreathingTechnique>("4-7-8");
  const [isActive, setIsActive] = useState(false);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [secondsRemaining, setSecondsRemaining] = useState(4);
  const [cycleCount, setCycleCount] = useState(0);

  const currentConfig = TECHNIQUES[selectedTech];
  const currentPhase = currentConfig.phases[phaseIndex];

  useEffect(() => {
    // Reset phase when technique changes
    setIsActive(false);
    setPhaseIndex(0);
    setSecondsRemaining(currentConfig.phases[0].duration);
    setCycleCount(0);
  }, [selectedTech]);

  useEffect(() => {
    let timer: any = null;
    if (isActive) {
      timer = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            // Advance phase
            const nextIndex = (phaseIndex + 1) % currentConfig.phases.length;
            if (nextIndex === 0) {
              setCycleCount((c) => c + 1);
            }
            setPhaseIndex(nextIndex);
            return currentConfig.phases[nextIndex].duration;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isActive, phaseIndex, currentConfig]);

  const handleToggle = () => {
    setIsActive(!isActive);
  };

  const handleReset = () => {
    setIsActive(false);
    setPhaseIndex(0);
    setSecondsRemaining(currentConfig.phases[0].duration);
    setCycleCount(0);
  };

  return (
    <div
      id="breathing-tool-container"
      className="bg-white rounded-3xl border border-stone-200 p-6 md:p-8 shadow-sm space-y-6 max-w-xl mx-auto"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-teal-800 text-white flex items-center justify-center">
            <Wind className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-stone-900">
              Somatic Breathing Sanctuary
            </h3>
            <p className="text-xs text-stone-500">
              Regulate your nervous system with guided rhythmic breathing
            </p>
          </div>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-stone-400 hover:text-stone-700 px-2.5 py-1 rounded-lg border border-stone-200"
          >
            Close
          </button>
        )}
      </div>

      {/* Technique Selector Tabs */}
      <div className="grid grid-cols-3 gap-2 bg-stone-100 p-1.5 rounded-2xl">
        {(Object.keys(TECHNIQUES) as BreathingTechnique[]).map((tech) => (
          <button
            key={tech}
            type="button"
            onClick={() => setSelectedTech(tech)}
            className={`py-2 px-2 text-xs font-medium rounded-xl transition-all cursor-pointer truncate ${
              selectedTech === tech
                ? "bg-white text-stone-900 shadow-xs font-semibold"
                : "text-stone-500 hover:text-stone-800"
            }`}
          >
            {tech.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="text-center">
        <h4 className="text-sm font-semibold text-stone-900">{currentConfig.name}</h4>
        <p className="text-xs text-stone-500 mt-0.5">{currentConfig.desc}</p>
      </div>

      {/* Animated Breathing Orb */}
      <div className="flex flex-col items-center justify-center py-6">
        <div className="relative flex items-center justify-center w-56 h-56">
          {/* Outer Ring */}
          <div
            className={`absolute inset-0 rounded-full border-2 border-teal-200 transition-transform duration-1000 ${
              isActive ? "animate-pulse" : ""
            }`}
            style={{
              transform: `scale(${isActive ? currentPhase.scale * 1.05 : 1})`,
            }}
          />

          {/* Inner Solid Orb */}
          <div
            className="w-40 h-40 rounded-full bg-gradient-to-br from-teal-600 to-teal-800 text-white flex flex-col items-center justify-center shadow-lg transition-transform duration-1000 ease-in-out"
            style={{
              transform: `scale(${isActive ? currentPhase.scale : 1})`,
            }}
          >
            <span className="text-xs uppercase tracking-widest font-medium text-teal-100 mb-1">
              {currentPhase.name}
            </span>
            <span className="text-3xl font-bold font-serif">{secondsRemaining}s</span>
            <span className="text-[10px] text-teal-200 mt-1">Cycle {cycleCount + 1}</span>
          </div>
        </div>

        <p className="text-sm font-medium text-stone-700 mt-5 h-6 text-center">
          {currentPhase.text}
        </p>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center space-x-3 pt-2">
        <button
          id="toggle-breathing-btn"
          type="button"
          onClick={handleToggle}
          className="px-6 py-2.5 bg-teal-800 hover:bg-teal-900 text-white font-medium text-sm rounded-xl inline-flex items-center space-x-2 shadow-xs transition-colors cursor-pointer"
        >
          {isActive ? (
            <>
              <Pause className="w-4 h-4 fill-current" />
              <span>Pause Breath</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>Begin Exercise</span>
            </>
          )}
        </button>

        <button
          id="reset-breathing-btn"
          type="button"
          onClick={handleReset}
          className="p-2.5 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-100 transition-colors cursor-pointer"
          title="Reset timer"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      <div className="text-center text-xs text-stone-400">
        💡 Tip: Soften your jaw, let your stomach expand naturally, and exhale through parted lips.
      </div>
    </div>
  );
};
