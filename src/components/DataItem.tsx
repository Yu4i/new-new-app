'use client';

import { useState } from 'react';
import { ref, update, remove } from 'firebase/database';
import { database } from '@/lib/firebase';

interface DataItemProps {
  id: string;
  title: string;
  description: string;
  category: string;
  timestamp: number;
}

export default function DataItem({ id, title, description, category, timestamp }: DataItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const [editedDescription, setEditedDescription] = useState(description);
  const [editedCategory, setEditedCategory] = useState(category);

  const handleUpdate = async () => {
    const updates = {
      title: editedTitle,
      description: editedDescription,
      category: editedCategory,
      lastModified: Date.now()
    };

    try {
      await update(ref(database, `items/${id}`), updates);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await remove(ref(database, `items/${id}`));
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 space-y-4">
      {isEditing ? (
        <div className="space-y-3">
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Title"
          />
          <textarea
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Description"
          />
          <select
            value={editedCategory}
            onChange={(e) => setEditedCategory(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="work">Work</option>
            <option value="personal">Personal</option>
            <option value="shopping">Shopping</option>
            <option value="other">Other</option>
          </select>
          <div className="flex space-x-2">
            <button
              onClick={handleUpdate}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold">{title}</h3>
              <p className="text-gray-600 mt-1">{description}</p>
              <span className="inline-block bg-gray-100 px-2 py-1 rounded text-sm mt-2">
                {category}
              </span>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setIsEditing(true)}
                className="text-blue-500 hover:text-blue-600"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="text-red-500 hover:text-red-600"
              >
                Delete
              </button>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            Last modified: {new Date(timestamp).toLocaleString()}
          </p>
        </div>
      )}
    </div>
  );
} 