import { useQuery } from '@tanstack/react-query';
import { tableApiClient } from '../api/client';

export const useTables = () => {
  return useQuery({
    queryKey: ['tables'],
    queryFn: () => tableApiClient.listTablesTableGet(),
  });
};