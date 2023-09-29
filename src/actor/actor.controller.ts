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
	Query,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { ActorService } from './actor.service'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { ActorDto } from './dto/create-actor.dto'

@Controller('actor')
export class ActorController {
	constructor(private readonly actorService: ActorService) {}

	@Get()
	@Auth('admin')
	async getAll(@Query('name') searchTerm: string) {
		return this.actorService.getAll(searchTerm)
	}

	@Get('by-id/:id')
	@Auth('admin')
	async getById(@Param('id') id: string) {
		return this.actorService.byIdOrSlug(+id)
	}

	@Get('by-slug/:slug')
	async getBySlug(@Param('slug') slug: string) {
		return this.actorService.byIdOrSlug(slug)
	}

	@Post()
	@HttpCode(HttpStatus.OK)
	@Auth('admin')
	async create() {
		return this.actorService.create()
	}

	@UsePipes(new ValidationPipe())
	@Put(':id')
	@HttpCode(HttpStatus.OK)
	@Auth('admin')
	async update(@Param('id') id: string, @Body() dto: ActorDto) {
		return this.actorService.update(+id, dto)
	}

	@Delete(':id')
	@HttpCode(HttpStatus.OK)
	@Auth('admin')
	async delete(@Param('id') id: string) {
		return this.actorService.delete(+id)
	}
}
