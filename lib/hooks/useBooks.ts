'use client';

import { useQuery } from '@tanstack/react-query';
import { apiGet } from '@/lib/apiClient';
import type { Book, BookFilters, BooksResponse } from '@/lib/types';

export interface BookListFilters {
  grade?: string;
  subject?: string;
  publisher?: string;
  contentType?: string;
  isNewTextbook?: string;
  difficulty?: string;
  keyword?: string;
}

function buildQueryString(filters: BookListFilters) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.set(key, value);
  });
  const qs = params.toString();
  return qs ? `?${qs}` : '';
}

export function useBooks(filters: BookListFilters = {}) {
  return useQuery<BooksResponse>({
    queryKey: ['books', filters],
    queryFn: () => apiGet<BooksResponse>(`/api/books${buildQueryString(filters)}`),
  });
}

export function useBookFilters() {
  return useQuery<BookFilters>({
    queryKey: ['bookFilters'],
    queryFn: () => apiGet<BookFilters>('/api/books/filters'),
  });
}

export function useBookDetail(id: string | null) {
  return useQuery<Book>({
    queryKey: ['book', id],
    queryFn: () => apiGet<Book>(`/api/books/${id}`),
    enabled: !!id,
  });
}
