'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { useChildren } from '@/components/dashboard/ChildrenContext';
import EmptyState from '@/components/ui/EmptyState';
import GlassCard from '@/components/ui/glass-card';
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

  const { data: sessions = [], isLoading: sessionsLoading } = useChatSessions(currentChild?.id);
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
    <div className="flex h-[calc(100vh-8rem)] flex-col gap-4 lg:flex-row">
      {/* Session list */}
      <motion.aside
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        className={`flex shrink-0 flex-col gap-3 lg:w-72 ${
          isMobileListVisible ? 'flex' : 'hidden lg:flex'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-xl border border-secondary/20 bg-secondary/10">
              <Icon name="Sparkles" size="sm" className="text-secondary" />
            </div>
            <h1 className="font-display text-xl font-bold text-text-primary">AI 学习助手</h1>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={handleCreateSession}
            disabled={createSession.isPending}
            className=""
          >
            {createSession.isPending ? (
              <Icon name="Loader" size="xs" animate="spin" />
            ) : (
              <Icon name="Plus" size="xs" />
            )}
            新对话
          </Button>
        </div>

        <GlassCard strength="subtle" className="flex-1 space-y-1 overflow-y-auto p-2">
          {sessionsLoading ? (
            <div className="flex items-center justify-center py-12">
              <Icon name="Loader" size="lg" animate="spin" className="text-primary" />
            </div>
          ) : sessions.length === 0 ? (
            <div className="py-8">
              <EmptyState
                icon="MessageSquare"
                title="还没有对话"
                description="点击右上角开始一个新的学习咨询"
              />
            </div>
          ) : (
            sessions.map((session) => (
              <Button
                key={session.id}
                variant="ghost"
                size="sm"
                onClick={() => handleSelectSession(session.id)}
                className={`w-full rounded-lg px-3 py-2.5 text-left transition-colors ${
                  selectedSessionId === session.id
                    ? 'bg-primary/10 border-primary/20 border'
                    : 'border border-transparent hover:bg-surface-highlight'
                }`}
              >
                <div className="mb-1 flex items-center gap-2">
                  <Icon
                    name="MessageSquare"
                    size="sm"
                    className={
                      selectedSessionId === session.id ? 'text-primary' : 'text-text-muted'
                    }
                  />
                  <p className="truncate text-sm font-medium text-text-primary">
                    {session.title || '未命名对话'}
                  </p>
                </div>
                <div className="flex items-center justify-between text-2xs text-text-muted">
                  <span className="flex items-center gap-1">
                    <Icon name="Clock" size="xs" />
                    {new Date(session.updatedAt).toLocaleDateString('zh-CN')}
                  </span>
                  <span>{session._count?.messages ?? 0} 条消息</span>
                </div>
              </Button>
            ))
          )}
        </GlassCard>
      </motion.aside>

      {/* Chat area */}
      <GlassCard
        strength="default"
        className={`flex flex-1 flex-col overflow-hidden ${
          isMobileListVisible ? 'hidden lg:flex' : 'flex'
        }`}
      >
        {/* Header */}
        <div className="flex shrink-0 items-center gap-3 border-b border-border-default px-4 py-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMobileListVisible(true)}
            className="lg:hidden"
          >
            <Icon name="ChevronLeft" size="sm" />
          </Button>
          <div className="flex size-9 items-center justify-center rounded-lg bg-gradient-to-br from-secondary to-secondary-glow">
            <Icon name="Bot" size="md" className="text-text-primary" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-text-primary">
              {selectedSession ? selectedSession.title || 'AI 学习助手' : '请选择或开始对话'}
            </p>
            <p className="text-2xs text-text-muted">
              {currentChild ? `当前孩子：${currentChild.name}` : '未选择孩子'}
            </p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 space-y-4 overflow-y-auto p-4">
          {!selectedSessionId ? (
            <div className="flex h-full items-center justify-center">
              <EmptyState
                icon="Bot"
                title="开始一次学习咨询"
                description="选择左侧对话或点击「新对话」向 AI 学习助手提问"
              />
            </div>
          ) : messagesLoading ? (
            <div className="flex h-full items-center justify-center">
              <Icon name="Loader" size="lg" animate="spin" className="text-primary" />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <EmptyState
                icon="Bot"
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
                  className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div
                    className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${
                      message.role === 'user'
                        ? 'bg-primary/20'
                        : 'bg-gradient-to-br from-secondary to-secondary-glow'
                    }`}
                  >
                    {message.role === 'user' ? (
                      <Icon name="User" size="sm" className="text-primary" />
                    ) : (
                      <Icon name="Bot" size="sm" className="text-text-primary" />
                    )}
                  </div>
                  {message.role === 'user' ? (
                    <div className="max-w-[80%] rounded-2xl rounded-tr-none bg-primary px-4 py-2.5 text-sm leading-relaxed text-text-primary">
                      {message.content}
                    </div>
                  ) : (
                    <GlassCard
                      strength="subtle"
                      className="max-w-[80%] rounded-2xl rounded-tl-none px-4 py-2.5 text-sm leading-relaxed text-text-secondary"
                    >
                      {message.content}
                    </GlassCard>
                  )}
                </motion.div>
              ))}
              {sendMessage.isPending && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3"
                >
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-secondary to-secondary-glow">
                    <Icon name="Bot" size="sm" className="text-text-primary" />
                  </div>
                  <GlassCard
                    strength="subtle"
                    className="flex items-center gap-2 rounded-2xl rounded-tl-none px-4 py-2.5"
                  >
                    <Icon name="Loader" size="sm" animate="spin" className="text-secondary" />
                    <span className="text-sm text-text-muted">AI 正在思考…</span>
                  </GlassCard>
                </motion.div>
              )}
            </AnimatePresence>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSend} className="shrink-0 border-t border-border-default p-3">
          <div className="focus-within:border-primary/50 focus-within:ring-primary/10 flex items-center gap-2 rounded-2xl border border-border-default bg-surface px-3 py-2 transition-all focus-within:ring-2">
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
            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={!input.trim() || !selectedSessionId || sendMessage.isPending}
              className=""
            >
              {sendMessage.isPending ? (
                <Icon name="Loader" size="sm" animate="spin" />
              ) : (
                <Icon name="Send" size="sm" />
              )}
            </Button>
          </div>
        </form>
      </GlassCard>
    </div>
  );
}
