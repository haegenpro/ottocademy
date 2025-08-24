import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StatisticsService {
  constructor(private readonly prisma: PrismaService) {}

  async getHomepageStatistics() {
    try {
      const totalCourses = await this.prisma.course.count();
      
      const uniqueCategories = await this.prisma.course.findMany({
        select: { category: true },
        distinct: ['category'],
      });
      
      const roundedCourses = Math.floor(totalCourses / 10) * 10;
      
      return {
        status: 'success',
        data: {
          total_courses: totalCourses,
          rounded_courses: roundedCourses,
          total_categories: uniqueCategories.length,
          display_courses: roundedCourses > 0 ? `${roundedCourses}+` : `${totalCourses}`,
        }
      };
    } catch (error) {
      return {
        status: 'error',
        message: 'Failed to fetch statistics',
        data: null
      };
    }
  }
}
