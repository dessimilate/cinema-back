import { Module } from '@nestjs/common'
import { ActorService } from './actor.service'
import { ActorController } from './actor.controller'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { getJwtConfig } from 'src/config/jwt.config'
import { PrismaService } from 'src/prisma.service'

@Module({
	imports: [
		ConfigModule,
		JwtModule.registerAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: getJwtConfig
		})
	],
	controllers: [ActorController],
	providers: [ActorService, PrismaService],
	exports: [ActorService]
})
export class ActorModule {}
