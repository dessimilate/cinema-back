import { Prisma } from '@prisma/client'

export const returnFields: Prisma.GenreSelect = {
	id: true,
	createdAt: true,
	name: true,
	slug: true,
	description: true,
	icon: true,
	movie: true
}
