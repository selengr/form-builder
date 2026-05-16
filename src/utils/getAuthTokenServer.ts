import { getServerSession } from 'next-auth';
import { authOptions } from '@/services/auth/authConfig';

export async function getAuthTokenServer(): Promise<string | null> {
  try {
    const session = await getServerSession(authOptions);
    return session?.access_token ?? null;
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
}
