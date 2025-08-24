import {
  Controller, Post, Body, UseGuards, UseInterceptors,
  UploadedFile, Get, Param, Put, Delete, Request, UploadedFiles, Query,
  HttpCode, Res, Patch
} from '@nestjs/common';
import type { Response } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CoursesService } from './courses.service';
import { AdminGuard } from '../auth/guards/admin.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { /*...,*/ ModulesService } from '../modules/modules.service';
import { CreateModuleDto } from '../modules/dto/create-module.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@UseGuards(JwtAuthGuard)
@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService,
              private readonly modulesService: ModulesService
  ) {}

  @UseGuards(AdminGuard)
  @Post()
  @UseInterceptors(FileInterceptor('thumbnail_image'))
  async create(
    @Body() createCourseDto: CreateCourseDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      const course = await this.coursesService.create(createCourseDto, file?.path);
      return {
        status: 'success',
        message: 'Course created successfully',
        data: course,
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message || 'Failed to create course',
        data: null,
      };
    }
  }

  @Get()
  async findAll(
    @Query('q') search?: string,
    @Query('category') category?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    try {
      const pageNumber = page ? parseInt(page, 10) : 1;
      const limitNumber = limit ? Math.min(parseInt(limit, 10), 50) : 15;
      const result = await this.coursesService.findAll(search, pageNumber, limitNumber, category);
      return {
        status: 'success',
        message: 'Courses retrieved successfully',
        data: result.data,
        pagination: result.pagination,
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message || 'Failed to retrieve courses',
        data: null,
      };
    }
  }

  @Get('my-courses')
  getMyCourses(
    @Request() req,
    @Query('q') search?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const userId = req.user.id;
    const pageNumber = page ? parseInt(page, 10) : 1;
    const limitNumber = limit ? Math.min(parseInt(limit, 10), 50) : 15;
    return this.coursesService.getMyCourses(userId, search, pageNumber, limitNumber);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    const userId = req.user?.id;
    return this.coursesService.findOne(id, userId);
  }

  @UseGuards(AdminGuard)
  @Put(':id')
  @UseInterceptors(FileInterceptor('thumbnail_image'))
  update(
    @Param('id') id: string,
    @Body() updateCourseDto: UpdateCourseDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.coursesService.update(id, updateCourseDto, file?.path);
  }

  @UseGuards(AdminGuard)
  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: string, @Res() res: Response) {
    await this.coursesService.remove(id);
    res.status(204).send();
  }

  @Post(':id/buy')
  buyCourse(@Param('id') courseId: string, @Request() req) {
    const userId = req.user.id;
    return this.coursesService.buy(courseId, userId);
  }

  @Get(':courseId/modules')
  getCourseModules(
    @Param('courseId') courseId: string,
    @Request() req,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const userId = req.user.id;
    const isAdmin = req.user.isAdmin || false;
    const pageNumber = page ? parseInt(page, 10) : 1;
    const limitNumber = limit ? Math.min(parseInt(limit, 10), 50) : 15;
    return this.coursesService.getCourseModules(courseId, userId, pageNumber, limitNumber, isAdmin);
  }

  @UseGuards(AdminGuard)
  @Post(':courseId/modules')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'pdf_content', maxCount: 1 },
    { name: 'video_content', maxCount: 1 },
  ]))
  async createModule(
    @Param('courseId') courseId: string,
    @Body() createModuleDto: CreateModuleDto,
    @UploadedFiles() files: { pdf_content?: Express.Multer.File[], video_content?: Express.Multer.File[] },
  ) {
    try {
      const module = await this.modulesService.create(courseId, createModuleDto, files);
      return {
        status: 'success',
        message: 'Module created successfully',
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
        message: error.message || 'Failed to create module',
        data: null,
      };
    }
  }

  @UseGuards(AdminGuard)
  @Patch(':courseId/modules/reorder')
  async reorderModules(
    @Param('courseId') courseId: string,
    @Body() reorderDto: { module_order: { id: string; order: number }[] },
  ) {
    try {
      const result = await this.modulesService.reorderModules(courseId, reorderDto.module_order);
      return {
        status: 'success',
        message: 'Modules reordered successfully',
        data: {
          module_order: result,
        },
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message || 'Failed to reorder modules',
        data: null,
      };
    }
  }
}