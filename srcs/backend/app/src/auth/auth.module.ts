import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './services/auth.service';
import { TwoFactorAuthenticationService } from './services/twoFactorAuthentication.service'
import { User } from '../entity/user.entity';
import { UserModule } from 'src/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './strategy/constants';
import { LocalStrategy } from './strategy/local.strategy';
import { JwtTwoFactorStrategy } from './strategy/jwt-two-factor.strategy';
import { JwtStrategy } from './strategy/jwt.strategy';
import { HttpModule } from '@nestjs/axios';
import { ApiService } from './services/api.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]), 
    UserModule, 
    PassportModule,
    HttpModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '200s' },
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, JwtTwoFactorStrategy,
  TwoFactorAuthenticationService, ApiService],
  controllers: [AuthController]
})

export class AuthModule {}
