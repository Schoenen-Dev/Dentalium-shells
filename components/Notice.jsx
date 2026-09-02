// =====================================================================
//  NEW FILE:  components/Notice.jsx
//
//  Replaces the browser's alert() and confirm() boxes.
//
//  Anywhere in the app:
//
//    import { notify, confirmAction } from "@/components/Notice";
//
//    notify.success("Message sent");
//    notify.error("Couldn't save that");
//    notify("Saved");                       // neutral
//
//    const yes = await confirmAction({
//      title: "Remove this product?",
//      body: "It disappears from the shop straight away.",
//      confirmLabel: "Remove",
//      danger: true,
//    });
// =====================================================================

"use client";

import { useEffect, useState, useCallback } from "react";
import { Check, AlertCircle, Info, X } from "lucide-react";

/* ---------------------------------------------------------------
   Tiny store so non-hook code can raise a notice too
   --------------------------------------------------------------- */

let listeners = [];
let counter = 0;

const emit = (action) => listeners.forEach((fn) => fn(action));

export function notify(message, tone = "neutral", duration = 4000) {
  emit({
    type: "toast",
    toast: { id: ++counter, message, tone, duration },
  });
}

notify.success = (m, d) => notify(m, "success", d);
notify.error = (m, d) => notify(m, "error", d ?? 6000);
notify.info = (m, d) => notify(m, "neutral", d);

export function confirmAction({
  title,
  body = "",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  danger = false,
}) {
  return new Promise((resolve) => {
    emit({
      type: "confirm",
      confirm: { title, body, confirmLabel, cancelLabel, danger, resolve },
    });
  });
}

/* ---------------------------------------------------------------
   Host - mount once in app/layout.js
   --------------------------------------------------------------- */

const TONES = {
  success: { rule: "bg-[#1f5d43]", text: "text-[#1f5d43]", Icon: Check },
  error: { rule: "bg-[#b4432f]", text: "text-[#b4432f]", Icon: AlertCircle },
  neutral: { rule: "bg-[#b88e4b]", text: "text-[#b88e4b]", Icon: Info },
};

export default function NoticeHost() {
  const [toasts, setToasts] = useState([]);
  const [dialog, setDialog] = useState(null);

  const dismiss = useCallback((id) => {
    setToasts((list) => list.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    const handler = (action) => {
      if (action.type === "toast") {
        const t = action.toast;

        setToasts((list) => [...list, t]);

        if (t.duration > 0) {
          setTimeout(() => dismiss(t.id), t.duration);
        }
      }

      if (action.type === "confirm") {
        setDialog(action.confirm);
      }
    };

    listeners.push(handler);

    return () => {
      listeners = listeners.filter((fn) => fn !== handler);
    };
  }, [dismiss]);

  // Escape closes the dialog
  useEffect(() => {
    if (!dialog) return;

    const onKey = (e) => {
      if (e.key === "Escape") {
        dialog.resolve(false);
        setDialog(null);
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [dialog]);

  const answer = (value) => {
    dialog.resolve(value);
    setDialog(null);
  };

  return (
    <>
      {/* ---------------- TOASTS ---------------- */}

      <div className="fixed z-[100] inset-x-4 bottom-4 sm:inset-x-auto sm:right-6 sm:bottom-6 sm:w-[380px] flex flex-col gap-3 pointer-events-none">
        {toasts.map((t) => {
          const tone = TONES[t.tone] || TONES.neutral;
          const Icon = tone.Icon;

          return (
            <div
              key={t.id}
              role="status"
              className="notice-in pointer-events-auto flex items-start gap-3 bg-white border border-[#ebdec8] shadow-[0_18px_40px_-24px_rgba(11,47,73,0.45)] pl-0 pr-4 py-4"
            >
              <span className={`self-stretch w-[3px] shrink-0 ${tone.rule}`} />

              <Icon
                className={`w-[18px] h-[18px] shrink-0 mt-[1px] ml-1 ${tone.text}`}
                strokeWidth={2}
              />

              <p className="flex-1 text-[15px] leading-snug text-[#0b2f49]">
                {t.message}
              </p>

              <button
                onClick={() => dismiss(t.id)}
                aria-label="Dismiss"
                className="shrink-0 -mr-1 p-1 text-[#0b2f49]/30 hover:text-[#0b2f49] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>

      {/* ---------------- CONFIRM ---------------- */}

      {dialog && (
        <div
          className="fixed inset-0 z-[110] flex items-center justify-center px-4"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="absolute inset-0 bg-[#0b2f49]/45"
            onClick={() => answer(false)}
          />

          <div className="notice-pop relative w-full max-w-[420px] bg-[#FBF7F1] border border-[#ebdec8] p-8">
            <div
              className={`w-9 h-[2px] mb-6 ${
                dialog.danger ? "bg-[#b4432f]" : "bg-[#b88e4b]"
              }`}
            />

            <h2 className="font-serif text-[24px] leading-snug text-[#0b2f49]">
              {dialog.title}
            </h2>

            {dialog.body && (
              <p className="mt-3 text-[15px] leading-relaxed text-[#0b2f49]/60">
                {dialog.body}
              </p>
            )}

            <div className="mt-8 flex gap-3">
              <button
                autoFocus
                onClick={() => answer(true)}
                className={`flex-1 text-white text-[15px] py-3.5 transition-colors ${
                  dialog.danger
                    ? "bg-[#b4432f] hover:bg-[#93341f]"
                    : "bg-[#0b2f49] hover:bg-[#b88e4b]"
                }`}
              >
                {dialog.confirmLabel}
              </button>

              <button
                onClick={() => answer(false)}
                className="px-7 border border-[#0b2f49]/20 text-[15px] text-[#0b2f49] hover:border-[#b88e4b] transition-colors"
              >
                {dialog.cancelLabel}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes noticeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes noticePop {
          from {
            opacity: 0;
            transform: scale(0.97);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .notice-in {
          animation: noticeIn 0.28s cubic-bezier(0.2, 0.8, 0.2, 1) both;
        }

        .notice-pop {
          animation: noticePop 0.2s ease-out both;
        }

        @media (prefers-reduced-motion: reduce) {
          .notice-in,
          .notice-pop {
            animation: none;
          }
        }
      `}</style>
    </>
  );
}
