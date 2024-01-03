import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './stretegy/jwt.strategy';
import { UserService } from 'src/user/user.service';

@Module({
  imports: [
    PrismaModule,
    PassportModule,
    JwtModule.register({
      secret: 'jwtSecretData.secret',
      signOptions: { expiresIn: '7d' }, // e.g. 7d, 24h
    }),
    
  ],
  controllers: [AuthController],
  providers: [AuthService,JwtStrategy,UserService],
  exports:[JwtStrategy]
})
export class AuthModule {}
