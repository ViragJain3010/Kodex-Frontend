// src/components/SnippetsList.jsx
"use client";
import { useEffect, useState } from 'react';
import { useApi } from '@/hooks/useApi';
import { useAuth } from '@/hooks/useAuth';

export default function SnippetsList() {
  const [snippets, setSnippets] = useState([]);
  const { get, loading, error } = useApi();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    async function fetchSnippets() {
      if (isAuthenticated) {
        try {
          const data = await get('/api/user/snippets');
          setSnippets(data);
        } catch (err) {
          console.error('Failed to fetch snippets:', err);
        }
      }
    }

    fetchSnippets();
  }, [get, isAuthenticated]);

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return <div>Loading snippets...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Your Snippets</h2>
      {snippets.length === 0 ? (
        <p>No snippets found</p>
      ) : (
        <ul className="space-y-2">
          {snippets.map((snippet) => (
            <li key={snippet.id} className="p-4 border rounded">
              <h3 className="font-medium">{snippet.title}</h3>
              <p className="text-sm text-gray-500">
                Language: {snippet.language}
              </p>
              <p className="text-sm text-gray-500">
                Created: {new Date(snippet.createdAt).toLocaleDateString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}