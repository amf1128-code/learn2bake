"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { CameraCapture } from "./CameraCapture";

interface Message {
  role: "user" | "assistant";
  text: string;
  image?: string; // data URL for display
}

interface DoughAssistantProps {
  recipeName: string;
  currentStepNumber: number;
  stepInstruction: string;
}

export function DoughAssistant({
  recipeName,
  currentStepNumber,
  stepInstruction,
}: DoughAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [pendingImage, setPendingImage] = useState<{
    base64: string;
    mediaType: string;
    dataUrl: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleCapture = useCallback((base64: string, mediaType: string) => {
    const dataUrl = `data:${mediaType};base64,${base64}`;
    setPendingImage({ base64, mediaType, dataUrl });
  }, []);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text && !pendingImage) return;

    const userMessage: Message = {
      role: "user",
      text: text || "How does my dough look?",
      image: pendingImage?.dataUrl,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/dough-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          imageData: pendingImage?.base64 || undefined,
          imageMediaType: pendingImage?.mediaType || undefined,
          recipeName,
          currentStep: `Step ${currentStepNumber}`,
          stepInstruction,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", text: data.error || "Something went wrong. Try again!" },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", text: data.reply },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Couldn't reach the assistant right now. Check your connection and try again.",
        },
      ]);
    } finally {
      setPendingImage(null);
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-accent text-white px-5 py-3 rounded-full shadow-lg hover:bg-orange-800 transition-colors text-sm font-medium z-40 flex items-center gap-2"
      >
        <span className="text-lg">🤲</span>
        How&apos;s my dough?
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background/95 backdrop-blur-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-surface">
        <div>
          <h2 className="font-semibold text-sm">Dough Assistant</h2>
          <p className="text-xs text-muted">
            Step {currentStepNumber} &middot; {recipeName}
          </p>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="text-muted hover:text-foreground text-xl leading-none px-2"
          aria-label="Close assistant"
        >
          ✕
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-8 space-y-3">
            <p className="text-3xl">🤲</p>
            <p className="text-sm font-medium">Your baking partner</p>
            <p className="text-xs text-muted max-w-xs mx-auto leading-relaxed">
              Snap a photo of your dough and I&apos;ll help you understand
              what&apos;s happening. Is it ready for the next step? Does
              it need more time? Ask me anything.
            </p>
            <div className="flex flex-wrap justify-center gap-2 pt-2">
              {[
                "How does my dough look?",
                "Is this enough gluten development?",
                "Has it risen enough?",
                "What should it feel like right now?",
              ].map((q) => (
                <button
                  key={q}
                  onClick={() => {
                    setInput(q);
                    inputRef.current?.focus();
                  }}
                  className="text-xs px-3 py-1.5 bg-surface border border-border rounded-full hover:border-accent transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-lg px-4 py-3 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-accent text-white"
                  : "bg-surface border border-border"
              }`}
            >
              {msg.image && (
                <img
                  src={msg.image}
                  alt="Your dough"
                  className="w-full max-h-40 object-cover rounded mb-2"
                />
              )}
              <div className="whitespace-pre-wrap">{msg.text}</div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-surface border border-border rounded-lg px-4 py-3 text-sm text-muted">
              Looking at your dough...
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="border-t border-border bg-surface px-4 py-3 space-y-3">
        <CameraCapture onCapture={handleCapture} disabled={isLoading} />

        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              pendingImage
                ? "Add a question about your dough (optional)..."
                : "Ask about your dough..."
            }
            disabled={isLoading}
            className="flex-1 px-3 py-2 border border-border rounded-lg text-sm bg-background focus:outline-none focus:border-accent disabled:opacity-50"
          />
          <button
            onClick={sendMessage}
            disabled={isLoading && !input.trim() && !pendingImage}
            className="px-4 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:bg-orange-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "..." : "Ask"}
          </button>
        </div>
      </div>
    </div>
  );
}
