import { Module } from '@nestjs/common'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { getJwtConfig } from 'src/config/jwt.config'
import { PrismaService } from 'src/prisma.service'
import { MovieService } from 'src/movie/movie.service'
import { ActorService } from 'src/actor/actor.service'
import { GenreService } from 'src/genre/genre.service'

@Module({
	imports: [
		ConfigModule,
		JwtModule.registerAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: getJwtConfig
		})
	],
	controllers: [UserController],
	providers: [
		UserService,
		PrismaService,
		MovieService,
		ActorService,
		GenreService
	],
	exports: [UserService]
})
export class UserModule {}
