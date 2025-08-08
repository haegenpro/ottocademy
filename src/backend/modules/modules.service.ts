import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateModuleDto } from './dto/create-module.dto';
import { ReorderModulesDto } from './dto/reorder-modules.dto';
import { UpdateModuleDto } from './dto/update-module.dto';
import * as fs from 'fs/promises';

@Injectable()
export class ModulesService {
  constructor(private prisma: PrismaService) {}

  async create(
    courseId: string,
    createModuleDto: CreateModuleDto,
    files?: { pdf_content?: Express.Multer.File[], video_content?: Express.Multer.File[] },
  ) {
    const pdfPath = files?.pdf_content?.[0]?.path;
    const videoPath = files?.video_content?.[0]?.path;

    return this.prisma.module.create({
      data: {
        ...createModuleDto,
        courseId: courseId,
        pdf_content: pdfPath || null,
        video_content: videoPath || null,
      },
    });
  }

  async reorder(reorderModulesDto: ReorderModulesDto) {
    const { module_order } = reorderModulesDto;

    const updatePromises = module_order.map(module =>
      this.prisma.module.update({
        where: { id: module.id },
        data: { order: module.order },
      }),
    );

    return this.prisma.$transaction(updatePromises);
  }

  async complete(moduleId: string, userId: string) {
    const module = await this.prisma.module.findUnique({
      where: { id: moduleId },
      include: { course: { include: { purchasedBy: true } } },
    });

    if (!module) {
      throw new NotFoundException(`Module with ID "${moduleId}" not found.`);
    }

    const isPurchased = module.course.purchasedBy.some(p => p.userId === userId);
    if (!isPurchased) {
      throw new ForbiddenException('You have not purchased this course.');
    }

    await this.prisma.moduleCompletion.upsert({
      where: { userId_moduleId: { userId, moduleId } },
      update: { isCompleted: true },
      create: { userId, moduleId, isCompleted: true },
    });

    const courseId = module.courseId;
    const totalModules = await this.prisma.module.count({ where: { courseId } });
    const completedModules = await this.prisma.moduleCompletion.count({
      where: {
        userId,
        isCompleted: true,
        module: { courseId },
      },
    });

    let certificate: any = null;
    if (totalModules === completedModules) {
      certificate = await this.prisma.certificate.upsert({
        where: { userId_courseId: { userId, courseId } },
        update: {},
        create: { userId, courseId },
      });
    }

    return {
      message: 'Module marked as complete.',
      course_progress: {
        total_modules: totalModules,
        completed_modules: completedModules,
        percentage: (completedModules / totalModules) * 100,
      },
      certificate_generated: certificate,
    };
  }

  async findOne(id: string) {
    const module = await this.prisma.module.findUnique({ where: { id } });
    if (!module) {
      throw new NotFoundException(`Module with ID "${id}" not found.`);
    }
    return module;
  }

  async update(
    id: string,
    updateModuleDto: UpdateModuleDto,
    files: { pdf_content?: Express.Multer.File[], video_content?: Express.Multer.File[] },
  ) {
    await this.findOne(id);

    const pdfPath = files.pdf_content?.[0]?.path;
    const videoPath = files.video_content?.[0]?.path;

    return this.prisma.module.update({
      where: { id },
      data: {
        ...updateModuleDto,
        pdf_content: pdfPath,
        video_content: videoPath,
      },
    });
  }

  async remove(id: string) {
    const module = await this.findOne(id);
    
    if (module.pdf_content) {
      try { await fs.unlink(module.pdf_content); } catch (e) { console.error(e); }
    }
    if (module.video_content) {
      try { await fs.unlink(module.video_content); } catch (e) { console.error(e); }
    }

    await this.prisma.module.delete({ where: { id } });
    return { message: `Module with ID "${id}" has been deleted.` };
  }
}