export function serializeDates<T extends Record<string, unknown>>(obj: T): T {
  const serialized = { ...obj };
  
  for (const [key, value] of Object.entries(serialized)) {
    if (value instanceof Date) {
      (serialized as Record<string, unknown>)[key] = value.toISOString();
    } else if (value === null || value === undefined) {
      (serialized as Record<string, unknown>)[key] = null;
    }
  }
  
  return serialized;
}