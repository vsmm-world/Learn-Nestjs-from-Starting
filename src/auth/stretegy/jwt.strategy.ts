import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '../../user/user.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private userService: UserService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'jwtSecretData.secret',
    });
  }

  async validate(payload: { sub: string }, req) {
    if (!payload) throw new UnauthorizedException();
    return await this.userService
      .findOne(payload.sub)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        throw new UnauthorizedException();
      });
  }
}
