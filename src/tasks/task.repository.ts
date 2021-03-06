import { Repository, EntityRepository } from "typeorm";
import { Task } from "./task.entity";
import { CreateTaskDto } from "./dto/create-task.dto";
import { TaskStatus } from "./task-status.enum";
import { GetTasksFilterDto } from "./dto/get-tasks-filter.dto";
import { promises } from "fs";

@EntityRepository(Task)
export class TaskRepository extends Repository<Task>{
  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const task = new Task()
    const { title, description } = createTaskDto
    task.title = title
    task.description = description
    task.status = TaskStatus.OPEN
    await task.save()
    return task
  }

  async getTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
    const { status, search } = filterDto
    const query = this.createQueryBuilder('task')
    if (status) {
      query.andWhere('task.status = :status', { status })
    }
    if (search) {
      query.andWhere('(task.title LIKE :search OR task.description LIKE :search)', { search: `%${search}%` })
    }
    const tasks = await query.getMany()
    return tasks
  }
}