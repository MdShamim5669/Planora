'use client';

import React from 'react';
import { Bot, User, Sparkles } from 'lucide-react';
import { AssistantEventCardData } from '@/lib/assistantApi';
import { AssistantEventCard } from './AssistantEventCard';

export interface ChatMessageItem {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  events?: AssistantEventCardData[];
  isError?: boolean;
}

interface ChatMessageProps {
  message: ChatMessageItem;
  onRetry?: () => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, onRetry }) => {
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
      </div>
    </div>
  );
};
