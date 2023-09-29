import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator'

export class RatingDto {
  @IsNumber()
	@Min(1)
	@Max(5)
  @IsOptional()
	rating?: number

  @IsString()
  @IsOptional()
  comment?: string
}