import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Post,
	Put,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { GenreService } from './genre.service'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { GenreDto } from './dto/create-genre.dto'

@Controller('genre')
export class GenreController {
	constructor(private readonly genreService: GenreService) {}

	@Get()
	@Auth('admin')
	async getAll() {
		return this.genreService.getAll()
	}

	// @Get('collection')
	// @Auth('admin')
	// async getCollection() {
	// 	return this.genreService.getCollection()
	// }

	@Get('by-id/:id')
	@Auth('admin')
	async getById(@Param('id') id: string) {
		return this.genreService.byIdOrSlug(+id)
	}

	@Get('by-slug/:slug')
	async getBySlug(@Param('slug') slug: string) {
		return this.genreService.byIdOrSlug(slug)
	}

	@Post()
	@HttpCode(HttpStatus.OK)
	@Auth('admin')
	async create() {
		return this.genreService.create()
	}

	@UsePipes(new ValidationPipe())
	@Put(':id')
	@HttpCode(HttpStatus.OK)
	@Auth('admin')
	async update(@Param('id') id: string, @Body() dto: GenreDto) {
		return this.genreService.update(+id, dto)
	}

	@Delete(':id')
	@HttpCode(HttpStatus.OK)
	@Auth('admin')
	async delete(@Param('id') id: string) {
		return this.genreService.delete(+id)
	}
}
