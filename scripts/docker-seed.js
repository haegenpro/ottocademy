const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  const existingAdminCount = await prisma.user.count({
    where: { isAdmin: true }
  });

  if (existingAdminCount > 0) {
    console.log('⚠️  Database already seeded. Skipping...');
    console.log('💡 To re-seed, please reset the database first.');
    return;
  }

  // === USERS ===
  console.log('Creating users...');

  const hashedAdminPassword = await bcrypt.hash('admin123', 10);
  const hashedUserPassword = await bcrypt.hash('password123', 10);

  const admin = await prisma.user.create({
    data: {
      email: 'admin@grocademy.com',
      username: 'admin',
      firstName: 'Admin',
      lastName: 'Grocademy',
      password: hashedAdminPassword,
      isAdmin: true,
      balance: 1000000,
      googleId: null,
      picture: null,
    },
  });

  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: 'john.doe@email.com',
        username: 'johndoe',
        firstName: 'John',
        lastName: 'Doe',
        password: hashedUserPassword,
        balance: 15000,
        googleId: null,
        picture: null,
      },
    }),
    prisma.user.create({
      data: {
        email: 'jane.smith@email.com',
        username: 'janesmith',
        firstName: 'Jane',
        lastName: 'Smith',
        password: hashedUserPassword,
        balance: 20000,
        googleId: null,
        picture: null,
      },
    }),
    prisma.user.create({
      data: {
        email: 'alex.johnson@email.com',
        username: 'alexj',
        firstName: 'Alex',
        lastName: 'Johnson',
        password: hashedUserPassword,
        balance: 7500,
        googleId: null,
        picture: null,
      },
    }),
    prisma.user.create({
      data: {
        email: 'sarah.williams@email.com',
        username: 'sarahw',
        firstName: 'Sarah',
        lastName: 'Williams',
        password: hashedUserPassword,
        balance: 30000,
        googleId: null,
        picture: null,
      },
    }),
    prisma.user.create({
      data: {
        email: 'michael.brown@email.com',
        username: 'mikeb',
        firstName: 'Michael',
        lastName: 'Brown',
        password: hashedUserPassword,
        balance: 12500,
        googleId: null,
        picture: null,
      },
    }),
  ]);

  console.log(`Created admin and ${users.length} regular users`);

  // === COURSES ===
  console.log('Creating courses...');

  // Technology Courses
  const webDevCourse = await prisma.course.create({
    data: {
      title: 'Complete Web Development Bootcamp',
      description: 'Learn full-stack web development from HTML/CSS to React and Node.js. Build real-world projects and deploy them.',
      instructor: 'Dr. Sarah Connor',
      price: 8999,
      topics: ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'MongoDB'],
      category: 'INFORMATION_TECHNOLOGY',
      thumbnail_image: 'uploads/courses/web-dev-bootcamp.jpg',
    },
  });

  const pythonCourse = await prisma.course.create({
    data: {
      title: 'Python Programming Mastery',
      description: 'Master Python programming from basics to advanced topics including web development, data science, and automation.',
      instructor: 'Prof. David Chen',
      price: 7999,
      topics: ['Python Basics', 'OOP', 'Django', 'Data Science', 'Machine Learning', 'Automation'],
      category: 'COMPUTER_SCIENCE',
      thumbnail_image: 'uploads/courses/python-masterclass.jpg',
    },
  });

  const mobileCourse = await prisma.course.create({
    data: {
      title: 'Mobile App Development with React Native',
      description: 'Build cross-platform mobile applications using React Native, from basic components to app store deployment.',
      instructor: 'Michael Rodriguez',
      price: 9499,
      topics: ['React Native', 'Mobile UI', 'Navigation', 'API Integration', 'Publishing', 'Performance'],
      category: 'INFORMATION_TECHNOLOGY',
      thumbnail_image: 'uploads/courses/react-native-course.jpg',
    },
  });

  // Data Science Courses
  const dataAnalyticsCourse = await prisma.course.create({
    data: {
      title: 'Data Analytics with Excel and SQL',
      description: 'Learn data analysis techniques using Excel, SQL, and basic statistics to make data-driven decisions.',
      instructor: 'Dr. Emily Watson',
      price: 6999,
      topics: ['Excel Advanced', 'SQL', 'Data Visualization', 'Statistics', 'Dashboards', 'Reporting'],
      category: 'DATA_SCIENCE',
      thumbnail_image: 'uploads/courses/data-analytics.jpg',
    },
  });

  const machineLearningCourse = await prisma.course.create({
    data: {
      title: 'Machine Learning A-Z',
      description: 'Comprehensive machine learning course covering algorithms, Python implementation, and real-world applications.',
      instructor: 'Dr. Robert Kim',
      price: 10999,
      topics: ['Supervised Learning', 'Unsupervised Learning', 'Neural Networks', 'Python', 'TensorFlow', 'Scikit-learn'],
      category: 'DATA_SCIENCE',
      thumbnail_image: 'uploads/courses/machine-learning-az.jpg',
    },
  });

  // Business Courses
  const digitalMarketingCourse = await prisma.course.create({
    data: {
      title: 'Digital Marketing Strategy',
      description: 'Master digital marketing including SEO, social media, email marketing, and paid advertising campaigns.',
      instructor: 'Lisa Thompson',
      price: 5999,
      topics: ['SEO', 'Social Media', 'Email Marketing', 'Google Ads', 'Analytics', 'Content Marketing'],
      category: 'BUSINESS',
      thumbnail_image: 'uploads/courses/digital-marketing.jpg',
    },
  });

  const entrepreneurshipCourse = await prisma.course.create({
    data: {
      title: 'Startup Entrepreneurship',
      description: 'Learn how to start and scale a successful business from idea validation to funding and growth strategies.',
      instructor: 'Mark Stevens',
      price: 8499,
      topics: ['Business Planning', 'Market Research', 'Funding', 'Product Development', 'Marketing', 'Leadership'],
      category: 'BUSINESS',
      thumbnail_image: 'uploads/courses/entrepreneurship.jpg',
    },
  });

  // Personal Development Course
  const productivityCourse = await prisma.course.create({
    data: {
      title: 'Productivity and Time Management',
      description: 'Boost your productivity with proven time management techniques, goal setting, and habit formation strategies.',
      instructor: 'Jennifer Lee',
      price: 3999,
      topics: ['Time Management', 'Productivity', 'Goal Setting', 'Habits', 'Focus', 'Organization'],
      category: 'PERSONAL_DEVELOPMENT',
      thumbnail_image: 'uploads/courses/productivity.jpg',
    },
  });

  // Language Course
  const englishCourse = await prisma.course.create({
    data: {
      title: 'Business English Communication',
      description: 'Improve your professional English skills for international business, presentations, meetings, and negotiations.',
      instructor: 'Prof. James Wilson',
      price: 4999,
      topics: ['Business English', 'Communication', 'Presentations', 'Meetings', 'Writing', 'Speaking'],
      category: 'LANGUAGE',
      thumbnail_image: 'uploads/courses/business-english.jpg',
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
      thumbnail_image: 'uploads/courses/photography.jpg',
    },
  });

  const courses = [
    webDevCourse, pythonCourse, mobileCourse, dataAnalyticsCourse, machineLearningCourse,
    digitalMarketingCourse, entrepreneurshipCourse, productivityCourse, englishCourse, photographyCourse
  ];
  console.log(`Created ${courses.length} courses`);

  // === MODULES ===
  console.log('Creating modules...');

  // Web Development Course Modules
  const webDevModules = [
    {
      title: 'HTML Fundamentals',
      description: 'Learn HTML structure, semantic elements, forms, and best practices for building web pages.',
      pdf_content: null,
      video_content: 'uploads/modules/merahputih.mp4',
      order: 1,
      courseId: webDevCourse.id,
    },
    {
      title: 'CSS Styling and Layout',
      description: 'Master CSS selectors, flexbox, grid, animations, and responsive design techniques.',
      pdf_content: null,
      video_content: 'uploads/modules/test.mp4',
      order: 2,
      courseId: webDevCourse.id,
    },
    {
      title: 'JavaScript Basics',
      description: 'Learn JavaScript fundamentals including variables, functions, DOM manipulation, and event handling.',
      pdf_content: 'uploads/modules/test.pdf',
      video_content: null,
      order: 3,
      courseId: webDevCourse.id,
    },
    {
      title: 'Advanced JavaScript',
      description: 'Explore ES6+ features, async/await, closures, and modern JavaScript development patterns.',
      pdf_content: null,
      video_content: null,
      order: 4,
      courseId: webDevCourse.id,
    },
    {
      title: 'React Development',
      description: 'Build dynamic user interfaces with React components, hooks, state management, and the React ecosystem.',
      pdf_content: null,
      video_content: null,
      order: 5,
      courseId: webDevCourse.id,
    },
    {
      title: 'Node.js Backend',
      description: 'Create server-side applications with Node.js, Express, and RESTful API development.',
      pdf_content: null,
      video_content: null,
      order: 6,
      courseId: webDevCourse.id,
    },
    {
      title: 'Database Integration',
      description: 'Learn database design, SQL, and how to integrate databases with web applications.',
      pdf_content: null,
      video_content: null,
      order: 7,
      courseId: webDevCourse.id,
    },
    {
      title: 'Deployment and DevOps',
      description: 'Deploy applications to production with cloud services, CI/CD, and monitoring tools.',
      pdf_content: null,
      video_content: null,
      order: 8,
      courseId: webDevCourse.id,
    },
  ];

  await prisma.module.createMany({ data: webDevModules });

  // Python Course Modules
  const pythonModules = [
    {
      title: 'Python Fundamentals',
      description: 'Learn Python syntax, data types, control structures, and basic programming concepts.',
      pdf_content: null,
      video_content: null,
      order: 1,
      courseId: pythonCourse.id,
    },
    {
      title: 'Object-Oriented Programming',
      description: 'Master classes, objects, inheritance, polymorphism, and OOP design principles in Python.',
      pdf_content: null,
      video_content: null,
      order: 2,
      courseId: pythonCourse.id,
    },
    {
      title: 'Python Libraries and Modules',
      description: 'Explore essential Python libraries for data manipulation, web development, and automation.',
      pdf_content: null,
      video_content: null,
      order: 3,
      courseId: pythonCourse.id,
    },
    {
      title: 'Web Development with Django',
      description: 'Build web applications using Django framework, models, views, and templates.',
      pdf_content: null,
      video_content: null,
      order: 4,
      courseId: pythonCourse.id,
    },
    {
      title: 'Data Science with Python',
      description: 'Use Python for data analysis with pandas, numpy, and visualization libraries.',
      pdf_content: null,
      video_content: null,
      order: 5,
      courseId: pythonCourse.id,
    },
    {
      title: 'Automation and Scripting',
      description: 'Automate tasks and processes using Python scripts and third-party tools.',
      pdf_content: null,
      video_content: null,
      order: 6,
      courseId: pythonCourse.id,
    },
  ];

  await prisma.module.createMany({ data: pythonModules });

  const otherCourses = [mobileCourse, dataAnalyticsCourse, machineLearningCourse, digitalMarketingCourse, entrepreneurshipCourse, productivityCourse, englishCourse, photographyCourse];
  
  for (const course of otherCourses) {
    const modules = Array.from({ length: 6 }, (_, i) => ({
      title: `Module ${i + 1}: ${course.title.split(' ')[0]} Fundamentals`,
      description: `Learn essential concepts and practices in ${course.title.split(' ')[0]} - Module ${i + 1}`,
      pdf_content: null,
      video_content: null,
      order: i + 1,
      courseId: course.id,
    }));

    await prisma.module.createMany({ data: modules });
  }

  console.log('Created comprehensive modules for all courses');

  // === USER COURSE PURCHASES ===
  console.log('Creating user course purchases...');
  
  const purchases = [
    { userId: users[0].id, courseId: webDevCourse.id },
    { userId: users[0].id, courseId: pythonCourse.id },
    { userId: users[1].id, courseId: dataAnalyticsCourse.id },
    { userId: users[1].id, courseId: machineLearningCourse.id },
    { userId: users[2].id, courseId: mobileCourse.id },
    { userId: users[2].id, courseId: webDevCourse.id },
    { userId: users[3].id, courseId: digitalMarketingCourse.id },
    { userId: users[3].id, courseId: entrepreneurshipCourse.id },
    { userId: users[4].id, courseId: photographyCourse.id },
    { userId: users[4].id, courseId: englishCourse.id },
  ];

  await prisma.userCourse.createMany({ data: purchases });
  console.log(`Created ${purchases.length} course purchases`);

  // === MODULE COMPLETIONS ===
  console.log('Creating module completions...');
  
  const allModules = await prisma.module.findMany();
  
  const johnWebDevModules = allModules.filter(m => m.courseId === webDevCourse.id).slice(0, 3);
  const johnWebDevCompletions = johnWebDevModules.map(module => ({
    userId: users[0].id,
    moduleId: module.id,
    isCompleted: true,
  }));

  const johnPythonModules = allModules.filter(m => m.courseId === pythonCourse.id).slice(0, 2);
  const johnPythonCompletions = johnPythonModules.map(module => ({
    userId: users[0].id,
    moduleId: module.id,
    isCompleted: true,
  }));

  const janeDataModules = allModules.filter(m => m.courseId === dataAnalyticsCourse.id).slice(0, 4);
  const janeDataCompletions = janeDataModules.map(module => ({
    userId: users[1].id,
    moduleId: module.id,
    isCompleted: true,
  }));

  const bobMobileModules = allModules.filter(m => m.courseId === mobileCourse.id).slice(0, 1);
  const bobMobileCompletions = bobMobileModules.map(module => ({
    userId: users[2].id,
    moduleId: module.id,
    isCompleted: true,
  }));

  const allCompletions = [
    ...johnWebDevCompletions,
    ...johnPythonCompletions,
    ...janeDataCompletions,
    ...bobMobileCompletions,
  ];

  await prisma.moduleCompletion.createMany({ data: allCompletions });
  console.log(`Created ${allCompletions.length} module completions`);

  // === CERTIFICATES ===
  console.log('Creating certificates...');
  
  await prisma.certificate.create({
    data: {
      userId: users[0].id,
      courseId: webDevCourse.id,
      finishDate: new Date('2024-12-01'),
    },
  });

  await prisma.certificate.create({
    data: {
      userId: users[1].id,
      courseId: dataAnalyticsCourse.id,
      finishDate: new Date('2024-12-05'),
    },
  });
  
  console.log('Created 2 certificates');

  console.log('✅ Seeding finished successfully!');
  console.log('\n=== SEEDED DATA SUMMARY ===');
  console.log(`✅ 1 Admin user (admin@grocademy.com / admin123)`);
  console.log(`✅ ${users.length} Regular users (password: password123)`);
  console.log(`✅ ${courses.length} Courses across all categories`);
  console.log(`✅ Comprehensive modules for each course (HTML Fundamentals has test video)`);
  console.log(`✅ ${purchases.length} Course purchases by users`);
  console.log(`✅ ${allCompletions.length} Module completions showing user progress`);
  console.log(`✅ 2 Certificates for completed courses`);
  console.log('\n🔑 Admin Login: admin@grocademy.com / admin123');
  console.log('🔑 User Login: john.doe@email.com / password123 (or any other user)');
  console.log('🎥 Test Video Module: HTML Fundamentals in Web Development course');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
