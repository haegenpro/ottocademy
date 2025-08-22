import {
  Controller, Post, Body, UseGuards, UseInterceptors,
  UploadedFile, Get, Param, Put, Delete, Request, UploadedFiles, Query
} from '@nestjs/common';
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
  create(
    @Body() createCourseDto: CreateCourseDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.coursesService.create(createCourseDto, file?.path);
  }

  @Get()
  findAll(
    @Query('q') search?: string,
    @Query('category') category?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pageNumber = page ? parseInt(page, 10) : 1;
    const limitNumber = limit ? Math.min(parseInt(limit, 10), 50) : 15;
    return this.coursesService.findAll(search, pageNumber, limitNumber, category);
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
    const userId = req.user?.id; // Optional user ID for purchase status
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
  remove(@Param('id') id: string) {
    return this.coursesService.remove(id);
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
    const pageNumber = page ? parseInt(page, 10) : 1;
    const limitNumber = limit ? Math.min(parseInt(limit, 10), 50) : 15;
    return this.coursesService.getCourseModules(courseId, userId, pageNumber, limitNumber);
  }

  @UseGuards(AdminGuard)
  @Post(':courseId/modules')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'pdf_content', maxCount: 1 },
    { name: 'video_content', maxCount: 1 },
  ]))
  createModule(
    @Param('courseId') courseId: string,
    @Body() createModuleDto: CreateModuleDto,
    @UploadedFiles() files: { pdf_content?: Express.Multer.File[], video_content?: Express.Multer.File[] },
  ) {
    return this.modulesService.create(courseId, createModuleDto, files);
  }
}