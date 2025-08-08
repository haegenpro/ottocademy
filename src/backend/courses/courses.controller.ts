import {
  Controller, Post, Body, UseGuards, UseInterceptors,
  UploadedFile, Get, Param, Put, Delete, Request, UploadedFiles
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
  findAll() {
    return this.coursesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.coursesService.findOne(id);
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