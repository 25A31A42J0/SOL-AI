import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles, Trash2, ArrowLeft, RefreshCw } from "lucide-react";
import { ChatMessage, MoodCategory } from "../types";
import { MOOD_OPTIONS } from "../data/moods";

interface AgentChatProps {
  currentMood: MoodCategory;
  initialContext: string;
  onClose?: () => void;
}

export const AgentChat: React.FC<AgentChatProps> = ({
  currentMood,
  initialContext,
  onClose,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: "initial-welcome",
      role: "assistant",
      text: `Hello, I'm here with you. I see you've been carrying ${
        MOOD_OPTIONS.find((m) => m.id === currentMood)?.label || "deep feelings"
      }${
        initialContext ? ` regarding: "${initialContext.slice(0, 80)}..."` : ""
      }. There is no rush, and you don't have to perform or pretend to be okay here. What would feel most supportive right now?`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isSending]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || isSending) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      role: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsSending(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: messages.map((m) => ({ role: m.role, text: m.text })),
          currentMood,
          context: initialContext,
        }),
      });

      const data = await response.json();
      const reply = data.reply || "I am right here with you. Take a soft, gentle breath.";

      const assistantMessage: ChatMessage = {
        id: `msg-${Date.now()}-agent`,
        role: "assistant",
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      const errorMsg: ChatMessage = {
        id: `msg-${Date.now()}-error`,
        role: "assistant",
        text: "I'm having a brief connection pause, but please remember: you are not alone in this moment. Place a warm hand on your chest and breathe gently with me.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  const suggestedQuestions = [
    "How can I stop overthinking this right now?",
    "Why does this feeling hit so intensely at night?",
    "Can you give me a gentle affirmation for today?",
    "What is one small boundary I should set?",
  ];

  return (
    <div
      id="agent-chat-container"
      className="bg-white rounded-3xl border border-stone-200 shadow-sm flex flex-col h-[600px] max-h-[80vh] overflow-hidden"
    >
      {/* Top Header */}
      <div className="p-4 border-b border-stone-200 bg-stone-50/80 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {onClose && (
            <button
              id="back-from-chat-btn"
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-stone-200 text-stone-600 transition-colors cursor-pointer"
              title="Return to guidance"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div className="w-8 h-8 rounded-full bg-teal-800 text-teal-100 flex items-center justify-center">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-stone-900 leading-tight">
              SOL AI Companion
            </h3>
            <div className="flex items-center space-x-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] text-stone-500">
                Holding space for {currentMood.replace("_", " ")}
              </span>
            </div>
          </div>
        </div>

        <button
          id="clear-chat-history-btn"
          type="button"
          onClick={() => setMessages(messages.slice(0, 1))}
          className="text-stone-400 hover:text-stone-600 p-1.5 rounded-lg hover:bg-stone-200/60 transition-colors"
          title="Reset conversation"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-stone-50/40">
        {messages.map((m) => {
          const isUser = m.role === "user";
          return (
            <div
              key={m.id}
              className={`flex items-start space-x-2.5 ${
                isUser ? "flex-row-reverse space-x-reverse" : "flex-row"
              }`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs ${
                  isUser
                    ? "bg-stone-800 text-stone-200"
                    : "bg-teal-800 text-teal-100"
                }`}
              >
                {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
              </div>

              <div
                className={`max-w-[82%] sm:max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  isUser
                    ? "bg-teal-800 text-white rounded-tr-none shadow-xs"
                    : "bg-white text-stone-800 border border-stone-200 rounded-tl-none shadow-xs"
                }`}
              >
                <p className="whitespace-pre-wrap">{m.text}</p>
                <span
                  className={`block text-[10px] mt-1.5 ${
                    isUser ? "text-teal-200 text-right" : "text-stone-400"
                  }`}
                >
                  {m.timestamp}
                </span>
              </div>
            </div>
          );
        })}

        {isSending && (
          <div className="flex items-start space-x-2.5">
            <div className="w-7 h-7 rounded-full bg-teal-800 text-teal-100 flex items-center justify-center shrink-0">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <div className="bg-white border border-stone-200 rounded-2xl rounded-tl-none px-4 py-3 shadow-xs flex items-center space-x-2 text-stone-500 text-xs">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-teal-700" />
              <span>Reflecting with compassion...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Follow-ups */}
      <div className="p-2 border-t border-stone-100 bg-white overflow-x-auto flex items-center space-x-1.5 text-xs text-stone-600">
        <span className="text-[11px] text-stone-400 font-medium shrink-0 ml-2">
          Suggestions:
        </span>
        {suggestedQuestions.map((q, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSend(q)}
            className="shrink-0 bg-stone-100 hover:bg-stone-200 px-2.5 py-1 rounded-full border border-stone-200 text-stone-700 transition-colors cursor-pointer"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <div className="p-3 border-t border-stone-200 bg-white">
        <div className="flex items-center space-x-2">
          <input
            id="chat-user-input"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message or ask a question..."
            disabled={isSending}
            className="flex-1 px-4 py-2.5 bg-stone-100 border border-stone-200 rounded-xl text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700"
          />
          <button
            id="chat-send-btn"
            type="button"
            onClick={() => handleSend()}
            disabled={isSending || !input.trim()}
            className={`p-2.5 rounded-xl transition-colors cursor-pointer ${
              input.trim() && !isSending
                ? "bg-teal-800 hover:bg-teal-900 text-white"
                : "bg-stone-200 text-stone-400 cursor-not-allowed"
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
