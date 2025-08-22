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

  async findAll(search?: string, page: number = 1, limit: number = 15, category?: string) {
    const skip = (page - 1) * limit;
    
    const where: any = {};
    
    // Handle search
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' as const } },
        { instructor: { contains: search, mode: 'insensitive' as const } },
        { topics: { has: search } },
      ];
    }
    
    // Handle category filter
    if (category) {
      where.category = category;
    }

    const [courses, total] = await Promise.all([
      this.prisma.course.findMany({
        where,
        skip,
        take: limit,
        include: {
          modules: {
            select: { id: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.course.count({ where }),
    ]);

    const coursesWithModuleCount = courses.map(course => ({
      ...course,
      price: course.price / 100, // Convert from cents to display units
      total_modules: course.modules.length,
      modules: undefined,
    }));

    return {
      status: 'success',
      message: 'Courses retrieved successfully',
      data: coursesWithModuleCount,
      pagination: {
        current_page: page,
        total_pages: Math.ceil(total / limit),
        total_items: total,
      },
    };
  }

  async findOne(id: string, userId?: string) {
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
    
    // Check if user has purchased this course
    let isPurchased = false;
    if (userId) {
      const userCourse = await this.prisma.userCourse.findUnique({
        where: { userId_courseId: { userId, courseId: id } },
      });
      isPurchased = !!userCourse;
    }
    
    // Convert price from cents to display units and add module count and purchase status
    return {
      ...course,
      price: course.price / 100,
      total_modules: course.modules.length,
      isPurchased,
      is_purchased: isPurchased, // For backward compatibility
    };
  }

  async update(id: string, updateCourseDto: UpdateCourseDto, thumbnailPath?: string) {
    // Check if course exists (without user context)
    const existingCourse = await this.prisma.course.findUnique({ where: { id } });
    if (!existingCourse) {
      throw new NotFoundException(`Course with ID "${id}" not found.`);
    }

    const priceInCents = updateCourseDto.price ? updateCourseDto.price * 100 : undefined;

    const updatedCourse = await this.prisma.course.update({
      where: { id },
      data: {
        ...updateCourseDto,
        price: priceInCents,
        thumbnail_image: thumbnailPath,
      },
    });

    // Convert price back to display units
    return {
      ...updatedCourse,
      price: updatedCourse.price / 100,
    };
  }

  async remove(id: string) {
    // Check if course exists (without user context)
    const course = await this.prisma.course.findUnique({ where: { id } });
    if (!course) {
      throw new NotFoundException(`Course with ID "${id}" not found.`);
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.moduleCompletion.deleteMany({
        where: {
          module: {
            courseId: id,
          },
        },
      });

      await tx.module.deleteMany({
        where: { courseId: id },
      });

      await tx.certificate.deleteMany({
        where: { courseId: id },
      });

      await tx.userCourse.deleteMany({
        where: { courseId: id },
      });

      await tx.course.delete({ where: { id } });
    });

    if (course.thumbnail_image) {
      try {
        await fs.unlink(course.thumbnail_image);
      } catch (error) {
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

  async getMyCourses(userId: string, search?: string, page: number = 1, limit: number = 15) {
    const skip = (page - 1) * limit;
    
    const where = {
      userId,
      ...(search && {
        course: {
          OR: [
            { title: { contains: search, mode: 'insensitive' as const } },
            { instructor: { contains: search, mode: 'insensitive' as const } },
            { topics: { has: search } },
          ],
        },
      }),
    };

    const [userCourses, total] = await Promise.all([
      this.prisma.userCourse.findMany({
        where,
        skip,
        take: limit,
        include: {
          course: {
            include: {
              modules: {
                select: { id: true },
              },
            },
          },
        },
        orderBy: { purchasedAt: 'desc' },
      }),
      this.prisma.userCourse.count({ where }),
    ]);

    const courseIds = userCourses.map(uc => uc.courseId);
    const completions = await this.prisma.moduleCompletion.groupBy({
      by: ['moduleId'],
      where: {
        userId,
        isCompleted: true,
        module: {
          courseId: { in: courseIds },
        },
      },
      _count: { moduleId: true },
    });

    const completionMap = new Map();
    for (const completion of completions) {
      const module = await this.prisma.module.findUnique({
        where: { id: completion.moduleId },
        select: { courseId: true },
      });
      if (module) {
        const count = completionMap.get(module.courseId) || 0;
        completionMap.set(module.courseId, count + 1);
      }
    }

    const coursesWithProgress = userCourses.map(userCourse => {
      const totalModules = userCourse.course.modules.length;
      const completedModules = completionMap.get(userCourse.courseId) || 0;
      const progressPercentage = totalModules > 0 ? (completedModules / totalModules) * 100 : 0;

      return {
        id: userCourse.course.id,
        title: userCourse.course.title,
        instructor: userCourse.course.instructor,
        topics: userCourse.course.topics,
        thumbnail_image: userCourse.course.thumbnail_image,
        progress_percentage: Math.round(progressPercentage),
        purchased_at: userCourse.purchasedAt,
      };
    });

    return {
      status: 'success',
      message: 'My courses retrieved successfully',
      data: coursesWithProgress,
      pagination: {
        current_page: page,
        total_pages: Math.ceil(total / limit),
        total_items: total,
      },
    };
  }

  async getCourseModules(courseId: string, userId: string, page: number = 1, limit: number = 15) {
    const userCourse = await this.prisma.userCourse.findUnique({
      where: { userId_courseId: { userId, courseId } },
    });

    if (!userCourse) {
      throw new ForbiddenException('You have not purchased this course.');
    }

    const skip = (page - 1) * limit;

    const [modules, total] = await Promise.all([
      this.prisma.module.findMany({
        where: { courseId },
        skip,
        take: limit,
        include: {
          completions: {
            where: { userId },
            select: { isCompleted: true },
          },
        },
        orderBy: { order: 'asc' },
      }),
      this.prisma.module.count({ where: { courseId } }),
    ]);

    const modulesWithCompletion = modules.map(module => ({
      ...module,
      is_completed: module.completions.length > 0 && module.completions[0].isCompleted,
      completions: undefined,
    }));

    return {
      status: 'success',
      message: 'Course modules retrieved successfully',
      data: modulesWithCompletion,
      pagination: {
        current_page: page,
        total_pages: Math.ceil(total / limit),
        total_items: total,
      },
    };
  }
}
