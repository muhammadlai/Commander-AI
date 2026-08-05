export function formatTime(timestamp?: string): string {
  if (!timestamp) return '';
  // If timestamp already looks like a human-readable time (contains AM/PM or ':' and no 'T'), return as-is
  if (timestamp.includes('AM') || timestamp.includes('PM')) return timestamp;

  const date = new Date(timestamp);
  if (isNaN(date.getTime())) {
    // Not a valid ISO string, return original
    return timestamp;
  }

  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
