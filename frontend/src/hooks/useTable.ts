import { useQuery } from '@tanstack/react-query';
import { tableApiClient } from '../api/client'; // Assuming you exported a TableApi instance

export const useTables = () => {
  return useQuery({
    queryKey: ['tables'],
    queryFn: () => tableApiClient.listTablesTableGet(),
  });
};