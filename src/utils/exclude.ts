export function exclude<T, Key extends keyof T>(user: T, keys: Key[]) {
  // @ts-ignore
  return Object.fromEntries(
    Object.entries(user).filter(([key]) => !keys.includes(key as Key)),
  ) as any;
}
