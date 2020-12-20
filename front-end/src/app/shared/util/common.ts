export function isPresent(obj: any): boolean {
  return obj !== undefined && typeof obj !== 'undefined' && obj !== null;
}
