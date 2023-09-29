import { IsBoolean, IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUserDto {
	@IsEmail()
	email: string

	@IsString()
	@MinLength(6, { message: 'password cannot be less than 6 characters' })
	@IsOptional()
	password?: string

	@IsBoolean()
	@IsOptional()
	isAdmin?: boolean
}
