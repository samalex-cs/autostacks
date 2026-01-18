'use client';

import { getIdToken } from './auth';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';

export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error: {
    message: string;
    code: string;
  } | null;
}

export class ApiError extends Error {
  code: string;
  status: number;

  constructor(message: string, code: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
  }
}

/**
 * Make an authenticated API request
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = await getIdToken();

  if (!token) {
    // Redirect to login if no token
    if (typeof window !== 'undefined') {
      window.location.href = '/auth/login';
    }
    throw new ApiError('Authentication required', 'UNAUTHENTICATED', 401);
  }

  const url = `${BACKEND_URL}${endpoint}`;
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const data: ApiResponse<T> = await response.json();

  // Handle 401 - redirect to login
  if (response.status === 401) {
    if (typeof window !== 'undefined') {
      window.location.href = '/auth/login';
    }
    throw new ApiError('Session expired', 'SESSION_EXPIRED', 401);
  }

  // Handle API errors
  if (!data.success || data.error) {
    throw new ApiError(
      data.error?.message || 'An error occurred',
      data.error?.code || 'UNKNOWN_ERROR',
      response.status
    );
  }

  return data.data as T;
}

// ============== User Profile ==============

export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  city: string;
  attributes: Record<string, string>;
  audiences: string[];
  abTestGroup: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileRequest {
  name?: string;
  city?: string;
  attributes?: Record<string, string>;
}

export async function getUserProfile(): Promise<UserProfile> {
  return apiRequest<UserProfile>('/v1/api/user/me', {
    method: 'GET',
  });
}

export async function updateUserProfile(
  data: UpdateProfileRequest
): Promise<UserProfile> {
  return apiRequest<UserProfile>('/v1/api/user/me', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

// ============== Interests ==============

export interface Interest {
  id: string;
  userId: string;
  carId: string;
  carOwner: string;
  createdAt: string;
}

export interface CreateInterestRequest {
  carId: string;
  carOwner: string;
}

export async function getInterests(): Promise<Interest[]> {
  return apiRequest<Interest[]>('/v1/api/interests', {
    method: 'GET',
  });
}

export async function postInterest(data: CreateInterestRequest): Promise<Interest> {
  return apiRequest<Interest>('/v1/api/interests', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// ============== Test Drives ==============

export interface TestDrive {
  id: string;
  userId: string;
  carId: string;
  carOwner: string;
  dealerId: string;
  preferredDate: string;
  status: 'requested' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface CreateTestDriveRequest {
  carId: string;
  carOwner: string;
  dealerId: string;
  preferredDate: string;
}

export async function getTestDrives(): Promise<TestDrive[]> {
  return apiRequest<TestDrive[]>('/v1/api/test-drives', {
    method: 'GET',
  });
}

export async function postTestDrive(
  data: CreateTestDriveRequest
): Promise<TestDrive> {
  return apiRequest<TestDrive>('/v1/api/test-drives', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// ============== Auth Verification ==============

export interface AuthVerifyResponse {
  uid: string;
  email: string;
  name: string;
}

export async function verifyAuth(): Promise<AuthVerifyResponse> {
  return apiRequest<AuthVerifyResponse>('/v1/api/auth/verify', {
    method: 'POST',
  });
}

