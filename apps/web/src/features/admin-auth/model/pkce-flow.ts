const PKCE_FLOW_ID_PATTERN = /^[A-Za-z0-9_-]{8,64}$/;

export function readPkceFlowId(value: string | null): string | null {
  return value && PKCE_FLOW_ID_PATTERN.test(value) ? value : null;
}
