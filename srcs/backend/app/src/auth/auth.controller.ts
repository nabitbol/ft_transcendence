import { Body, Controller, Get, Post } from '@nestjs/common';
import { RegisterDto } from 'src/dto/register.dto';
import { LoginDto } from 'src/dto/login.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('register')
	Register(@Body() registerDto: RegisterDto) {
		return this.authService.register(registerDto);
	}

	@Post('login')
	LogIn(@Body() loginDto: LoginDto)
	{
		return this.authService.login(loginDto);
	}
}
