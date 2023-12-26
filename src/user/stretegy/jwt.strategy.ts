import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '../user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: "jwtSecretData.secret",
    });
  }

  async validate(payload: { userId: string }) {
    const signup = await this.userService.findOne(payload.userId);

    if (!signup) {
      throw new UnauthorizedException();
    }
    return signup;
  }
}
