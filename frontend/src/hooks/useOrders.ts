import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orderApiClient } from '@/api/client';
import type { Order, OrderUpdate, OrderStatus, BodyCreateOrderOrderPost } from '@/api/stub';
import { useMemo, useState } from 'react';

const ORDERS_QUERY_KEY = ['orders'];

export default function useOrders() {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<OrderStatus | null>(null);
  const [tableIdFilter, setTableIdFilter] = useState<number | null>(null);

  // Fetch orders
  const { data: orders = [], isLoading, isError, error } = useQuery<Order[]>({
    queryKey: ORDERS_QUERY_KEY,
    queryFn: () =>
      orderApiClient.listOrdersOrderGet({
        status: statusFilter || undefined,
        tableId: tableIdFilter || undefined,
      }),
  });

  const createMutation = useMutation({
    mutationFn: async (payload: BodyCreateOrderOrderPost) => {
      // Since the payload is already perfectly shaped as BodyCreateOrderOrderPost,
      // you can just pass it directly into the API client!
      return orderApiClient.createOrderOrderPost({
        bodyCreateOrderOrderPost: payload,
      });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEY }),
  });
  // Update order
  const updateMutation = useMutation({
    mutationFn: ({ orderId, orderUpdate }: { orderId: number; orderUpdate: OrderUpdate }) =>
      orderApiClient.partialUpdateOrderOrderOrderIdPatch({ orderId, orderUpdate }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEY }),
  });

  // Delete order
  const deleteMutation = useMutation({
    mutationFn: (orderId: number) =>
      orderApiClient.deleteOrderOrderOrderIdDelete({ orderId }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEY }),
  });

  // Group by status for tabs
  const groupedOrders = useMemo(() => {
    const ongoing = orders.filter((o) => o.status === 'draft' || o.status === 'in_progress');
    const completed = orders.filter((o) => o.status === 'completed' || o.status === 'cancelled');
    return { ongoing, completed };
  }, [orders]);

  return {
    orders,
    groupedOrders,
    isLoading,
    isError,
    error,
    statusFilter,
    setStatusFilter,
    tableIdFilter,
    setTableIdFilter,
    createOrder: createMutation.mutate,
    isCreating: createMutation.isPending,
    updateOrder: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
    deleteOrder: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
  };
}
