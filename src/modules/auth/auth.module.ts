import { PrismaService } from 'src/modules/prisma/prisma.service';
import { SessionSerializer } from './strategies/Serializer';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GoogleStrategy } from './strategies/GoogleStrategy';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './guards/AuthGuard';

@Module({
  imports: [
    ConfigModule.forRoot(),
    JwtModule.register({
      global: true,
      secret: 'b10bd247ec1641499c7ad16b8eda371e3rg03300f5b7',
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
