// Firebase exports
export { getFirebaseApp, getFirebaseAuth, isFirebaseConfigured } from './client';
export {
  sendLoginLink,
  completeLoginWithLink,
  getIdToken,
  getCurrentUser,
  logout,
  onAuthChange,
  isEmailLink,
  isAuthConfigured,
} from './auth';
export { sessionManager, toSessionUser } from './session';
export type { SessionUser } from './session';
export {
  ApiError,
  getUserProfile,
  updateUserProfile,
  getInterests,
  postInterest,
  getTestDrives,
  postTestDrive,
  verifyAuth,
} from './api';
export type {
  ApiResponse,
  UserProfile,
  UpdateProfileRequest,
  Interest,
  CreateInterestRequest,
  TestDrive,
  CreateTestDriveRequest,
  AuthVerifyResponse,
} from './api';
