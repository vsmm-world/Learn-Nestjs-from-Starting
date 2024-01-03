import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '../user.service';
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

  async validate(payload: { sub: string }) {
    return await this.prisma.userSession
      .findFirst({
        where: { token: payload.sub, expiresAt: { gte: new Date(Date.now()) } },
      })
      .then(async (res) => {
        const signup = await this.userService.findOne(payload.sub);
        console.log(signup);
        if (!signup) {
          throw new UnauthorizedException();
        }
        return signup;
      }).catch((err) => {
        throw new UnauthorizedException();
      });
  }
}
