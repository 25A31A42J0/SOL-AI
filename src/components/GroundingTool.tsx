import React, { useState } from "react";
import { Eye, Hand, Volume2, Sparkles, Heart, CheckCircle2, RotateCcw } from "lucide-react";

interface Step {
  stepNumber: number;
  count: number;
  sense: string;
  instruction: string;
  icon: any;
  placeholder: string;
}

const GROUNDING_STEPS: Step[] = [
  {
    stepNumber: 1,
    count: 5,
    sense: "See",
    instruction: "Acknowledge 5 things you can see around you right now.",
    icon: Eye,
    placeholder: "e.g. A plant, blue sky through window, coffee mug, wooden desk, my shoes",
  },
  {
    stepNumber: 2,
    count: 4,
    sense: "Feel / Touch",
    instruction: "Acknowledge 4 things you can physically touch or feel.",
    icon: Hand,
    placeholder: "e.g. The cool fabric of my shirt, firm floor under feet, smooth phone screen, back of chair",
  },
  {
    stepNumber: 3,
    count: 3,
    sense: "Hear",
    instruction: "Acknowledge 3 distinct sounds you can hear in your environment.",
    icon: Volume2,
    placeholder: "e.g. Distant traffic, hum of air conditioning, birds chirping outside",
  },
  {
    stepNumber: 4,
    count: 2,
    sense: "Smell",
    instruction: "Acknowledge 2 things you can smell (or memories of comforting scents).",
    icon: Sparkles,
    placeholder: "e.g. Fresh laundry, coffee aroma, cool breeze",
  },
  {
    stepNumber: 5,
    count: 1,
    sense: "Affirm & Breathe",
    instruction: "Acknowledge 1 comforting truth or positive affirmation about yourself.",
    icon: Heart,
    placeholder: "e.g. 'I am safe in this room right now', 'I am doing the best I can today'",
  },
];

export const GroundingTool: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [notes, setNotes] = useState<Record<number, string>>({});
  const [isCompleted, setIsCompleted] = useState(false);

  const step = GROUNDING_STEPS[currentStepIndex];
  const StepIcon = step.icon;

  const handleNext = () => {
    if (currentStepIndex < GROUNDING_STEPS.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleReset = () => {
    setCurrentStepIndex(0);
    setNotes({});
    setIsCompleted(false);
  };

  return (
    <div
      id="grounding-tool-container"
      className="bg-white rounded-3xl border border-stone-200 p-6 md:p-8 shadow-sm space-y-6 max-w-xl mx-auto"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-700 text-white flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-stone-900">
              5-4-3-2-1 Sensory Grounding
            </h3>
            <p className="text-xs text-stone-500">
              Anchor your mind in the present physical reality when feelings overwhelm you
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

      {!isCompleted ? (
        <div className="space-y-6">
          {/* Progress tracker */}
          <div className="flex items-center justify-between space-x-1.5">
            {GROUNDING_STEPS.map((s, idx) => {
              const isPassed = idx < currentStepIndex;
              const isCurrent = idx === currentStepIndex;
              return (
                <div
                  key={idx}
                  className={`flex-1 h-2 rounded-full transition-all ${
                    isPassed
                      ? "bg-teal-700"
                      : isCurrent
                      ? "bg-amber-600"
                      : "bg-stone-200"
                  }`}
                />
              );
            })}
          </div>

          {/* Current Step Card */}
          <div className="bg-stone-50 rounded-2xl p-6 border border-stone-200 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center">
                <StepIcon className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs uppercase tracking-wider font-semibold text-amber-800">
                  Step {step.stepNumber} of 5
                </span>
                <h4 className="text-lg font-serif font-semibold text-stone-900">
                  {step.count} Things You Can {step.sense}
                </h4>
              </div>
            </div>

            <p className="text-sm text-stone-700 leading-relaxed">
              {step.instruction}
            </p>

            <textarea
              rows={3}
              value={notes[step.stepNumber] || ""}
              onChange={(e) =>
                setNotes({ ...notes, [step.stepNumber]: e.target.value })
              }
              placeholder={step.placeholder}
              className="w-full bg-white rounded-xl border border-stone-300 p-3 text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentStepIndex === 0}
              className="text-xs px-4 py-2 border border-stone-200 rounded-xl text-stone-600 hover:bg-stone-100 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
            >
              Previous
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="text-xs px-5 py-2.5 bg-teal-800 hover:bg-teal-900 text-white font-medium rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              {currentStepIndex === GROUNDING_STEPS.length - 1
                ? "Complete Grounding"
                : "Next Sense"}
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-6 space-y-4">
          <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h4 className="text-xl font-serif font-semibold text-stone-900">
            Grounding Complete
          </h4>
          <p className="text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
            Take a deep breath and feel your feet connected to the ground. You have returned your mind to the safety of the present moment.
          </p>

          <div className="pt-2">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center space-x-2 text-xs px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 font-medium rounded-xl border border-stone-200 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Practice Again</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
