import { Injectable, Get, Post, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import * as uuid from 'uuid/v1'
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getTasks(): Task[] {
    return this.tasks
  }

  getTasksWithFilter(filterDto: GetTasksFilterDto): Task[] {
    const { status, search } = filterDto
    let tasks = this.getTasks()
    if (search) {
      tasks = tasks.filter(task => {
        return task.title.includes(search) ||
          task.description.includes(search)
      })
    }
    if (status) {
      tasks = tasks.filter(task => task.status === status)
    }
    return tasks
  }

  getTaskById(id: string): Task {
    const found = this.tasks.find(task => task.id === id)
    if (!found) {
      throw new NotFoundException(`Task with ID: ${id} not found.`)
    }
    return found
  }

  createTask(createTaskDto: CreateTaskDto): Task {
    const { title, description } = createTaskDto;
    const task: Task = {
      id: uuid(),
      title,
      description,
      status: TaskStatus.OPEN
    }
    this.tasks.push(task)
    return task
  }

  updateTask(id: string, status: TaskStatus): Task {
    let taskIndex = this.tasks.findIndex(task => task.id === id)
    let task = this.tasks[taskIndex]
    task.status = status
    this.tasks[taskIndex] = task
    return task
  }

  deleteTask(id: string) {
    const found = this.getTaskById(id)
    this.tasks = this.tasks.filter(task => found.id != id)
  }
}
