import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { ValidationPipe, Logger } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  
  try {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    
    // Serve static files from the 'public' directory (clearer separation from backend)
    app.useStaticAssets(join(process.cwd(), 'public'), {
      index: false, // Disable auto-serving index.html to avoid conflict with controller
    });
    
    // Set global API prefix for API routes only
    app.setGlobalPrefix('api', {
      exclude: [
        '',
        'auth.html',
        'courses.html', 
        'course-detail.html',
        'module.html',
        'my-courses.html'
      ]
    });
    
    // Global exception filter to prevent server crashes
    app.useGlobalFilters(new AllExceptionsFilter());
    
    // Global validation pipe for DTO validation
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }));
    
    // Enable CORS for frontend integration
    app.enableCors({
      origin: true,
      credentials: true,
    });

    const port = process.env.PORT ?? 3000;

    // Listen on all interfaces (IPv4 and IPv6)
    await app.listen(port, '::'); // '::' binds to both IPv4 and IPv6
    
    logger.log(`Application is running on: http://localhost:${port}`);
    logger.log(`Also available on: http://127.0.0.1:${port}`);
  } catch (error) {
    logger.error('❌ Error starting the application', error);
    process.exit(1);
  }
}

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

bootstrap();