import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useMemo } from 'react';
import { menuApiClient } from '../api/client';
import type { MenuItem, MenuBase, MenuUpdate } from '../api/stub/models';

export function useMenuModifiers() {
  const queryClient = useQueryClient();

  const [nameFilter, setNameFilter] = useState<string>('');
  const [minPrice, setMinPrice] = useState<number | ''>('');
  const [maxPrice, setMaxPrice] = useState<number | ''>('');
  const [sortOrder, setSortOrder] = useState<'none' | 'asc' | 'desc'>('none');

  const { data: items = [], isLoading, isError, error } = useQuery<MenuItem[]>({
    queryKey: ['menuModifiers'],
    queryFn: () => menuApiClient.listModifiersMenuModifierGet(),
  });

  const processed = useMemo(() => {
    let result = [...items];

    if (nameFilter && nameFilter.trim() !== '') {
      const needle = nameFilter.trim().toLowerCase();
      result = result.filter((i) => (i.name ?? '').toLowerCase().includes(needle));
    }

    if (minPrice !== '') {
      result = result.filter((i) => typeof i.price === 'number' && i.price >= (minPrice as number));
    }
    if (maxPrice !== '') {
      result = result.filter((i) => typeof i.price === 'number' && i.price <= (maxPrice as number));
    }

    if (sortOrder !== 'none') {
      result.sort((a, b) => a.name.localeCompare(b.name));
      if (sortOrder === 'desc') result.reverse();
    }

    return result;
  }, [items, nameFilter, minPrice, maxPrice, sortOrder]);

  const deleteMutation = useMutation({
    mutationFn: (modifierId: number) =>
      menuApiClient.deleteModifierMenuModifierModifierIdDelete({ modifierId }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['menuModifiers'] }),
  });

  const createMutation = useMutation({
    mutationFn: (menuBase: MenuBase) =>
      menuApiClient.createModifierMenuModifierPost({ menuBase }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['menuModifiers'] }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ modifierId, menuUpdate }: { modifierId: number; menuUpdate: MenuUpdate }) =>
      menuApiClient.partialUpdateModifierMenuModifierModifierIdPatch({ modifierId, menuUpdate }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['menuModifiers'] }),
  });

  return {
    modifiers: processed,
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
    deleteModifier: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
    createModifier: createMutation.mutate,
    isCreating: createMutation.isPending,
    updateModifier: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
  } as const;
}

export default useMenuModifiers;
