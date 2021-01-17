export interface ConfirmDialogData {
    content: { title: string, message: string, acceptLabel?: string, rejectLabel?: string, cancelLabel?: string };
    data: any;
    contentParams?: { [id: string]: string };
}

export enum ConfirmDialogResultKind {
    Confirmed = 'CONFIRMED',
    Rejected = 'REJECTED'
}

export enum ConfirmDialogWithCancelResultKind {
    Yes = 'Yes',
    No = 'No',
    Cancel = 'Cancel'
}

export interface ConfirmDialogResult {
    kind: ConfirmDialogResultKind;
    data: any;
}

export interface ConfirmDialogWithCancelResult {
    kind: ConfirmDialogWithCancelResultKind;
    data: any;
}

export interface InforDialogData {
    content: { title: string, message: string, okLabel?: string, hiddendClose?: boolean };
    data: { messageType: 'alert' | 'warning' | 'success' | 'general' | '', [key: string]: any };
    contentParams?: { [id: string]: string };
}
export interface DetailStatus {
    title: string;
    path: string;
    message: string;
    code: string;
    reference?: string;
    severityLevel?: string;
    exceptionType?: string;
    isGraphApi?: boolean;
    error?: { date: string, requestId: string };
    dateTime: string;
}

export interface ExceptionDialogData {
    content: DetailStatus;
    id?: number;
    alertTypes: ExceptionalertTypes;
    visible?: boolean;
}

export interface FailDialogData {
    messageHeader: string;
    messageBody: string;
    status?: string;
    detailStatus: Array<{ title: string, message: string }>;
    id?: number;
}

export interface MessageDialogData {
    content: { message: string };
}

export interface InsertPasswordDialog {
    content: { title: string, details: string, message: string };
    data: { password: string; askToRemainded?: boolean, needPasswordHash?: boolean };
}

export enum InforDialogResultKind {
    Confirmed = 'CONFIRMED'
}

export interface InforDialogResult {
    kind: InforDialogResultKind;
    data: any;
}

export enum ExceptionalertTypes {
    INFO = 'info',
    WARNING = 'warning',
    SUCCESS = 'Success',
    DANGER = 'danger',
    ERROR = 'error',
}

export interface OptionDialogInput {
    content: { title: string, actionName: string, cancelBtn: string };
    list: OptionDialogOptionList[];
    isMultipleSelect: boolean;
    needOneSelected: boolean;
}

export interface OptionDialogOptionList {
    value: string;
    displyName: string;
    isSelect: boolean;
}

export interface TextInsertDialogInput {
    content: { title: string, details: string, message: string, placeholder: string, acceptLabel?: string, rejectLabel?: string };
    allowEmpty: boolean;
    text: string;
    showCancelBtn: boolean;
    extension?: string;
    textArea?: { text: string, value: string };
    hideTextBox?: boolean;
}

export interface LookupsDialogInput {
    title: string;
    secondTitle: string;
    items: LoockupItem[];
    keyColumsEnable: boolean;
    editable: boolean;
    showCode?: boolean;
    enableSearch?: boolean;
    searchText?: string;
}

export interface LoockupItem {
    code: string;
    name: string;
    description1?: string;
    description2?: string;
}

export enum LookupType {
    COURT = 4,
    LISTED_AS = 7,
    WORK_DONE = 10,
    COURT_CODES = 21,
    POLICE_ST_CODES = 22,
    MA_COURT_CODES = 23,
    POLICE_ST_USER_CODES = 16,
    HEARING_TYPES = 1,
    ATTENDEE_CODES = 2,
    NOTE_FIXTURE = 6,
    REASON = 8,
    PRISON_CODES = 24,
    LEADUFN_MATTERS = 25,
}


