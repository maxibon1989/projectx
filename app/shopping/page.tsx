'use client';

import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { PageLayout } from '@/components/layout';
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Modal,
  Input,
  Badge,
  Avatar,
  EmptyState,
} from '@/components/ui';
import { ShoppingItem, ItemPriority, ItemCategory } from '@/types';
import { formatRelativeTime, generateId } from '@/lib/utils';
import {
  FiShoppingCart,
  FiPlus,
  FiCheck,
  FiEdit2,
  FiTrash2,
  FiUser,
} from 'react-icons/fi';

const priorities: { value: ItemPriority; label: string }[] = [
  { value: 'urgent', label: 'Urgent' },
  { value: 'high', label: 'High' },
  { value: 'normal', label: 'Normal' },
  { value: 'low', label: 'Low' },
];

const categories: { value: ItemCategory; label: string }[] = [
  { value: 'food', label: 'Food' },
  { value: 'cleaning', label: 'Cleaning' },
  { value: 'toiletries', label: 'Toiletries' },
  { value: 'maintenance', label: 'Maintenance' },
  { value: 'other', label: 'Other' },
];

export default function ShoppingPage() {
  const { state, dispatch, getHouseById, getShoppingItemsForHouse, getMemberById } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<ShoppingItem | null>(null);
  const [filter, setFilter] = useState<ItemCategory | 'all'>('all');

  // Form states
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [priority, setPriority] = useState<ItemPriority>('normal');
  const [category, setCategory] = useState<ItemCategory>('other');

  const selectedHouse = state.selectedHouseId
    ? getHouseById(state.selectedHouseId)
    : null;

  const allItems = selectedHouse ? getShoppingItemsForHouse(selectedHouse.id) : [];
  const items = filter === 'all' ? allItems : allItems.filter((i) => i.category === filter);

  const resetForm = () => {
    setName('');
    setQuantity('1');
    setPriority('normal');
    setCategory('other');
    setEditingItem(null);
  };

  const handleSubmit = () => {
    if (!selectedHouse || !name.trim()) return;

    if (editingItem) {
      const updatedItem: ShoppingItem = {
        ...editingItem,
        name: name.trim(),
        quantity: parseInt(quantity) || 1,
        priority,
        category,
      };
      dispatch({ type: 'UPDATE_SHOPPING_ITEM', payload: updatedItem });
    } else {
      const newItem: ShoppingItem = {
        id: generateId(),
        houseId: selectedHouse.id,
        name: name.trim(),
        quantity: parseInt(quantity) || 1,
        priority,
        category,
        addedBy: state.currentUser?.id || '',
        createdAt: new Date(),
      };
      dispatch({ type: 'ADD_SHOPPING_ITEM', payload: newItem });
    }

    resetForm();
    setShowModal(false);
  };

  const handleMarkBought = (itemId: string) => {
    dispatch({
      type: 'MARK_ITEM_BOUGHT',
      payload: { itemId, boughtBy: state.currentUser?.id || '' },
    });
  };

  const handleAssignToMe = (item: ShoppingItem) => {
    dispatch({
      type: 'UPDATE_SHOPPING_ITEM',
      payload: { ...item, assignedTo: state.currentUser?.id },
    });
  };

  const handleDelete = (itemId: string) => {
    if (confirm('Remove this item from the list?')) {
      dispatch({ type: 'DELETE_SHOPPING_ITEM', payload: itemId });
    }
  };

  const openEditModal = (item: ShoppingItem) => {
    setEditingItem(item);
    setName(item.name);
    setQuantity(item.quantity.toString());
    setPriority(item.priority);
    setCategory(item.category);
    setShowModal(true);
  };

  const getPriorityColor = (p: ItemPriority) => {
    const colors: Record<ItemPriority, 'danger' | 'warning' | 'info' | 'neutral'> = {
      urgent: 'danger',
      high: 'warning',
      normal: 'info',
      low: 'neutral',
    };
    return colors[p];
  };

  if (!selectedHouse) {
    return (
      <PageLayout title="Shopping List">
        <EmptyState
          icon={<FiShoppingCart className="w-8 h-8" />}
          title="No house selected"
          description="Select a house from the sidebar to view its shopping list."
        />
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Shopping List">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <p className="text-slate-500">
            Shared shopping list for {selectedHouse.name}
          </p>
          <Button onClick={() => setShowModal(true)}>
            <FiPlus className="w-4 h-4 mr-2" />
            Add Item
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filter === 'all'
                ? 'bg-slate-800 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All ({allItems.length})
          </button>
          {categories.map((cat) => {
            const count = allItems.filter((i) => i.category === cat.value).length;
            if (count === 0) return null;
            return (
              <button
                key={cat.value}
                onClick={() => setFilter(cat.value)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  filter === cat.value
                    ? 'bg-slate-800 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat.label} ({count})
              </button>
            );
          })}
        </div>

        {/* Items List */}
        {items.length === 0 ? (
          <EmptyState
            icon={<FiShoppingCart className="w-8 h-8" />}
            title={filter === 'all' ? 'Shopping list is empty' : 'No items in this category'}
            description="Add items that need to be bought for this house."
            actionLabel="Add Item"
            onAction={() => setShowModal(true)}
          />
        ) : (
          <Card>
            <CardBody className="p-0">
              <ul className="divide-y divide-slate-100">
                {items.map((item) => {
                  const addedBy = getMemberById(item.addedBy);
                  const assignedTo = item.assignedTo ? getMemberById(item.assignedTo) : null;
                  return (
                    <li
                      key={item.id}
                      className={`p-4 priority-${item.priority}`}
                    >
                      <div className="flex items-start gap-4">
                        <button
                          onClick={() => handleMarkBought(item.id)}
                          className="mt-1 p-1.5 rounded-lg border-2 border-slate-300 hover:border-green-500 hover:bg-green-50 transition-colors"
                          title="Mark as bought"
                        >
                          <FiCheck className="w-4 h-4 text-slate-400" />
                        </button>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-slate-800">
                              {item.name}
                            </span>
                            <Badge variant={getPriorityColor(item.priority)} size="sm">
                              {item.priority}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-3 mt-1 text-sm text-slate-500">
                            <span>Qty: {item.quantity}</span>
                            <span className="text-slate-300">|</span>
                            <span className="capitalize">{item.category}</span>
                          </div>
                          <div className="flex items-center gap-3 mt-2">
                            <span className="text-xs text-slate-400">
                              Added by {addedBy?.name || 'Unknown'} {formatRelativeTime(item.createdAt)}
                            </span>
                          </div>
                          {assignedTo ? (
                            <div className="flex items-center gap-1.5 mt-2">
                              <Avatar name={assignedTo.name} size="sm" />
                              <span className="text-xs text-slate-600">
                                {assignedTo.name} will get this
                              </span>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleAssignToMe(item)}
                              className="flex items-center gap-1 mt-2 text-xs text-slate-500 hover:text-slate-700"
                            >
                              <FiUser className="w-3 h-3" />
                              I'll get this
                            </button>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => openEditModal(item)}
                            className="p-1.5 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600"
                            title="Edit"
                          >
                            <FiEdit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-1.5 hover:bg-slate-100 rounded text-slate-400 hover:text-red-600"
                            title="Remove"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </CardBody>
          </Card>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          resetForm();
        }}
        title={editingItem ? 'Edit Item' : 'Add Item'}
        size="md"
      >
        <div className="p-4 space-y-4">
          <Input
            label="Item Name"
            placeholder="e.g., Toilet paper"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Quantity"
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as ItemPriority)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400"
              >
                {priorities.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ItemCategory)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400"
            >
              {categories.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowModal(false);
                resetForm();
              }}
              fullWidth
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit} fullWidth disabled={!name.trim()}>
              {editingItem ? 'Save Changes' : 'Add Item'}
            </Button>
          </div>
        </div>
      </Modal>
    </PageLayout>
  );
}
