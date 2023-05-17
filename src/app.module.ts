import { Module } from '@nestjs/common';
import { TaskModule } from './task/task.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './task/task.entity';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TaskModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'www56923',
      database: 'task-management',
      autoLoadEntities: true,
      synchronize: true,
      entities: [Task],
    }),
    AuthModule,
  ],
})
export class AppModule {}
