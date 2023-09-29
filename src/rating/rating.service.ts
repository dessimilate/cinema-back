import {
	BadRequestException,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { MovieService } from 'src/movie/movie.service'
import { PrismaService } from 'src/prisma.service'
import { returnFields } from './return-fields'
import { RatingDto } from './dto/set-rating.dto'
import { UserService } from 'src/user/user.service'

@Injectable()
export class RatingService {
	constructor(
		private prisma: PrismaService,
		private movieService: MovieService,
		private userService: UserService
	) {}

	/** ----GET ALL ASSESS---- */
	async getAll() {
		return await this.prisma.assess.findMany()
	}

	/** ----GET ASSESS BY USER---- */
	async getByUser(userId: number) {
		return await this.prisma.assess.findMany({
			where: { userId }
		})
	}

	/** ----GET ASSESS BY MOVIE---- */
	async getByMovie(movieId: number) {
		return await this.prisma.assess.findMany({
			where: { movieId }
		})
	}

	/** ----GET ASSESS---- */
	async getAssess(userId: number, movieId: number) {
		const assess = await this.prisma.assess.findUnique({
			where: { userId_movieId: { userId, movieId } }
		})

		if (!assess) throw new NotFoundException('comment not found')

		return assess
	}

	/** ----SET ASSESS---- */
	async setAssess(userId: number, movieId: number, dto: RatingDto) {
		await this.movieService.byIdOrSlug(movieId)
		await this.userService.byId(userId)

		const assess = await this.prisma.assess.upsert({
			where: { userId_movieId: { userId, movieId } },
			create: {
				userId,
				movieId,
				comment: dto.comment,
				rating: dto.rating
			},
			update: {
				comment: dto.comment,
				rating: dto.rating
			},
			select: returnFields
		})

		if (dto.rating) {
			await this.avgRating(movieId)
		}

		return assess
	}

	/** ----DELETE ASSESS---- */
	async deleteAssess(userId: number, movieId: number) {
		await this.getAssess(userId, movieId)

		const assess = await this.prisma.assess.delete({
			where: { userId_movieId: { userId, movieId } },
			select: returnFields
		})

		await this.avgRating(movieId)

		return assess
	}

	private async avgRating(movieId: number) {
		const avgRating = await this.prisma.assess.aggregate({
			where: { movieId },
			_avg: { rating: true }
		})

		await this.movieService.updateAvgRating(movieId, avgRating._avg.rating)
	}
}
