import { IsArray, IsEnum, IsInt, IsNotEmpty, IsString, Min } from 'class-validator';
import { CourseCategory } from '@prisma/client';

export class CreateCourseDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  instructor: string;

  @IsArray()
  @IsString({ each: true })
  topics: string[];

  @IsInt()
  @Min(0)
  price: number;

  @IsEnum(CourseCategory)
  category: CourseCategory;
}