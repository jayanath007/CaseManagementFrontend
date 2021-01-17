import { PaginatorDef } from './../../core/lib/grid-model';
import { CivilClassObj } from '../../civil-class-management';
import { RateType } from './enum';

export interface CivilTimeRecordingModuleInput {
    civilClassObj: CivilClassObj;
    diaryId?: number;
}

export interface ViewData {
    levels: CivilDropDownData[];
    civilTimeRecordData: CivilTimeRecordsData;
    mpu: number;
    legalAidJudge: CivilDropDownData[];
    claimCodes: { code: string, description: string }[];
}

export interface CivilDropDownData {
    id: number;
    value: string;
    selected?: boolean;
}

export interface CivilTimeRecordsData {
    timeRecords: TimeRecord[];
    totalCount: number;
    pageInfo: PaginatorDef;
}

export interface TimeRecord {
    diaryId: number;
    dateDone: string;
    note: string;
    feeEarner: string;
    fundLevelDiscription: string;
}

export interface TimeRecordModel {
    advocacyRate: number;
    advocacyUnit: number;
    advocacyValue: number;
    appId: number;
    attendanceRate: number;
    attendanceUnit: number;
    attendanceValue: number;
    branchId: number;
    claimCode: string;
    classType: number;
    conferenceRate: number;
    conferenceUnit: number;
    conferenceValue: number;
    dateDone: string;
    detail: string;
    diaryId: number;
    faresIcludingRate: number;
    faresIcludingVat: number;
    faresIcludingVatNet: number;
    faresVatExempt: number;
    feeEarner: string;
    fileId: number;
    fundLevelDiscription: string;
    judgeLevel: number;
    legalAidCaseId: number;
    level: number;
    mileageRate: number;
    mileageUnit: number;
    mileageValue: number;
    note: string;
    parkingFees: number;
    preparationRate: number;
    preparationUnit: number;
    preparationValue: number;
    tickIfEstimated: boolean;
    totalValue: number;
    travelRate: number;
    travelUnit: number;
    travelValue: number;
    waitingRate: number;
    waitingUnit: number;
    waitingValue: number;
}

export interface Rates {
    rateType: RateType;
    value: number;
}

export function civilTimeTotal(model: TimeRecordModel) {
    if (!model) {
        return 0;
    }
    // tslint:disable-next-line: max-line-length
    return Number(model.attendanceValue) + Number(model.preparationValue) + Number(model.travelValue) + Number(model.waitingValue) + Number(model.conferenceValue) + Number(model.advocacyValue);
}
