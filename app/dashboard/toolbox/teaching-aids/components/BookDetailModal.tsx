'use client';
import { Icon, type IconName } from '@/components/ui/icon';

import Modal from '@/components/ui/Modal';
import { useBookDetail } from '@/lib/hooks/useBooks';
import EmptyState from '@/components/ui/EmptyState';

interface BookDetailModalProps {
  bookId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

function Section({
  icon,
  title,
  children,
}: {
  icon: IconName;
  title: string;
  children: React.ReactNode;
}) {
  if (!children) return null;
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-text-secondary">
        <Icon name={icon} size="sm" className="size-4 text-primary" />
        <h4 className="font-display text-sm font-semibold">{title}</h4>
      </div>
      <div className="pl-6 text-sm leading-relaxed text-text-tertiary">{children}</div>
    </div>
  );
}

function DifficultyStars({ difficulty }: { difficulty: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Icon
          name="Star"
          size="md"
          key={i}
          className={`size-4 ${i < difficulty ? 'fill-warning text-warning' : 'text-text-muted/30'}`}
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
      className="hover:border-primary/30 group flex items-center justify-between gap-3 rounded-xl border border-border-default bg-surface-elevated p-3 transition-all hover:bg-surface-highlight"
    >
      <div className="flex items-center gap-2.5">
        <div className="bg-primary/10 flex size-8 items-center justify-center rounded-lg">
          <Icon name="Package" size="sm" className="text-primary" />
        </div>
        <div>
          <p className="text-sm font-medium text-text-secondary transition-colors group-hover:text-text-primary">
            {label}
          </p>
          <p className="text-2xs text-text-muted">{platform}</p>
        </div>
      </div>
      <Icon
        name="ExternalLink"
        size="sm"
        className="text-text-muted transition-colors group-hover:text-primary"
      />
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
      icon="BookOpen"
      size="lg"
      colorScheme="accent"
    >
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="border-primary/30 size-8 animate-spin rounded-full border-2 border-t-primary" />
        </div>
      )}

      {error && (
        <EmptyState
          icon="BookOpen"
          title="加载失败"
          description={error instanceof Error ? error.message : '无法加载教辅详情'}
        />
      )}

      {!isLoading && book && (
        <div className="space-y-6">
          {/* 基础信息 */}
          <div className="flex flex-wrap gap-2">
            <span className="rounded-md border border-border-subtle bg-surface-elevated px-2 py-1 text-2xs text-text-muted">
              {book.subject}
            </span>
            <span className="rounded-md border border-border-subtle bg-surface-elevated px-2 py-1 text-2xs text-text-muted">
              {book.contentType.name}
            </span>
            <span className="rounded-md border border-border-subtle bg-surface-elevated px-2 py-1 text-2xs text-text-muted">
              {book.grade}
            </span>
            {book.isNewTextbook !== '否' && (
              <span className="bg-success/10 border-success/10 rounded-md border px-2 py-1 text-2xs text-success">
                新教材{book.isNewTextbook === '部分适配' ? '部分适配' : '适配'}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-border-default bg-surface-elevated p-3">
              <p className="mb-1 text-2xs text-text-muted">难度</p>
              <DifficultyStars difficulty={book.difficulty} />
            </div>
            {book.price ? (
              <div className="rounded-xl border border-border-default bg-surface-elevated p-3">
                <p className="mb-1 text-2xs text-text-muted">定价</p>
                <p className="text-sm font-semibold text-text-secondary">
                  ¥{book.price.toFixed(2)}
                </p>
              </div>
            ) : null}
            {book.author ? (
              <div className="rounded-xl border border-border-default bg-surface-elevated p-3">
                <p className="mb-1 text-2xs text-text-muted">作者/编写组</p>
                <p className="truncate text-sm text-text-secondary">{book.author}</p>
              </div>
            ) : null}
            {book.editionDate || book.editionNumber ? (
              <div className="rounded-xl border border-border-default bg-surface-elevated p-3">
                <p className="mb-1 text-2xs text-text-muted">出版信息</p>
                <p className="truncate text-sm text-text-secondary">
                  {[book.editionDate, book.editionNumber].filter(Boolean).join(' · ')}
                </p>
              </div>
            ) : null}
            {book.isbn ? (
              <div className="col-span-2 rounded-xl border border-border-default bg-surface-elevated p-3">
                <p className="mb-1 text-2xs text-text-muted">ISBN</p>
                <p className="font-mono text-sm text-text-secondary">{book.isbn}</p>
              </div>
            ) : null}
          </div>

          {book.textbookVersion ? (
            <div className="bg-primary/5 border-primary/10 rounded-xl border p-3">
              <p className="text-xs text-text-secondary">
                <span className="font-medium">适配教材：</span>
                {book.textbookVersion}
              </p>
            </div>
          ) : null}

          <Section icon="Lightbulb" title="核心卖点">
            {book.sellingPoints}
          </Section>

          <Section icon="Layers" title="结构说明">
            {book.structureDesc}
          </Section>

          <Section icon="Target" title="适合人群">
            {book.targetAudience}
          </Section>

          <Section icon="FileText" title="配套建议">
            {book.companionSuggestion}
          </Section>

          {/* 购买链接 */}
          {(book.jdUrl || book.dangdangUrl || book.officialUrl) && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-text-secondary">
                <Icon name="Calendar" size="sm" className="text-primary" />
                <h4 className="font-display text-sm font-semibold">购买渠道</h4>
              </div>
              <div className="grid grid-cols-1 gap-2 pl-6 sm:grid-cols-2">
                {book.jdUrl && <PurchaseLink href={book.jdUrl} label="京东购买" platform="京东" />}
                {book.dangdangUrl && (
                  <PurchaseLink href={book.dangdangUrl} label="当当购买" platform="当当" />
                )}
                {book.officialUrl && (
                  <PurchaseLink href={book.officialUrl} label="官方旗舰店" platform="出版社官方" />
                )}
              </div>
              <p className="pl-6 text-2xs text-text-muted">链接为推广/广告，价格以实际页面为准</p>
            </div>
          )}

          {!book.jdUrl && !book.dangdangUrl && !book.officialUrl && book.isbn && (
            <div className="rounded-xl border border-border-default bg-surface-elevated p-3">
              <p className="text-xs text-text-tertiary">
                暂无购买链接，可复制 ISBN 到电商平台搜索：
                <a
                  href={`https://search.jd.com/Search?keyword=${encodeURIComponent(book.isbn)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-1 text-primary transition-colors hover:text-primary-glow"
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
