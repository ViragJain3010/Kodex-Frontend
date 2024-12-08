// src/lib/api-client.js
import { getSession } from "next-auth/react";

class ApiClient {
  constructor(baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000') {
    this.baseURL = baseURL;
    this.token = null;
  }

  async getAuthToken() {
    try {
      const session = await getSession();
      if (!session) return null;

      // If we don't have a token or it's new session, get a new token
      if (!this.token) {
        const response = await fetch(`${this.baseURL}/api/auth/session`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sessionToken: session.sessionToken,
          }),
        });

        if (!response.ok) throw new Error('Failed to get auth token');

        const data = await response.json();
        this.token = data.token;
      }

      return this.token;
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  }

  async request(endpoint, options = {}) {
    try {
      const token = await this.getAuthToken();
      const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...options,
        headers,
      });

      // Handle 401 errors (unauthorized)
      if (response.status === 401) {
        this.token = null; // Clear token
        // Retry the request once
        return this.request(endpoint, options);
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  }

  // HTTP method helpers
  async get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  async post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();