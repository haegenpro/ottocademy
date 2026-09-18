/**
 * Safely extract a human-readable message from a `catch` variable, which
 * TypeScript types as `unknown` - avoids `error.message` unsafe-member-access
 * on a value that might not even be an Error.
 */
export function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error) {
    return error.message;
  }
  return fallback;
}
