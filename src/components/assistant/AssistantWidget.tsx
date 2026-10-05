'use client';

import React, { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import {
  Sparkles,
  X,
  Send,
  RotateCcw,
  Bot,
  Compass,
  MessageSquare,
  AlertCircle,
  ChevronDown,
  Shuffle,
} from 'lucide-react';
import { askAssistant, AssistantChatMessage, AssistantEventCardData } from '@/lib/assistantApi';
import { ChatMessage, ChatMessageItem } from './ChatMessage';

const SUGGESTION_POOL = [
  'Free events this weekend',
  'Paid workshops',
  'Events I can join',
  'Technology and coding meetups',
  'Upcoming music and cultural fests',
  'Ei shoptah-r free events',
  'Design & creative bootcamps',
  'Events happening today',
  'Online tech conferences',
  'Business networking meetups',
  'Agamikal ki event ache?',
  'Sports and gaming tournaments',
];

const getRandomSuggestions = (exclude: string[] = []): string[] => {
  const available = SUGGESTION_POOL.filter((item) => !exclude.includes(item));
  const pool = available.length >= 3 ? available : SUGGESTION_POOL;
  const shuffled = [...pool].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 3);
};

export const AssistantWidget: React.FC = () => {
  const pathname = usePathname();

  // Hide assistant on admin, authentication, and password recovery pages
  const hiddenRoutes = ['/admin', '/login', '/register', '/forgot-password', '/reset-password'];
  const isHidden = hiddenRoutes.some((route) => pathname?.startsWith(route));

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessageItem[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [currentSuggestions, setCurrentSuggestions] = useState<string[]>([
    'Free events this weekend',
    'Paid workshops',
    'Events I can join',
  ]);
  const [isShuffling, setIsShuffling] = useState(false);

  // Restore suggestion toggle preference from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('planora_assistant_show_suggestions');
      if (saved !== null) {
        setShowSuggestions(saved === 'true');
      }
    } catch {
      // Ignore storage errors in restricted contexts
    }
  }, []);

  const handleToggleSuggestions = () => {
    setShowSuggestions((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('planora_assistant_show_suggestions', String(next));
      } catch {
        // Ignore storage errors
      }
      return next;
    });
  };

  const handleShuffleSuggestions = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setIsShuffling(true);
    setTimeout(() => {
      setCurrentSuggestions((prev) => getRandomSuggestions(prev));
      setIsShuffling(false);
    }, 200);
  };

  const handleShuffleMessageSuggestions = (messageId: string) => {
    setMessages((prev) =>
      prev.map((m) => {
        if (m.id === messageId) {
          return {
            ...m,
            suggestions: getRandomSuggestions(m.suggestions || []),
          };
        }
        return m;
      })
    );
  };

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
        suggestions:
          res.suggestions && res.suggestions.length > 0
            ? res.suggestions
            : getRandomSuggestions(),
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

  // Close assistant if navigated to a hidden route
  useEffect(() => {
    if (isHidden && isOpen) {
      setIsOpen(false);
    }
  }, [isHidden, isOpen]);

  // Do not render on hidden routes (admin, login, register, etc.)
  if (isHidden) {
    return null;
  }

  return (
    <>
      {/* Floating Toggle Button */}
      <div className="fixed bottom-6 right-6 z-50 print:hidden">
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
          className="fixed inset-0 sm:inset-auto sm:bottom-24 sm:right-6 z-50 w-full sm:w-[410px] h-full sm:h-[600px] sm:max-h-[85vh] bg-white dark:bg-slate-950 sm:rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 print:hidden"
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

                {/* Suggestion Chips with Toggle & Shuffle */}
                <div className="pt-2 w-full space-y-2">
                  <div className="flex items-center justify-between px-1">
                    <button
                      type="button"
                      onClick={handleToggleSuggestions}
                      aria-expanded={showSuggestions}
                      className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 uppercase tracking-wider transition-colors cursor-pointer group"
                    >
                      <span>Quick suggestions</span>
                      <span className="text-[10px] font-normal px-1.5 py-0.5 rounded-full bg-slate-200/70 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/40 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {currentSuggestions.length}
                      </span>
                    </button>

                    <div className="flex items-center gap-1">
                      {/* Shuffle Button */}
                      {showSuggestions && (
                        <button
                          type="button"
                          onClick={handleShuffleSuggestions}
                          disabled={isShuffling}
                          title="Shuffle new suggestions"
                          aria-label="Shuffle new suggestions"
                          className="flex items-center gap-1 text-[11px] font-medium text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 px-2 py-0.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-all cursor-pointer group disabled:opacity-50"
                        >
                          <Shuffle
                            className={`w-3 h-3 text-slate-400 group-hover:text-blue-500 transition-transform ${
                              isShuffling ? 'rotate-180 duration-200' : ''
                            }`}
                          />
                          <span className="capitalize">Shuffle</span>
                        </button>
                      )}

                      {/* Toggle Show/Hide Button */}
                      <button
                        type="button"
                        onClick={handleToggleSuggestions}
                        aria-label={showSuggestions ? 'Hide quick suggestions' : 'Show quick suggestions'}
                        className="flex items-center gap-1 text-[11px] font-medium text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 px-2 py-0.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-all cursor-pointer"
                      >
                        <span>{showSuggestions ? 'Hide' : 'Show'}</span>
                        <ChevronDown
                          className={`w-3.5 h-3.5 transition-transform duration-200 ${
                            showSuggestions ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {showSuggestions && (
                    <div
                      className={`flex flex-col gap-1.5 transition-all duration-200 ${
                        isShuffling ? 'opacity-40 scale-[0.98]' : 'opacity-100 scale-100'
                      }`}
                    >
                      {currentSuggestions.map((chip) => (
                        <button
                          key={chip}
                          type="button"
                          onClick={() => handleSendMessage(chip)}
                          className="text-left text-xs px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-950/30 text-slate-700 dark:text-slate-300 font-medium transition-all shadow-2xs hover:shadow-xs flex items-center justify-between group cursor-pointer animate-in fade-in duration-150"
                        >
                          <span>{chip}</span>
                          <Compass className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-500 transition-colors" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              messages.map((m) => (
                <ChatMessage
                  key={m.id}
                  message={m}
                  onRetry={handleRetryLast}
                  onSelectSuggestion={handleSendMessage}
                  onShuffleSuggestions={handleShuffleMessageSuggestions}
                />
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
            {/* Quick Suggestions strip above input during chat */}
            {messages.length > 0 && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between px-1">
                  <span className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    <Sparkles className="w-3 h-3 text-blue-500" />
                    <span>Suggestions</span>
                  </span>
                  <div className="flex items-center gap-1">
                    {showSuggestions && (
                      <button
                        type="button"
                        onClick={handleShuffleSuggestions}
                        disabled={isShuffling}
                        title="Shuffle suggestions"
                        aria-label="Shuffle suggestions"
                        className="flex items-center gap-1 text-[10px] font-medium text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 px-1.5 py-0.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer group disabled:opacity-50"
                      >
                        <Shuffle
                          className={`w-2.5 h-2.5 text-slate-400 group-hover:text-blue-500 transition-transform ${
                            isShuffling ? 'rotate-180 duration-200' : ''
                          }`}
                        />
                        <span className="capitalize">Shuffle</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={handleToggleSuggestions}
                      aria-label={showSuggestions ? 'Hide suggestions' : 'Show suggestions'}
                      className="flex items-center gap-0.5 text-[10px] font-medium text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 px-1.5 py-0.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      <span>{showSuggestions ? 'Hide' : 'Show'}</span>
                      <ChevronDown
                        className={`w-3 h-3 transition-transform duration-200 ${
                          showSuggestions ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {showSuggestions && (
                  <div
                    className={`flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none transition-all duration-200 ${
                      isShuffling ? 'opacity-40 scale-[0.98]' : 'opacity-100 scale-100'
                    }`}
                  >
                    {currentSuggestions.map((chip) => (
                      <button
                        key={chip}
                        type="button"
                        onClick={() => handleSendMessage(chip)}
                        className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800/90 hover:bg-blue-50 dark:hover:bg-blue-950/40 border border-slate-200/80 dark:border-slate-700/80 hover:border-blue-400 text-slate-700 dark:text-slate-300 text-[11px] whitespace-nowrap transition-all flex-shrink-0 cursor-pointer flex items-center gap-1 group shadow-2xs hover:shadow-xs"
                      >
                        <span>{chip}</span>
                        <Compass className="w-3 h-3 text-slate-400 group-hover:text-blue-500 transition-colors" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

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
