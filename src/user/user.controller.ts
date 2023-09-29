import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Patch,
	Put,
	Query,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { UserService } from './user.service'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { CurrentUser } from 'src/auth/decorators/user.decorator'
import { UpdateUserDto } from './dto/update-user.dto'

@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@UsePipes(new ValidationPipe())
	@Get()
	@HttpCode(HttpStatus.OK)
	@Auth('admin')
	async getAll(@Query('email') email: string) {
		return this.userService.getAll(email)
	}

	@Get('profile')
	@Auth()
	async getProfile(@CurrentUser('id') id: number) {
		return this.userService.byId(id)
	}

	@Get('count')
	@Auth('admin')
	async getCountUsers() {
		return this.userService.getCount()
	}

	@Get('profile/:id')
	@Auth('admin')
	async getUserProfile(@Param('id') id: string) {
		return this.userService.byId(+id)
	}

	@UsePipes(new ValidationPipe())
	@Put('profile')
	@HttpCode(HttpStatus.OK)
	@Auth()
	async updateProfile(
		@CurrentUser('id') id: number,
		@Body() dto: UpdateUserDto
	) {
		return this.userService.updateProfile(id, dto)
	}

	@UsePipes(new ValidationPipe())
	@Put('profile/:id')
	@HttpCode(HttpStatus.OK)
	@Auth('admin')
	async updateUser(@Param('id') id: string, @Body() dto: UpdateUserDto) {
		return this.userService.updateProfile(+id, dto)
	}

	@Patch('movie/:id')
	@HttpCode(HttpStatus.OK)
	@Auth()
	async toggleFavoriteMovie(
		@CurrentUser('id') id: number,
		@Param('id') movieId: string
	) {
		return this.userService.toggleFavoriteMovie(id, +movieId)
	}

	@Patch('actor/:id')
	@HttpCode(HttpStatus.OK)
	@Auth()
	async toggleFavoriteActor(
		@CurrentUser('id') id: number,
		@Param('id') actorId: string
	) {
		return this.userService.toggleFavoriteActors(id, +actorId)
	}

	@Patch('genre/:id')
	@HttpCode(HttpStatus.OK)
	@Auth()
	async toggleFavoriteGenre(
		@CurrentUser('id') id: number,
		@Param('id') genreId: string
	) {
		return this.userService.toggleFavoriteGenres(id, +genreId)
	}

	@Delete()
	@HttpCode(HttpStatus.OK)
	@Auth()
	async deleteProfile(@CurrentUser('id') id: number) {
		return this.userService.delete(id)
	}

	@Delete(':id')
	@HttpCode(HttpStatus.OK)
	@Auth('admin')
	async deleteUser(@Param('id') id: string) {
		return this.userService.delete(+id)
	}
}
