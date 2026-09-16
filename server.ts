import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialize Gemini AI client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.startsWith("MY_") || apiKey.trim() === "") {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

function withTimeout<T>(promise: Promise<T>, ms = 9000): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error("AI response timeout")), ms)
    ),
  ]);
}

async function callGeminiWithFallback(params: any): Promise<any> {
  const ai = getGeminiClient();
  if (!ai) throw new Error("No Gemini client available");
  try {
    return await withTimeout(
      ai.models.generateContent({
        ...params,
        model: "gemini-3.8-flash",
      }),
      6000
    );
  } catch (err: any) {
    console.warn("gemini-3.8-flash unavailable, trying gemini-3.1-flash-lite:", err?.message);
    return await withTimeout(
      ai.models.generateContent({
        ...params,
        model: "gemini-3.1-flash-lite",
      }),
      6000
    );
  }
}

// Fallback intelligent response generator if API key is not present or API call fails
function generateFallbackSupport(mood: string, thoughts: string, intensity: number = 3) {
  const moodClean = (mood || "general").toLowerCase();

  const moodResponses: Record<string, { validation: string; reframing: string; steps: string[]; motivation: string; exercise: string; exerciseGuide: string[] }> = {
    sad: {
      validation: "I hear how heavy things feel right now. Sadness can feel exhausting and quiet, and it takes genuine courage to give yourself permission to acknowledge it.",
      reframing: "Sadness is not a failure or a permanent state—it is your heart's natural way of honoring something that matters deeply to you. You don't have to force yourself to 'fix' it this very second.",
      steps: [
        "Wrap yourself in a comfortable blanket or hold a warm cup of tea/water to bring comfort to your body.",
        "Allow tears or silence without judging yourself—release is a healing mechanism.",
        "Take a slow 5-minute walk outside or look out a window to connect with the open sky.",
        "Reach out to one trusted person or write down 3 unfiltered sentences in a private journal."
      ],
      motivation: "Be as gentle with yourself as you would be with a dear friend going through this. The sky may be overcast right now, but the sun hasn't disappeared.",
      exercise: "Gentle Heart-Hand Comfort",
      exerciseGuide: [
        "Place one hand over your heart and the other over your stomach.",
        "Inhale gently through your nose for 4 counts, feeling the warmth of your hands.",
        "Exhale slowly through your mouth for 6 counts.",
        "Whisper softly: 'I am safe in this moment. I can take this one breath at a time.'"
      ]
    },
    depressed: {
      validation: "Thank you for trusting this space. Depression often makes everything feel shrouded in fog, draining your energy and whispering that things won't change. Your pain is valid, and you are not alone.",
      reframing: "Depression distorts our view like tinted glasses—it tells you that you are helpless, but the depression is a condition, not your identity. Small micro-actions, even tiny ones, build ripples toward light.",
      steps: [
        "Break the day down into the next 15 minutes only—do not worry about tomorrow or next week.",
        "Complete one micro-task: drink half a glass of cool water or wash your face with warm water.",
        "Step near natural sunlight for 3 minutes to help reset your circadian nervous system.",
        "Recognize that simply existing through today is an accomplishment worthy of respect."
      ],
      motivation: "You have survived every single difficult day so far. Even when the flame feels small, your spark is still inside you.",
      exercise: "5-4-3-2-1 Sensory Grounding",
      exerciseGuide: [
        "Name 5 things you can see around you right now.",
        "Touch 4 different textures (your clothing, a table, a blanket, your skin).",
        "Listen for 3 distinct sounds in the room or outside.",
        "Notice 2 things you can smell or physically sense.",
        "Acknowledge 1 comforting thought or truth: 'I am taking care of myself right now.'"
      ]
    },
    anxiety: {
      validation: "I can feel the tension and racing thoughts you are carrying. Anxiety can make your chest tight and your mind race into the future, which is deeply exhausting.",
      reframing: "Anxiety is your nervous system trying to protect you, even if the alarm is going off for something that isn't an immediate physical danger. You do not have to believe every thought your anxious mind produces.",
      steps: [
        "Drop your shoulders away from your ears and unclench your jaw right now.",
        "Lengthen your exhale—when exhaling is longer than inhaling, your parasympathetic brake activates.",
        "Write down your worry on paper, then draw a box around what is actually in your control today.",
        "Step away from screens and news for 20 minutes to reduce sensory overstimulation."
      ],
      motivation: "You are not your anxious thoughts. You are the calm, grounded awareness watching those thoughts pass like weather clouds.",
      exercise: "4-7-8 Relaxing Breath",
      exerciseGuide: [
        "Empty your lungs completely with a gentle whoosh.",
        "Inhale quietly through your nose for 4 seconds.",
        "Hold your breath gently for 7 seconds without straining.",
        "Exhale smoothly through your mouth for 8 seconds. Repeat 4 cycles."
      ]
    },
    stress: {
      validation: "It sounds like your plate has been overflowing and you have been carrying more weight than anyone should carry alone.",
      reframing: "Stress happens when demands exceed our perceived resources. It's a signal to pause and renegotiate boundaries, not evidence that you are failing.",
      steps: [
        "Identify the top 3 obligations pressing on you, and intentionally postpone or delegate at least one.",
        "Stand up, stretch your arms overhead, and take three full diaphragmatic breaths.",
        "Set a firm boundary this evening: no work or stressful discussions after a chosen hour.",
        "Give yourself permission to do 'good enough' rather than striving for perfection."
      ],
      motivation: "Rest is not a reward you earn after finishing everything; rest is a biological requirement to live well.",
      exercise: "Progressive Muscle Release",
      exerciseGuide: [
        "Tense your shoulders tightly up to your ears for 5 seconds.",
        "Release them completely with a heavy sigh. Notice the sensation of relief.",
        "Tense your hands into tight fists for 5 seconds, then let your fingers open gently.",
        "Notice how your body feels when you consciously let go of holding on."
      ]
    },
    insecurity: {
      validation: "Feelings of insecurity and self-doubt can cut so deeply, making you question your worth or compare yourself to others. It is completely human to feel vulnerable.",
      reframing: "Insecurity often stems from the habit of comparing your behind-the-scenes reality with everyone else's highlight reels. Your worth is inherent—it cannot be increased by applause or diminished by criticism.",
      steps: [
        "Catch the inner critic: notice if you're speaking to yourself more harshly than you would ever speak to someone you love.",
        "Write down 3 qualities about yourself that have nothing to do with external achievements or appearance.",
        "Mute or take a temporary break from social media accounts that trigger comparison.",
        "Recall a moment where you overcame an obstacle that you once thought was impossible."
      ],
      motivation: "You do not need to be flawless to be worthy of love, belonging, and peace. You are enough as you are.",
      exercise: "Self-Compassion Pause",
      exerciseGuide: [
        "Place your hand gently over your chest.",
        "Say to yourself: 'This is a moment of suffering or doubt.'",
        "Acknowledge: 'Struggle and self-doubt are part of the shared human experience.'",
        "Offer yourself kindness: 'May I be kind to myself in this moment. May I give myself the compassion I need.'"
      ]
    },
    love_failure: {
      validation: "Heartbreak and relationship pain can feel like physical grief in your chest. The loss of connection, broken promises, or unreciprocated love shakes our foundations, and your sadness and confusion are completely real.",
      reframing: "A relationship ending or not working out does not mean your capacity to love or be loved is broken. It means this particular path, person, or chapter reached its boundary. Love given is never wasted—it remains proof of your deep heart.",
      steps: [
        "Protect your peace: resist the urge to repeatedly check their social profiles or re-read old message logs.",
        "Acknowledge both the good memories and the painful realities without romanticizing the parts that hurt you.",
        "Lean into comfort connections: spend time with a friend, pet, or family member who reminds you of your warmth.",
        "Channel raw emotion into movement, music, or journaling an unsent release letter."
      ],
      motivation: "Your value does not decrease based on someone's inability to see your worth. This chapter hurts, but your life story still has beautiful unwritten pages ahead.",
      exercise: "Cord of Release & Reclamation",
      exerciseGuide: [
        "Close your eyes and visualize reclaiming all the energy, pieces of your soul, and love you gave away.",
        "Take a deep breath and imagine that energy flowing back into your chest, filling you with gentle golden light.",
        "Exhale and let go of trying to control their thoughts, choices, or feelings.",
        "Affirm: 'I release what is not meant for me, and I open my heart to heal at my own pace.'"
      ]
    }
  };

  const key = moodClean.includes("love") || moodClean.includes("breakup") || moodClean.includes("heart")
    ? "love_failure"
    : moodClean.includes("anx")
    ? "anxiety"
    : moodClean.includes("depress")
    ? "depressed"
    : moodClean.includes("stress")
    ? "stress"
    : moodClean.includes("insec")
    ? "insecurity"
    : moodClean.includes("sad")
    ? "sad"
    : "sad";

  const fallback = moodResponses[key] || moodResponses.sad;

  return {
    validationMessage: fallback.validation + (thoughts ? ` Hearing you share "${thoughts.slice(0, 100)}${thoughts.length > 100 ? '...' : ''}" shows how deeply this is touching your day.` : ""),
    perspectiveReframe: fallback.reframing,
    copingSteps: fallback.steps,
    motivationalAffirmation: fallback.motivation,
    guidedExerciseRecommendation: {
      title: fallback.exercise,
      steps: fallback.exerciseGuide,
    },
    reflectiveQuestions: [
      "If a close friend were in this exact situation, what gentle words would you offer them?",
      "What is one tiny comfort you can give your mind or body within the next hour?"
    ],
    timestamp: new Date().toISOString()
  };
}

