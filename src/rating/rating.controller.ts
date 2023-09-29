import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Put,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { RatingService } from './rating.service'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { CurrentUser } from 'src/auth/decorators/user.decorator'
import { RatingDto } from './dto/set-rating.dto'

@Controller('assess')
export class RatingController {
	constructor(private readonly ratingService: RatingService) {}

	@Get()
	@Auth('admin')
	async getAll() {
		return this.ratingService.getAll()
	}

  @Get('all-by-user')
	@Auth('admin')
	async getByUser(@CurrentUser('id') userId: number) {
		return this.ratingService.getByUser(userId)
	}

  @Get('all-by-movie/:movieId')
	@Auth()
	async getByMovie(@Param('movieId') movieId: string) {
		return this.ratingService.getByMovie(+movieId)
	}

	@Get('by-movie-id/:movieId')
	@Auth()
	async getCountUsers(
		@CurrentUser('id') userId: number,
		@Param('movieId') movieId: string
	) {
		return this.ratingService.getAssess(userId, +movieId)
	}

	@UsePipes(new ValidationPipe())
	@Put(':movieId')
	@HttpCode(HttpStatus.OK)
	@Auth()
	async setAssess(
		@CurrentUser('id') userId: number,
		@Param('movieId') movieId: string,
		@Body() dto: RatingDto
	) {
		return this.ratingService.setAssess(userId, +movieId, dto)
	}

	@Delete(':movieId')
	@Auth()
	async deleteAssess(
		@CurrentUser('id') userId: number,
		@Param('movieId') movieId: string
	) {
		return this.ratingService.deleteAssess(userId, +movieId)
	}
}
