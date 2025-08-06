import { Module } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { ModulesService } from '../modules/modules.service';
import { ModulesModule } from '../modules/modules.module';

@Module({
  providers: [CoursesService],
  controllers: [CoursesController],
  imports: [ModulesModule],
})
export class CoursesModule {}
