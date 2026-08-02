'use client';

import { BookOpen, Star } from 'lucide-react';
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
        <Star
          key={i}
          className={`w-3 h-3 ${
            i < difficulty
              ? 'text-warning fill-warning'
              : 'text-text-muted/30'
          }`}
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
      className="h-full p-4 flex flex-col gap-3 cursor-pointer group"
      aria-label={`${book.title}，点击进入详情`}
    >
      <div className="flex items-start gap-3">
        <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/15 flex items-center justify-center shrink-0">
          <BookOpen className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold font-display text-text-primary leading-snug line-clamp-2 group-hover:text-white transition-colors">
            {book.title}
          </h3>
          <p className="text-xs text-text-tertiary mt-0.5 truncate">
            {book.publisher.name}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        <span className="text-2xs px-1.5 py-0.5 rounded-md bg-surface-elevated text-text-muted border border-border-subtle">
          {book.subject}
        </span>
        <span className="text-2xs px-1.5 py-0.5 rounded-md bg-surface-elevated text-text-muted border border-border-subtle">
          {book.contentType.name}
        </span>
        <span className="text-2xs px-1.5 py-0.5 rounded-md bg-surface-elevated text-text-muted border border-border-subtle">
          {book.grade}
        </span>
      </div>

      <div className="flex items-center justify-between mt-auto pt-1">
        <DifficultyStars difficulty={book.difficulty} />
        {book.price ? (
          <span className="text-xs text-text-tertiary">
            ¥{book.price.toFixed(2)}
          </span>
        ) : (
          <span className="text-xs text-text-muted">暂无定价</span>
        )}
      </div>

      {book.sellingPoints && (
        <p className="text-xs text-text-tertiary line-clamp-2 leading-relaxed">
          {book.sellingPoints}
        </p>
      )}
    </CommandCard>
  );
}
