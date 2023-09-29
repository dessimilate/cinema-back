import {
	Controller,
	Post,
	Body,
	UsePipes,
	ValidationPipe,
	HttpCode,
	HttpStatus
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthDto } from './dto/auth.dto'
import { RefreshTokenDto } from './dto/refreshToken.dto'

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@UsePipes(new ValidationPipe())
	@HttpCode(HttpStatus.OK)
	@Post('register')
	async register(@Body() dto: AuthDto) {
		return this.authService.register(dto)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(HttpStatus.OK)
	@Post('login/access-token')
	async getNewTokens(@Body() dto: RefreshTokenDto) {
		return this.authService.getNewTokens(dto)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(HttpStatus.OK)
	@Post('login')
	async login(@Body() dto: AuthDto) {
		return this.authService.login(dto)
	}
}
