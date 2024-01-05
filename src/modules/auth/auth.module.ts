import { PrismaService } from 'src/modules/prisma/prisma.service';
import { SessionSerializer } from './strategies/Serializer';
import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GoogleStrategy } from './strategies/GoogleStrategy';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './guards/AuthGuard';
import { jwtConstants } from './constants/jwtConstants';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  providers: [
    AuthService,
    GoogleStrategy,
    PrismaService,
    SessionSerializer,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
