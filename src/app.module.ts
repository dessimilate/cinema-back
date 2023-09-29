import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { PrismaService } from './prisma.service'
import { AuthModule } from './auth/auth.module'
import { JwtModule } from '@nestjs/jwt'
import { getJwtConfig } from './config/jwt.config'
import { UserModule } from './user/user.module'
import { GenreModule } from './genre/genre.module'
import { FileModule } from './file/file.module'
import { ActorModule } from './actor/actor.module'
import { MovieModule } from './movie/movie.module'
import { RatingModule } from './rating/rating.module'

@Module({
	imports: [
		ConfigModule.forRoot(),
		AuthModule,
		JwtModule.registerAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: getJwtConfig
		}),
		UserModule,
		GenreModule,
		FileModule,
		ActorModule,
		MovieModule,
		RatingModule
	],
	controllers: [],
	providers: [PrismaService]
})
export class AppModule {}
