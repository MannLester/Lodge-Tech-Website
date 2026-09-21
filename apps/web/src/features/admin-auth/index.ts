// Server Actions & Session Handlers
export {
  logoutAdmin,
  requestPasswordResetAction,
  signInWithEmailAction,
} from "@/features/admin-auth/server/actions";
export {
  deleteInvitedCrmUser,
  inviteCrmUser,
  updateCrmUserRole,
  updateCrmUserStatus,
} from "@/features/admin-auth/server/access-actions";
export {
  loadAdminAccessUsers,
  loadAdminAuditLogs,
  type AdminAccessResult,
  type AdminAuditResult,
} from "@/features/admin-auth/server/access-management";

// Repositories
export { accessRepository } from "@/features/admin-auth/data/access-repository";
export { auditRepository } from "@/features/admin-auth/data/audit-repository";
export {
  createAdminSessionForAuthenticatedUser,
  readAdminSession,
  requireAdminSession,
  requirePermission,
  signOutAdmin,
} from "@/features/admin-auth/server/session";
export { createRetryingAuthFetch } from "@/features/admin-auth/server/retrying-auth-fetch";

// Session & PKCE Utilities
export { type AdminSession } from "@/features/admin-auth/model/admin-session";
export {
  can,
  type AccessRole,
  type Permission,
} from "@/features/admin-auth/model/permissions";
export {
  readAdminAuthErrorReason,
  type AdminAuthErrorReason,
} from "@/features/admin-auth/model/auth-error";
export { readPkceFlowId } from "@/features/admin-auth/model/pkce-flow";

// UI Components
export { AdminSignIn } from "@/features/admin-auth/ui/admin-sign-in";
export { EmailSignInForm } from "@/features/admin-auth/ui/email-sign-in-form";
export { ForgotPasswordForm } from "@/features/admin-auth/ui/forgot-password-form";
export { MicrosoftSignInButton } from "@/features/admin-auth/ui/microsoft-sign-in-button";
export { ResetPasswordForm } from "@/features/admin-auth/ui/reset-password-form";
