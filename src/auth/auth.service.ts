import {
	BadRequestException,
	Injectable,
	NotFoundException,
	UnauthorizedException
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { PrismaService } from 'src/prisma.service'
import { AuthDto } from './dto/auth.dto'
import { hash, verify } from 'argon2'
import { User } from '@prisma/client'
import { RefreshTokenDto } from './dto/refreshToken.dto'

@Injectable()
export class AuthService {
	constructor(private prisma: PrismaService, private jwt: JwtService) {}

	/** ----REGISTER---- */
	async register(dto: AuthDto) {
		const oldUser = await this.prisma.user.findUnique({
			where: { email: dto.email }
		})

		if (oldUser) {
			throw new BadRequestException('user with this email already exists')
		}

		const newUser = await this.prisma.user.create({
			data: {
				email: dto.email,
				password: await hash(dto.password)
			}
		})

		return {
			user: this.returnUserFields(newUser),
			...(await this.issueTokenPair(newUser.id))
		}
	}

	/** ----LOGIN---- */
	async login(dto: AuthDto) {
		const user = await this.validateUser(dto)

		return {
			user,
			...(await this.issueTokenPair(user.id))
		}
	}

	/** ----VALIDATE USER---- */
	async validateUser(dto: AuthDto) {
		const user = await this.prisma.user.findUnique({
			where: { email: dto.email }
		})

		if (!user) throw new NotFoundException('wrong email')

		const isValid = await verify(user.password, dto.password)
		if (!isValid) throw new UnauthorizedException('wrong password')

		return this.returnUserFields(user)
	}

	/** ----TOKENS---- */
	async issueTokenPair(id: number) {
		const data = { id: String(id) }

		const accessToken = await this.jwt.signAsync(data, { expiresIn: '1h' })
		const refreshToken = await this.jwt.signAsync(data, { expiresIn: '15d' })

		return { refreshToken, accessToken }
	}

	/** ----SELECT USER FIELDS---- */
	private returnUserFields(user: User) {
		return {
			id: user.id,
			email: user.email,
			isAdmin: user.isAdmin
		}
	}

	/** ----GET NEW TOKENS---- */
	async getNewTokens({ refreshToken }: RefreshTokenDto) {
		if (!refreshToken) throw new UnauthorizedException('please login')

		const result = await this.jwt.verifyAsync(refreshToken)
		if (!result) throw new UnauthorizedException('wrong token or expired')

		const user = await this.prisma.user.findUnique({
			where: { id: +result.id }
		})

		return {
			user: this.returnUserFields(user),
			...(await this.issueTokenPair(user.id))
		}
	}
}
