import { User } from '@/types/auth';
import { jwtVerify, SignJWT } from 'jose';

function getSecretKey(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret && process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET environment variable is missing in production');
  }
  return new TextEncoder().encode(secret || 'your-secret-key');
}

export class TokenService {
  static async generateToken(user: User): Promise<string> {
    const secretKey = getSecretKey();
    return new SignJWT({ sub: user.id, role: user.role })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('24h')
      .sign(secretKey);
  }

  static async verifyToken(token: string): Promise<User | null> {
    if (!token || typeof token !== 'string') {
      return null;
    }
    try {
      const secretKey = getSecretKey();
      const { payload } = await jwtVerify(token, secretKey);
      if (
        !payload.sub ||
        typeof payload.sub !== 'string' ||
        (payload.role !== 'admin' && payload.role !== 'user')
      ) {
        return null;
      }
      return {
        id: payload.sub,
        role: payload.role as 'admin' | 'user'
      };
    } catch {
      return null;
    }
  }
}
