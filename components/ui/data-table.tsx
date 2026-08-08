'use client';

import * as React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import Card from './card';
import Button from './button';
import Skeleton from './skeleton';
import EmptyState from './EmptyState';

export interface DataTableColumn<T> {
  key: string;
  title: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
  render?: (row: T, index: number) => React.ReactNode;
  sorter?: (a: T, b: T) => number;
}

export interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  loading?: boolean;
  emptyText?: string;
  rowKey?: keyof T | ((row: T) => string);
  pagination?: {
    current: number;
    pageSize: number;
    total: number;
    onChange: (page: number) => void;
  };
  onRowClick?: (row: T) => void;
  className?: string;
}

type SortState<T> = {
  key: string;
  direction: 'asc' | 'desc';
  sorter: (a: T, b: T) => number;
} | null;

function getRowKey<T>(row: T, rowKey: DataTableProps<T>['rowKey'], index: number): string {
  if (!rowKey) return String(index);
  if (typeof rowKey === 'function') return rowKey(row);
  return String(row[rowKey] ?? index);
}

export default function DataTable<T>({
  columns,
  data,
  loading = false,
  emptyText = '暂无数据',
  rowKey,
  pagination,
  onRowClick,
  className,
}: DataTableProps<T>) {
  const [sort, setSort] = React.useState<SortState<T>>(null);

  const handleSort = (column: DataTableColumn<T>) => {
    if (!column.sorter) return;
    if (sort?.key === column.key) {
      setSort(
        sort.direction === 'asc'
          ? { key: column.key, direction: 'desc', sorter: column.sorter }
          : null
      );
    } else {
      setSort({ key: column.key, direction: 'asc', sorter: column.sorter });
    }
  };

  const sortedData = React.useMemo(() => {
    if (!sort) return data;
    return [...data].sort((a, b) => {
      const result = sort.sorter(a, b);
      return sort.direction === 'asc' ? result : -result;
    });
  }, [data, sort]);

  const totalPages = pagination
    ? Math.max(1, Math.ceil(pagination.total / pagination.pageSize))
    : 1;

  return (
    <Card padding="none" className={cn('overflow-hidden', className)}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-surface-hover text-xs font-medium uppercase tracking-wide text-text-muted">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={cn(
                    'px-6 py-3 text-left',
                    column.align === 'center' && 'text-center',
                    column.align === 'right' && 'text-right',
                    column.sorter && 'cursor-pointer select-none hover:text-text-secondary'
                  )}
                  style={{ width: column.width }}
                  onClick={() => handleSort(column)}
                >
                  <div
                    className={cn(
                      'inline-flex items-center gap-1',
                      column.align === 'center' && 'justify-center',
                      column.align === 'right' && 'justify-end'
                    )}
                  >
                    {column.title}
                    {column.sorter && (
                      <span className="inline-flex flex-col">
                        <ChevronUp
                          className={cn(
                            '-mb-1 size-3',
                            sort?.key === column.key && sort.direction === 'asc'
                              ? 'text-text-primary'
                              : 'text-text-disabled'
                          )}
                        />
                        <ChevronDown
                          className={cn(
                            'size-3',
                            sort?.key === column.key && sort.direction === 'desc'
                              ? 'text-text-primary'
                              : 'text-text-disabled'
                          )}
                        />
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading &&
              Array.from({ length: 5 }).map((_, rowIndex) => (
                <tr key={`skeleton-${rowIndex}`} className="border-b border-border-subtle">
                  {columns.map((column) => (
                    <td key={column.key} className="px-6 py-4">
                      <Skeleton className="h-4 w-full" />
                    </td>
                  ))}
                </tr>
              ))}
            {!loading && sortedData.length === 0 && (
              <tr>
                <td colSpan={columns.length}>
                  <EmptyState icon={undefined} title={emptyText} compact />
                </td>
              </tr>
            )}
            {!loading &&
              sortedData.map((row, index) => (
                <tr
                  key={getRowKey(row, rowKey, index)}
                  className={cn(
                    'border-b border-border-subtle text-text-secondary transition-colors',
                    onRowClick && 'cursor-pointer hover:bg-surface-hover'
                  )}
                  onClick={() => onRowClick?.(row)}
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={cn(
                        'px-6 py-4',
                        column.align === 'center' && 'text-center',
                        column.align === 'right' && 'text-right'
                      )}
                    >
                      {column.render
                        ? column.render(row, index)
                        : String((row as Record<string, unknown>)[column.key] ?? '')}
                    </td>
                  ))}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      {pagination && totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-border-subtle px-6 py-4">
          <p className="text-sm text-text-muted">
            共 {pagination.total} 条，第 {pagination.current} / {totalPages} 页
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => pagination.onChange(pagination.current - 1)}
              disabled={pagination.current <= 1}
            >
              上一页
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => pagination.onChange(pagination.current + 1)}
              disabled={pagination.current >= totalPages}
            >
              下一页
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
