import { IsNotEmpty, IsString, IsInt, Min, IsOptional } from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';

export class CreateModuleDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsOptional()
  @Transform(({ value }: TransformFnParams) =>
    value ? parseInt(String(value), 10) : undefined,
  )
  @IsInt()
  @Min(1)
  order?: number;
}
