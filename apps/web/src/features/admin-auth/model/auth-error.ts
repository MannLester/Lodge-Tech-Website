export type AdminAuthErrorReason = "exchange_failed" | "missing_code";

export function readAdminAuthErrorReason(
  value: string | undefined,
): AdminAuthErrorReason | null {
  return value === "exchange_failed" || value === "missing_code" ? value : null;
}
