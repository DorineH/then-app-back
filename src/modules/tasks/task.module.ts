import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksService } from './task.service';
import { TaskEntity } from './entities/task.entity';
import { TasksController } from './task.controller';


@Module({
imports: [TypeOrmModule.forFeature([TaskEntity])],
providers: [TasksService],
controllers: [TasksController],
exports: [TasksService],
})
export class TasksModule {}