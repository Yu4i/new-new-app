'use client';

import { useState, useEffect } from 'react';
import { ref, onValue, push } from 'firebase/database';
import { database } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import DataItem from './DataItem';

interface DataItem {
  id: string;
  title: string;
  description: string;
  category: string;
  timestamp: number;
}

export default function DataList() {
  const { user } = useAuth();
  const [items, setItems] = useState<DataItem[]>([]);
  const [newItem, setNewItem] = useState({
    title: '',
    description: '',
    category: 'work'
  });
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'title'>('date');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const itemsRef = ref(database, `users/${user.uid}/items`);
    const unsubscribe = onValue(itemsRef, (snapshot) => {
      try {
        const data = snapshot.val();
        if (data) {
          const itemsList = Object.entries(data).map(([id, value]: [string, any]) => ({
            id,
            ...value
          }));
          setItems(itemsList);
        } else {
          setItems([]);
        }
        setError(null);
      } catch (error) {
        setError('Error loading data. Please try again later.');
        console.error('Error loading data:', error);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [user]);

  const handleAddItem = async () => {
    if (!user) {
      setError('Please sign in to add items');
      return;
    }

    if (!newItem.title.trim()) {
      setError('Title is required');
      return;
    }

    try {
      const itemData = {
        ...newItem,
        timestamp: Date.now(),
        userId: user.uid
      };

      await push(ref(database, `users/${user.uid}/items`), itemData);
      setNewItem({ title: '', description: '', category: 'work' });
      setError(null);
    } catch (error) {
      setError('Error adding item. Please try again.');
      console.error('Error adding item:', error);
    }
  };

  const filteredAndSortedItems = items
    .filter(item => 
      (filter === 'all' || item.category === filter) &&
      (searchQuery === '' || 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortBy === 'date') {
        return b.timestamp - a.timestamp;
      }
      return a.title.localeCompare(b.title);
    });

  if (!user) {
    return (
      <div className="text-center py-10">
        <h2 className="text-xl font-semibold text-gray-800">Please sign in to manage your data</h2>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-4">
        <h2 className="text-xl font-semibold mb-4">Add New Item</h2>
        <div className="space-y-3">
          <input
            type="text"
            value={newItem.title}
            onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
            className="w-full p-2 border rounded"
            placeholder="Title"
          />
          <textarea
            value={newItem.description}
            onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
            className="w-full p-2 border rounded"
            placeholder="Description"
          />
          <select
            value={newItem.category}
            onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
            className="w-full p-2 border rounded"
          >
            <option value="work">Work</option>
            <option value="personal">Personal</option>
            <option value="shopping">Shopping</option>
            <option value="other">Other</option>
          </select>
          <button
            onClick={handleAddItem}
            className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add Item
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-xl font-semibold">Your Items</h2>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search items..."
              className="p-2 border rounded w-full sm:w-64"
            />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="p-2 border rounded"
            >
              <option value="all">All Categories</option>
              <option value="work">Work</option>
              <option value="personal">Personal</option>
              <option value="shopping">Shopping</option>
              <option value="other">Other</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'title')}
              className="p-2 border rounded"
            >
              <option value="date">Sort by Date</option>
              <option value="title">Sort by Title</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          {filteredAndSortedItems.map((item) => (
            <DataItem key={item.id} {...item} />
          ))}
          {filteredAndSortedItems.length === 0 && (
            <p className="text-center text-gray-500">No items found</p>
          )}
        </div>
      </div>
    </div>
  );
} 