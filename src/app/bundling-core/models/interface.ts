
import { ColumnDef, PaginatorDef } from '../../core/lib/grid-model';
import { PDFBundleHeaderViewModel } from '../../core/lib/bundle';

export interface GridDataObject {
  data: FileHistory[];
  total: number;
  group: any[];
}


export interface GridDataObjectResponse {
  data: GridDataObject;
  status: StatusType;
}
export enum StatusType {
  Fail = 0,
  Success = 1,
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

export type FileItemWrapper = FileHistorListItem<Readonly<FileHistory>>;

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
export enum GroupMode {
  Default = 'View',
  Folder = 'FolderName',
}
export enum ViewChangeKind {
  Up = 'UP',
  Down = 'DOWN',
  Rmove = 'REMOVE',
  Add = 'ADD',
  Heading = 'HEADING',
  Bundled = 'BUNDLED',
  OpenExisting = 'OPENEXISTING',
  CoreBundled = 'CORE_BUNDLED',
}

export interface FileHistorListItem<FileHistoryDataItem> {
  readonly data: FileHistoryDataItem;
  readonly emailItem: any;
  readonly isExpand: boolean;
  readonly isChecked: boolean;
  readonly documentUrl?: string;
  readonly documentUrlIsLoading?: boolean;
  readonly documentUrlLoadSuccess?: boolean;
  readonly password: string;
  readonly selected?: boolean;
  readonly signAndSendUrl?: string;
  readonly groupRow?: FileHistoryGroup;
}

export interface FileHistory {
  dateDone: string;
  diary_UID: number;
  folder: number;
  folderName: string;
  letter_name: string;
  note: string;
  offlineStatus: number;
  groupHash?: string;
  isRemove?: boolean;
  emailItem?: boolean;
  docUrl?: string;
  view?: boolean;
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

export interface BundleTreeItem {
  data?: FileHistory;
  lable: string;
  selected: boolean;
  id: string;
  parentId: string;
  isFolder: boolean;
  isCoverPage: boolean;
  isRoot: boolean;
  expanded: boolean;
  visible: boolean;
  level: number;
  previousId: string;
  moving: boolean;
  isEdit: boolean;
  date?: string;
  filePath?: string;
  pageNoLabel?: string;
  folderName?: string;
  isCoreBunlde: boolean;
  hierarchy: string;
  isFileDateEnable: boolean;
  isSavedItem?: boolean;
  pbI_DisplayDate?: boolean;
  pbI_PageOffset?: number;
  pbI_PageCount?: number;
  pbI_SectionPrefix?: string;
  pbI_PageNoLabel?: string;
  pbI_IgnoreForMerge?: boolean;
  pbI_IsSubPage?: boolean;
}

export interface BundleOption {
  name: string;
  createIndexPage: boolean;
  showDocDate: boolean;
  separateEmail: boolean;
  preserveExitPage: boolean;
  restartPageNoAtSection: boolean;
  pageNumberLocation: number;
  includeTitlePage: boolean;
  coverPage: File;
  stopMergeIfError: boolean;
}

export interface PDFBundleTreeItemViewModel {
  pbI_ItemID: number;
  pbI_BundleID: number;
  pbI_Position: number;
  pbI_DpsDiaryID: number;
  pbI_FilePath: string;
  pbI_FileDate?: string;
  pbI_ItemText: string;
  pbI_LastModifiedDate: string;
  pbI_FolderName: string;
  pbI_Version: number;
  pbI_ParentID?: number;
  pbI_Type?: number;
  pbI_Info: number;
  // pbI_DisplayDate?: boolean;
  // pbI_PageOffset: number;
  // pbI_PageCount: number;
  // pbI_SectionPrefix: string;
  // pbI_PageNoLabel: string;
  // pbI_IgnoreForMerge?: boolean;
  pbI_ExclFromCoreBundle: boolean;
  // pbI_IsSubPage: boolean;
}
export interface BundleItemsViewModel {
  pbI_ItemID: number;
  pbI_BundleID: number;
  pbI_Position: number;
  pbI_DpsDiaryID: number;
  pbI_FilePath: string;
  pbI_FileDate: string;
  pbI_ItemText: string;
  pbI_LastModifiedDate: string;
  pbI_FolderName: string;
  pbI_Version: number;
  pbI_ParentID: number;
  pbI_Type: number;
  pbI_Info: number;
  pbI_DisplayDate: string;
  pbI_PageOffset: number;
  pbI_PageCount: number;
  pbI_SectionPrefix: string;
  pbI_PageNoLabel: string;
  pbI_IgnoreForMerge: boolean;
  pbI_ExclFromCoreBundle: boolean;
  pbI_IsSubPage: boolean;
  tempPDFPath: string;
  tempIgnoreForMerge: boolean;
  isNew: number;
}
export interface BundlingSaveDataModel {
  PDFBundleHeaderViewModel: PDFBundleHeaderViewModel;
  PDFBundleTreeItemViewModel: PDFBundleTreeItemViewModel[];
}
export interface ExistingRecordPopUpInput {
  branchId: number;
  appId: number;
  fileId: number;
  displayDataString: string;
  excludeInProgress: boolean;
}
export interface BundlingHistoryGrid {
  gridColumns: ColumnDef[];
  PaginatorDef: PaginatorDef;
}
export interface BundlingDates {
  fromDate: string;
  toDate: string;
  searchTest: string;
  refresh: string;
}

export interface BundlingValidationResponce {
  data: any;
  detailStatus: DetailStatus[];
  messageBody: string;
  messageHeader: string;
  status: string;
  title?: string;
}

export interface DetailStatus {
  code: any;
  exceptionType: any;
  message: string;
  messageType: string;
  reference: string;
  severityLevel: string;
}
export interface FromToDateObject {
  fromDate: string;
  toDate: string;
}
export interface PreserveCheckboxProperty {
  checked: boolean;
  enable: boolean;
}
export interface LoadSavedBundleDataResponce {
  pdfBundleHeaderDto: PDFBundleHeaderViewModel;
  pdfBundleItemDto: BundleItemsViewModel[];
}

