import { Prisma } from '@prisma/client'

export const returnFields: Prisma.UserSelect = {
	id: true,
	createdAt: true,
	email: true,
	isAdmin: true,
	favoriteMovies: true,
	favoriteActors: true,
	favoriteGenres: true
}
