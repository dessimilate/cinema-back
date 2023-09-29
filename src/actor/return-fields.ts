import { Prisma } from '@prisma/client'

export const returnFields: Prisma.ActorSelect = {
	id: true,
	createdAt: true,
	updatedAt: true,
	name: true,
	slug: true,
	photo: true,
	movie: true
}
