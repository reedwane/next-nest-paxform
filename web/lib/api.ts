import axios from "axios";
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  Appointment,
  CreateAppointmentRequest,
  User,
  CreateUserRequest,
  PaginatedResult,
} from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Auth API
export const authApi = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/auth/login", data);
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/auth/register", data);
    return response.data;
  },
};

// Appointments API
export const appointmentsApi = {
  create: async (data: CreateAppointmentRequest): Promise<Appointment> => {
    const response = await api.post<Appointment>("/appointments", data);
    return response.data;
  },

  getAll: async (params?: {
    page?: number;
    limit?: number;
  }): Promise<PaginatedResult<Appointment>> => {
    const response = await api.get<PaginatedResult<Appointment>>(
      "/appointments",
      {
        params: {
          _page: params?.page || 1,
          _limit: params?.limit || 10,
        },
      }
    );
    return response.data;
  },

  getById: async (id: string): Promise<Appointment> => {
    const response = await api.get<Appointment>(`/appointments/${id}`);
    return response.data;
  },

  update: async (
    id: string,
    data: Partial<CreateAppointmentRequest>
  ): Promise<Appointment> => {
    const response = await api.patch<Appointment>(`/appointments/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/appointments/${id}`);
  },
};

// Users API
export const usersApi = {
  create: async (data: CreateUserRequest): Promise<User> => {
    const response = await api.post<User>("/users", data);
    return response.data;
  },

  getAll: async (params?: {
    page?: number;
    limit?: number;
  }): Promise<PaginatedResult<User>> => {
    const response = await api.get<PaginatedResult<User>>("/users", {
      params: {
        _page: params?.page || 1,
        _limit: params?.limit || 10,
      },
    });
    return response.data;
  },

  update: async (
    id: string,
    data: Partial<CreateUserRequest>
  ): Promise<User> => {
    const response = await api.patch<User>(`/users/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/users/${id}`);
  },
};

export default api;
