// // src/hooks/useApi.js
// import { useState, useCallback } from 'react';
// import { apiClient } from '@/lib/api-client';
// import { useAuth } from './useAuth';

// export function useApi() {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const { isAuthenticated } = useAuth();

//   const request = useCallback(async (method, endpoint, data = null) => {
//     if (!isAuthenticated) {
//       throw new Error('User not authenticated');
//     }

//     setLoading(true);
//     setError(null);

//     try {
//       let response;
//       switch (method.toLowerCase()) {
//         case 'get':
//           response = await apiClient.get(endpoint);
//           break;
//         case 'post':
//           response = await apiClient.post(endpoint, data);
//           break;
//         case 'put':
//           response = await apiClient.put(endpoint, data);
//           break;
//         case 'delete':
//           response = await apiClient.delete(endpoint);
//           break;
//         default:
//           throw new Error(`Unsupported method: ${method}`);
//       }
//       return response;
//     } catch (err) {
//       setError(err.message);
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   }, [isAuthenticated]);

//   return {
//     loading,
//     error,
//     request,
//     get: useCallback((endpoint) => request('get', endpoint), [request]),
//     post: useCallback((endpoint, data) => request('post', endpoint, data), [request]),
//     put: useCallback((endpoint, data) => request('put', endpoint, data), [request]),
//     delete: useCallback((endpoint) => request('delete', endpoint), [request]),
//   };
// }