// Support endpoint: analyzes mood + feeling notes and returns structured, compassionate psychological guidance
app.post("/api/support", async (req, res) => {
  try {
    const { mood, intensity = 3, contextCategory = "General", thoughts = "" } = req.body;

    const ai = getGeminiClient();

    if (!ai) {
      console.log("No GEMINI_API_KEY present; serving comprehensive fallback guidance.");
      const fallback = generateFallbackSupport(mood, thoughts, intensity);
      return res.json({ success: true, data: fallback, mode: "local" });
    }

    const systemInstruction = `You are SOL AI, an exceptionally warm, trauma-informed, empathetic mental well-being companion and emotional coach.
Your mission is to support the user who is sharing their honest emotions, feelings, and current struggles.
You provide:
1. Genuine empathetic validation (no toxic positivity, no dismissive clichés like 'just cheer up').
2. Psychological perspective reframing (rooted in Cognitive Behavioral Therapy and Acceptance & Commitment Therapy principles).
3. Practical, gentle, step-by-step coping actions (concrete, realistic, doable even when depleted).
4. Heartfelt, uplifting motivation and personalized affirmation.
5. A guided micro-exercise suitable for immediate somatic or mental relief.
6. Two thought-provoking, gentle self-reflection questions.

IMPORTANT: Always respond in valid JSON format matching the schema requested. If the user mentions self-harm or life-threatening crisis, provide warm validation alongside an invitation to contact free, confidential crisis hotlines (such as dialing 988 in the US/Canada or local equivalents).`;

    const prompt = `User Mood/Feeling Entry:
- Primary Emotion/Feeling: ${mood}
- Intensity Level (1-5): ${intensity} / 5
- Life Context / Category: ${contextCategory}
- User's Personal Reflection & Thoughts: "${thoughts}"

Generate a personalized mental health guidance response tailored directly to this emotional state and situation.`;

    const response = await callGeminiWithFallback({
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            validationMessage: {
              type: Type.STRING,
              description: "Empathetic, validating paragraph acknowledging the emotional difficulty and specific feelings shared without judgment."
            },
            perspectiveReframe: {
              type: Type.STRING,
              description: "Gentle psychological reframing or compassionate perspective to help make sense of the problem and relieve catastrophic thinking."
            },
            copingSteps: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "3 to 4 concrete, actionable, gentle steps the user can take right now or today to soothe themselves or address the situation."
            },
            motivationalAffirmation: {
              type: Type.STRING,
              description: "Warm, empowering, inspirational message and reminder of resilience tailored to their specific feeling."
            },
            guidedExerciseRecommendation: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING, description: "Name of the somatic or mindfulness exercise (e.g., '4-7-8 Grounding', 'Heartbreak Release Ritual', 'Cognitive Thought Defusion')" },
                steps: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "3 to 4 sequential, easy-to-follow steps for the exercise."
                }
              },
              required: ["title", "steps"]
            },
            reflectiveQuestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "2 gentle questions to help them reflect deeper or journal."
            }
          },
          required: ["validationMessage", "perspectiveReframe", "copingSteps", "motivationalAffirmation", "guidedExerciseRecommendation", "reflectiveQuestions"]
        }
      }
    });

    const rawText = response.text || "";
    try {
      const parsed = JSON.parse(rawText);
      return res.json({ success: true, data: { ...parsed, timestamp: new Date().toISOString() }, mode: "gemini" });
    } catch (parseErr) {
      console.error("JSON parse error from Gemini response:", parseErr);
      const fallback = generateFallbackSupport(mood, thoughts, intensity);
      return res.json({ success: true, data: fallback, mode: "fallback" });
    }
  } catch (err: any) {
    console.error("Error in /api/support endpoint:", err);
    const { mood = "sad", thoughts = "", intensity = 3 } = req.body || {};
    const fallback = generateFallbackSupport(mood, thoughts, intensity);
    return res.json({ success: true, data: fallback, mode: "fallback-error" });
  }
});

