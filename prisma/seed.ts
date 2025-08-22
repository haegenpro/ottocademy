import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

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
      balance: 1000000,
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
        balance: 15000,
      },
    }),
    prisma.user.create({
      data: {
        email: 'jane.smith@email.com',
        username: 'janesmith',
        firstName: 'Jane',
        lastName: 'Smith',
        password: userPassword,
        balance: 20000,
      },
    }),
    prisma.user.create({
      data: {
        email: 'alex.johnson@email.com',
        username: 'alexj',
        firstName: 'Alex',
        lastName: 'Johnson',
        password: userPassword,
        balance: 7500,
      },
    }),
    prisma.user.create({
      data: {
        email: 'sarah.williams@email.com',
        username: 'sarahw',
        firstName: 'Sarah',
        lastName: 'Williams',
        password: userPassword,
        balance: 30000,
      },
    }),
    prisma.user.create({
      data: {
        email: 'michael.brown@email.com',
        username: 'mikeb',
        firstName: 'Michael',
        lastName: 'Brown',
        password: userPassword,
        balance: 12500,
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
      price: 8999,
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
      price: 6999,
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
      price: 7999,
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
      price: 7499,
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
      price: 9999,
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
      price: 5999,
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
      price: 8499,
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
      price: 3999,
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
      price: 4999,
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
      price: 5499,
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
      {
        title: 'Backend with Node.js',
        description: 'Server setup, Express.js, middleware, and API development.',
        pdf_content: 'uploads/modules/nodejs-backend.pdf',
        video_content: 'uploads/modules/nodejs-backend.mp4',
        order: 6,
        courseId: webDevCourse.id,
      },
      {
        title: 'Database Integration',
        description: 'MongoDB setup, CRUD operations, and data modeling.',
        pdf_content: 'uploads/modules/database-integration.pdf',
        video_content: 'uploads/modules/database-integration.mp4',
        order: 7,
        courseId: webDevCourse.id,
      },
      {
        title: 'Deployment and DevOps',
        description: 'Deploy applications using cloud services and CI/CD pipelines.',
        pdf_content: 'uploads/modules/deployment.pdf',
        video_content: 'uploads/modules/deployment.mp4',
        order: 8,
        courseId: webDevCourse.id,
      },
    ],
  });

  // Python Course Modules
  await prisma.module.createMany({
    data: [
      {
        title: 'Python Syntax and Basics',
        description: 'Variables, data types, operators, and control structures.',
        pdf_content: 'uploads/modules/python-basics.pdf',
        video_content: 'uploads/modules/python-basics.mp4',
        order: 1,
        courseId: pythonCourse.id,
      },
      {
        title: 'Object-Oriented Programming',
        description: 'Classes, objects, inheritance, polymorphism, and encapsulation.',
        pdf_content: 'uploads/modules/python-oop.pdf',
        video_content: 'uploads/modules/python-oop.mp4',
        order: 2,
        courseId: pythonCourse.id,
      },
      {
        title: 'Data Structures and Algorithms',
        description: 'Lists, dictionaries, sets, sorting, searching, and complexity analysis.',
        pdf_content: 'uploads/modules/python-algorithms.pdf',
        video_content: 'uploads/modules/python-algorithms.mp4',
        order: 3,
        courseId: pythonCourse.id,
      },
      {
        title: 'File Handling and I/O',
        description: 'Reading and writing files, working with CSV, JSON, and APIs.',
        pdf_content: 'uploads/modules/python-io.pdf',
        video_content: 'uploads/modules/python-io.mp4',
        order: 4,
        courseId: pythonCourse.id,
      },
      {
        title: 'Web Scraping with Python',
        description: 'BeautifulSoup, requests, selenium, and ethical scraping practices.',
        pdf_content: 'uploads/modules/python-scraping.pdf',
        video_content: 'uploads/modules/python-scraping.mp4',
        order: 5,
        courseId: pythonCourse.id,
      },
    ],
  });

  // Data Analytics Course Modules
  await prisma.module.createMany({
    data: [
      {
        title: 'Introduction to Data Analytics',
        description: 'Data types, data lifecycle, and analytics methodology.',
        pdf_content: 'uploads/modules/data-intro.pdf',
        video_content: 'uploads/modules/data-intro.mp4',
        order: 1,
        courseId: dataAnalyticsCourse.id,
      },
      {
        title: 'SQL for Data Analysis',
        description: 'Queries, joins, aggregations, and database design.',
        pdf_content: 'uploads/modules/sql-analysis.pdf',
        video_content: 'uploads/modules/sql-analysis.mp4',
        order: 2,
        courseId: dataAnalyticsCourse.id,
      },
      {
        title: 'Python for Data Science',
        description: 'Pandas, NumPy, data cleaning, and manipulation.',
        pdf_content: 'uploads/modules/python-datascience.pdf',
        video_content: 'uploads/modules/python-datascience.mp4',
        order: 3,
        courseId: dataAnalyticsCourse.id,
      },
      {
        title: 'Data Visualization',
        description: 'Matplotlib, Seaborn, and creating compelling visualizations.',
        pdf_content: 'uploads/modules/data-visualization.pdf',
        video_content: 'uploads/modules/data-visualization.mp4',
        order: 4,
        courseId: dataAnalyticsCourse.id,
      },
    ],
  });

  // Add modules for other courses (simplified for brevity)
  const otherCourseModules = [
    // Machine Learning modules
    { courseId: machineLearningCourse.id, count: 6, prefix: 'ml' },
    // Mobile Development modules
    { courseId: mobileCourse.id, count: 5, prefix: 'mobile' },
    // Digital Marketing modules
    { courseId: digitalMarketingCourse.id, count: 4, prefix: 'marketing' },
    // Entrepreneurship modules
    { courseId: entrepreneurshipCourse.id, count: 5, prefix: 'entrepreneurship' },
    // Productivity modules
    { courseId: productivityCourse.id, count: 3, prefix: 'productivity' },
    // English modules
    { courseId: englishCourse.id, count: 4, prefix: 'english' },
    // Photography modules
    { courseId: photographyCourse.id, count: 4, prefix: 'photography' },
  ];

  for (const courseModule of otherCourseModules) {
    const modules = Array.from({ length: courseModule.count }, (_, i) => ({
      title: `Module ${i + 1}: ${courseModule.prefix} topic ${i + 1}`,
      description: `Learn important concepts in ${courseModule.prefix} - module ${i + 1}`,
      pdf_content: `uploads/modules/${courseModule.prefix}-module-${i + 1}.pdf`,
      video_content: `uploads/modules/${courseModule.prefix}-module-${i + 1}.mp4`,
      order: i + 1,
      courseId: courseModule.courseId,
    }));
    
    await prisma.module.createMany({ data: modules });
  }

  console.log('Created modules for all courses');

  // === USER COURSE PURCHASES ===
  console.log('Creating user course purchases...');
  
  const purchases = [
    // John purchased web development and python
    { userId: users[0].id, courseId: webDevCourse.id },
    { userId: users[0].id, courseId: pythonCourse.id },
    
    // Jane purchased data analytics and machine learning
    { userId: users[1].id, courseId: dataAnalyticsCourse.id },
    { userId: users[1].id, courseId: machineLearningCourse.id },
    { userId: users[1].id, courseId: webDevCourse.id },
    
    // Alex purchased mobile development and productivity
    { userId: users[2].id, courseId: mobileCourse.id },
    { userId: users[2].id, courseId: productivityCourse.id },
    
    // Sarah purchased business courses
    { userId: users[3].id, courseId: digitalMarketingCourse.id },
    { userId: users[3].id, courseId: entrepreneurshipCourse.id },
    { userId: users[3].id, courseId: englishCourse.id },
    
    // Michael purchased photography and productivity
    { userId: users[4].id, courseId: photographyCourse.id },
    { userId: users[4].id, courseId: productivityCourse.id },
  ];

  await prisma.userCourse.createMany({ data: purchases });
  console.log(`Created ${purchases.length} course purchases`);

  // === MODULE COMPLETIONS ===
  console.log('Creating module completions...');
  
  // Get all modules for purchased courses
  const allModules = await prisma.module.findMany();
  
  // John completed all modules for web dev course (first 8 modules)
  const johnWebDevModules = allModules.filter(m => m.courseId === webDevCourse.id);
  const johnCompletions = johnWebDevModules.map(module => ({
    userId: users[0].id,
    moduleId: module.id,
    isCompleted: true,
  }));
  
  // Jane completed first 3 modules of data analytics
  const janeDataModules = allModules.filter(m => m.courseId === dataAnalyticsCourse.id).slice(0, 3);
  const janeCompletions = janeDataModules.map(module => ({
    userId: users[1].id,
    moduleId: module.id,
    isCompleted: true,
  }));
  
  // Alex completed first 2 modules of productivity course
  const alexProductivityModules = allModules.filter(m => m.courseId === productivityCourse.id).slice(0, 2);
  const alexCompletions = alexProductivityModules.map(module => ({
    userId: users[2].id,
    moduleId: module.id,
    isCompleted: true,
  }));

  await prisma.moduleCompletion.createMany({
    data: [...johnCompletions, ...janeCompletions, ...alexCompletions],
  });
  console.log('Created module completions');

  // === CERTIFICATES ===
  console.log('Creating certificates...');
  
  // John completed web development course, so he gets a certificate
  await prisma.certificate.create({
    data: {
      userId: users[0].id,
      courseId: webDevCourse.id,
      finishDate: new Date('2024-12-15'),
    },
  });
  
  console.log('Created certificates');

  console.log('Seeding finished successfully!');
  console.log('\n=== SEEDED DATA SUMMARY ===');
  console.log(`✅ 1 Admin user (admin@grocademy.com / admin123)`);
  console.log(`✅ ${users.length} Regular users (password: password123)`);
  console.log(`✅ ${courses.length} Courses across multiple categories`);
  console.log(`✅ Multiple modules for each course with PDF and video content`);
  console.log(`✅ ${purchases.length} Course purchases by users`);
  console.log(`✅ Module completions and 1 certificate`);
  console.log('\n🔑 Admin Login: admin@grocademy.com / admin123');
  console.log('🔑 User Login: john.doe@email.com / password123 (or any other user)');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });