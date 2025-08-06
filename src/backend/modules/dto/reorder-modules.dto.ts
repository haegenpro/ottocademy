import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class ModuleOrder {
  id: string;
  order: number;
}

export class ReorderModulesDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ModuleOrder)
  module_order: ModuleOrder[];
}