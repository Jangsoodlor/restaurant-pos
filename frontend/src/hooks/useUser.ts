import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useMemo } from 'react';
import { userApiClient } from '../api/client';
import type { UserRead, Role, UserCreate, UserUpdate } from '@/api/stub/models';

export function useUser() {
  const queryClient = useQueryClient();

  // Local state for list controls
  const [filterRole, setFilterRole] = useState<Role | 'all'>('all');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Fetch users List
  const { data: users = [], isLoading, isError, error } = useQuery<UserRead[]>({
    queryKey: ['users'],
    queryFn: () => userApiClient.listUsersUserGet(),
  });

  // Client-side filtering and sorting
  const processedUsers = useMemo(() => {
    let result = [...users];

    // Apply Filter
    if (filterRole !== 'all') {
      result = result.filter((u) => u.role === filterRole);
    }

    // Apply Sort (sort by name as default sort logic)
    result.sort((a, b) => {
      const comparison = a.name.localeCompare(b.name);
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [users, filterRole, sortOrder]);

  // Handle Delete
  const deleteMutation = useMutation({
    mutationFn: (userId: number) =>
      userApiClient.deleteUserUserUserIdDelete({ userId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  // Handle Create
  const createMutation = useMutation({
    mutationFn: (userCreate: UserCreate) =>
      userApiClient.createUserUserPost({ userCreate }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  // Handle Update
  const updateMutation = useMutation({
    mutationFn: ({ userId, userUpdate }: { userId: number; userUpdate: UserUpdate }) =>
      userApiClient.partialUpdateUserUserUserIdPatch({ userId, userUpdate }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  return {
    users: processedUsers,
    isLoading,
    isError,
    error,
    filterRole,
    setFilterRole,
    sortOrder,
    setSortOrder,
    deleteUser: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
    deleteError: deleteMutation.error,
    createUser: createMutation.mutate,
    isCreating: createMutation.isPending,
    createError: createMutation.error,
    updateUser: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
    updateError: updateMutation.error,
  };
}