// Interactive continuous conversational support endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const { message, history = [], currentMood = "general", context = "" } = req.body;

    const ai = getGeminiClient();

    if (!ai) {
      // Meaningful fallback conversational reply
      const reply = `I'm holding space for what you just shared: "${message}". When emotions like ${currentMood} are present, every conversation is a step toward unburdening your heart. What feels like the most supportive thing for you right now—would you like to explore another coping tool, reflect on what's triggering this, or just have a quiet listening ear?`;
      return res.json({ success: true, reply, mode: "local" });
    }

    const systemInstruction = `You are SOL AI, a compassionate, articulate, and supportive emotional well-being AI counselor.
The user is currently feeling: "${currentMood}".
Context of their struggle: "${context}".
Guidelines:
- Speak with warmth, sincerity, and emotional depth.
- Keep answers grounded, concise (2-4 thoughtful paragraphs maximum), and focused on human connection.
- Avoid robotic disclaimers in every sentence; maintain an authentic conversational tone.
- If appropriate, offer a gentle follow-up question or an invitation to try a small grounding practice.
- If the user discusses self-harm, gently mention crisis support lines (988 in the US/Canada).`;

    // Construct conversational prompt with history
    let conversationPrompt = `You are SOL AI, an empathetic, caring, and grounded mental health & emotional well-being AI companion.
The user is currently feeling: "${currentMood}".
${context ? `Context of their situation: "${context}".` : ""}

Guidelines:
- Speak directly to them with warmth, deep empathy, validation, and zero judgment.
- Keep responses focused, comforting, and conversational (2-3 concise paragraphs).
- Offer practical coping tips, gentle psychological reframings, or a mindful question when appropriate.
- If they express thoughts of crisis or self-harm, compassionately guide them toward 988 or the crisis lifelines.

Conversation History:
`;

    if (Array.isArray(history) && history.length > 0) {
      for (const h of history.slice(-6)) {
        const speaker = h.role === "assistant" ? "SOL AI" : "User";
        conversationPrompt += `${speaker}: ${h.text || h.content || ""}\n`;
      }
    }
    conversationPrompt += `User: ${message}\n\nSOL AI:`;

    const response = await callGeminiWithFallback({
      contents: conversationPrompt,
      config: {
        temperature: 0.8,
      }
    });

    const reply = response.text || "I'm listening and right here with you. Please take a gentle breath.";
    return res.json({ success: true, reply, mode: "gemini" });
  } catch (err: any) {
    console.error("Error in /api/chat:", err);
    return res.json({
      success: true,
      reply: "I am listening closely. Sometimes putting feelings into words is the hardest part. Take your time, and know that you don't have to carry this alone.",
      mode: "fallback"
    });
  }
});

