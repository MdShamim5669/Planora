'use client';

import React from 'react';
import { Bot, User, Sparkles, Compass, Shuffle } from 'lucide-react';
import { AssistantEventCardData } from '@/lib/assistantApi';
import { AssistantEventCard } from './AssistantEventCard';

export interface ChatMessageItem {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  events?: AssistantEventCardData[];
  suggestions?: string[];
  isError?: boolean;
}

interface ChatMessageProps {
  message: ChatMessageItem;
  onRetry?: () => void;
  onSelectSuggestion?: (suggestion: string) => void;
  onShuffleSuggestions?: (messageId: string) => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  onRetry,
  onSelectSuggestion,
  onShuffleSuggestions,
}) => {
  const isUser = message.role === 'user';

  return (
    <div
      className={`flex gap-3 text-sm ${
        isUser ? 'flex-row-reverse items-start' : 'flex-row items-start'
      }`}
    >
      {/* Avatar */}
      <div
        className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
          isUser
            ? 'bg-blue-600 text-white'
            : 'bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-sm'
        }`}
      >
        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
      </div>

      {/* Message content */}
      <div className={`max-w-[85%] sm:max-w-[80%] space-y-2.5 ${isUser ? 'items-end' : 'items-start'}`}>
        <div
          className={`px-4 py-3 rounded-2xl leading-relaxed whitespace-pre-wrap ${
            isUser
              ? 'bg-blue-600 text-white rounded-tr-sm shadow-sm'
              : message.isError
              ? 'bg-red-50 text-red-900 border border-red-200 dark:bg-red-950/40 dark:text-red-200 dark:border-red-900/50 rounded-tl-sm'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200/80 dark:border-slate-700/80 rounded-tl-sm shadow-xs'
          }`}
        >
          {message.content}

          {message.isError && onRetry && (
            <div className="mt-2 pt-2 border-t border-red-200 dark:border-red-900/60">
              <button
                onClick={onRetry}
                type="button"
                className="text-xs font-semibold underline hover:no-underline text-red-700 dark:text-red-300"
              >
                Try again
              </button>
            </div>
          )}
        </div>

        {/* Real Event Cards attached by server */}
        {!isUser && message.events && message.events.length > 0 && (
          <div className="grid grid-cols-1 gap-2 pt-1">
            {message.events.map((ev) => (
              <AssistantEventCard key={ev.id} event={ev} />
            ))}
          </div>
        )}

        {/* Follow-up / Suggested questions */}
        {!isUser && message.suggestions && message.suggestions.length > 0 && (
          <div className="pt-1.5 space-y-1.5 animate-in fade-in-50 duration-200">
            <div className="flex items-center justify-between px-0.5">
              <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400 dark:text-slate-500">
                <Sparkles className="w-3 h-3 text-blue-500" />
                <span>Suggested questions</span>
              </div>
              {onShuffleSuggestions && (
                <button
                  type="button"
                  onClick={() => onShuffleSuggestions(message.id)}
                  title="Shuffle new suggestions"
                  aria-label="Shuffle new suggestions"
                  className="flex items-center gap-1 text-[10px] font-medium text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 px-1.5 py-0.5 rounded hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer group"
                >
                  <Shuffle className="w-2.5 h-2.5 text-slate-400 group-hover:text-blue-500 transition-transform group-hover:rotate-180 duration-200" />
                  <span>Shuffle</span>
                </button>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              {message.suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => onSelectSuggestion?.(suggestion)}
                  className="text-left text-xs px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-950/30 text-slate-700 dark:text-slate-300 font-medium transition-all shadow-2xs hover:shadow-xs flex items-center justify-between group cursor-pointer"
                >
                  <span>{suggestion}</span>
                  <Compass className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-500 transition-colors flex-shrink-0" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
