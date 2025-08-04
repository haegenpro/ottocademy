import { IsInt, IsNotEmpty, Min } from 'class-validator';

export class AddBalanceDto {
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  amount: number;
}