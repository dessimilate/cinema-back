import { Prisma } from '@prisma/client'

export const returnFields: Prisma.AssessSelect = {
	createdAt: true,
	rating: true,
	comment: true,
	user: { select: { id: true, createdAt: true, email: true } },
	movie: { select: { id: true } }
}
