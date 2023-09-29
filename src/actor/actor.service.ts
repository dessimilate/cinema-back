import {
	BadRequestException,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { ActorDto } from 'src/actor/dto/create-actor.dto'
import { PrismaService } from 'src/prisma.service'
import { nameToSlug } from 'src/utils/name-to-slug'
import { returnFields } from './return-fields'

@Injectable()
export class ActorService {
	constructor(private prisma: PrismaService) {}

	/** ----GET ALL ACTORS---- */
	async getAll(searchTerm?: string) {
		return await this.prisma.actor.findMany({
			where: { name: searchTerm },
			select: returnFields
		})
	}

	/** ----GET ACTOR BY ID OR SLUG---- */
	async byIdOrSlug(data: number | string) {
		const options = typeof data === 'number' ? { id: data } : { slug: data }
		const actor = await this.prisma.actor.findUnique({
			where: options,
			select: returnFields
		})

		if (!actor) throw new NotFoundException('actor not found')

		return actor
	}

	/** ----CREATE ACTOR---- */
	async create() {
		const actor = await this.prisma.actor.create({
			data: { name: '', slug: '', photo: '' },
			select: returnFields
		})

		return actor.id
	}

	/** ----UPDATE ACTOR---- */
	async update(id: number, dto: ActorDto) {
		const isSameActor = await this.prisma.actor.findUnique({
			where: { slug: dto.slug }
		})

		await this.byIdOrSlug(id)

		if (isSameActor && id !== isSameActor.id) {
			throw new BadRequestException('actor slug busy')
		}

		return await this.prisma.actor.update({
			where: { id },
			data: {
				name: dto.name,
				slug: dto.slug.replace(' ', '').toLowerCase(),
				photo: dto.photo
			},
			select: returnFields
		})
	}

	/** ----DELETE ACTOR---- */
	async delete(id: number) {
		await this.byIdOrSlug(id)

		return await this.prisma.actor.delete({
			where: { id },
			select: returnFields
		})
	}
}
