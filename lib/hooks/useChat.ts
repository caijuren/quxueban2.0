'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiGet, apiPost } from '@/lib/apiClient';
import { ChatSessionCreateInput, ChatMessageCreateInput } from '@/lib/validation';

export interface ChatSession {
  id: string;
  userId: string;
  childId: string | null;
  title: string | null;
  createdAt: string;
  updatedAt: string;
  _count?: { messages: number };
  child?: { id: string; name: string; avatarColor: string } | null;
}

export interface ChatMessage {
  id: string;
  sessionId: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
}

const sessionsKey = ['chat-sessions'];

export function useChatSessions(childId?: string) {
  return useQuery<ChatSession[]>({
    queryKey: [...sessionsKey, childId ?? 'all'],
    queryFn: () =>
      apiGet<ChatSession[]>(
        `/api/chat/sessions${childId ? `?childId=${encodeURIComponent(childId)}` : ''}`
      ),
  });
}

export function useCreateChatSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ChatSessionCreateInput) => apiPost<ChatSession>('/api/chat/sessions', data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [...sessionsKey, variables.childId ?? 'all'],
      });
    },
  });
}

export function useChatMessages(sessionId: string | undefined) {
  return useQuery<ChatMessage[]>({
    queryKey: ['chat-messages', sessionId ?? ''],
    queryFn: () => apiGet<ChatMessage[]>(`/api/chat/sessions/${sessionId}/messages`),
    enabled: !!sessionId,
  });
}

export function useSendChatMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ sessionId, content }: { sessionId: string; content: string }) =>
      apiPost<ChatMessage>(`/api/chat/sessions/${sessionId}/messages`, {
        content,
      } as ChatMessageCreateInput),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['chat-messages', variables.sessionId],
      });
      queryClient.invalidateQueries({
        queryKey: sessionsKey,
      });
    },
  });
}