// Cognitive Thought Reframing tool endpoint
app.post("/api/reframe", async (req, res) => {
  try {
    const { negativeThought } = req.body;
    if (!negativeThought) {
      return res.status(400).json({ error: "Missing negativeThought" });
    }

    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        success: true,
        reframes: [
          `"This thought feels very real right now, but a feeling is not a permanent fact."`,
          `"I am learning and doing the best I can with the tools and energy I have today."`,
          `"Even if things didn't go as I hoped, my inherent worth as a human remains unchanged."`
        ]
      });
    }

    const prompt = `The user is caught in a distressing or self-critical thought:
"${negativeThought}"

Provide 3 distinct, compassionate cognitive reframings (based on CBT and self-compassion practices).
Each reframe should be one or two sentences that replace black-and-white thinking, personalization, or catastrophizing with a balanced, caring perspective.`;

    const response = await callGeminiWithFallback({
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            reframes: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "3 balanced, compassionate alternative ways to view the situation."
            }
          },
          required: ["reframes"]
        }
      }
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json({ success: true, reframes: parsed.reframes || [] });
  } catch (err) {
    return res.json({
      success: true,
      reframes: [
        "This thought is temporary weather, not the permanent climate of my life.",
        "I can be kind to myself while I work through this struggle.",
        "I am worthy of patience, forgiveness, and new beginnings."
      ]
    });
  }
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// Vite middleware setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    // Express 4 wildcard catch-all for SPA fallback
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Emotional Support AI Agent server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
