'use client';
import { Icon } from '@/components/ui/icon';

import CommandCard from '@/components/ui/CommandCard';
import type { Book } from '@/lib/types';

interface BookCardProps {
  book: Book;
  onClick: () => void;
}

function DifficultyStars({ difficulty }: { difficulty: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Icon
          name="Star"
          size="md"
          key={i}
          className={`size-3 ${i < difficulty ? 'fill-warning text-warning' : 'text-text-muted/30'}`}
        />
      ))}
    </div>
  );
}

export default function BookCard({ book, onClick }: BookCardProps) {
  return (
    <CommandCard
      hover
      onClick={onClick}
      className="group flex h-full cursor-pointer flex-col gap-3 p-4"
      aria-label={`${book.title}，点击进入详情`}
    >
      <div className="flex items-start gap-3">
        <div className="bg-primary/10 border-primary/15 flex size-11 shrink-0 items-center justify-center rounded-xl border">
          <Icon name="BookOpen" size="md" className="text-primary" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="line-clamp-2 font-display text-sm font-bold leading-snug text-text-primary transition-colors group-hover:text-text-primary">
            {book.title}
          </h3>
          <p className="mt-0.5 truncate text-xs text-text-tertiary">{book.publisher.name}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        <span className="rounded-md border border-border-subtle bg-surface-elevated px-1.5 py-0.5 text-2xs text-text-muted">
          {book.subject}
        </span>
        <span className="rounded-md border border-border-subtle bg-surface-elevated px-1.5 py-0.5 text-2xs text-text-muted">
          {book.contentType.name}
        </span>
        <span className="rounded-md border border-border-subtle bg-surface-elevated px-1.5 py-0.5 text-2xs text-text-muted">
          {book.grade}
        </span>
      </div>

      <div className="mt-auto flex items-center justify-between pt-1">
        <DifficultyStars difficulty={book.difficulty} />
        {book.price ? (
          <span className="text-xs text-text-tertiary">¥{book.price.toFixed(2)}</span>
        ) : (
          <span className="text-xs text-text-muted">暂无定价</span>
        )}
      </div>

      {book.sellingPoints && (
        <p className="line-clamp-2 text-xs leading-relaxed text-text-tertiary">
          {book.sellingPoints}
        </p>
      )}
    </CommandCard>
  );
}
