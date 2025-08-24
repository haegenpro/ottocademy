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
  HttpCode,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
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
    const isAdmin = req.user.isAdmin || false;
    return this.modulesService.findOne(id, userId, isAdmin);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/complete')
  completeModule(@Param('id') moduleId: string, @Request() req) {
    const userId = req.user.id;
    const isAdmin = req.user.isAdmin || false;
    return this.modulesService.complete(moduleId, userId, isAdmin);
  }

  @UseGuards(AdminGuard)
  @Put(':id')
  @UseInterceptors(FileFieldsInterceptor([
      { name: 'pdf_content', maxCount: 1 },
      { name: 'video_content', maxCount: 1 },
  ]))
  async update(
      @Param('id') id: string,
      @Body() updateModuleDto: UpdateModuleDto,
      @UploadedFiles() files: { pdf_content?: Express.Multer.File[], video_content?: Express.Multer.File[] },
  ) {
      try {
        const module = await this.modulesService.update(id, updateModuleDto, files);
        return {
          status: 'success',
          message: 'Module updated successfully',
          data: {
            id: module.id,
            course_id: module.courseId,
            title: module.title,
            description: module.description,
            order: module.order,
            pdf_content: module.pdf_content,
            video_content: module.video_content,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        };
      } catch (error) {
        return {
          status: 'error',
          message: error.message || 'Failed to update module',
          data: null,
        };
      }
  }

  @UseGuards(AdminGuard)
  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: string, @Res() res: Response) {
    await this.modulesService.remove(id);
    res.status(204).send();
  }
}