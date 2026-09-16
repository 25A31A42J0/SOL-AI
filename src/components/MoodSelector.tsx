import React from "react";
import { MOOD_OPTIONS, CONTEXT_CATEGORIES } from "../data/moods";
import { MoodCategory } from "../types";

interface MoodSelectorProps {
  selectedMood: MoodCategory;
  onSelectMood: (mood: MoodCategory) => void;
  intensity: number;
  onChangeIntensity: (val: number) => void;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
}

const INTENSITY_LABELS: Record<number, { label: string; desc: string }> = {
  1: { label: "Mild", desc: "A quiet background feeling" },
  2: { label: "Noticeable", desc: "Present, but manageable" },
  3: { label: "Moderate", desc: "Clearly affecting your day" },
  4: { label: "Intense", desc: "Heavy and difficult to hold" },
  5: { label: "Overwhelming", desc: "Consuming and deeply challenging" },
};

export const MoodSelector: React.FC<MoodSelectorProps> = ({
  selectedMood,
  onSelectMood,
  intensity,
  onChangeIntensity,
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <div id="mood-selector-container" className="space-y-6">
      {/* 1. Mood Grid Selection */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-base font-semibold text-stone-900 tracking-tight">
              1. What emotion or feeling are you experiencing?
            </h2>
            <p className="text-sm text-stone-500">
              Select the primary mood closest to your heart right now.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {MOOD_OPTIONS.map((mood) => {
            const isSelected = selectedMood === mood.id;
            return (
              <button
                key={mood.id}
                id={`mood-btn-${mood.id}`}
                type="button"
                onClick={() => onSelectMood(mood.id)}
                className={`group relative text-left p-3 rounded-xl border transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? "bg-teal-50/80 border-teal-600 shadow-xs ring-1 ring-teal-600"
                    : "bg-white hover:bg-stone-50 border-stone-200 text-stone-700"
                }`}
              >
                <div className="flex items-center space-x-2 mb-1.5">
                  <span className="text-2xl select-none" role="img" aria-label={mood.label}>
                    {mood.emoji}
                  </span>
                  <span
                    className={`text-sm font-semibold leading-tight line-clamp-1 ${
                      isSelected ? "text-teal-900 font-bold" : "text-stone-800"
                    }`}
                  >
                    {mood.label}
                  </span>
                </div>
                <p className="text-xs text-stone-500 leading-snug line-clamp-2">
                  {mood.tagline}
                </p>
                {isSelected && (
                  <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-teal-600" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Intensity Slider */}
      <div className="bg-stone-100/70 p-4 rounded-xl border border-stone-200/80">
        <div className="flex items-center justify-between mb-2">
          <label
            htmlFor="intensity-slider"
            className="text-sm font-medium text-stone-800"
          >
            2. Intensity Level:{" "}
            <span className="font-semibold text-teal-800">
              {intensity} / 5 — {INTENSITY_LABELS[intensity]?.label}
            </span>
          </label>
          <span className="text-xs text-stone-500 italic">
            {INTENSITY_LABELS[intensity]?.desc}
          </span>
        </div>

        <div className="flex items-center space-x-4">
          <span className="text-xs font-medium text-stone-400">Gentle</span>
          <input
            id="intensity-slider"
            type="range"
            min={1}
            max={5}
            step={1}
            value={intensity}
            onChange={(e) => onChangeIntensity(Number(e.target.value))}
            className="w-full h-2 bg-stone-300 rounded-lg appearance-none cursor-pointer accent-teal-700 focus:outline-none"
          />
          <span className="text-xs font-medium text-stone-400">Stormy</span>
        </div>

        <div className="flex justify-between text-[11px] text-stone-400 mt-1.5 px-0.5">
          <span>1 • Low</span>
          <span>2 • Mild</span>
          <span>3 • Moderate</span>
          <span>4 • Strong</span>
          <span>5 • Peak</span>
        </div>
      </div>

      {/* 3. Context Category Chips */}
      <div>
        <label className="block text-sm font-medium text-stone-800 mb-2">
          3. Life context (optional)
        </label>
        <div className="flex flex-wrap gap-2">
          {CONTEXT_CATEGORIES.map((category) => {
            const isSelected = selectedCategory === category;
            return (
              <button
                key={category}
                id={`cat-chip-${category.toLowerCase().replace(/[^a-z0-9]/g, "-")}`}
                type="button"
                onClick={() => onSelectCategory(isSelected ? "" : category)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-colors cursor-pointer ${
                  isSelected
                    ? "bg-teal-800 text-white border-teal-800 font-medium"
                    : "bg-white text-stone-600 border-stone-200 hover:bg-stone-100"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
