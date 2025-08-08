import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import * as fs from 'fs/promises';

@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService) {}

  async create(createCourseDto: CreateCourseDto, thumbnailPath?: string) {
    const priceInCents = createCourseDto.price * 100;

    return this.prisma.course.create({
      data: {
        ...createCourseDto,
        price: priceInCents,
        thumbnail_image: thumbnailPath,
      },
    });
  }

  async findAll() {
    return this.prisma.course.findMany({
      include: {
        modules: {
          orderBy: { order: 'asc' },
        },
      },
    });
  }

  async findOne(id: string) {
    const course = await this.prisma.course.findUnique({ 
      where: { id },
      include: {
        modules: {
          orderBy: { order: 'asc' },
        },
      },
    });
    if (!course) {
      throw new NotFoundException(`Course with ID "${id}" not found.`);
    }
    return course;
  }

  async update(id: string, updateCourseDto: UpdateCourseDto, thumbnailPath?: string) {
    await this.findOne(id);

    const priceInCents = updateCourseDto.price ? updateCourseDto.price * 100 : undefined;

    return this.prisma.course.update({
      where: { id },
      data: {
        ...updateCourseDto,
        price: priceInCents,
        thumbnail_image: thumbnailPath,
      },
    });
  }

  async remove(id: string) {
    const course = await this.findOne(id);

    // Delete in correct order due to foreign key constraints
    await this.prisma.$transaction(async (tx) => {
      // Delete module completions first
      await tx.moduleCompletion.deleteMany({
        where: {
          module: {
            courseId: id,
          },
        },
      });

      // Delete modules
      await tx.module.deleteMany({
        where: { courseId: id },
      });

      // Delete certificates
      await tx.certificate.deleteMany({
        where: { courseId: id },
      });

      // Delete user course purchases
      await tx.userCourse.deleteMany({
        where: { courseId: id },
      });

      // Finally delete the course
      await tx.course.delete({ where: { id } });
    });

    // Try to delete thumbnail file (don't fail if it doesn't exist)
    if (course.thumbnail_image) {
      try {
        await fs.unlink(course.thumbnail_image);
      } catch (error) {
        // File doesn't exist, that's okay
        console.log(`Thumbnail file not found for course ${id}, skipping deletion`);
      }
    }

    return { message: `Course with ID "${id}" deleted successfully.` };
  }

  async buy(courseId: string, userId: string) {
    return this.prisma.$transaction(async (tx) => {
      const course = await tx.course.findUnique({ where: { id: courseId } });
      const user = await tx.user.findUnique({ where: { id: userId } });

      if (!course) {
        throw new NotFoundException(`Course with ID "${courseId}" not found.`);
      }
      if (!user) {
        throw new NotFoundException(`User with ID "${userId}" not found.`);
      }

      if (user.balance < course.price) {
        throw new ForbiddenException('Insufficient balance.');
      }

      const existingPurchase = await tx.userCourse.findUnique({
        where: { userId_courseId: { userId, courseId } },
      });

      if (existingPurchase) {
        throw new ConflictException('Course already purchased.');
      }

      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: { balance: { decrement: course.price } },
      });

      await tx.userCourse.create({
        data: {
          userId,
          courseId,
        },
      });

      return {
        message: 'Course purchased successfully!',
        user_balance: updatedUser.balance,
      };
    });
  }
}