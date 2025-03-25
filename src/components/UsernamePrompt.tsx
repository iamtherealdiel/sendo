import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';

interface UsernamePromptProps {
  onClose: () => void;
}

export default function UsernamePrompt({ onClose }: UsernamePromptProps) {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const { updateUsername } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username) {
      setError('Username is required');
      return;
    }

    if (username.includes('@')) {
      setError('Username should not contain @');
      return;
    }

    try {
      await updateUsername(username);
      onClose();
    } catch (err) {
      setError('Error updating username. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Create Your Username
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Choose a unique username that will identify you in the system. This will be your @handle.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="text-red-600 text-sm">{error}</div>
          )}

          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Username
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-gray-500">@</span>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="block w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="username"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full apple-button-primary"
          >
            Set Username
          </button>
        </form>
      </div>
    </div>
  );
}