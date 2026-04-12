import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orderApiClient } from '@/api/client';
import type { OrderLineItem, OrderLineItemCreate, OrderLineItemUpdate } from '@/api/stub';

export default function useOrderLineItems(orderId: number | null) {
  const queryClient = useQueryClient();
  const queryKey = ['orderLineItems', orderId];

  // Fetch line items for order
  const { data: lineItems = [], isLoading, isError, error } = useQuery<OrderLineItem[]>({
    queryKey,
    queryFn: () => orderApiClient.listLineItemsOrderOrderIdLineItemsGet({ orderId: orderId! }),
    enabled: !!orderId,
  });

  // Create line item
  const createMutation = useMutation({
    mutationFn: (lineItem: OrderLineItemCreate) =>
      orderApiClient.createLineItemOrderOrderIdLineItemsPost({
        orderId: orderId!,
        orderLineItemCreate: lineItem,
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  // Update line item
  const updateMutation = useMutation({
    mutationFn: ({ lineItemId, lineItemUpdate }: { lineItemId: number; lineItemUpdate: OrderLineItemUpdate }) =>
      orderApiClient.partialUpdateLineItemOrderOrderIdLineItemsLineItemIdPatch({
        orderId: orderId!,
        lineItemId,
        orderLineItemUpdate: lineItemUpdate,
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  // Delete line item
  const deleteMutation = useMutation({
    mutationFn: (lineItemId: number) =>
      orderApiClient.deleteLineItemOrderOrderIdLineItemsLineItemIdDelete({ orderId: orderId!, lineItemId }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  return {
    lineItems,
    isLoading,
    isError,
    error,
    createLineItem: createMutation.mutate,
    isCreating: createMutation.isPending,
    updateLineItem: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
    deleteLineItem: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
  };
}
