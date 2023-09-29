import {
	BadRequestException,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { UpdateUserDto } from './dto/update-user.dto'
import { hash } from 'argon2'
import { returnFields } from './return-fields'
import { GenreService } from 'src/genre/genre.service'
import { ActorService } from 'src/actor/actor.service'
import { MovieService } from 'src/movie/movie.service'

@Injectable()
export class UserService {
	constructor(
		private prisma: PrismaService,
		private genreService: GenreService,
		private actorService: ActorService,
		private movieService: MovieService
	) {}

	/** ----GET ALL USERS---- */
	async getAll(email?: string) {
		return this.prisma.user.findMany({
			where: { email: email },
			select: returnFields
		})
	}

	/** ----GET USER BY ID---- */
	async byId(id: number) {
		const user = await this.prisma.user.findUnique({
			where: { id },
			select: returnFields
		})

		if (!user) throw new NotFoundException('user not found')

		return user
	}

	/** ----UPDATE PROFILE---- */
	async updateProfile(id: number, dto: UpdateUserDto) {
		const isSameUser = await this.prisma.user.findUnique({
			where: { email: dto.email }
		})

		if (isSameUser && id !== isSameUser.id) {
			throw new BadRequestException('email busy')
		}

		const changePassword = async () => {
			const user = await this.byId(id)
			return dto.password ? await hash(dto.password) : user.password
		}

		return await this.prisma.user.update({
			where: { id },
			data: {
				email: dto.email,
				password: await changePassword(),
				isAdmin: dto.isAdmin
			},
			select: returnFields
		})
	}

	/** ----TOGGLE FAVORITE MOVIES---- */
	async toggleFavoriteMovie(id: number, movieId: number) {
		const user = await this.byId(id)
		await this.movieService.byIdOrSlug(movieId)

		const isExists = user.favoriteMovies.some(movie => movie.id === movieId)

		return await this.prisma.user.update({
			where: { id: user.id },
			data: {
				favoriteMovies: {
					[isExists ? 'disconnect' : 'connect']: { id: movieId }
				}
			},
			select: returnFields
		})
	}

	/** ----TOGGLE FAVORITE ACTORS---- */
	async toggleFavoriteActors(id: number, actorId: number) {
		const user = await this.byId(id)
		await this.actorService.byIdOrSlug(actorId)

		const isExists = user.favoriteActors.some(actor => actor.id === actorId)

		return await this.prisma.user.update({
			where: { id: user.id },
			data: {
				favoriteActors: {
					[isExists ? 'disconnect' : 'connect']: { id: actorId }
				}
			},
			select: returnFields
		})
	}

	/** ----TOGGLE FAVORITE GENRES---- */
	async toggleFavoriteGenres(id: number, genreId: number) {
		const user = await this.byId(id)
		await this.genreService.byIdOrSlug(genreId)

		const isExists = user.favoriteGenres.some(genre => genre.id === genreId)

		return await this.prisma.user.update({
			where: { id: user.id },
			data: {
				favoriteGenres: {
					[isExists ? 'disconnect' : 'connect']: { id: genreId }
				}
			},
			select: returnFields
		})
	}

	/** ----DELETE USER---- */
	async delete(id: number) {
		return await this.prisma.user.delete({
			where: { id },
			select: returnFields
		})
	}

	/** ----COUNT USERS---- */
	async getCount() {
		return await this.prisma.user.count()
	}
}
