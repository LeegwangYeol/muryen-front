import { User } from '@/types/auth';
import { jwtVerify, SignJWT } from 'jose';

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key');

export class TokenService {
  static async generateToken(user: User): Promise<string> {
    return new SignJWT({ sub: user.id, role: user.role })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('24h')
      .sign(SECRET_KEY);
  }

  static async verifyToken(token: string): Promise<User | null> {
    try {
      const { payload } = await jwtVerify(token, SECRET_KEY);
      return {
        id: payload.sub as string,
        role: payload.role as 'admin' | 'user'
      };
    } catch {
      return null;
    }
  }
}
