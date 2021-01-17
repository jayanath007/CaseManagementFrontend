import { PageEvent } from '@angular/material';
export interface Task {
  MatterReferenceNo: string;
  DateBy?: Date;
  Note: string;
  TaskFor: string;
  PutOnBy: string;
  Date?: Date;
}

export interface DetailStatusViewModel {
  Code: string;
  Message: string;
  Reference: string;
  MessageType: string;
  SeverityLevel: string;
  ExceptionType: string;
}
export interface AggregatorViewModel {
  Field: string;
  Aggregate: string;
}

export interface TaskList {
  Data: Task[];
  Total: number;
}

export interface TaskResponse {
  Data: TaskList;
  Aggregates: Array<AggregatorViewModel>;
  Status: string;
  MessageBody: string;
  MessageHeader: string;
  DetailStatus: DetailStatusViewModel[];
}


export interface TaskListItem<TaskDataItem> {
  readonly data: TaskDataItem;
  readonly isExpand: boolean;
  readonly documentUrl?: string;
}

export type FileItemWrapper = TaskListItem<Readonly<Task>>;

