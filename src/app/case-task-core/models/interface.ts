import { eBillingType } from '../../core/lib/matter';
export interface CaseTask {
  action: boolean;
  billRequestId: number;
  columnFolderId: number;
  dateBy?: string;
  datedn?: string;
  documentFlowStatus: string;
  hasPassword: boolean;
  letter: string;
  note: string;
  taskFor: string;
  putOnBy: string;
  date?: string;
  template?: string;
  spanDiff: number;
  taskID: number;
  workflowActions: string;
}

export interface CaseTaskViewState {
  data: TaskItemWrapper[];
  total: number;
  loading: boolean;
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

export interface CaseTaskList {
  data: CaseTask[];
  total: number;
}

export interface CaseTaskResponse {
  data: CaseTaskList;
  aggregates: Array<AggregatorViewModel>;
  status: string;
  messageBody: string;
  messageHeader: string;
  detailStatus: DetailStatusViewModel[];
}




export interface CaseTaskListItem<CaseTaskDataItem> {
  readonly data: CaseTaskDataItem;
  readonly isExpand: boolean;
  readonly documentUrl?: string;
  readonly documentUrlIsLoading?: boolean;
  readonly documentUrlLoadSuccess?: boolean;
}

export type TaskItemWrapper = CaseTaskListItem<Readonly<CaseTask>>;

export interface GridData {
  action: boolean;
  appCode: string;
  appID: number;
  branchID: number;
  billRequestId: number;
  client: string;
  columnFolderId: number;
  date: Date;
  dateBy: Date;
  dateDone: Date;
  datedn: Date;
  documentFlowStatus: string;
  fileID: number;
  folderName: string;
  hasPassword: boolean;
  letter: string;
  matterDetails: string;
  matterReferenceNo: string;
  note: string;
  putOnBy: string;
  taskFor: string;
  taskID: number;
  workflowActions: string;
  selected?: boolean;
  expanded?: boolean;
  checkTREnable?: boolean;
  isTimeRecordingEnabled?: boolean;
  matterCounter: number;
  ufnValue: string;
  eBilling: eBillingType;
  isPlotMatter?: boolean;
  isPlotMasterMatter?: boolean;
  isProspectMatter: boolean;
  isLegalAid: boolean;
}

export class RequestToCompleteTask {
  constructor(public data: CompletePostRequest, public token: string) { }

  public CompleteTaskToPost() {
    const data = new FormData();
    const dataRow: any = this.data;
    data.append('taskViewModel', JSON.stringify(dataRow));
    return data;
  }
}

export class CompletePostRequest {
  taskFor: string;
  client: string;
  matterReferenceNo: string;
  matterDetails: string;
  columnFolderId: number;
  workflowActions: string;
  note: string;
  dateBy: string;
  // taskID: number;
  putOnBy: string;
  appCode: string;
  appID: number;
  fileID: number;
  date: string | Date;
  branchID: number;
  diaryId: number;
}

export interface MsgModel {
  isShow: boolean;
  msg: string;
}
export interface TREnableResponse {
  data: TREnable;
  status: StatusType;
}
export interface TREnable {
  isTimeRecordingEnabled: boolean;
}
export enum StatusType {
  Fail = 0,
  Success = 1,
}

