export const ROLES = {
  ADMIN: 'admin',
  HOTEL_OWNER: 'hotel',
} as const;

export type Role = keyof typeof ROLES;
