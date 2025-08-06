import {
  Controller, Post, Body, UseGuards, UseInterceptors,
  UploadedFile, Get, Param, Put, Delete
} from '@nestjs/common';

import { CoursesService } from './courses.service';
import { AdminGuard } from '../auth/guards/admin.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@UseGuards(AdminGuard)
@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

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

  @Put(':id')
  @UseInterceptors(FileInterceptor('thumbnail_image'))
  update(
    @Param('id') id: string,
    @Body() updateCourseDto: UpdateCourseDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.coursesService.update(id, updateCourseDto, file?.path);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.coursesService.remove(id);
  }
}