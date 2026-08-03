'use client';

import { ExternalLink, BookOpen, Star, Package, Calendar, User, Target, FileText, Lightbulb, Layers } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import { useBookDetail } from '@/lib/hooks/useBooks';
import EmptyState from '@/components/ui/EmptyState';

interface BookDetailModalProps {
  bookId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

function Section({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}) {
  if (!children) return null;
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-text-secondary">
        <Icon className="w-4 h-4 text-primary" />
        <h4 className="text-sm font-semibold font-display">{title}</h4>
      </div>
      <div className="text-sm text-text-tertiary leading-relaxed pl-6">
        {children}
      </div>
    </div>
  );
}

function DifficultyStars({ difficulty }: { difficulty: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${
            i < difficulty
              ? 'text-warning fill-warning'
              : 'text-text-muted/30'
          }`}
        />
      ))}
    </div>
  );
}

function PurchaseLink({
  href,
  label,
  platform,
}: {
  href: string;
  label: string;
  platform: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-between gap-3 p-3 rounded-xl bg-surface-elevated border border-border-default hover:border-primary/30 hover:bg-surface-highlight transition-all group"
    >
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <Package className="w-4 h-4 text-primary" />
        </div>
        <div>
          <p className="text-sm font-medium text-text-secondary group-hover:text-text-primary transition-colors">
            {label}
          </p>
          <p className="text-2xs text-text-muted">{platform}</p>
        </div>
      </div>
      <ExternalLink className="w-4 h-4 text-text-muted group-hover:text-primary transition-colors" />
    </a>
  );
}

export default function BookDetailModal({ bookId, isOpen, onClose }: BookDetailModalProps) {
  const { data: book, isLoading, error } = useBookDetail(bookId);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={book?.title ?? '教辅详情'}
      subtitle={book ? `${book.publisher.name} · ${book.grade}` : undefined}
      icon={BookOpen}
      size="lg"
      colorScheme="accent"
    >
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      )}

      {error && (
        <EmptyState
          icon={BookOpen}
          title="加载失败"
          description={error instanceof Error ? error.message : '无法加载教辅详情'}
        />
      )}

      {!isLoading && book && (
        <div className="space-y-6">
          {/* 基础信息 */}
          <div className="flex flex-wrap gap-2">
            <span className="text-2xs px-2 py-1 rounded-md bg-surface-elevated text-text-muted border border-border-subtle">
              {book.subject}
            </span>
            <span className="text-2xs px-2 py-1 rounded-md bg-surface-elevated text-text-muted border border-border-subtle">
              {book.contentType.name}
            </span>
            <span className="text-2xs px-2 py-1 rounded-md bg-surface-elevated text-text-muted border border-border-subtle">
              {book.grade}
            </span>
            {book.isNewTextbook !== '否' && (
              <span className="text-2xs px-2 py-1 rounded-md bg-success/10 text-success border border-success/10">
                新教材{book.isNewTextbook === '部分适配' ? '部分适配' : '适配'}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 rounded-xl bg-surface-elevated border border-border-default">
              <p className="text-2xs text-text-muted mb-1">难度</p>
              <DifficultyStars difficulty={book.difficulty} />
            </div>
            {book.price ? (
              <div className="p-3 rounded-xl bg-surface-elevated border border-border-default">
                <p className="text-2xs text-text-muted mb-1">定价</p>
                <p className="text-sm font-semibold text-text-secondary">
                  ¥{book.price.toFixed(2)}
                </p>
              </div>
            ) : null}
            {book.author ? (
              <div className="p-3 rounded-xl bg-surface-elevated border border-border-default">
                <p className="text-2xs text-text-muted mb-1">作者/编写组</p>
                <p className="text-sm text-text-secondary truncate">{book.author}</p>
              </div>
            ) : null}
            {book.editionDate || book.editionNumber ? (
              <div className="p-3 rounded-xl bg-surface-elevated border border-border-default">
                <p className="text-2xs text-text-muted mb-1">出版信息</p>
                <p className="text-sm text-text-secondary truncate">
                  {[book.editionDate, book.editionNumber].filter(Boolean).join(' · ')}
                </p>
              </div>
            ) : null}
            {book.isbn ? (
              <div className="p-3 rounded-xl bg-surface-elevated border border-border-default col-span-2">
                <p className="text-2xs text-text-muted mb-1">ISBN</p>
                <p className="text-sm text-text-secondary font-mono">{book.isbn}</p>
              </div>
            ) : null}
          </div>

          {book.textbookVersion ? (
            <div className="p-3 rounded-xl bg-primary/5 border border-primary/10">
              <p className="text-xs text-text-secondary">
                <span className="font-medium">适配教材：</span>
                {book.textbookVersion}
              </p>
            </div>
          ) : null}

          <Section icon={Lightbulb} title="核心卖点">
            {book.sellingPoints}
          </Section>

          <Section icon={Layers} title="结构说明">
            {book.structureDesc}
          </Section>

          <Section icon={Target} title="适合人群">
            {book.targetAudience}
          </Section>

          <Section icon={FileText} title="配套建议">
            {book.companionSuggestion}
          </Section>

          {/* 购买链接 */}
          {(book.jdUrl || book.dangdangUrl || book.officialUrl) && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-text-secondary">
                <Calendar className="w-4 h-4 text-primary" />
                <h4 className="text-sm font-semibold font-display">购买渠道</h4>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-6">
                {book.jdUrl && (
                  <PurchaseLink href={book.jdUrl} label="京东购买" platform="京东" />
                )}
                {book.dangdangUrl && (
                  <PurchaseLink href={book.dangdangUrl} label="当当购买" platform="当当" />
                )}
                {book.officialUrl && (
                  <PurchaseLink
                    href={book.officialUrl}
                    label="官方旗舰店"
                    platform="出版社官方"
                  />
                )}
              </div>
              <p className="text-2xs text-text-muted pl-6">
                链接为推广/广告，价格以实际页面为准
              </p>
            </div>
          )}

          {!book.jdUrl && !book.dangdangUrl && !book.officialUrl && book.isbn && (
            <div className="p-3 rounded-xl bg-surface-elevated border border-border-default">
              <p className="text-xs text-text-tertiary">
                暂无购买链接，可复制 ISBN 到电商平台搜索：
                <a
                  href={`https://search.jd.com/Search?keyword=${encodeURIComponent(book.isbn)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary-glow transition-colors ml-1"
                >
                  去京东搜索
                </a>
              </p>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}
