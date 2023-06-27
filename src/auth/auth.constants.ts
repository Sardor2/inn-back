export const ROLES = {
  ADMIN: 'admin',
  HOTEL_OWNER: 'hotel_owner',
} as const;

export type Role = keyof typeof ROLES;
