import React, { useState } from "react";
import {
  Heart,
  Compass,
  CheckCircle2,
  Circle,
  Quote,
  Sparkles,
  Play,
  HelpCircle,
  Share2,
  Check,
  MessageCircle,
} from "lucide-react";
import { MentalHealthGuidance, MoodCategory } from "../types";
import { MOOD_OPTIONS } from "../data/moods";

interface GuidanceCardProps {
  guidance: MentalHealthGuidance;
  mood: MoodCategory;
  intensity: number;
  onOpenChat: () => void;
  onOpenExercise: (exerciseTitle: string) => void;
}

export const GuidanceCard: React.FC<GuidanceCardProps> = ({
  guidance,
  mood,
  intensity,
  onOpenChat,
  onOpenExercise,
}) => {
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});
  const [copiedAffirmation, setCopiedAffirmation] = useState(false);

  const moodMeta = MOOD_OPTIONS.find((m) => m.id === mood) || MOOD_OPTIONS[0];

  const toggleStep = (idx: number) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const handleCopyAffirmation = () => {
    if (guidance.motivationalAffirmation) {
      navigator.clipboard.writeText(guidance.motivationalAffirmation);
      setCopiedAffirmation(true);
      setTimeout(() => setCopiedAffirmation(false), 2200);
    }
  };

  return (
    <div
      id="guidance-card-root"
      className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden transition-all"
    >
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-900 to-stone-900 p-6 text-white relative">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">{moodMeta.emoji}</span>
            <span className="text-xs uppercase tracking-wider font-semibold text-teal-200">
              Personalized Well-Being Guidance
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/10 text-white border border-white/20">
              {moodMeta.label} • Intensity {intensity}/5
            </span>
          </div>

          <button
            id="chat-followup-top-btn"
            type="button"
            onClick={onOpenChat}
            className="inline-flex items-center space-x-1.5 bg-teal-700/80 hover:bg-teal-600 text-white text-xs px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer border border-teal-500/40"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Chat Deeper with Agent</span>
          </button>
        </div>

        <h3 className="text-xl md:text-2xl font-serif font-medium text-stone-50 leading-snug">
          Gentle Guidance for Your Mind & Heart
        </h3>
        <p className="text-xs text-stone-300 mt-1">
          Take your time reading. Healing and clarity unfold one breath at a time.
        </p>
      </div>

      <div className="p-6 md:p-8 space-y-8">
        {/* 1. Validation & Empathy */}
        <div className="bg-teal-50/60 rounded-2xl p-5 border border-teal-100 flex items-start space-x-4">
          <div className="w-9 h-9 rounded-xl bg-teal-700 text-white flex items-center justify-center shrink-0 mt-0.5">
            <Heart className="w-5 h-5 text-teal-100" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-semibold text-teal-950 uppercase tracking-wider text-[11px]">
              Empathetic Validation
            </h4>
            <p className="text-stone-800 text-sm md:text-base leading-relaxed">
              {guidance.validationMessage}
            </p>
          </div>
        </div>

        {/* 2. Psychological Perspective & Reframing */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-stone-900 font-semibold text-base">
            <Compass className="w-5 h-5 text-teal-700" />
            <h4>Compassionate Reframing & Problem Solving</h4>
          </div>
          <div className="bg-stone-50 rounded-2xl p-5 border border-stone-200 text-stone-700 text-sm md:text-base leading-relaxed">
            {guidance.perspectiveReframe}
          </div>
        </div>

        {/* 3. Personalized Coping Steps (Checklist) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-stone-900 font-semibold text-base">
              <CheckCircle2 className="w-5 h-5 text-teal-700" />
              <h4>Actionable Steps for Today</h4>
            </div>
            <span className="text-xs text-stone-500">Check off what feels right</span>
          </div>

          <div className="space-y-2.5">
            {guidance.copingSteps.map((step, idx) => {
              const isChecked = completedSteps[idx];
              return (
                <div
                  key={idx}
                  id={`coping-step-${idx}`}
                  onClick={() => toggleStep(idx)}
                  className={`flex items-start space-x-3.5 p-3.5 rounded-xl border transition-all cursor-pointer select-none ${
                    isChecked
                      ? "bg-stone-50/80 border-stone-200 text-stone-400"
                      : "bg-white border-stone-200 hover:border-teal-300 text-stone-800"
                  }`}
                >
                  <button
                    type="button"
                    className="mt-0.5 shrink-0 text-teal-700 focus:outline-none"
                    aria-label={isChecked ? "Mark incomplete" : "Mark complete"}
                  >
                    {isChecked ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <Circle className="w-5 h-5 text-stone-300 hover:text-teal-600" />
                    )}
                  </button>
                  <p
                    className={`text-sm leading-relaxed ${
                      isChecked ? "line-through text-stone-400" : "text-stone-800"
                    }`}
                  >
                    {step}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4. Motivational Affirmation */}
        <div className="relative bg-gradient-to-br from-amber-50 to-orange-50/60 rounded-2xl p-6 border border-amber-200/70 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-amber-950 font-semibold text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Personalized Motivation & Affirmation</span>
            </div>
            <button
              id="copy-affirmation-btn"
              type="button"
              onClick={handleCopyAffirmation}
              className="text-xs inline-flex items-center space-x-1 text-amber-800 hover:text-amber-950 font-medium cursor-pointer"
            >
              {copiedAffirmation ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Copied</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          <div className="flex items-start space-x-3">
            <Quote className="w-6 h-6 text-amber-400 shrink-0 mt-0.5 rotate-180" />
            <p className="text-base md:text-lg font-serif italic text-amber-950 leading-relaxed">
              "{guidance.motivationalAffirmation}"
            </p>
          </div>
        </div>

        {/* 5. Recommended Micro-Exercise */}
        {guidance.guidedExerciseRecommendation && (
          <div className="bg-stone-50 rounded-2xl p-5 border border-stone-200 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-xs uppercase tracking-wider font-semibold text-teal-800">
                  Recommended Somatic Micro-Tool
                </span>
                <h4 className="text-base font-semibold text-stone-900">
                  {guidance.guidedExerciseRecommendation.title}
                </h4>
              </div>
              <button
                id="launch-exercise-btn"
                type="button"
                onClick={() =>
                  onOpenExercise(guidance.guidedExerciseRecommendation.title)
                }
                className="inline-flex items-center justify-center space-x-2 px-4 py-2 bg-stone-900 hover:bg-black text-white text-xs font-medium rounded-xl transition-colors cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Open Exercise Mode</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-stone-700 pt-1">
              {guidance.guidedExerciseRecommendation.steps.map((st, i) => (
                <div
                  key={i}
                  className="bg-white p-2.5 rounded-lg border border-stone-200/80 flex items-start space-x-2"
                >
                  <span className="font-semibold text-teal-700 shrink-0">{i + 1}.</span>
                  <span>{st}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6. Reflective Questions */}
        {guidance.reflectiveQuestions && guidance.reflectiveQuestions.length > 0 && (
          <div className="space-y-2.5 pt-2 border-t border-stone-100">
            <div className="flex items-center space-x-2 text-stone-800 font-semibold text-sm">
              <HelpCircle className="w-4 h-4 text-teal-700" />
              <span>Questions to Gently Ponder</span>
            </div>
            <div className="space-y-2">
              {guidance.reflectiveQuestions.map((q, idx) => (
                <div
                  key={idx}
                  className="bg-stone-100/60 p-3 rounded-xl border border-stone-200/60 text-xs md:text-sm text-stone-700 italic"
                >
                  • {q}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom CTA to Chat */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left bg-stone-100/80 p-4 rounded-2xl border border-stone-200">
          <div>
            <h5 className="text-sm font-semibold text-stone-900">
              Want to talk this through further?
            </h5>
            <p className="text-xs text-stone-600">
              The AI companion is here to listen, problem-solve, and keep you company.
            </p>
          </div>
          <button
            id="chat-deeper-bottom-btn"
            type="button"
            onClick={onOpenChat}
            className="w-full sm:w-auto px-5 py-2.5 bg-teal-800 hover:bg-teal-900 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer inline-flex items-center justify-center space-x-2"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Continue Conversation</span>
          </button>
        </div>
      </div>
    </div>
  );
};
