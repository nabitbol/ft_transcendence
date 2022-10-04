import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { jwtConstants } from './constant';
import { UserService } from '@ft-transcendence/libs-backend-user';

@Injectable()
export class JwtTwoFactorStrategy extends PassportStrategy(Strategy, 'jwt-two-factor') {
	constructor(private userService: UserService) {
		super({
		jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
		ignoreExpiration: false,
		secretOrKey: jwtConstants.secret,
		});
	}

	async validate(payload: any) {
		const user = await this.userService.getUserById(payload.user_pseudo);
		if (!user)
			throw new UnauthorizedException("Invalid jwt token.");
		if (!user.doubleAuth || payload.TwoFa_auth)
			return user;
		throw new UnauthorizedException("Incorrect jwt token, you need to be authenticated with 2FA.");
	}
}