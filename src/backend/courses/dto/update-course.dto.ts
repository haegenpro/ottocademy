import { IsArray, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class UpdateCourseDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  instructor?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  topics?: string[];

  @IsOptional()
  @IsInt()
  @Min(0)
  price?: number;
}