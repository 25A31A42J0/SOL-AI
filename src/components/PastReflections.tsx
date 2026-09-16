import React from "react";
import { History, Calendar, Trash2, ArrowUpRight, BookOpen } from "lucide-react";
import { ReflectionEntry } from "../types";
import { MOOD_OPTIONS } from "../data/moods";

interface PastReflectionsProps {
  entries: ReflectionEntry[];
  onSelectEntry: (entry: ReflectionEntry) => void;
  onDeleteEntry: (id: string) => void;
  onClearAll: () => void;
}

export const PastReflections: React.FC<PastReflectionsProps> = ({
  entries,
  onSelectEntry,
  onDeleteEntry,
  onClearAll,
}) => {
  if (entries.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-stone-200 p-8 text-center space-y-3">
        <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
          <BookOpen className="w-6 h-6" />
        </div>
        <h4 className="text-base font-medium text-stone-800">No past check-ins yet</h4>
        <p className="text-xs text-stone-500 max-w-sm mx-auto">
          Every time you share your feelings and receive personalized guidance, your reflections will be stored here privately on your device.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-stone-200 p-6 md:p-8 shadow-sm space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <History className="w-5 h-5 text-teal-700" />
          <h3 className="text-base font-semibold text-stone-900">
            Past Reflections & Emotional Journey ({entries.length})
          </h3>
        </div>
        <button
          type="button"
          onClick={onClearAll}
          className="text-xs text-stone-400 hover:text-rose-600 transition-colors"
        >
          Clear history
        </button>
      </div>

      <div className="divide-y divide-stone-100">
        {entries.map((entry) => {
          const moodInfo =
            MOOD_OPTIONS.find((m) => m.id === entry.mood) || MOOD_OPTIONS[0];
          const dateStr = new Date(entry.createdAt).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          });

          return (
            <div
              key={entry.id}
              className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 group"
            >
              <div
                className="flex-1 cursor-pointer"
                onClick={() => onSelectEntry(entry)}
              >
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-lg">{moodInfo.emoji}</span>
                  <span className="text-sm font-semibold text-stone-800">
                    {moodInfo.label}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 font-medium">
                    Intensity {entry.intensity}/5
                  </span>
                  {entry.category && (
                    <span className="text-xs text-stone-400">• {entry.category}</span>
                  )}
                  <span className="text-xs text-stone-400">• {dateStr}</span>
                </div>

                <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                  {entry.thoughts || entry.guidance?.validationMessage}
                </p>
              </div>

              <div className="flex items-center space-x-2 self-end sm:self-center">
                <button
                  type="button"
                  onClick={() => onSelectEntry(entry)}
                  className="inline-flex items-center space-x-1 text-xs px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg transition-colors cursor-pointer"
                >
                  <span>View Guidance</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => onDeleteEntry(entry.id)}
                  className="p-1.5 text-stone-300 hover:text-rose-500 rounded-lg transition-colors cursor-pointer"
                  title="Delete entry"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
