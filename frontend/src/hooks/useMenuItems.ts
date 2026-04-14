import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useMemo } from 'react';
import { menuApiClient } from '../api/client';
import type { MenuItem, MenuBase, MenuUpdate } from '@/api/stub/models';

export function useMenuItems() {
  const queryClient = useQueryClient();

  const [nameFilter, setNameFilter] = useState<string>('');
  const [minPrice, setMinPrice] = useState<number | ''>('');
  const [maxPrice, setMaxPrice] = useState<number | ''>('');
  const [sortOrder, setSortOrder] = useState<'none' | 'asc' | 'desc'>('none');

  const { data: items = [], isLoading, isError, error } = useQuery<MenuItem[]>({
    queryKey: ['menuItems'],
    queryFn: () => menuApiClient.listTablesMenuItemGet(),
  });

  const processed = useMemo(() => {
    let result = [...items];

    // Name filter (case-insensitive substring)
    if (nameFilter && nameFilter.trim() !== '') {
      const needle = nameFilter.trim().toLowerCase();
      result = result.filter((i) => (i.name ?? '').toLowerCase().includes(needle));
    }

    // Price range filter
    if (minPrice !== '') {
      result = result.filter((i) => typeof i.price === 'number' && i.price >= (minPrice as number));
    }
    if (maxPrice !== '') {
      result = result.filter((i) => typeof i.price === 'number' && i.price <= (maxPrice as number));
    }

    // Sorting by name
    if (sortOrder !== 'none') {
      result.sort((a, b) => a.name.localeCompare(b.name));
      if (sortOrder === 'desc') result.reverse();
    }

    return result;
  }, [items, nameFilter, minPrice, maxPrice, sortOrder]);

  const deleteMutation = useMutation({
    mutationFn: (menuItemId: number) =>
      menuApiClient.deleteMenuItemMenuItemMenuItemIdDelete({ menuItemId }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['menuItems'] }),
  });

  const createMutation = useMutation({
    mutationFn: (menuBase: MenuBase) =>
      menuApiClient.createMenuItemMenuItemPost({ menuBase }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['menuItems'] }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ menuItemId, menuUpdate }: { menuItemId: number; menuUpdate: MenuUpdate }) =>
      menuApiClient.partialUpdateItemMenuItemMenuItemIdPatch({ menuItemId, menuUpdate }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['menuItems'] }),
  });

  return {
    items: processed,
    isLoading,
    isError,
    error,
    nameFilter,
    setNameFilter,
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,
    sortOrder,
    setSortOrder,
    deleteItem: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
    createItem: createMutation.mutate,
    isCreating: createMutation.isPending,
    updateItem: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
  } as const;
}

export default useMenuItems;
