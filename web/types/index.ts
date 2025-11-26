export interface User {
  id: string;
  email: string;
  isAdmin: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Appointment {
  id: string;
  name: string;
  email: string;
  appointmentDateTime: string;
  notes?: string;
  googleEventId?: string;
  createdAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface CreateAppointmentRequest {
  name: string;
  email: string;
  appointmentDateTime: string;
  notes?: string;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  isAdmin?: boolean;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
