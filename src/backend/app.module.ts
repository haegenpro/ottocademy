import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { CoursesModule } from './courses/courses.module';
import { MulterModule } from '@nestjs/platform-express';
import { ModulesModule } from './modules/modules.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, 
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    CoursesModule,
    MulterModule.register({
      dest: './uploads',
    }),
    ModulesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}