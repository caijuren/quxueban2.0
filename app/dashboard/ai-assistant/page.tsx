'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  Plus,
  Send,
  Loader2,
  Bot,
  User,
  Clock,
  ChevronLeft,
} from 'lucide-react';
import { useChildren } from '@/components/dashboard/ChildrenContext';
import EmptyState from '@/components/ui/EmptyState';
import {
  useChatSessions,
  useCreateChatSession,
  useChatMessages,
  useSendChatMessage,
} from '@/lib/hooks/useChat';

export default function AIAssistantPage() {
  const { currentChild } = useChildren();
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [isMobileListVisible, setIsMobileListVisible] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: sessions = [], isLoading: sessionsLoading } = useChatSessions(
    currentChild?.id
  );
  const createSession = useCreateChatSession();
  const { data: messages = [], isLoading: messagesLoading } = useChatMessages(
    selectedSessionId ?? undefined
  );
  const sendMessage = useSendChatMessage();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, sendMessage.isPending]);

  const handleCreateSession = async () => {
    const session = await createSession.mutateAsync({
      childId: currentChild?.id,
      title: currentChild ? `${currentChild.name}的学习咨询` : '新的咨询',
    });
    setSelectedSessionId(session.id);
    setIsMobileListVisible(false);
  };

  const handleSelectSession = (id: string) => {
    setSelectedSessionId(id);
    setIsMobileListVisible(false);
  };

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || !selectedSessionId || sendMessage.isPending) return;
    const content = input.trim();
    setInput('');
    await sendMessage.mutateAsync({ sessionId: selectedSessionId, content });
  };

  const selectedSession = sessions.find((s) => s.id === selectedSessionId);

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col lg:flex-row gap-4">
      {/* Session list */}
      <motion.aside
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        className={`shrink-0 lg:w-72 flex flex-col gap-3 ${
          isMobileListVisible ? 'flex' : 'hidden lg:flex'
        }`}
      >
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold font-display text-text-primary">AI 学习助手</h1>
          <button
            onClick={handleCreateSession}
            disabled={createSession.isPending}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-text-primary text-xs font-medium hover:opacity-90 transition-all disabled:opacity-60"
          >
            {createSession.isPending ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Plus className="w-3.5 h-3.5" />
            )}
            新对话
          </button>
        </div>

        <div className="flex-1 overflow-y-auto rounded-card bg-surface-elevated border border-border-default p-2 space-y-1">
          {sessionsLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : sessions.length === 0 ? (
            <div className="py-8">
              <EmptyState
                icon={MessageSquare}
                title="还没有对话"
                description="点击右上角开始一个新的学习咨询"
              />
            </div>
          ) : (
            sessions.map((session) => (
              <button
                key={session.id}
                onClick={() => handleSelectSession(session.id)}
                className={`w-full text-left rounded-lg px-3 py-2.5 transition-colors ${
                  selectedSessionId === session.id
                    ? 'bg-primary/10 border border-primary/20'
                    : 'hover:bg-surface-highlight border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <MessageSquare
                    className={`w-4 h-4 ${
                      selectedSessionId === session.id ? 'text-primary' : 'text-text-muted'
                    }`}
                  />
                  <p className="text-sm font-medium text-text-primary truncate">
                    {session.title || '未命名对话'}
                  </p>
                </div>
                <div className="flex items-center justify-between text-2xs text-text-muted">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(session.updatedAt).toLocaleDateString('zh-CN')}
                  </span>
                  <span>{session._count?.messages ?? 0} 条消息</span>
                </div>
              </button>
            ))
          )}
        </div>
      </motion.aside>

      {/* Chat area */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className={`flex-1 flex flex-col rounded-card bg-surface-elevated border border-border-default overflow-hidden ${
          isMobileListVisible ? 'hidden lg:flex' : 'flex'
        }`}
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border-default shrink-0">
          <button
            onClick={() => setIsMobileListVisible(true)}
            className="lg:hidden w-8 h-8 rounded-lg bg-surface-hover flex items-center justify-center text-text-secondary"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-secondary to-secondary-glow flex items-center justify-center">
            <Bot className="w-5 h-5 text-text-primary" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-text-primary truncate">
              {selectedSession ? selectedSession.title || 'AI 学习助手' : '请选择或开始对话'}
            </p>
            <p className="text-2xs text-text-muted">
              {currentChild ? `当前孩子：${currentChild.name}` : '未选择孩子'}
            </p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {!selectedSessionId ? (
            <div className="h-full flex items-center justify-center">
              <EmptyState
                icon={Bot}
                title="开始一次学习咨询"
                description="选择左侧对话或点击「新对话」向 AI 学习助手提问"
              />
            </div>
          ) : messagesLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : messages.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <EmptyState
                icon={Bot}
                title="发送第一条消息"
                description="向 AI 学习助手提问关于学习规划、学科提升或习惯养成的问题"
              />
            </div>
          ) : (
            <AnimatePresence initial={false}>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${
                    message.role === 'user' ? 'flex-row-reverse' : ''
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      message.role === 'user'
                        ? 'bg-primary/20'
                        : 'bg-gradient-to-br from-secondary to-secondary-glow'
                    }`}
                  >
                    {message.role === 'user' ? (
                      <User className="w-4 h-4 text-primary" />
                    ) : (
                      <Bot className="w-4 h-4 text-text-primary" />
                    )}
                  </div>
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                      message.role === 'user'
                        ? 'bg-primary text-text-primary rounded-tr-none'
                        : 'bg-surface border border-border-default rounded-tl-none text-text-secondary'
                    }`}
                  >
                    {message.content}
                  </div>
                </motion.div>
              ))}
              {sendMessage.isPending && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-secondary to-secondary-glow flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4 text-text-primary" />
                  </div>
                  <div className="bg-surface border border-border-default rounded-2xl rounded-tl-none px-4 py-2.5 flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-secondary" />
                    <span className="text-sm text-text-muted">AI 正在思考…</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form
          onSubmit={handleSend}
          className="p-3 border-t border-border-default shrink-0"
        >
          <div className="flex items-center gap-2 rounded-2xl bg-surface border border-border-default px-3 py-2 focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/10 transition-all">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                selectedSessionId
                  ? '输入问题，例如：如何帮助孩子提高数学计算速度？'
                  : '请先选择或创建一个对话'
              }
              disabled={!selectedSessionId || sendMessage.isPending}
              className="flex-1 bg-transparent text-sm text-text-secondary placeholder:text-text-muted focus:outline-none disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!input.trim() || !selectedSessionId || sendMessage.isPending}
              className="w-9 h-9 rounded-xl bg-primary text-text-primary flex items-center justify-center hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {sendMessage.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
