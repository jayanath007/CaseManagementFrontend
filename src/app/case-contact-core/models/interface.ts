import { PageEvent } from '@angular/material';
import { FieldSort } from '../../odata';
export interface CaseContact {

  name?: string;
  company?: string;
  telephone?: string;
  email?: string;
  postCode?: string;
  address?: string;
  roleOnFile?: string;
  screenId?: string;
  contactTypeId?: number;
  isScreenContact?: boolean;
  select?: boolean;

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

export interface CaseContactList {
  data: CaseContact[];
  total: number;
}

export interface CaseContactResponse {
  data: CaseContactList;
  aggregates: Array<AggregatorViewModel>;
  status: string;
  messageBody: string;
  messageHeader: string;
  detailStatus: DetailStatusViewModel[];
}




export interface CaseContactListItem<CaseContactDataItem> {
  readonly data: CaseContactDataItem;
  readonly isExpand: boolean;
  readonly documentUrl?: string;
  readonly documentUrlIsLoading?: boolean;
  readonly documentUrlLoadSuccess?: boolean;
}

export type ContactItemWrapper = CaseContactListItem<Readonly<CaseContact>>;


export enum ContactMode {
  All = 'All',
  View = 'View',
}

export interface DataSourceRequestViewModel {
  take: number;
  skip: number;
  sort?: Array<FieldSort>;
  filter?: any;
  aggregators?: Array<AggregatorViewModel>;
  group?: any[];
}

