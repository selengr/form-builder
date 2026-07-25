// client-only
import { getSession } from 'next-auth/react';

export async function getAuthTokenClient(): Promise<string | null> {
  const session = await getSession();
  return session?.access_token ?? null;
}