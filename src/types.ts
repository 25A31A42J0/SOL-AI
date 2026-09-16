export type MoodCategory =
  | "sad"
  | "happy"
  | "depressed"
  | "anxiety"
  | "stress"
  | "insecurity"
  | "love_failure"
  | "lonely"
  | "overwhelmed"
  | "angry";

export interface MoodOption {
  id: MoodCategory;
  label: string;
  emoji: string;
  tagline: string;
  color: string; // Tailwind class name or hex for theme
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
}

export interface GuidedExercise {
  title: string;
  steps: string[];
}

export interface MentalHealthGuidance {
  validationMessage: string;
  perspectiveReframe: string;
  copingSteps: string[];
  motivationalAffirmation: string;
  guidedExerciseRecommendation: GuidedExercise;
  reflectiveQuestions: string[];
  timestamp: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  timestamp: string;
}

export interface ReflectionEntry {
  id: string;
  mood: MoodCategory;
  intensity: number;
  category: string;
  thoughts: string;
  guidance: MentalHealthGuidance;
  createdAt: string;
}
