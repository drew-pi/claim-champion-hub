export function stringToUUID(str: string): string {
  // Simple hash function
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }

  // Convert hash to UUID format
  const hex = Math.abs(hash).toString(16).padStart(8, "0");
  return `${hex.slice(0, 8)}-${hex.slice(0, 4)}-4${hex.slice(
    1,
    4
  )}-8${hex.slice(0, 3)}-${hex.slice(0, 12)}`.padEnd(36, "0");
}
