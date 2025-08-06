import {
  Controller, Post, Body, UseGuards, UseInterceptors, UploadedFiles, Param, Patch
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { AdminGuard } from '../auth/guards/admin.guard';
import { ModulesService } from './modules.service';
import { CreateModuleDto } from './dto/create-module.dto';
import { ReorderModulesDto } from './dto/reorder-modules.dto';

@UseGuards(AdminGuard)
@Controller('courses/:courseId/modules')
export class ModulesController {
  constructor(private readonly modulesService: ModulesService) {}

  @Post()
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'pdf_content', maxCount: 1 },
    { name: 'video_content', maxCount: 1 },
  ]))
  create(
    @Param('courseId') courseId: string,
    @Body() createModuleDto: CreateModuleDto,
    @UploadedFiles() files: { pdf_content?: Express.Multer.File[], video_content?: Express.Multer.File[] },
  ) {
    return this.modulesService.create(courseId, createModuleDto, files);
  }

  @Patch('reorder')
  reorder(@Body() reorderModulesDto: ReorderModulesDto) {
      return this.modulesService.reorder(reorderModulesDto);
  }
}