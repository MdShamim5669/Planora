import { api } from './api';

export interface AssistantChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface AssistantEventCardData {
  id: string;
  title: string;
  eventDate: string;
  visibility: 'PUBLIC' | 'PRIVATE';
  fee: number | string;
  organizer: {
    name: string;
  };
  yourStatus: string;
}

export interface AskAssistantResponse {
  answer: string;
  events: AssistantEventCardData[];
  usedRetriever: 'keyword' | 'vector';
}

export interface AskAssistantApiResponse {
  success: boolean;
  message: string;
  data: AskAssistantResponse;
}

export async function askAssistant(
  question: string,
  history: AssistantChatMessage[] = []
): Promise<AskAssistantResponse> {
  const response = await api.post<AskAssistantApiResponse>('/assistant/ask', {
    question,
    history,
  });
  return response.data.data;
}
