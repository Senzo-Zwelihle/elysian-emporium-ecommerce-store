export function sanitizeUser<T extends {
  createdAt: Date;
  updatedAt: Date;
  banExpires?: Date | null;
}>(user: T) {
  return {
    ...user,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
    banExpires: user.banExpires?.toISOString() ?? null,
  };
}