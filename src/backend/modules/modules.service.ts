import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateModuleDto } from './dto/create-module.dto';
import { ReorderModulesDto } from './dto/reorder-modules.dto';

@Injectable()
export class ModulesService {
  constructor(private prisma: PrismaService) {}

  async create(
    courseId: string,
    createModuleDto: CreateModuleDto,
    files: { pdf_content?: Express.Multer.File[], video_content?: Express.Multer.File[] },
  ) {
    const pdfPath = files.pdf_content?.[0]?.path;
    const videoPath = files.video_content?.[0]?.path;

    return this.prisma.module.create({
      data: {
        ...createModuleDto,
        courseId: courseId,
        pdf_content: pdfPath,
        video_content: videoPath,
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
}