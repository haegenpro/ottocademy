import { Controller, Get, Res } from '@nestjs/common';
import express from 'express';
import { join } from 'path';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health')
  getHealth(): string {
    return this.appService.getHello();
  }

  // Serve root index.html
  @Get('')
  getIndex(@Res() res: express.Response): void {
    res.sendFile(join(process.cwd(), 'public', 'index.html'));
  }

  // Serve specific frontend pages
  @Get('auth.html')
  getAuth(@Res() res: express.Response): void {
    res.sendFile(join(process.cwd(), 'public', 'auth.html'));
  }

  @Get('courses.html')
  getCourses(@Res() res: express.Response): void {
    res.sendFile(join(process.cwd(), 'public', 'courses.html'));
  }

  @Get('course-detail.html')
  getCourseDetail(@Res() res: express.Response): void {
    res.sendFile(join(process.cwd(), 'public', 'course-detail.html'));
  }

  @Get('module.html')
  getModule(@Res() res: express.Response): void {
    res.sendFile(join(process.cwd(), 'public', 'module.html'));
  }

  @Get('my-courses.html')
  getMyCourses(@Res() res: express.Response): void {
    res.sendFile(join(process.cwd(), 'public', 'my-courses.html'));
  }
}