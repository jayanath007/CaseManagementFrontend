import { PageEvent } from '@angular/material';

export interface Time {
  DateDone: string;
  FeeEarner: string;
  Description: string;
  Details: string;
  Units: number;
  USUnits: number;
  Value: number;
  Billed: boolean;
  DateBilled?: Date;
  NetBilled: number;
  BillNo?: string;
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

export interface TimeList {
  Data: Time[];
  Total: number;
}

export interface TimeResponse {
  Data: TimeList;
  Aggregates: Array<AggregatorViewModel>;
  Status: string;
  MessageBody: string;
  MessageHeader: string;
  DetailStatus: DetailStatusViewModel[];
}


export interface TimeListItem<TimeDataItem> {
  readonly data: TimeDataItem;
  readonly isExpand: boolean;
  readonly documentUrl?: string;
}

export type TimeItemWrapper = TimeListItem<Readonly<Time>>;

