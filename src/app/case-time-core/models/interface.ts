import { PageEvent } from '@angular/material';
export interface CaseTime {
  dateDone: string;
  feeEarner: string;
  description: string;
  details: string;
  units: number;
  uSUnits: number;
  value: number;
  billed: boolean;
  dateBilled?: string;
  netBilled: number;
  billNo?: number;
  mpu: number;
  postingDate: string;
  rate: number;
  timeUniqueRef: number;
  classId: number;
  crimeTimeId: number;
  eBillingActivityID: number;
  eBillingPhaseID: number;
  eBillingTaskID: number;
  subClassId: number;
  usUnits: number;
  workType: any;
  timeEventId?: number;
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

export interface CaseTimeList {
  data: CaseTime[];
  total: number;
}

export interface CaseTimeResponse {
  data: CaseTimeList;
  aggregates: Array<AggregatorViewModel>;
  status: string;
  messageBody: string;
  messageHeader: string;
  detailStatus: DetailStatusViewModel[];
}




export interface CaseTimeListItem<CaseTimeDataItem> {
  readonly data: CaseTimeDataItem;
  readonly isExpand: boolean;
  readonly documentUrl?: string;
  readonly documentUrlIsLoading?: boolean;
  readonly documentUrlLoadSuccess?: boolean;
}

export type TimeItemWrapper = CaseTimeListItem<Readonly<CaseTime>>;

