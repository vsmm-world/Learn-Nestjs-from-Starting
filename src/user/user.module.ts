import { Module, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './stretegy/jwt.strategy';
import * as postmark from 'postmark';

@Module({
  imports: [
    PrismaModule,
    PassportModule,
    JwtModule.register({
      secret: 'jwtSecretData.secret',
      signOptions: { expiresIn: '7d' }, // e.g. 7d, 24h
    }),
   postmark.ServerClient,
  ],
  controllers: [UserController],
  providers: [UserService, JwtStrategy],
  exports: [JwtStrategy,postmark.ServerClient],
})
export class UserModule {}
