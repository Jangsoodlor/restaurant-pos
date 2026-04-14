import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tableApiClient } from '../api/client';
import type { Table, TableBase, TableUpdate } from '@/api/stub/models';

export const useTables = () => {
  return useQuery({
    queryKey: ['tables'],
    queryFn: () => tableApiClient.listTablesTableGet(),
  });
};

export const useCreateTable = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (tableBase: TableBase) =>
      tableApiClient.createTableTablePost({ tableBase }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tables'] });
    },
  });
};

export const useUpdateTable = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ tableId, tableUpdate }: { tableId: number; tableUpdate: TableUpdate }) =>
      tableApiClient.partialUpdateTableTableTableIdPatch({ tableId, tableUpdate }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tables'] });
    },
  });
};

export const useDeleteTable = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (tableId: number) =>
      tableApiClient.deleteTableTableTableIdDelete({ tableId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tables'] });
    },
  });
};