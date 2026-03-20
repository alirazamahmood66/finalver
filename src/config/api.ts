/**
 * API Configuration
 * Centralized API endpoint management for secure access
 */

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://gisserver.vercel.app/api";

/**
 * API Endpoints
 */
export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
  },
  
  // Appointments endpoints
  APPOINTMENTS: {
    LIST: `${API_BASE_URL}/appointments`,
    GET: (id: string) => `${API_BASE_URL}/appointments/${id}`,
    CREATE: `${API_BASE_URL}/appointments`,
    UPDATE: (id: string) => `${API_BASE_URL}/appointments/${id}`,
    DELETE: (id: string) => `${API_BASE_URL}/appointments/${id}`,
  },
  
  // Users endpoints
  USERS: {
    LIST: `${API_BASE_URL}/users`,
    GET: (id: string) => `${API_BASE_URL}/users?id=${id}`,
    CREATE: `${API_BASE_URL}/users`,
    UPDATE: (id: string) => `${API_BASE_URL}/users?id=${id}`,
    DELETE: (id: string) => `${API_BASE_URL}/users?id=${id}`,
  },
  
  // Coupons endpoints
  COUPONS: {
    LIST: `${API_BASE_URL}/coupons`,
    LIST_ACTIVE: `${API_BASE_URL}/coupons?active=true`,
    GET: (id: string) => `${API_BASE_URL}/coupons?id=${id}`,
    CREATE: `${API_BASE_URL}/coupons`,
    UPDATE: (id: string) => `${API_BASE_URL}/coupons?id=${id}`,
    DELETE: (id: string) => `${API_BASE_URL}/coupons?id=${id}`,
  },
  
  // Contact endpoints
  CONTACT: {
    LIST: `${API_BASE_URL}/contact`,
    GET: (id: string) => `${API_BASE_URL}/contact?id=${id}`,
    CREATE: `${API_BASE_URL}/contact`,
    UPDATE: (id: string) => `${API_BASE_URL}/contact?id=${id}`,
    DELETE: (id: string) => `${API_BASE_URL}/contact?id=${id}`,
  },
  
  // Feedback endpoints
  FEEDBACK: {
    LIST: `${API_BASE_URL}/feedback`,
    GET: (id: string) => `${API_BASE_URL}/feedback?id=${id}`,
    CREATE: `${API_BASE_URL}/feedback`,
    UPDATE: (id: string) => `${API_BASE_URL}/feedback?id=${id}`,
    DELETE: (id: string) => `${API_BASE_URL}/feedback?id=${id}`,
  },
} as const;
