export enum FileHistoryDisplayGroup {
  OpenCaseDragDrop = 'OpenCaseDragDrop',
  letterEngin = 'letterEngin',
  Organizer = 'Organizer',
  OpenCase = 'OpenCaseClick',
  OpenCaseRowEdit = 'OpenCaseRowEdit',
  emptyOpen = 'emptyOpen',
}


export interface FileHistory {
  for: string;
  letter_name: string;
  letter_icon: string;
  dateDone: string;
  by: string;
  note: string;
  folder: number;
  folderName: string;
  type: string;
  type_icon: string;
  type_GlyphIcon?: any;
  client?: any;
  details?: any;
  diary_UID: number;
  emailFrom: string;
  emailTo: string;
  hasPassword: boolean;
  offlineStates: number;
  changeXdraft: boolean;
  crimeTimeId: number;
  auditParentId: number;
  auditVersion: number;
  versionName: string;
  checkedOutByUser: string;
  checkedOutHashKey: string;
  ufnValue: string;
  isProspectMatter: boolean;
  classId: number;
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

export interface FileHistorList {
  data: FileHistory[];
  total: number;
}

export interface FileHistoryResponse {
  data: FileHistorList;
  aggregates: Array<AggregatorViewModel>;
  status: string;
  messageBody: string;
  messageHeader: string;
  detailStatus: DetailStatusViewModel[];
}





export interface DocumentUrlResponse {
  Data: DocumentUrlData;
  Aggregates: Array<AggregatorViewModel>;
  Status: string;
  MessageBody: string;
  MessageHeader: string;
  DetailStatus: DetailStatusViewModel[];
}

export interface DocumentUrlData {
  EditUrl: string;
  DocumentPath: string;
  IsSuccess: boolean;
  NoBorder: boolean;
  NoConverted: boolean;
}

export interface FileHistorListItem<FileHistoryDataItem> {
  readonly data: FileHistoryDataItem;
  readonly emailItem: boolean;
  readonly isExpand: boolean;
  readonly documentUrl?: string;
  readonly documentUrlIsLoading?: boolean;
  readonly documentUrlLoadSuccess?: boolean;
  readonly password: string;
  readonly selected?: boolean;
  readonly signAndSendUrl?: string;
  readonly groupHash?: string;
  readonly groupRow?: FileHistoryGroup;
  readonly editingBusy?: boolean;
}

export type FileItemWrapper = FileHistorListItem<Readonly<FileHistory>>;

export enum GroupMode {
  Default = 'View',
  Folder = 'Folder',
  Note = 'Note',
  Type = 'Type',
  Date = 'DateDone',
  FolderDate = 'Folder DateDone',
  DateFolder = 'DateDone Folder',
}

// export interface Folder {
//   text: string;
//   value: string;
//   selected: boolean;
// }
export interface Folder {
  folderName: string;
  folderId: number;
  parentId: number;
  position: number;
  selected: boolean;
  children?: Folder[];
}


export interface FileHistoryGroupResponse {
  data: FileHistoryGroup;
  aggregates: Array<AggregatorViewModel>;
  status: string;
  messageBody: string;
  messageHeader: string;
  detailStatus: DetailStatusViewModel[];
}


export interface FileHistoryGroup {
  readonly data?: FileHistoryGroupData;
  isExpand?: boolean;
  isLefNode?: boolean;
  groupHash: string;
  groupIds?: { group1: string, group2: string, group1Value: string, group2Value: string, };
  groupMode?: GroupMode;
  items?: FileHistoryGroup[];
  currentItems?: number;
  totalItems?: number;
}


export interface FolderListResponce {
  data: Folder[];
  Status: StatusType;
}

export enum StatusType {
  Fail = 0,
  Success = 1
}

export interface FileHistoryGroupData {
  aggregates: string;
  count: number;
  field: string;
  filterValue: string;
  hasSubgroups: boolean;
  selectorField: string;
  value: string;
  items: FileHistoryGroupDataResponse[];
}


export interface FileHistoryGroupDataResponse {
  aggregates: string;
  count: number;
  field: string;
  hasSubgroups: boolean;
  selectorField: string;
  filterValue: string;
  value: string;
  items: FileHistoryGroupDataResponse[];
}


export enum DiaryEditTypes {
  None = 'None',
  StandardEvent = 'StandardEvent',
  RecordTimeEvent = 'RecordTimeEvent',
  LegalAidCrimeTimeEvent = 'LegalAidCrimeTimeEvent',
  InvalidTimeEvent = 'InvalidTimeEvent',
  CivilTimeCertificated = 'CivilTimeCertificated',
  CivilTimeLegalHelp = 'CivilTimeLegalHelp'
}

export interface SignatureTokenResponce {
  signatureToken: string;
  passwordHash?: string;
}

