import { Module, forwardRef } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { TwoFactorAuthenticationService } from "./twoFactorAuthentification.service";
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { UserModule } from "@ft-transcendence/libs-backend-user";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { jwtConstants } from "./strategy/constant";
import { HttpModule } from "@nestjs/axios";
import { ApiService } from "./api.service";
import { LocalStrategy } from "./strategy/local.strategy";
import { JwtStrategy } from "./strategy/jwt.strategy";
import { JwtTwoFactorStrategy } from "./strategy/jwt-two-factor.strategy";

@Module({
  imports: [
    forwardRef(() => UserModule),
    PassportModule,
    HttpModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: "20000s" },
    }),
  ],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    JwtTwoFactorStrategy,
    TwoFactorAuthenticationService,
    ApiService,
  ],
  controllers: [AuthController],
  exports: [AuthService, TwoFactorAuthenticationService, ApiService],
})
export class AuthModule {}
