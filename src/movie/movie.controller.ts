import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Patch,
	Post,
	Put,
	Query,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { MovieService } from './movie.service'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { MovieDto } from './dto/create-movie.dto'

@Controller('movie')
export class MovieController {
	constructor(private readonly movieService: MovieService) {}

	@Get()
	@Auth('admin')
	async getAll(@Query('name') searchTerm: string) {
		return this.movieService.getAll(searchTerm)
	}

  @Get('most-popular/:count')
	async mostPopular(@Param('count') count: string) {
		return this.movieService.mostPopular(+count)
	}

	@Get('by-id/:id')
	@Auth('admin')
	async getById(@Param('id') id: string) {
		return this.movieService.byIdOrSlug(+id)
	}

	@Get('by-slug/:slug')
	async getBySlug(@Param('slug') slug: string) {
		return this.movieService.byIdOrSlug(slug)
	}

	@Post('by-actors')
	async getByActors(@Body('ids') actorIds: number[]) {
		return this.movieService.byActor(actorIds)
	}

	@Post('by-genres')
	async getByGenres(@Body('ids') genreIds: number[]) {
		return this.movieService.byGenres(genreIds)
	}

	@Post()
	@HttpCode(HttpStatus.OK)
	@Auth('admin')
	async create() {
		return this.movieService.create()
	}

	@UsePipes(new ValidationPipe())
	@Put(':id')
	@HttpCode(HttpStatus.OK)
	@Auth('admin')
	async update(@Param('id') id: string, @Body() dto: MovieDto) {
		return this.movieService.update(+id, dto)
	}

	@Delete(':id')
	@HttpCode(HttpStatus.OK)
	@Auth('admin')
	async delete(@Param('id') id: string) {
		return this.movieService.delete(+id)
	}

	@Patch('view/:slug')
	@HttpCode(HttpStatus.OK)
	@Auth()
	async updateCountOpened(@Param('slug') slug: string) {
		return this.movieService.updateCountOpened(slug)
	}
}
