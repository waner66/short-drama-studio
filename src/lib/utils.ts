/**
 * cn — lightweight className joiner
 * Filters falsy values and joins remaining strings with space.
 */
export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}
