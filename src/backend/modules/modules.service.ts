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
    // Convert file paths to URLs that can be served by the static asset middleware
    const pdfPath = files?.pdf_content?.[0]?.path?.replace(/\\/g, '/').replace('./public/', '');
    const videoPath = files?.video_content?.[0]?.path?.replace(/\\/g, '/').replace('./public/', '');

    return this.prisma.module.create({
      data: {
        ...createModuleDto,
        courseId: courseId,
        pdf_content: pdfPath || null,
        video_content: videoPath || null,
      },
    });
  }

  async findOne(moduleId: string, userId: string) {
    const module = await this.prisma.module.findUnique({
      where: { id: moduleId },
      include: {
        course: {
          include: {
            purchasedBy: {
              where: { userId },
            },
          },
        },
        completions: {
          where: { userId },
          select: { isCompleted: true },
        },
      },
    });

    if (!module) {
      throw new NotFoundException(`Module with ID "${moduleId}" not found.`);
    }

    if (module.course.purchasedBy.length === 0) {
      throw new ForbiddenException('You have not purchased this course.');
    }

    return {
      status: 'success',
      message: 'Module retrieved successfully',
      data: {
        ...module,
        is_completed: module.completions.length > 0 && module.completions[0].isCompleted,
        course: undefined,
        completions: undefined,
      },
    };
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
      include: { 
        course: { 
          include: { 
            purchasedBy: {
              where: { userId },
            }
          } 
        } 
      },
    });

    if (!module) {
      throw new NotFoundException(`Module with ID "${moduleId}" not found.`);
    }

    if (module.course.purchasedBy.length === 0) {
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
      status: 'success',
      message: 'Module marked as complete.',
      data: {
        module_id: moduleId,
        is_completed: true,
        course_progress: {
          total_modules: totalModules,
          completed_modules: completedModules,
          percentage: Math.round((completedModules / totalModules) * 100),
        },
        certificate_url: certificate ? `/certificates/${certificate.id}` : null,
      },
    };
  }

  async update(
    id: string,
    updateModuleDto: UpdateModuleDto,
    files: { pdf_content?: Express.Multer.File[], video_content?: Express.Multer.File[] },
  ) {
    const module = await this.prisma.module.findUnique({ where: { id } });
    if (!module) {
      throw new NotFoundException(`Module with ID "${id}" not found.`);
    }

    // Convert file paths to URLs that can be served by the static asset middleware
    const pdfPath = files.pdf_content?.[0]?.path?.replace(/\\/g, '/').replace('./public/', '');
    const videoPath = files.video_content?.[0]?.path?.replace(/\\/g, '/').replace('./public/', '');

    // Clean up old files if new ones are uploaded
    if (pdfPath && module.pdf_content) {
      try { await fs.unlink(`./public/${module.pdf_content}`); } catch (e) { console.error('Error deleting old PDF:', e); }
    }
    if (videoPath && module.video_content) {
      try { await fs.unlink(`./public/${module.video_content}`); } catch (e) { console.error('Error deleting old video:', e); }
    }

    return this.prisma.module.update({
      where: { id },
      data: {
        ...updateModuleDto,
        pdf_content: pdfPath || module.pdf_content,
        video_content: videoPath || module.video_content,
      },
    });
  }

  async remove(id: string) {
    const module = await this.prisma.module.findUnique({ where: { id } });
    
    if (!module) {
      throw new NotFoundException(`Module with ID "${id}" not found.`);
    }
    
    // Clean up files
    if (module.pdf_content) {
      try { await fs.unlink(`./public/${module.pdf_content}`); } catch (e) { console.error('Error deleting PDF:', e); }
    }
    if (module.video_content) {
      try { await fs.unlink(`./public/${module.video_content}`); } catch (e) { console.error('Error deleting video:', e); }
    }

    await this.prisma.module.delete({ where: { id } });
    return { message: `Module with ID "${id}" has been deleted.` };
  }
}