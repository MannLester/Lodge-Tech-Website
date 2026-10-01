export function normalizeProposalPhone(value: string) {
  const trimmed = value.trimStart();
  const digits = trimmed.replace(/\D/g, "");

  if (digits.length !== 11 || !digits.startsWith("1")) return value;

  return trimmed.replace(/^\+?1(?:[\s.-]+)?(?=[(\d])/, "").trimStart();
}
