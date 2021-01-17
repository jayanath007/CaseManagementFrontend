export interface CourtDutyTimeRecord {
    branchId: number;
    feMin: number;
    feeEarner: string;
    isLonRates: boolean;
    isYouth: boolean;
    locationId: string;
    locationName: string;
    mileage: string;
    mileageRate: string;
    mileageValue;
    nextHearDate: string;
    nonVATFares: string;
    parking: string;
    socialTimeHrsMin: string;
    socialTimeRate: string;
    socialTimeVal;
    timDate: string;
    timId: number;
    totalValue: string;
    travelHrsMin: string;
    travelRate: string;
    travelVal;
    unSocialTimeHrsMin: string;
    unSocialTimeRate: string;
    unSocialTimeVal;
    vatFares: string;
    doNotClaimTravel: boolean;
    note: string;
    matterInfor: MatterInfor;
    diaryRef?: number;
}


export interface GridDataFilter {
    fromData: string;
    toDate: string;
}

export interface CourtDutyData {
    courtDutyTimeRecords: CourtDutyTimeRecord[];
    totalCount: number;
}
export interface MatterInfor {
    appId: number;
    fileId: number;
    branchId: number;
    matterReferenceNo: string;
}




