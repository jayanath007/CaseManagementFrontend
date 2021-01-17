import { Operator, FilterType } from './enum';

export interface GridRowAction {
    kind: GridRowType;
    value: GridData;
}


export interface DropdownListData {
    key: number;
    value: string;
}

export enum GridRowType {
    // openCase = 'OPEN_CASE',
    // openTimeRecording = 'TIME_RECORDING',
    //  openNewMail = 'NEW_MAIL',
    //  openLedgerCard = 'LEDGER_CARD',
    viewDocument = 'VIEW_DOCUMENT',
    //  closeViewer = 'CLOSE_VIEW'
}

export interface GridData {
    anchorType: string;
    appCode: string;
    appID: number;
    branchID: number;
    by: string;
    client: string;
    dateDone: Date;
    details: string;
    diary_UID: number;
    emailFrom: string;
    emailTo: string;
    fileId: number;
    fileNumber: number;
    folder: number;
    folderName: string;
    for: string;
    hasPassword: boolean;
    letter_icon: string;
    letter_name: string;
    matterReferenceNo: string;
    note: string;
    offlineStates: number;
    type: string;
    type_GlyphIcon: string;
    type_icon: string;
    // matterFinance: MatterFinance;
    docUrl?: string;
    password?: string;
    //  emailItem?: MessageItemWrapper;
    view?: boolean;
    groupHash?: string;
}



export interface FilterItem {
    filterId: number;
    fieldOperator: string;
    fieldHidden: boolean;
    filterType: FilterType;
    operator: Operator;
    filterValue: string;
    operatorType: { id: Operator, label: string }[];
    // isDirty?: boolean;
    // isDelete?: boolean;
}



export interface FilterViewModel {
    searchText: string;
    filterList: FilterItem[];

}

export enum UpdateCol {
    field = 'FIELD',
    operator = 'OPERATOR',
    value = 'VALUE',
    filterType = 'FILTERTYPE',
}



