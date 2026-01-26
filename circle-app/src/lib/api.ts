// api.ts 
// src/lib/api.ts

import axios from 'axios';

const api = axios.create({
  // import.meta.env is how Vite accesses .env variables
  baseURL: import.meta.env.VITE_API_URL,
});

export default api; // Must be "export default"