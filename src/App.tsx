import React, { useState, useEffect } from "react";
import {
  Heart,
  MessageCircle,
  Wind,
  Sparkles,
  Compass,
  History,
  ShieldAlert,
  ArrowRight,
  Smile,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { MoodCategory, MentalHealthGuidance, ReflectionEntry } from "./types";
import { MoodSelector } from "./components/MoodSelector";
import { FeelingInputBar } from "./components/FeelingInputBar";
import { GuidanceCard } from "./components/GuidanceCard";
import { AgentChat } from "./components/AgentChat";
import { BreathingTool } from "./components/BreathingTool";
import { GroundingTool } from "./components/GroundingTool";
import { ThoughtReframer } from "./components/ThoughtReframer";
import { PastReflections } from "./components/PastReflections";
import { CrisisBanner } from "./components/CrisisBanner";
import { MOOD_OPTIONS } from "./data/moods";

type ActiveTab = "checkin" | "chat" | "breathing" | "grounding" | "reframer" | "history";

const STORAGE_KEY = "serenemind_reflections_v1";

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("checkin");
  const [selectedMood, setSelectedMood] = useState<MoodCategory>("anxiety");
  const [intensity, setIntensity] = useState<number>(3);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [thoughts, setThoughts] = useState<string>("");

  const [isLoadingGuidance, setIsLoadingGuidance] = useState<boolean>(false);
  const [guidanceResult, setGuidanceResult] = useState<MentalHealthGuidance | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [entries, setEntries] = useState<ReflectionEntry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch (e) {
      console.error("Failed to save reflections to localStorage", e);
    }
  }, [entries]);

  const handleSubmitFeelings = async () => {
    setIsLoadingGuidance(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mood: selectedMood,
          intensity,
          contextCategory: selectedCategory || "General",
          thoughts: thoughts.trim(),
        }),
      });

      const responseData = await res.json();
      if (responseData.success && responseData.data) {
        const guidance: MentalHealthGuidance = responseData.data;
        setGuidanceResult(guidance);

        // Save to journal history
        const newEntry: ReflectionEntry = {
          id: `entry-${Date.now()}`,
          mood: selectedMood,
          intensity,
          category: selectedCategory,
          thoughts: thoughts.trim(),
          guidance,
          createdAt: new Date().toISOString(),
        };

        setEntries((prev) => [newEntry, ...prev.slice(0, 49)]);

        // Smooth scroll to guidance card
        setTimeout(() => {
          document
            .getElementById("guidance-card-root")
            ?.scrollIntoView({ behavior: "smooth" });
        }, 150);
      } else {
        throw new Error("Unable to retrieve guidance at this time.");
      }
    } catch (err: any) {
      console.error("Submission error:", err);
      setErrorMessage(
        "We encountered a brief glitch while preparing your guidance, but please take comfort: your feelings matter and you are not alone."
      );
    } finally {
      setIsLoadingGuidance(false);
    }
  };

  const handleSelectPastEntry = (entry: ReflectionEntry) => {
    setSelectedMood(entry.mood);
    setIntensity(entry.intensity);
    setSelectedCategory(entry.category || "");
    setThoughts(entry.thoughts || "");
    setGuidanceResult(entry.guidance);
    setActiveTab("checkin");

    setTimeout(() => {
      document
        .getElementById("guidance-card-root")
        ?.scrollIntoView({ behavior: "smooth" });
    }, 150);
  };

  const handleDeleteEntry = (id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  const handleClearAllHistory = () => {
    if (window.confirm("Are you sure you want to clear your reflection history?")) {
      setEntries([]);
    }
  };

  const handleOpenExercise = (exerciseTitle: string) => {
    const titleLower = (exerciseTitle || "").toLowerCase();
    if (titleLower.includes("ground") || titleLower.includes("5-4-3-2-1")) {
      setActiveTab("grounding");
    } else if (
      titleLower.includes("breath") ||
      titleLower.includes("4-7-8") ||
      titleLower.includes("box")
    ) {
      setActiveTab("breathing");
    } else {
      setActiveTab("breathing");
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col font-sans selection:bg-teal-100">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-2xs">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <div
            className="flex items-center space-x-2.5 cursor-pointer"
            onClick={() => setActiveTab("checkin")}
          >
            <div className="w-9 h-9 rounded-xl bg-teal-800 text-teal-50 flex items-center justify-center shadow-xs">
              <Heart className="w-5 h-5 fill-teal-100/30" />
            </div>
            <div>
              <h1 className="text-base font-bold text-stone-900 leading-tight tracking-tight">
                SOL AI
              </h1>
              <p className="text-[11px] text-stone-500 font-medium">
                Emotional Well-Being Companion
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-1 text-xs">
            <button
              id="nav-tab-checkin"
              type="button"
              onClick={() => setActiveTab("checkin")}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                activeTab === "checkin"
                  ? "bg-teal-800 text-white"
                  : "text-stone-600 hover:bg-stone-100"
              }`}
            >
              Share Feelings
            </button>
            <button
              id="nav-tab-chat"
              type="button"
              onClick={() => setActiveTab("chat")}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer flex items-center space-x-1.5 ${
                activeTab === "chat"
                  ? "bg-teal-800 text-white"
                  : "text-stone-600 hover:bg-stone-100"
              }`}
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>AI Chat</span>
            </button>
            <button
              id="nav-tab-breathing"
              type="button"
              onClick={() => setActiveTab("breathing")}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer flex items-center space-x-1.5 ${
                activeTab === "breathing"
                  ? "bg-teal-800 text-white"
                  : "text-stone-600 hover:bg-stone-100"
              }`}
            >
              <Wind className="w-3.5 h-3.5" />
              <span>Breathing</span>
            </button>
            <button
              id="nav-tab-grounding"
              type="button"
              onClick={() => setActiveTab("grounding")}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer flex items-center space-x-1.5 ${
                activeTab === "grounding"
                  ? "bg-teal-800 text-white"
                  : "text-stone-600 hover:bg-stone-100"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>5-4-3-2-1</span>
            </button>
            <button
              id="nav-tab-reframer"
              type="button"
              onClick={() => setActiveTab("reframer")}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer flex items-center space-x-1.5 ${
                activeTab === "reframer"
                  ? "bg-teal-800 text-white"
                  : "text-stone-600 hover:bg-stone-100"
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Reframe Thoughts</span>
            </button>
            <button
              id="nav-tab-history"
              type="button"
              onClick={() => setActiveTab("history")}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer flex items-center space-x-1.5 ${
                activeTab === "history"
                  ? "bg-teal-800 text-white"
                  : "text-stone-600 hover:bg-stone-100"
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>Journal ({entries.length})</span>
            </button>
          </nav>

          <div className="flex items-center space-x-2">
            <span className="hidden sm:inline text-xs text-teal-800 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200/60 font-medium">
              Private & Safe Space
            </span>
          </div>
        </div>

        {/* Mobile Navigation Scrollbar */}
        <div className="md:hidden flex items-center space-x-1 px-4 py-2 border-t border-stone-100 overflow-x-auto text-xs">
          <button
            type="button"
            onClick={() => setActiveTab("checkin")}
            className={`shrink-0 px-3 py-1.5 rounded-lg font-medium ${
              activeTab === "checkin"
                ? "bg-teal-800 text-white"
                : "bg-stone-100 text-stone-700"
            }`}
          >
            Share Feelings
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("chat")}
            className={`shrink-0 px-3 py-1.5 rounded-lg font-medium ${
              activeTab === "chat"
                ? "bg-teal-800 text-white"
                : "bg-stone-100 text-stone-700"
            }`}
          >
            AI Chat
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("breathing")}
            className={`shrink-0 px-3 py-1.5 rounded-lg font-medium ${
              activeTab === "breathing"
                ? "bg-teal-800 text-white"
                : "bg-stone-100 text-stone-700"
            }`}
          >
            Breathing
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("grounding")}
            className={`shrink-0 px-3 py-1.5 rounded-lg font-medium ${
              activeTab === "grounding"
                ? "bg-teal-800 text-white"
                : "bg-stone-100 text-stone-700"
            }`}
          >
            5-4-3-2-1
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("reframer")}
            className={`shrink-0 px-3 py-1.5 rounded-lg font-medium ${
              activeTab === "reframer"
                ? "bg-teal-800 text-white"
                : "bg-stone-100 text-stone-700"
            }`}
          >
            Reframe Thoughts
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("history")}
            className={`shrink-0 px-3 py-1.5 rounded-lg font-medium ${
              activeTab === "history"
                ? "bg-teal-800 text-white"
                : "bg-stone-100 text-stone-700"
            }`}
          >
            Journal ({entries.length})
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 md:py-8 space-y-8">
        {/* Error Alert if any */}
        {errorMessage && (
          <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-2xl flex items-start space-x-3 text-sm">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p>{errorMessage}</p>
            </div>
            <button
              type="button"
              onClick={() => setErrorMessage(null)}
              className="text-xs text-rose-600 underline font-medium"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Tab 1: Checkin / Share Feelings */}
        {activeTab === "checkin" && (
          <div className="space-y-8">
            {/* Header intro */}
            <div className="bg-gradient-to-br from-stone-100/90 to-stone-50 p-6 md:p-8 rounded-3xl border border-stone-200/80">
              <div className="max-w-2xl space-y-2">
                <span className="text-xs uppercase tracking-wider font-semibold text-teal-800">
                  Mindful Check-in
                </span>
                <h2 className="text-2xl md:text-3xl font-serif font-medium text-stone-900">
                  How is your soul doing today?
                </h2>
                <p className="text-sm text-stone-600 leading-relaxed">
                  Select your current emotional state, specify its intensity, and type whatever problem or feeling you are experiencing. Our empathetic AI companion will deconstruct the struggle, offer psychological reframing, and provide customized steps to motivate and restore your well-being.
                </p>
              </div>
            </div>

            {/* Step 1 to 3: Mood Selector */}
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-stone-200 shadow-xs">
              <MoodSelector
                selectedMood={selectedMood}
                onSelectMood={setSelectedMood}
                intensity={intensity}
                onChangeIntensity={setIntensity}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
              />
            </div>

            {/* Step 4: The Type Bar */}
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-stone-200 shadow-xs">
              <FeelingInputBar
                thoughts={thoughts}
                onChangeThoughts={setThoughts}
                onSubmit={handleSubmitFeelings}
                isLoading={isLoadingGuidance}
                selectedMood={selectedMood}
              />
            </div>

            {/* Guidance Result Presentation */}
            {guidanceResult && (
              <div className="pt-2">
                <GuidanceCard
                  guidance={guidanceResult}
                  mood={selectedMood}
                  intensity={intensity}
                  onOpenChat={() => setActiveTab("chat")}
                  onOpenExercise={handleOpenExercise}
                />
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Conversational Chat */}
        {activeTab === "chat" && (
          <div className="space-y-4 max-w-3xl mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-serif font-semibold text-stone-900">
                  Empathetic AI Companion
                </h2>
                <p className="text-xs text-stone-500">
                  A safe, ongoing conversation to reflect, unburden your heart, and find solutions
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab("checkin")}
                className="text-xs px-3 py-1.5 border border-stone-200 rounded-lg text-stone-600 hover:bg-stone-100"
              >
                Return to Check-in
              </button>
            </div>
            <AgentChat
              currentMood={selectedMood}
              initialContext={thoughts}
              onClose={() => setActiveTab("checkin")}
            />
          </div>
        )}

        {/* Tab 3: Somatic Breathing */}
        {activeTab === "breathing" && (
          <div className="space-y-4">
            <BreathingTool onClose={() => setActiveTab("checkin")} />
          </div>
        )}

        {/* Tab 4: 5-4-3-2-1 Sensory Grounding */}
        {activeTab === "grounding" && (
          <div className="space-y-4">
            <GroundingTool onClose={() => setActiveTab("checkin")} />
          </div>
        )}

        {/* Tab 5: Cognitive Thought Reframer */}
        {activeTab === "reframer" && (
          <div className="space-y-4">
            <ThoughtReframer onClose={() => setActiveTab("checkin")} />
          </div>
        )}

        {/* Tab 6: Journal & History */}
        {activeTab === "history" && (
          <div className="space-y-4">
            <PastReflections
              entries={entries}
              onSelectEntry={handleSelectPastEntry}
              onDeleteEntry={handleDeleteEntry}
              onClearAll={handleClearAllHistory}
            />
          </div>
        )}

        {/* Quiet Crisis Support Banner */}
        <div className="pt-4 border-t border-stone-200/60">
          <CrisisBanner />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-stone-200 py-6 text-center text-xs text-stone-400 mt-12">
        <div className="max-w-5xl mx-auto px-4 space-y-1">
          <p>SOL AI • Emotional Support & Mental Well-being Companion</p>
          <p className="text-[11px] text-stone-400">
            For personal reflection, emotional processing, and coping guidance. All entries are stored locally on your device.
          </p>
        </div>
      </footer>
    </div>
  );
}
