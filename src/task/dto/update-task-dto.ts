import { IsEnum } from 'class-validator';
import { TaskStatus } from '../task-status.enum';

export class UpdateTaskDTO {
  @IsEnum(TaskStatus)
  status: TaskStatus;
}
