// import { extend } from 'webdriver-js-extender';
import { StatusType } from './request';
import { eBillingType, MatterAppCode } from '../../core/lib/matter';

export enum AddTimeType {
    GenaralTime = 'Genaral_Time',
    CrimeTime = 'Crime_Time',
    NotSupport = 'Not_Support',
    PrecedentH = 'PrecedentH',
    PrecedentS = 'PrecedentS',
    CivilTime = 'Civil_Time'
}

export function onCheckTimeType(appCode: string, eBilling: string, isLegalAid: boolean) {
    if (appCode === MatterAppCode.CR && isLegalAid) {
        return AddTimeType.CrimeTime;
    } else if (appCode === MatterAppCode.MA && isLegalAid) {
        return AddTimeType.NotSupport;
    } else if (eBilling === eBillingType.PrecedentH) {
        return AddTimeType.PrecedentH;
    } else if (eBilling === eBillingType.PrecedentS) {
        return AddTimeType.PrecedentS;
    } else {
        return AddTimeType.GenaralTime;
    }
}

export interface ClassType {
    classId: number;
    className: string;
    selected?: boolean;
}

export interface FeeEarner {
    attDescription: string;
    attId: number;
    selected?: boolean;
}
export interface AttType {
    attDescription: string;
    attId: number;
    selected?: boolean;
}

export interface AttTypeResponse {
    data: AttType[];
    Status: StatusType;
}

export interface CrimeClassIdentityViewModel {
    fileId: number;
    branchId: number;
    classId: number;
    isRecursiveFormDisplay?: boolean;
}
export interface CrimeClassIdentitySubClassViewModel extends CrimeClassIdentityViewModel {
    SubClassId: number;
}

export interface OpenTimeValidation {
    appCode: string;
    appId: number;
    branchId: number;
    fileId: number;
    eBilling: eBillingType;
    matterRef: string;
    timeFeeEarner: string;
    matterDetails: string;
    clientName: string;
    ufnValue: string;
    canMinimize: boolean;
    isProspectMatter: boolean;
    isLegalAid: boolean;
}

export enum CrimeClassType {
    AGFS = 'AGFS',
    NON_AGFS = 'NON_AGFS'
}

