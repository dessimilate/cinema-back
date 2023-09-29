import { IsBoolean, IsNumber, IsOptional, IsString,Max, Min } from 'class-validator'

export class MovieDto {
	@IsString()
	@IsOptional()
	poster?: string

	@IsString()
	@IsOptional()
	bigPoster?: string

	@IsString()
	@IsOptional()
	title?: string

	@IsString()
	@IsOptional()
	description?: string

	@IsString()
	@IsOptional()
	slug?: string

	@IsString()
	@IsOptional()
	videoUrl?: string

	@IsNumber()
	@IsString({ each: true })
	@IsOptional()
	genres?: number[]

	@IsNumber()
	@IsString({ each: true })
	@IsOptional()
	actors?: number[]

	@IsBoolean()
	@IsOptional()
	isSendTelegram?: boolean

	@IsNumber()
	@IsOptional()
	year?: number

	@IsNumber()
	@IsOptional()
	duration?: number

	@IsString()
	@IsOptional()
	country?: string
}
