'use client';

import { useCallback, useState, useTransition } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Search, LayoutGrid, List, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export type ViewMode = 'grid' | 'list';
export type SortOption = 'updatedAt-desc' | 'updatedAt-asc' | 'title-asc' | 'createdAt-desc';
export type FilterOption = 'all' | 'ai-generated' | 'manual';

interface DashboardToolbarProps {
  view: ViewMode;
  onViewChange: (view: ViewMode) => void;
}

export function DashboardToolbar({ view, onViewChange }: DashboardToolbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const [searchValue, setSearchValue] = useState(searchParams.get('search') ?? '');

  const updateParams = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value && value !== 'all' && value !== 'updatedAt-desc') {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      // Reset to page 1 on filter/sort change
      if (key !== 'page') {
        params.delete('page');
      }
      startTransition(() => {
        router.replace(`${pathname}?${params.toString()}`);
      });
    },
    [searchParams, pathname, router],
  );

  function handleSearch(value: string): void {
    setSearchValue(value);
    // Debounce is handled by the caller's server fetch
    updateParams('search', value);
  }

  function handleSortChange(value: string): void {
    updateParams('sort', value);
  }

  function handleFilterChange(value: string): void {
    updateParams('filter', value);
  }

  const currentSort = searchParams.get('sort') ?? 'updatedAt-desc';
  const currentFilter = searchParams.get('filter') ?? 'all';

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search presentations..."
          value={searchValue}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-9"
          aria-label="Search presentations"
        />
      </div>

      <div className="flex items-center gap-2">
        <Select value={currentFilter} onValueChange={handleFilterChange}>
          <SelectTrigger className="w-[140px]" aria-label="Filter presentations">
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="ai-generated">AI Generated</SelectItem>
            <SelectItem value="manual">Manual</SelectItem>
          </SelectContent>
        </Select>

        <Select value={currentSort} onValueChange={handleSortChange}>
          <SelectTrigger className="w-[170px]" aria-label="Sort presentations">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="updatedAt-desc">Recently Edited</SelectItem>
            <SelectItem value="updatedAt-asc">Oldest Edited</SelectItem>
            <SelectItem value="createdAt-desc">Newest Created</SelectItem>
            <SelectItem value="title-asc">Alphabetical</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex rounded-md border">
          <Button
            variant={view === 'grid' ? 'secondary' : 'ghost'}
            size="icon"
            className="h-9 w-9 rounded-r-none"
            onClick={() => onViewChange('grid')}
            aria-label="Grid view"
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant={view === 'list' ? 'secondary' : 'ghost'}
            size="icon"
            className="h-9 w-9 rounded-l-none"
            onClick={() => onViewChange('list')}
            aria-label="List view"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
