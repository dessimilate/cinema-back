import { UseGuards, applyDecorators } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { JwtAuthGuard } from '../guards/jwt.guard'
import { AdminGuard } from '../guards/admin.guard'

type TypeRole = 'admin' | 'user'

export const Auth = (role: TypeRole = 'user') =>
	applyDecorators(
		role === 'admin'
			? UseGuards(JwtAuthGuard, AdminGuard)
			: UseGuards(JwtAuthGuard)
	)
