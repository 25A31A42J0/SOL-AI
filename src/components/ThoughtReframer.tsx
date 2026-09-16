import React, { useState } from "react";
import { Sparkles, ArrowRight, RefreshCw, Compass, Check, Copy } from "lucide-react";

export const ThoughtReframer: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const [thought, setThought] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [reframes, setReframes] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleReframe = async () => {
    if (!thought.trim() || isLoading) return;
    setIsLoading(true);

    try {
      const res = await fetch("/api/reframe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ negativeThought: thought }),
      });
      const data = await res.json();
      setReframes(data.reframes || []);
    } catch (err) {
      setReframes([
        "This thought feels powerful right now, but emotions are not permanent facts.",
        "I can treat myself with patience and grace while I heal.",
        "One setback or painful ending does not define my future chapters.",
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const sampleThoughts = [
    "I'll never find love again after this breakup.",
    "Everyone else has their life figured out except me.",
    "If I fail at this, it proves I'm not good enough.",
  ];

  return (
    <div
      id="thought-reframer-container"
      className="bg-white rounded-3xl border border-stone-200 p-6 md:p-8 shadow-sm space-y-6 max-w-xl mx-auto"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-violet-800 text-white flex items-center justify-center">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-stone-900">
              Cognitive Thought Reframer
            </h3>
            <p className="text-xs text-stone-500">
              Unravel catastrophic or harsh self-criticism into balanced truths
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

      <div className="space-y-3">
        <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider">
          What harsh thought is your mind repeating?
        </label>
        <textarea
          rows={3}
          value={thought}
          onChange={(e) => setThought(e.target.value)}
          placeholder="e.g. 'I messed up everything with them and I am completely unlovable' or 'I am constantly falling behind everyone else'..."
          className="w-full bg-stone-50 rounded-xl border border-stone-300 p-3.5 text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-violet-700/20 focus:border-violet-700"
        />

        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-1.5 text-xs text-stone-500">
            <span className="font-medium text-stone-400">Try:</span>
            {sampleThoughts.map((st, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setThought(st)}
                className="bg-stone-100 hover:bg-stone-200 px-2 py-0.5 rounded text-[11px] text-stone-700 cursor-pointer"
              >
                "{st.slice(0, 30)}..."
              </button>
            ))}
          </div>

          <button
            id="reframe-action-btn"
            type="button"
            onClick={handleReframe}
            disabled={isLoading || !thought.trim()}
            className={`px-4 py-2 text-xs font-medium rounded-xl inline-flex items-center space-x-1.5 transition-colors cursor-pointer ${
              thought.trim() && !isLoading
                ? "bg-violet-800 hover:bg-violet-900 text-white shadow-xs"
                : "bg-stone-200 text-stone-400 cursor-not-allowed"
            }`}
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Reframing...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Transform Thought</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Reframed Results */}
      {reframes.length > 0 && (
        <div className="space-y-3 pt-2 border-t border-stone-100">
          <h4 className="text-xs uppercase tracking-wider font-semibold text-violet-900">
            Compassionate & Balanced Perspectives:
          </h4>
          <div className="space-y-2.5">
            {reframes.map((rf, idx) => (
              <div
                key={idx}
                className="bg-violet-50/70 border border-violet-100 rounded-xl p-3.5 text-sm text-stone-800 flex items-start justify-between gap-2"
              >
                <p className="leading-relaxed font-serif italic text-violet-950">
                  {rf}
                </p>
                <button
                  type="button"
                  onClick={() => handleCopy(rf, idx)}
                  className="p-1 text-violet-700 hover:text-violet-900 shrink-0 cursor-pointer"
                  title="Copy reframe"
                >
                  {copiedIndex === idx ? (
                    <Check className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
