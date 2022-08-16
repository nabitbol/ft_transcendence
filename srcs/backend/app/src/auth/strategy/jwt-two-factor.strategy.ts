import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { jwtConstants } from './constants';
import { UserService } from '../../user/user.service';

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
		const user = await this.userService.findByUsername(payload.user_pseudo);
		if (!user)
			throw new UnauthorizedException("Invalid jwt token.");
		if (!user.user_TwoFa_on || payload.TwoFa_auth)
			return user;
		throw new UnauthorizedException("Incorrect jwt token, you need to be authenticated with 2FA.");
	}
}