import {
	BadRequestException,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { MovieDto } from './dto/create-movie.dto'
import { returnFields } from './return-fields'

@Injectable()
export class MovieService {
	constructor(private prisma: PrismaService) {}

	/** ----GET ALL MOVIES---- */
	async getAll(searchTerm?: string) {
		return await this.prisma.movie.findMany({
			where: { title: searchTerm },
			select: returnFields
		})
	}

	/** ----GET MOVIE BY ID OR SLUG---- */
	async byIdOrSlug(data: number | string) {
		const options =
			typeof data === 'number'
				? { id: data }
				: typeof data === 'string'
				? { slug: data }
				: null

		if (options === null) throw new BadRequestException('prop wrong')

		const movie = await this.prisma.movie.findUnique({
			where: options,
			select: returnFields
		})

		if (!movie) throw new NotFoundException('movie not found')

		return movie
	}

	/** ----GET MOVIE BY ACTORS---- */
	async byActor(actorIds: number[]) {
		if (!actorIds.every(el => typeof el === 'number')) {
			throw new BadRequestException('ids must be number')
		}

		const movie = await this.prisma.movie.findMany({
			where: {
				AND: actorIds.map(id => ({ actors: { some: { id } } }))
			},
			select: returnFields
		})

		if (!movie) throw new NotFoundException('movie not found')

		return movie
	}

	/** ----GET MOVIE BY GENRES---- */
	async byGenres(genreIds: number[]) {
		if (!genreIds.every(el => typeof el === 'number')) {
			throw new BadRequestException('ids must be number')
		}

		const movie = await this.prisma.movie.findMany({
			where: {
				AND: genreIds.map(id => ({ genres: { some: { id } } }))
			},
			select: returnFields
		})

		if (!movie) throw new NotFoundException('movie not found')

		return movie
	}

	/** ----MOST POPULAR---- */
	async mostPopular(count: number) {
		const movie = await this.prisma.movie.findMany({
			select: returnFields,
			orderBy: { countOpened: 'desc' }
		})

		if (!movie) throw new NotFoundException('movie not found')

		return movie.slice(0, count)
	}

	/** ----CREATE MOVIE---- */
	async create() {
		const movie = await this.prisma.movie.create({
			data: {},
			select: returnFields
		})

		return movie.id
	}
	/** ----UPDATE MOVIE---- */
	async update(id: number, dto: MovieDto) {
		const isSameMovie = await this.byIdOrSlug(dto.slug)

		await this.byIdOrSlug(id)

		if (isSameMovie && id !== isSameMovie.id) {
			throw new BadRequestException('movie slug busy')
		}

		return await this.prisma.movie.update({
			where: { id },
			data: {
				poster: dto.poster,
				bigPoster: dto.bigPoster,
				title: dto.title,
				description: dto.description,
				slug: dto.slug.replace(' ', '').toLowerCase(),
				videoUrl: dto.videoUrl,
				genres: { connect: dto.genres?.map(el => ({ id: el })) },
				actors: { connect: dto.actors?.map(el => ({ id: el })) },
				isSendTelegram: dto.isSendTelegram,
				year: dto.year,
				duration: dto.duration,
				country: dto.country
			},
			select: returnFields
		})
	}

	/** ----UPDATE COUNT VIEWS---- */
	async updateCountOpened(slug: string) {
		const oldMovie = await this.byIdOrSlug(slug)

		return await this.prisma.movie.update({
			where: { slug },
			data: { countOpened: oldMovie.countOpened + 1 },
			select: returnFields
		})
	}

	/** ----UPDATE COUNT VIEWS---- */
	async updateAvgRating(id: number, avgRating: number) {
		await this.byIdOrSlug(id)

		return await this.prisma.movie.update({
			where: { id },
			data: { rating: avgRating },
			select: returnFields
		})
	}

	/** ----DELETE MOVIE---- */
	async delete(id: number) {
		await this.byIdOrSlug(id)

		return await this.prisma.movie.delete({
			where: { id },
			select: returnFields
		})
	}
}
