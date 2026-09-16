import React from "react";
import { Sparkles, ArrowRight, CornerDownLeft, RefreshCw } from "lucide-react";
import { QUICK_PROMPT_SUGGESTIONS } from "../data/moods";
import { MoodCategory } from "../types";

interface FeelingInputBarProps {
  thoughts: string;
  onChangeThoughts: (val: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  selectedMood: MoodCategory;
}

export const FeelingInputBar: React.FC<FeelingInputBarProps> = ({
  thoughts,
  onChangeThoughts,
  onSubmit,
  isLoading,
  selectedMood,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // If Enter without Shift, submit
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      if (!isLoading && (thoughts.trim().length > 0 || selectedMood)) {
        onSubmit();
      }
    }
  };

  const handleApplySuggestion = (text: string) => {
    onChangeThoughts(text);
  };

  return (
    <div id="feeling-input-bar-container" className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-stone-900 tracking-tight">
            4. Share what you are facing (Type bar)
          </h2>
          <p className="text-sm text-stone-500">
            Express whatever is on your mind freely. You are in a private, judgment-free space.
          </p>
        </div>
        {thoughts.length > 0 && (
          <button
            id="clear-thoughts-btn"
            type="button"
            onClick={() => onChangeThoughts("")}
            className="text-xs text-stone-400 hover:text-stone-600 transition-colors"
          >
            Clear text
          </button>
        )}
      </div>

      {/* Main Type Bar Card */}
      <div className="relative bg-white rounded-2xl border border-stone-300 shadow-xs focus-within:border-teal-700 focus-within:ring-2 focus-within:ring-teal-700/20 transition-all p-3.5">
        <textarea
          id="feeling-textarea-bar"
          rows={4}
          value={thoughts}
          onChange={(e) => onChangeThoughts(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type whatever you are going through... (e.g. 'I've been feeling deeply heartbroken after a breakup', 'I feel overwhelmed with pressure and afraid of failing', or 'I can't shake this feeling of insecurity today...')"
          className="w-full resize-none border-0 bg-transparent text-stone-800 placeholder-stone-400 text-sm md:text-base leading-relaxed focus:outline-none"
        />

        <div className="pt-2 border-t border-stone-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2 text-xs text-stone-400">
            <span>{thoughts.length} characters</span>
            <span>•</span>
            <span className="hidden sm:inline">Press Ctrl+Enter to send</span>
          </div>

          <button
            id="submit-feeling-button"
            type="button"
            onClick={onSubmit}
            disabled={isLoading}
            className={`inline-flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 cursor-pointer ${
              isLoading
                ? "bg-teal-700/60 text-white cursor-not-allowed"
                : "bg-teal-800 hover:bg-teal-900 text-white shadow-xs hover:shadow-sm"
            }`}
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Generating Personalized Guidance...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-teal-200" />
                <span>Receive AI Support & Suggestions</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Quick Prompts Suggestions */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs">
        <span className="text-stone-400 shrink-0 font-medium">Examples:</span>
        {QUICK_PROMPT_SUGGESTIONS.map((s, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleApplySuggestion(s.text)}
            className="shrink-0 bg-stone-100 hover:bg-stone-200 text-stone-700 px-2.5 py-1 rounded-lg border border-stone-200 transition-colors cursor-pointer"
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
};
