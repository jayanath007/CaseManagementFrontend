import { eBillingType } from './../../core/lib/matter';
import { StatusType, StopStartInfo, TimeRecordAddingType } from './enum';
import { FeeEarner } from '../../core/lib/fee-earner';

export interface TimeRecordInputData {
    matterReferenceNo: string;
    feeEarner?: string;
    editData?: EditData;
    eBilling: eBillingType;
    canMinimize?: boolean;
    tabDataEdit?: TabDataEdit;
    clientMatterData?: ClientMatterData;
}
export interface ClientMatterData {
    matterDetails: string;
    clientName: string;
}
export interface TabDataEdit {
    appId: number;
    appCode: string;
    bigNote: string;
    billNo: number;
    billed: boolean;
    branchId: number;
    client: string;
    clientName: string;
    dateBilled: string;
    recordDate: string;
    department: string;
    fileId: number;
    matter: string;
    matterReferenceNo: string;
    mpu: number;
    netBilled: number;
    timeEditNote: string; // TimeEditNote
    postingDate: string; // PostingDate
    rate: number;
    reviewDate: Date;
    reviewNote?: string;
    surname?: string;
    timeBillFE?: string;
    timeDetails: string;
    timeFeeEarner: string;
    timeUniqueRef: number;
    unit: number;
    value: number;
    closed?: number;
    lastUsed?: Date;
    select?: boolean;
    groupHash?: string;
    timeEditDetails: string; // TimeEditDetails
    workType?: number;
    eBillingPhaseID?: number;
    eBillingTaskID?: number;
    eBillingActivityID?: number;
    timerValue: string;
    timerValueSeconds: number;
    timeRecordId: number;
    uncharge: boolean;
    note: string;
    details: string;
    matterDetails: string;
}
export interface EditData {
    appId: number;
    appCode: string;
    bigNote: string;
    billNo: number;
    billed: boolean;
    branchId: number;
    client: string;
    clientName: string;
    dateBilled: string;
    dateDone: string;
    department: string;
    fileId: number;
    matter: string;
    matterReferenceNo: string;
    mpu: number;
    netBilled: number;
    timeEditNote: string; // TimeEditNote
    postingDate: string; // PostingDate
    rate: number;
    reviewDate: Date;
    reviewNote?: string;
    surname?: string;
    timeBillFE?: string;
    timeDetails: string;
    timeFeeEarner: string;
    timeUniqueRef: number;
    units: number;
    value: number;
    closed?: number;
    lastUsed?: Date;
    select?: boolean;
    groupHash?: string;
    timeEditDetails: string; // TimeEditDetails
    workType: number;
    eBillingPhaseID: number;
    eBillingTaskID: number;
    eBillingActivityID: number;
    timerValue: string;
    timeEventId?: number;
}
export interface TimeRecordingMsg {
    isError: boolean;
    isFloatingTimeSave: boolean;
    msg: string;
}
export interface FeeEarnerResponce {
    data: FeeEarner[];
    Status: StatusType;
}
export interface TimeDeleteViewModel {
    timeIdList: number[];
    isFloatingTime: boolean;
}
export interface TimeRecordAddUpdateViewModel {
    timeRecordingAddViewModels: TimeRecordSubmitModel[];
    timeRecordAddingType: TimeRecordAddingType;
}
export interface TimeRecordSubmitModel {
    matterRef: string;
    mpu: number;
    unit: number;
    amount: number;
    rate: number;
    note: string;
    recordDate: string;
    feeEarner: string;
    details: string;
    timeRecordId: number;
    workType: number;
    eBillingPhaseID: number;
    eBillingTaskID: number;
    eBillingActivityID: number;
    timeRecordAddingType: TimeRecordAddingType;
    TimerValueSeconds: number;
    isHtmlNote: boolean;
    htmlNote: string;
}
export interface TimeRecordTabModel {
    matterRef: string;
    mpu: number;
    unit: number;
    amount: number;
    rate: number;
    note: string;
    recordDate: string;
    feeEarner: string;
    details: string;
    timeRecordId: number;
    timerValue: number;
    workType: number;
    eBillingPhaseID: number;
    eBillingTaskID: number;
    eBillingActivityID: number;
}
export interface WorkType {
    key: number;
    value: string;
    selected?: boolean;
}
export interface PrecedentHRate {
    key: number;
    value: string;
    selected?: boolean;
}
export interface Activiti {
    phaseID: number;
    parentId: number;
    description: string;
    selected?: boolean;
}
export interface Phase {
    phaseID: number;
    parentId: number;
    description: string;
    selected?: boolean;
}
export interface PhaseWiseTask {
    phaseID: number;
    parentId: number;
    description: string;
    selected?: boolean;
}
export interface PrecedentHSModel {
    phaseID: number;
    parentId: number;
    description: string;
    selected?: boolean;
}

export interface TimeRecordingInfoResponce {
    data: TimeRecordingInfo;
}

export interface TimeRecordingInfo {
    amount: number;
    details: string[];
    feeEarner: string;
    feeEarnerJobTitle: string;
    matterRef: string;
    mpu: number;
    rate: number;
    unit: number;
    rateType: 'C' | 'F';
    feRate: number;

}
export interface TimeRecordingState {
    readonly loading: boolean;
    readonly loadPhaseList: boolean;
    readonly loadActivitiList: boolean;
    readonly loadTaskList: boolean;
    readonly loadWorkTypeList: boolean;
    readonly loadTimeRecordInfo: boolean;
    readonly error: TimeRecordingMsg;
    readonly matterRefNo: string;
    readonly user: string;
    readonly details: string[];
    readonly selectDetails: string;
    readonly date: string;
    readonly timeValue: number;
    readonly newlyAddedTimeValue: number;
    readonly mpu: number;
    readonly unit: number | string;
    readonly hourlyRate: number | string;
    readonly amount: number | string;
    readonly body: string;
    readonly uncharge: boolean;
    readonly submit: boolean;
    readonly saved: TimeRecordingMsg;
    readonly isDirty: boolean;
    readonly editData: EditData;
    readonly tabDataEdit: TabDataEdit;
    readonly isSetEditData: boolean;
    readonly timeRecordId: number;
    readonly eBillingType: eBillingType;
    readonly workTypeList: WorkType[];
    readonly precedentHRateList: PrecedentHRates[];
    readonly activitiList: Activiti[];
    readonly phaseList: Phase[];
    readonly phaseWiseTaskList: PhaseWiseTask[];
    readonly feeEarner: string;
    readonly selectedJobTitle: string;
    readonly canMinimize: boolean;
    readonly isTimeRecordStart: boolean;
    readonly startStopState: StopStartInfo;
    readonly timeRecordAddingType: TimeRecordAddingType;
    readonly isMinimize: boolean;
    readonly clientMatterData: ClientMatterData;
    readonly selectedPhRate: PrecedentHRates;
    readonly diaryFileDetails: DiaryFileDetails;
    readonly startTime: number;
}
export interface PrecedentHRates {
    code: number;
    id: number;
    rate: number;
    type: string;
}
export interface DiaryFileData {
    data: DiaryFileDetails;
    Status: StatusType;
}
export interface DiaryFileDetails {
    extension: string;
    letterName: string;
}
