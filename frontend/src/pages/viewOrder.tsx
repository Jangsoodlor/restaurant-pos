import React, { useState } from 'react';
import { Link } from 'wouter';
import useOrders from '@/hooks/useOrders';
import { OrderDetail } from '@/components/OrderDetail';
import { DeleteDialog } from '@/components/DeleteDialog';
import { ActionMenu } from '@/components/ActionMenu';
import type { OrderWithLineItems, OrderUpdate } from '@/api/stub';

function formatTimeSince(date: Date | string | undefined): string {
  if (!date) return 'N/A';

  let then: Date;

  if (typeof date === 'string') {
    // If it comes in as a string, fix the label
    const forcedUtcString = date.replace(/ GMT.*/, ' UTC');
    then = new Date(forcedUtcString);
  } else {
    then = new Date(Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds()
    ));
  }

  const now = new Date();
  const diffMs = now.getTime() - then.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  return `${Math.max(0, diffMins)} min ago`;
}

export default function ViewOrder() {
  const [activeTab, setActiveTab] = useState<'ongoing' | 'completed'>('ongoing');
  const [selectedOrder, setSelectedOrder] = useState<OrderWithLineItems | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<OrderWithLineItems | null>(null);
  const [editStatusTarget, setEditStatusTarget] = useState<OrderWithLineItems | null>(null);
  const [newStatus, setNewStatus] = useState<string>('');

  const hook = useOrders();

  const displayOrders = activeTab === 'ongoing' ? hook.groupedOrders.ongoing : hook.groupedOrders.completed;

  return (
    <section>
      <header className="space">
        <nav>
          <button
            className={`button transparent ${activeTab === 'ongoing' ? 'active' : ''}`}
            onClick={() => setActiveTab('ongoing')}
          >
            Ongoing
          </button>
          <button
            className={`button transparent ${activeTab === 'completed' ? 'active' : ''}`}
            onClick={() => setActiveTab('completed')}
          >
            Completed
          </button>
        </nav>
      </header>

      <nav className="space">
        <Link href="/orders/create">
          <button className="button">Create Order</button>
        </Link>
      </nav>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {hook.isLoading ? (
          <div>Loading...</div>
        ) : displayOrders.length === 0 ? (
          <div className="padding">No orders</div>
        ) : (
          displayOrders.map((o: OrderWithLineItems) => {
            const order = o.order;
            return (
              <article
                key={order.id}
                className="round border padding row top-align"
                onClick={() => setSelectedOrder(o)}
                style={{ cursor: 'pointer' }}
              >
                <div className="max">
                  <h6 className="no-margin">Order #{order.id}</h6>
                  <p className="no-margin" style={{ marginTop: '0.25rem', fontSize: '0.9rem' }}>
                    <span className="bold">Table ID:</span> {order.tableId}
                  </p>
                  <p className="no-margin" style={{ fontSize: '0.9rem' }}>
                    <span className="bold">Waiter ID:</span> {order.userId}
                  </p>
                  <p className="no-margin" style={{ fontSize: '0.9rem' }}>
                    <span className="bold">Created:</span> {formatTimeSince(order.createdAt)}
                  </p>
                  <p className="no-margin" style={{ fontSize: '0.9rem' }}>
                    <span className="bold">Status:</span> {order.status || 'draft'}
                  </p>
                </div>

                <div
                  className="row"
                  style={{ gap: '0.5rem' }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <ActionMenu
                    onEdit={() => {
                      setEditStatusTarget(o);
                      setNewStatus(order.status || 'draft');
                    }}
                    onDelete={() => setDeleteTarget(o)}
                    ariaLabel={`Actions for Order #${order.id}`}
                  />
                </div>
              </article>
            );
          })
        )}
      </div>

      <dialog className={`round border ${editStatusTarget ? 'active' : ''}`} open={!!editStatusTarget} style={{ backgroundColor: 'var(--surface, #fff)' }}>
        <div className="padding">
          <h5 className="no-margin">Edit Order Status</h5>
          <p>Order #{editStatusTarget?.order.id}</p>
          <div className="space">
            <label>
              Status:
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
              >
                <option value="draft">Draft</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </label>
          </div>
          <nav className="right-align">
            <button
              className="button transparent"
              onClick={() => setEditStatusTarget(null)}
            >
              Cancel
            </button>
            <button
              className="button"
              onClick={() => {
                if (editStatusTarget?.order.id) {
                  hook.updateOrder({
                    orderId: editStatusTarget.order.id,
                    orderUpdate: { status: newStatus as any }
                  });
                  setEditStatusTarget(null);
                }
              }}
            >
              Save
            </button>
          </nav>
        </div>
      </dialog>

      <DeleteDialog
        itemName={`Order #${deleteTarget?.order.id}`}
        isPending={hook.isDeleting}
        isOpen={!!deleteTarget}
        onConfirm={() => {
          if (deleteTarget && deleteTarget.order.id) {
            hook.deleteOrder(deleteTarget.order.id);
            setDeleteTarget(null);
          }
        }}
        onCancel={() => setDeleteTarget(null)}
      />

      {/* Order Detail Modal */}
      {selectedOrder && (
        <OrderDetail
          orderWithLineItems={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </section>
  );
}
