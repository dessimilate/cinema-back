import { nameToSlug } from './../utils/name-to-slug'
import {
	BadRequestException,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { GenreDto } from './dto/create-genre.dto'
import { returnFields } from './return-fields'
import { MovieService } from 'src/movie/movie.service'

@Injectable()
export class GenreService {
	constructor(
		private prisma: PrismaService,
		private movieService: MovieService
	) {}

	/** ----GET ALL GENRES---- */
	async getAll() {
		return await this.prisma.genre.findMany({
			select: returnFields
		})
	}

	/** ----GET GENRE BY ID OR SLUG---- */
	async byIdOrSlug(data: number | string) {
		const options = typeof data === 'number' ? { id: data } : { slug: data }
		const genre = await this.prisma.genre.findUnique({
			where: options,
			select: returnFields
		})

		if (!genre) throw new NotFoundException('genre not found')

		return genre
	}

	/** ----GET COLLECTION---- */
	// async getCollection() {
	// 	const genres = await this.getAll()

	// 	const collections = await Promise.all(genres.map(async genre => {
	// 		const moviesByGenre = await this.movieService.byGenres([genre.id])
	// 	}))

	// 	return collections
	// }

	/** ----CREATE GENRE---- */
	async create() {
		const genre = await this.prisma.genre.create({
			data: {}
		})

		return genre.id
	}

	/** ----UPDATE GENRE---- */
	async update(id: number, dto: GenreDto) {
		const isSameGenre = await this.prisma.genre.findUnique({
			where: { name: dto.name }
		})

		await this.byIdOrSlug(id)

		if (isSameGenre && id !== isSameGenre.id) {
			throw new BadRequestException('genre name busy')
		}

		return await this.prisma.genre.update({
			where: { id },
			data: {
				...nameToSlug(dto.name),
				description: dto.description,
				icon: dto.icon
			},
			select: returnFields
		})
	}

	/** ----DELETE GENRE---- */
	async delete(id: number) {
		await this.byIdOrSlug(id)

		return await this.prisma.genre.delete({
			where: { id },
			select: returnFields
		})
	}
}
