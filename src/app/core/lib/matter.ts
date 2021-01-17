import { BasePopupType } from '../../shared/models/consol-error';

export interface Matter {
    MatterReferenceNo: string;
    BranchId: number;
    AppId: number;
    FileId: number;
    MatterDetails?: string;
    isLegalAid: boolean;
}
export enum eBillingType {
    PrecedentH = 'PrecedentH',
    PrecedentS = 'PrecedentS'
}
export enum XMLFileTypes {
    Phases = 'Phases',
    Tasks = 'Tasks',
    Activities = 'Activities'
}
export interface MatterInfo extends Matter {
    ClientName?: string;
    FeeEarner?: string;
    AppCode?: string;
    var1?: string;
    var2?: string;
    var3?: string;
    MatterCounter?: number;
    ufnValue?: string;
    eBilling?: eBillingType;
    isPlotMatter?: boolean;
    MatterDetails?: string;
    isPlotMasterMatter?: boolean;
    isProspectMatter?: boolean;
    isLegalAid: boolean;
}

export interface MatterKeyInfor {
    appId: number;
    fileId: number;
    branchId: number;
    matterReferenceNo: string;
    matterDetails?: string;
    isLegalAid: boolean;
}
export interface MatterFinance {
    wipSum: number;
    wipLimit: number;
    clientBal: number;
    unpaidBill: number;
    dateLastBill: string;
}

export interface MatterSearchGridData {
    appID: number;
    fileID: number;
    closed?: number;
    lastUsed?: Date;
    app_Code: string;
    branchID: number;
    feeEarner: string;
    reviewDate: Date;
    clientName: string;
    reviewNote: string;
    company_Name: string;
    matterDetails: string;
    matterReferenceNo: string;
    rateCategory?: string;
    matterCounter: number;
    ufnValue: string;
    eBilling: eBillingType;
    isPlotMatter?: boolean;
    isPlotMasterMatter: boolean;
    isProspectMatter: boolean;
    isLegalAid: boolean;
}

export interface GridRowListItem<T> {
    data: T;
    selected?: boolean;
    expanded?: boolean;
    loading?: boolean;
    financeDetails?: MatterFinance;
}
export type GridRowItemWrapper = GridRowListItem<Readonly<MatterSearchGridData>>;

export interface MatterInputData {
    isMatterSearch: boolean;
    basePopupType?: BasePopupType;
    emailList?: any;
}

export enum MatterAppCode {
    MA = 'MA',
    CR = 'CR'
}

export interface GridDocumentData {
    appId: number;
    branchId: number;
    diaryId: number;
    dpsLastModified: string;
    feeEarner: string;
    fileId: number;
    letterName: string;
    highlights: { Note: string[], content: string[] };
    matterCode: string;
    matterDetails: string;
    matterRef: number;
    note: string;
    token: string;
    docUrl?: string;
    selected: boolean;
    nonePdfUrl?: string;
    clientRef: string;
    clientName: string;
    auditOriginalID: number;
    auditParentID: number;
    auditVersion: number;
    versionName: string;
    columnFolderName: string;
}
export function convertUFNString(ufn: string): string {
    const dateStr = ufn.substring(0, 6);
    return + dateStr.substring(2, 4) + '/' + dateStr.substring(0, 2) + '/' + dateStr.substring(4, 6);
}

export function checkMatterUFN(ufnValue: string): { isValid: boolean, msg: string } {
    const result = { isValid: true, msg: null };
    const ufnPattern = new RegExp('^([0-9]{0,6}[/][0-9]{0,3})$');
    if (ufnValue.trim().length !== 10 || !ufnPattern.test(ufnValue)) {
        result.isValid = false;
        result.msg = 'UFN must be in the format as ddmmyy/xxx,  where /xxx is a unique number for that DAY.';
        return result;
    } else {
        let ufnDate;
        const dateStr = convertUFNString(ufnValue);
        try {
            ufnDate = new Date(dateStr);
        } catch (e) {
            result.isValid = false;
            result.msg = 'Incorrect UFN date';
            return result;
        }
        if (isNaN(ufnDate)) {
            result.isValid = false;
            result.msg = 'Invalid UFN date. UFN must be in the format as ddmmyy/xxx,  where /xxx is a unique number for that DAY.';
            return result;
        }
        if (!!ufnDate && ufnDate <= new Date('01/04/2016')) {
            result.isValid = false;
            result.msg = 'Cannot process! UFN dates pre 01/04/2016';
            return result;
        }
    }
    return result;
}


