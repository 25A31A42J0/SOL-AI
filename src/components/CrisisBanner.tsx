import React, { useState } from "react";
import { LifeBuoy, X, Phone, MessageSquare, Globe, ExternalLink, ShieldCheck } from "lucide-react";

export const CrisisBanner: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Subtle Top or Floating Button */}
      <div className="flex items-center justify-center pt-2">
        <button
          id="urgent-help-trigger-btn"
          type="button"
          onClick={() => setIsOpen(true)}
          className="inline-flex items-center space-x-1.5 text-xs text-stone-500 hover:text-stone-800 bg-stone-100 hover:bg-stone-200/80 px-3 py-1 rounded-full transition-colors cursor-pointer border border-stone-200/60"
        >
          <LifeBuoy className="w-3.5 h-3.5 text-rose-600" />
          <span>Need immediate emotional crisis support? (Free & 24/7)</span>
        </button>
      </div>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            id="crisis-modal-content"
            className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl border border-stone-200 space-y-6 relative"
          >
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                <LifeBuoy className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-serif font-semibold text-stone-900">
                  You Are Never Alone
                </h3>
                <p className="text-xs text-stone-500">
                  Free, confidential support is available 24 hours a day, 7 days a week.
                </p>
              </div>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              SOL AI is an AI well-being companion for self-reflection and emotional support, but it is not a replacement for human clinical care or crisis emergency response. If you or someone you know is in immediate danger or having thoughts of self-harm, please reach out to dedicated compassionate human responders right now:
            </p>

            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 flex items-start space-x-3">
                <Phone className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-stone-900">
                    988 Suicide & Crisis Lifeline (US & Canada)
                  </h4>
                  <p className="text-xs text-stone-500">
                    Call or text <strong className="text-stone-800">988</strong> anytime. Free, confidential, speaking to trained professionals.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 flex items-start space-x-3">
                <MessageSquare className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-stone-900">
                    Crisis Text Line
                  </h4>
                  <p className="text-xs text-stone-500">
                    Text <strong className="text-stone-800">HOME</strong> to <strong className="text-stone-800">741741</strong> to connect with a crisis counselor over text.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 flex items-start space-x-3">
                <Globe className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-stone-900">
                    International Helplines (Befrienders Worldwide)
                  </h4>
                  <p className="text-xs text-stone-500">
                    Find emotional support helplines in your country at{" "}
                    <a
                      href="https://www.befrienders.org"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-teal-700 underline font-medium"
                    >
                      befrienders.org
                    </a>
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-5 py-2.5 bg-stone-900 hover:bg-black text-white text-xs font-medium rounded-xl transition-colors cursor-pointer"
              >
                Return to Companion
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
