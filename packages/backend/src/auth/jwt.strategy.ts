import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { AuthService } from './auth.service';
import { User } from '../users/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'your-secret-key',
    });
  }

  async validate(payload: any): Promise<User> {
    const user = await this.authService.validateUserById(payload.sub);
    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }

    const exp = this.getExpirationTime(payload);
    const currentTime = Date.now();

    if (currentTime > exp * 1000) {
      throw new UnauthorizedException('Token has expired');
    }

    return user;
  }

  private getExpirationTime(payload: any): number {
    if (typeof payload.exp === 'number') {
      return payload.exp;
    } else if (typeof payload.exp === 'string') {
      return Number(payload.exp);
    } else {
      throw new UnauthorizedException('Invalid token expiration');
    }
  }
}
