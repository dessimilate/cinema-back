import { Prisma } from '@prisma/client'

export const returnFields: Prisma.MovieSelect = {
	id: true,
	createdAt: true,
	rating: true,
	poster: true,
	bigPoster: true,
	title: true,
	description: true,
	slug: true,
	videoUrl: true,
	isSendTelegram: true,
	countOpened: true,
	year: true,
	duration: true,
	country: true,
	genres: true,
	actors: true
}
