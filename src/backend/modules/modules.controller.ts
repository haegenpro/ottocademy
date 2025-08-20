import {
  Controller,
  Get,
  Patch,
  Body,
  UseGuards,
  Param,
  Request,
  Put,
  Delete,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ModulesService } from './modules.service';
import { AdminGuard } from '../auth/guards/admin.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ReorderModulesDto } from './dto/reorder-modules.dto';
import { UpdateModuleDto } from './dto/update-module.dto';

@Controller('modules')
export class ModulesController {
  constructor(private readonly modulesService: ModulesService) {}

  @UseGuards(AdminGuard)
  @Patch('reorder')
  reorder(@Body() reorderModulesDto: ReorderModulesDto) {
    return this.modulesService.reorder(reorderModulesDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    const userId = req.user.id;
    return this.modulesService.findOne(id, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/complete')
  completeModule(@Param('id') moduleId: string, @Request() req) {
    const userId = req.user.id;
    return this.modulesService.complete(moduleId, userId);
  }

  @UseGuards(AdminGuard)
  @Put(':id')
  @UseInterceptors(FileFieldsInterceptor([
      { name: 'pdf_content', maxCount: 1 },
      { name: 'video_content', maxCount: 1 },
  ]))
  update(
      @Param('id') id: string,
      @Body() updateModuleDto: UpdateModuleDto,
      @UploadedFiles() files: { pdf_content?: Express.Multer.File[], video_content?: Express.Multer.File[] },
  ) {
      return this.modulesService.update(id, updateModuleDto, files);
  }

  @UseGuards(AdminGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
      return this.modulesService.remove(id);
  }
}