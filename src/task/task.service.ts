import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { Repository } from 'typeorm';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task-dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter';
import { User } from 'src/auth/user.entity';
@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  async getTaskByID(id: string, user: User): Promise<Task> {
    const found = await this.taskRepository.findOne({ where: { id, user } });
    if (!found) throw new NotFoundException(`${id} task is not found!`);
    return found;
  }

  getTasks(getTasksFilterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    const { status, search } = getTasksFilterDto;
    const query = this.taskRepository.createQueryBuilder('task');
    query.where({ user });
    if (status) {
      query.andWhere('task.status = :status', { status });
    }
    if (search) {
      query.andWhere(
        '(LOWER(task.title) like LOWER(:search) OR LOWER(task.description) like LOWER(:search))',
        {
          search: `%${search}%`,
        },
      );
    }
    const tasks = query.getMany();
    return tasks;
  }
  async deleteTaskByID(id: string, user: User): Promise<void> {
    const found = await this.getTaskByID(id, user);
    if (found) {
      const result = await this.taskRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException(
          `id:${id} was not found! Please try again……`,
        );
      }
    } else {
      throw new NotFoundException();
    }
  }
  // deleteTaskByID(id: string): void {
  //   const found = this.getTaskByID(id);
  //   this.tasks = this.tasks.filter((task) => task.id !== id);
  // }
  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const { title, description } = createTaskDto;
    const task = this.taskRepository.create({
      title,
      description,
      status: TaskStatus.OPEN,
      user,
    });
    await this.taskRepository.save(task);
    return task;
  }

  async updateStatusByID(
    id: string,
    status: TaskStatus,
    user: User,
  ): Promise<Task> {
    const task = await this.getTaskByID(id, user);
    task.status = status;
    this.taskRepository.save(task);
    return task;
  }
}
