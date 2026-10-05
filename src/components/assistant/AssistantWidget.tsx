'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  X,
  Send,
  RotateCcw,
  Bot,
  Compass,
  MessageSquare,
  AlertCircle,
} from 'lucide-react';
import { askAssistant, AssistantChatMessage, AssistantEventCardData } from '@/lib/assistantApi';
import { ChatMessage, ChatMessageItem } from './ChatMessage';

const SUGGESTION_CHIPS = [
  'Free events this weekend',
  'Paid workshops',
  'Events I can join',
];

export const AssistantWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessageItem[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const toggleButtonRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, isOpen]);

  // Focus input when opened, return focus when closed
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
    } else {
      toggleButtonRef.current?.focus();
    }
  }, [isOpen]);

  // Handle Esc to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isLoading) return;

    const userMessageId = `user-${Date.now()}`;
    const newUserMsg: ChatMessageItem = {
      id: userMessageId,
      role: 'user',
      content: query,
    };

    const newMessages = [...messages, newUserMsg];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    // Prepare history payload (last 6 messages)
    const historyPayload: AssistantChatMessage[] = newMessages
      .slice(-6)
      .map((m) => ({
        role: m.role,
        content: m.content,
      }));

    try {
      const res = await askAssistant(query, historyPayload);
      const assistantMsg: ChatMessageItem = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: res.answer,
        events: res.events,
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (error: any) {
      console.error('Assistant error:', error);
      const serverMessage = error?.response?.data?.message;
      const errorMsg: ChatMessageItem = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content:
          serverMessage ||
          "Sorry, I couldn't reach the Planora assistant service right now. Please try again in a moment.",
        isError: true,
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDownInput = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleReset = () => {
    setMessages([]);
    setInput('');
    inputRef.current?.focus();
  };

  const handleRetryLast = () => {
    const lastUserMsg = [...messages].reverse().find((m) => m.role === 'user');
    if (lastUserMsg) {
      // Remove any trailing error assistant message
      setMessages((prev) => prev.filter((m) => !m.isError));
      handleSendMessage(lastUserMsg.content);
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          ref={toggleButtonRef}
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label={isOpen ? 'Close assistant' : 'Open assistant'}
          className={`relative group flex items-center justify-center p-3.5 rounded-full shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 ${
            isOpen
              ? 'bg-slate-800 text-white hover:bg-slate-900'
              : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white'
          }`}
        >
          {isOpen ? (
            <X className="w-6 h-6 transition-transform group-hover:rotate-90 duration-200" />
          ) : (
            <div className="relative flex items-center justify-center">
              <Sparkles className="w-6 h-6 animate-pulse" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-400"></span>
              </span>
            </div>
          )}
        </button>
      </div>

      {/* Chat Dialog Panel */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="Planora Assistant"
          className="fixed inset-0 sm:inset-auto sm:bottom-24 sm:right-6 z-50 w-full sm:w-[410px] h-full sm:h-[600px] sm:max-h-[85vh] bg-white dark:bg-slate-950 sm:rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-sm flex-shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center backdrop-blur-xs">
                <Sparkles className="w-4 h-4 text-cyan-200" />
              </div>
              <div>
                <h3 className="font-semibold text-sm leading-tight">Planora Assistant</h3>
                <p className="text-[11px] text-blue-100/90 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"></span>
                  AI Event Guide
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {messages.length > 0 && (
                <button
                  type="button"
                  onClick={handleReset}
                  title="Clear conversation"
                  aria-label="Clear conversation"
                  className="p-1.5 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                title="Close chat"
                aria-label="Close chat"
                className="p-1.5 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Conversation Area */}
          <div
            aria-live="polite"
            className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50 dark:bg-slate-900/40 text-slate-800 dark:text-slate-200"
          >
            {messages.length === 0 ? (
              <div className="h-full flex flex-col justify-center items-center text-center p-4 space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-xs">
                  <Bot className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100">
                    Welcome to Planora Assistant!
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-[260px] leading-relaxed">
                    Ask me about upcoming public or private events, workshops, tickets, or dates in English, Bangla, or Banglish.
                  </p>
                </div>

                {/* Suggestion Chips */}
                <div className="pt-2 w-full space-y-2">
                  <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                    Quick suggestions
                  </p>
                  <div className="flex flex-col gap-1.5">
                    {SUGGESTION_CHIPS.map((chip) => (
                      <button
                        key={chip}
                        type="button"
                        onClick={() => handleSendMessage(chip)}
                        className="text-left text-xs px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-950/30 text-slate-700 dark:text-slate-300 font-medium transition-all shadow-2xs hover:shadow-xs flex items-center justify-between group"
                      >
                        <span>{chip}</span>
                        <Compass className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-500 transition-colors" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              messages.map((m) => (
                <ChatMessage key={m.id} message={m} onRetry={handleRetryLast} />
              ))
            )}

            {/* Typing / Searching indicator */}
            {isLoading && (
              <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 px-3.5 py-2.5 rounded-2xl rounded-tl-sm flex items-center gap-2">
                  <span>Searching events</span>
                  <span className="flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce"></span>
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Footer Input */}
          <div className="p-3 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 space-y-2 flex-shrink-0">
            <div className="relative">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value.slice(0, 500))}
                onKeyDown={handleKeyDownInput}
                rows={2}
                placeholder="Ask about events (e.g. Free events in Dhaka)..."
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 pr-10 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none transition-all"
              />
              <button
                type="button"
                onClick={() => handleSendMessage()}
                disabled={!input.trim() || isLoading}
                aria-label="Send question"
                className="absolute right-2.5 bottom-3.5 p-1.5 rounded-lg bg-blue-600 text-white disabled:opacity-40 disabled:hover:bg-blue-600 hover:bg-blue-700 transition-colors shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-center justify-between text-[10px] text-slate-400 px-1">
              <span className="line-clamp-1">
                AI can make mistakes. Check details on the event page.
              </span>
              {input.length > 400 && (
                <span
                  className={`font-mono font-medium ${
                    input.length >= 500 ? 'text-red-500' : 'text-slate-500'
                  }`}
                >
                  {input.length}/500
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
