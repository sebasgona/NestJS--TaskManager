import { PipeTransform, ArgumentMetadata, BadRequestException } from "@nestjs/common";
import { TaskStatus } from "../task.model";

export class TaskStatusValidationPipe implements PipeTransform {
  readonly allowedStatuses = [
    TaskStatus.OPEN,
    TaskStatus.DONE,
    TaskStatus.IN_PROGRESS
  ]

  transform(value: any) {
    value = value.toUpperCase()
    if (!this.isStatusValid(value)) {
      throw new BadRequestException(`${value} is and invalid status. Should  be one of the following: ${Object.values(TaskStatus)}`)
    }
    return value;
  }

  private isStatusValid(status: any) {
    const idx = this.allowedStatuses.indexOf(status);
    return idx != -1;
  }
}