import { Injectable, Get, Post, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository
  ) { }

  async getTaskById(id: number): Promise<Task> {
    const found = await this.taskRepository.findOne(id);
    if (!found) {
      throw new NotFoundException(`Task with ID: ${id} not found.`)
    }
    return found
  }

  async createTask(createTaskDto: CreateTaskDto) {
    return this.taskRepository.createTask(createTaskDto)
  }

  async deleteTask(id: number): Promise<void> {
    const result = await this.taskRepository.delete(id)
    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID: ${id} not found`)
    }
  }

  async updateTaskStatus(id: number, status: TaskStatus): Promise<Task> {
    const task = await this.getTaskById(id)
    task.status = status
    await task.save()
    return task
  }

  async getTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
    return this.taskRepository.getTasks(filterDto)
  }


  // private tasks: Task[] = [];

  // getTasks(): Task[] {
  //   return this.tasks
  // }

  // getTasksWithFilter(filterDto: GetTasksFilterDto): Task[] {
  //   const { status, search } = filterDto
  //   let tasks = this.getTasks()
  //   if (search) {
  //     tasks = tasks.filter(task => {
  //       return task.title.includes(search) ||
  //         task.description.includes(search)
  //     })
  //   }
  //   if (status) {
  //     tasks = tasks.filter(task => task.status === status)
  //   }
  //   return tasks
  // }

  // deleteTask(id: string) {
  //   const found = this.getTaskById(id)
  //   this.tasks = this.tasks.filter(task => found.id != id)
  // }
}
