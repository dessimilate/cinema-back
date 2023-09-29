import { Module } from '@nestjs/common'
import { RatingService } from './rating.service'
import { RatingController } from './rating.controller'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { getJwtConfig } from 'src/config/jwt.config'
import { MovieService } from 'src/movie/movie.service'
import { PrismaService } from 'src/prisma.service'
import { UserService } from 'src/user/user.service'
import { GenreService } from 'src/genre/genre.service'
import { ActorService } from 'src/actor/actor.service'

@Module({
	imports: [
		ConfigModule,
		JwtModule.registerAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: getJwtConfig
		})
	],
	controllers: [RatingController],
	providers: [
		RatingService,
		MovieService,
		PrismaService,
		UserService,
		GenreService,
		ActorService
	]
})
export class RatingModule {}
