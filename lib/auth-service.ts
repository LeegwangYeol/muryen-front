import { AuthResponse, LoginCredentials, User } from '@/types/auth';
import { TokenService } from './token-service';

export class AuthService {
  static async login(credentials: LoginCredentials): Promise<AuthResponse | null> {
    // 하드코딩된 사용자 인증
    const { username, password } = credentials;
    
    let user: User | null = null;

    if (username === '1111' && password === '1111') {
      user = { id: '1', role: 'admin' };
    } else if (username === '2222' && password === '2222') {
      user = { id: '2', role: 'user' };
    }

    if (!user) {
      return null;
    }

    const accessToken = await TokenService.generateToken(user);
    
    return {
      user,
      accessToken
    };
  }

  static async validateToken(token: string): Promise<User | null> {
    return TokenService.verifyToken(token);
  }
}
