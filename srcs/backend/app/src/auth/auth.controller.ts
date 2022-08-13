import { Body, Controller, Post, UseGuards, Request, Get, Res, Query } from '@nestjs/common';
import { RegisterDto } from 'src/dto/register.dto';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Get('login/42')
	async RedirApi(@Res() res)
	{
		return res.redirect(302, process.env.API_URL);
	}

	@Get('login/api')
	async GetAccessToken(@Query('code') QueryParams)
	{
		const access_token = await this.authService.postApi(QueryParams);
		return this.authService.loginApi(access_token);
	}

	@UseGuards(LocalAuthGuard)
	@Post('login')
	async Login(@Request() req) {
		return await this.authService.login(req.user);
	}

	@Post('register')
	async Register(@Body() registerDto: RegisterDto) {
		return await this.authService.register(registerDto);
	}

}
