import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StatisticsService {
  constructor(private readonly prisma: PrismaService) {}

  async getHomepageStatistics() {
    try {
      // Get total courses count
      const totalCourses = await this.prisma.course.count();
      
      // Get unique categories count
      const uniqueCategories = await this.prisma.course.findMany({
        select: { category: true },
        distinct: ['category'],
      });
      
      // Round down courses to nearest 10
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
