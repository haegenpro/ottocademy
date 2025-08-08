const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('🔍 Checking if database is already seeded...');

  // Check if admin user already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email: 'admin@grocademy.com' }
  });

  if (existingAdmin) {
    console.log('✅ Database is already seeded. Skipping seed process.');
    console.log('🔑 Admin Login: admin@grocademy.com / admin123');
    console.log('🔑 User Login: john.doe@email.com / password123');
    return;
  }

  console.log('🌱 Database not seeded. Starting seeding process...');

  // Clear existing data
  console.log('Clearing existing data...');
  await prisma.certificate.deleteMany();
  await prisma.moduleCompletion.deleteMany();
  await prisma.userCourse.deleteMany();
  await prisma.module.deleteMany();
  await prisma.course.deleteMany();
  await prisma.user.deleteMany();

  // === USERS ===
  console.log('Creating users...');
  
  // Admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.create({
    data: {
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

  // Regular users
  const userPassword = await bcrypt.hash('password123', 10);
  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: 'john.doe@email.com',
        username: 'johndoe',
        firstName: 'John',
        lastName: 'Doe',
        password: userPassword,
        balance: 150000,
      },
    }),
    prisma.user.create({
      data: {
        email: 'jane.smith@email.com',
        username: 'janesmith',
        firstName: 'Jane',
        lastName: 'Smith',
        password: userPassword,
        balance: 200000,
      },
    }),
    prisma.user.create({
      data: {
        email: 'alex.johnson@email.com',
        username: 'alexj',
        firstName: 'Alex',
        lastName: 'Johnson',
        password: userPassword,
        balance: 75000,
      },
    }),
    prisma.user.create({
      data: {
        email: 'sarah.williams@email.com',
        username: 'sarahw',
        firstName: 'Sarah',
        lastName: 'Williams',
        password: userPassword,
        balance: 300000,
      },
    }),
    prisma.user.create({
      data: {
        email: 'michael.brown@email.com',
        username: 'mikeb',
        firstName: 'Michael',
        lastName: 'Brown',
        password: userPassword,
        balance: 125000,
      },
    }),
  ]);
  console.log(`Created ${users.length} regular users`);

  // === COURSES ===
  console.log('Creating courses...');

  // Computer Science Courses
  const webDevCourse = await prisma.course.create({
    data: {
      title: 'Complete Web Development Bootcamp',
      description: 'Master full-stack web development with HTML, CSS, JavaScript, React, Node.js, and databases. Build real-world projects and launch your career as a web developer.',
      instructor: 'Dr. Emily Chen',
      price: 89999,
      topics: ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'MongoDB', 'Express', 'Full-Stack'],
      category: 'COMPUTER_SCIENCE',
      thumbnail_image: 'uploads/web-dev-bootcamp.jpg',
    },
  });

  const pythonCourse = await prisma.course.create({
    data: {
      title: 'Python Programming Masterclass',
      description: 'Learn Python from scratch to advanced level. Cover OOP, data structures, algorithms, web scraping, automation, and more.',
      instructor: 'Prof. David Rodriguez',
      price: 69999,
      topics: ['Python', 'OOP', 'Data Structures', 'Algorithms', 'Web Scraping', 'Automation'],
      category: 'COMPUTER_SCIENCE',
      thumbnail_image: 'uploads/python-masterclass.jpg',
    },
  });

  const mobileCourse = await prisma.course.create({
    data: {
      title: 'React Native Mobile App Development',
      description: 'Build cross-platform mobile applications using React Native. Learn navigation, state management, API integration, and deployment.',
      instructor: 'Sarah Kim',
      price: 79999,
      topics: ['React Native', 'Mobile Development', 'Redux', 'Navigation', 'API Integration'],
      category: 'COMPUTER_SCIENCE',
      thumbnail_image: 'uploads/react-native-course.jpg',
    },
  });

  // Data Science Courses
  const dataAnalyticsCourse = await prisma.course.create({
    data: {
      title: 'Data Analytics with Python and SQL',
      description: 'Learn to analyze data using Python, pandas, NumPy, and SQL. Create visualizations and derive insights from real datasets.',
      instructor: 'Dr. Maria Gonzalez',
      price: 74999,
      topics: ['Python', 'SQL', 'Pandas', 'NumPy', 'Data Visualization', 'Statistics'],
      category: 'DATA_SCIENCE',
      thumbnail_image: 'uploads/data-analytics.jpg',
    },
  });

  const machineLearningCourse = await prisma.course.create({
    data: {
      title: 'Machine Learning A-Z',
      description: 'Comprehensive machine learning course covering supervised, unsupervised learning, deep learning, and neural networks.',
      instructor: 'Prof. Robert Thompson',
      price: 99999,
      topics: ['Machine Learning', 'Deep Learning', 'Neural Networks', 'TensorFlow', 'Scikit-learn'],
      category: 'ARTIFICIAL_INTELLIGENCE',
      thumbnail_image: 'uploads/machine-learning-az.jpg',
    },
  });

  // Business Courses
  const digitalMarketingCourse = await prisma.course.create({
    data: {
      title: 'Digital Marketing Mastery',
      description: 'Learn SEO, SEM, social media marketing, content marketing, email marketing, and analytics to grow your business online.',
      instructor: 'Jennifer Lee',
      price: 59999,
      topics: ['SEO', 'SEM', 'Social Media', 'Content Marketing', 'Email Marketing', 'Analytics'],
      category: 'BUSINESS',
      thumbnail_image: 'uploads/digital-marketing.jpg',
    },
  });

  const entrepreneurshipCourse = await prisma.course.create({
    data: {
      title: 'Startup Entrepreneurship',
      description: 'Learn how to start and scale a successful startup. Cover business models, funding, marketing, and leadership.',
      instructor: 'Mark Stevens',
      price: 84999,
      topics: ['Startup', 'Business Model', 'Funding', 'Leadership', 'Innovation', 'Strategy'],
      category: 'BUSINESS',
      thumbnail_image: 'uploads/entrepreneurship.jpg',
    },
  });

  // Personal Development Courses
  const productivityCourse = await prisma.course.create({
    data: {
      title: 'Productivity and Time Management',
      description: 'Master time management, goal setting, habit formation, and productivity systems to achieve more in less time.',
      instructor: 'Lisa Carter',
      price: 39999,
      topics: ['Time Management', 'Productivity', 'Goal Setting', 'Habits', 'Focus', 'Organization'],
      category: 'PERSONAL_DEVELOPMENT',
      thumbnail_image: 'uploads/productivity.jpg',
    },
  });

  // Language Courses
  const englishCourse = await prisma.course.create({
    data: {
      title: 'Business English Communication',
      description: 'Improve your professional English skills for international business, presentations, meetings, and negotiations.',
      instructor: 'Prof. James Wilson',
      price: 49999,
      topics: ['Business English', 'Communication', 'Presentations', 'Meetings', 'Writing', 'Speaking'],
      category: 'LANGUAGE',
      thumbnail_image: 'uploads/business-english.jpg',
    },
  });

  // Arts Course
  const photographyCourse = await prisma.course.create({
    data: {
      title: 'Digital Photography Masterclass',
      description: 'Learn composition, lighting, camera settings, post-processing, and create stunning photographs.',
      instructor: 'Anna Rodriguez',
      price: 54999,
      topics: ['Photography', 'Composition', 'Lighting', 'Camera Settings', 'Photo Editing', 'Lightroom'],
      category: 'ARTS',
      thumbnail_image: 'uploads/photography.jpg',
    },
  });

  const courses = [webDevCourse, pythonCourse, mobileCourse, dataAnalyticsCourse, machineLearningCourse, 
                  digitalMarketingCourse, entrepreneurshipCourse, productivityCourse, englishCourse, photographyCourse];
  console.log(`Created ${courses.length} courses`);

  // === MODULES ===
  console.log('Creating modules...');

  // Web Development Course Modules
  await prisma.module.createMany({
    data: [
      {
        title: 'HTML Fundamentals',
        description: 'Learn HTML structure, semantic elements, forms, and best practices.',
        pdf_content: 'uploads/modules/html-fundamentals.pdf',
        video_content: 'uploads/modules/html-fundamentals.mp4',
        order: 1,
        courseId: webDevCourse.id,
      },
      {
        title: 'CSS Styling and Layout',
        description: 'Master CSS selectors, flexbox, grid, animations, and responsive design.',
        pdf_content: 'uploads/modules/css-styling.pdf',
        video_content: 'uploads/modules/css-styling.mp4',
        order: 2,
        courseId: webDevCourse.id,
      },
      {
        title: 'JavaScript Basics',
        description: 'Variables, functions, DOM manipulation, and event handling.',
        pdf_content: 'uploads/modules/js-basics.pdf',
        video_content: 'uploads/modules/js-basics.mp4',
        order: 3,
        courseId: webDevCourse.id,
      },
      {
        title: 'Advanced JavaScript',
        description: 'ES6+, async/await, closures, and modern JavaScript patterns.',
        pdf_content: 'uploads/modules/js-advanced.pdf',
        video_content: 'uploads/modules/js-advanced.mp4',
        order: 4,
        courseId: webDevCourse.id,
      },
      {
        title: 'React Development',
        description: 'Components, hooks, state management, and React ecosystem.',
        pdf_content: 'uploads/modules/react-dev.pdf',
        video_content: 'uploads/modules/react-dev.mp4',
        order: 5,
        courseId: webDevCourse.id,
      },
    ],
  });

  // Add basic modules for other courses
  for (const course of courses.slice(1)) {
    await prisma.module.createMany({
      data: Array.from({ length: 3 }, (_, i) => ({
        title: `Module ${i + 1}: ${course.title.split(' ')[0]} Basics`,
        description: `Learn fundamental concepts of ${course.title.split(' ')[0]} - Module ${i + 1}`,
        pdf_content: `uploads/modules/${course.title.toLowerCase().replace(/\s+/g, '-')}-module-${i + 1}.pdf`,
        video_content: `uploads/modules/${course.title.toLowerCase().replace(/\s+/g, '-')}-module-${i + 1}.mp4`,
        order: i + 1,
        courseId: course.id,
      }))
    });
  }

  console.log('Created modules for all courses');

  // === USER COURSE PURCHASES ===
  console.log('Creating user course purchases...');
  
  const purchases = [
    { userId: users[0].id, courseId: webDevCourse.id },
    { userId: users[0].id, courseId: pythonCourse.id },
    { userId: users[1].id, courseId: dataAnalyticsCourse.id },
    { userId: users[1].id, courseId: machineLearningCourse.id },
    { userId: users[2].id, courseId: mobileCourse.id },
    { userId: users[3].id, courseId: digitalMarketingCourse.id },
    { userId: users[4].id, courseId: photographyCourse.id },
  ];

  await prisma.userCourse.createMany({ data: purchases });
  console.log(`Created ${purchases.length} course purchases`);

  // === MODULE COMPLETIONS ===
  console.log('Creating module completions...');
  
  const allModules = await prisma.module.findMany();
  const johnWebDevModules = allModules.filter(m => m.courseId === webDevCourse.id).slice(0, 3);
  const johnCompletions = johnWebDevModules.map(module => ({
    userId: users[0].id,
    moduleId: module.id,
    isCompleted: true,
  }));

  await prisma.moduleCompletion.createMany({ data: johnCompletions });
  console.log('Created module completions');

  // === CERTIFICATES ===
  console.log('Creating certificates...');
  
  await prisma.certificate.create({
    data: {
      userId: users[0].id,
      courseId: webDevCourse.id,
      finishDate: new Date('2024-12-15'),
    },
  });
  
  console.log('Created certificates');

  console.log('✅ Seeding finished successfully!');
  console.log('\n=== SEEDED DATA SUMMARY ===');
  console.log(`✅ 1 Admin user (admin@grocademy.com / admin123)`);
  console.log(`✅ ${users.length} Regular users (password: password123)`);
  console.log(`✅ ${courses.length} Courses across multiple categories`);
  console.log(`✅ Multiple modules for each course with PDF and video content`);
  console.log(`✅ ${purchases.length} Course purchases by users`);
  console.log(`✅ Module completions and certificates`);
  console.log('\n🔑 Admin Login: admin@grocademy.com / admin123');
  console.log('🔑 User Login: john.doe@email.com / password123 (or any other user)');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
