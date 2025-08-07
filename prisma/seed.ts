import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@grocademy.com' },
    update: {},
    create: {
      email: 'admin@grocademy.com',
      username: 'admin',
      firstName: 'Admin',
      lastName: 'Grocademy',
      password: adminPassword,
      isAdmin: true,
      balance: 10000000,
    },
  });
  console.log(`Created admin user: ${admin.email}`);

  const course1 = await prisma.course.create({
    data: {
      title: 'Introduction to Web Development',
      description: 'Learn the fundamentals of HTML, CSS, and JavaScript.',
      instructor: 'John Doe',
      price: 4999,
      topics: ['HTML', 'CSS', 'JavaScript', 'Frontend'],
      category: 'COMPUTER_SCIENCE',
      thumbnail_image: 'uploads/sample-thumbnail.jpg',
    },
  });
  console.log(`Created course: ${course1.title}`);

  await prisma.module.createMany({
    data: [
      {
        title: 'Module 1: Getting Started with HTML',
        description: 'The basic structure of a web page.',
        order: 1,
        courseId: course1.id,
      },
      {
        title: 'Module 2: Styling with CSS',
        description: 'Making your websites look good.',
        order: 2,
        courseId: course1.id,
      },
      {
        title: 'Module 3: JavaScript Fundamentals',
        description: 'Adding interactivity to your pages.',
        order: 3,
        courseId: course1.id,
      },
    ],
  });
  console.log(`Created 3 modules for ${course1.title}`);

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });