import { CrimeClassIdentityViewModel } from './../../core/lib/timeRecord';
import { UserInputDataEnum } from './enum';

export interface CurrentLimits {
    classID: number;
    classType: string;
    currentLimit: number;
    currentTot: number;
    limitType: number;
    limitTypeDesc: string;
    closedDate: string;
    openedDate: string;
    billedDate: string;
    selected?: boolean;
}

export interface UserInputData {
    [UserInputDataEnum.postingData]: any;
    [UserInputDataEnum.newLimit]: number | string;
    grantedDate: any;
    [UserInputDataEnum.limitedType]: number;
}

export interface LimitHistory {
    branchId: number;
    crimeClassIdentityViewModel: CrimeClassIdentityViewModel;
    generatedDate: string;
    limitType: number;
    limitValue: string | number;
    matterFileId: number;
    postedDate: string;
    user: string;
}


