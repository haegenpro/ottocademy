import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { ValidationPipe, Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  
  try {
    const app = await NestFactory.create(AppModule);
    
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
    
    await app.listen(process.env.PORT ?? 3000);
    logger.log(`🚀 Application is running on: http://localhost:${process.env.PORT ?? 3000}`);
  } catch (error) {
    logger.error('❌ Error starting the application', error);
    process.exit(1);
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  // Log the error but try to keep the process running
});

bootstrap();
