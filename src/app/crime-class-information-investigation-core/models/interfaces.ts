import { ModelProperty } from './enum';
import { CrimeClassIdentityViewModel } from './../../core/lib/timeRecord';

export interface InvestigationClassInfo {
    [ModelProperty.additionalFixedFee]: number;
    [ModelProperty.additionalWorkFee]: number;
    [ModelProperty.billedDate]: string;
    [ModelProperty.branchId]: number;
    [ModelProperty.cdsDirectTAFChecked]: boolean;
    [ModelProperty.claimDisbursements]: number;
    [ModelProperty.claimProfitCost]: number;
    [ModelProperty.claimTravel]: number;
    [ModelProperty.claimWaiting]: number;
    [ModelProperty.classDisbursements]: number;
    [ModelProperty.classFeeEarnTotal]: number;
    [ModelProperty.classId]: number;
    [ModelProperty.classProfitCost]: number;
    [ModelProperty.classTravel]: number;
    [ModelProperty.classWaiting]: number;
    [ModelProperty.closedDate]: string;
    [ModelProperty.disability]: string;
    [ModelProperty.doNotClaimVATChecked]: boolean;
    [ModelProperty.dsccRef]: string;
    [ModelProperty.dutySoliChecked]: boolean;
    [ModelProperty.escapeAmount]: number;
    [ModelProperty.ethnicCode]: string;
    [ModelProperty.excludeFromCDS6Checked]: boolean;
    [ModelProperty.excludeFromCDS6Enable]: boolean;
    [ModelProperty.fileId]: number;
    [ModelProperty.fixedFee]: number;
    [ModelProperty.gender]: string;
    [ModelProperty.invClassCurrentTotalsViewModel]: InvClassCurrentTotalsViewModel;
    [ModelProperty.matterType]: string;
    [ModelProperty.noOfDefendants]: number;
    [ModelProperty.nonFixedStageReached]: string;
    [ModelProperty.openedDate]: string;
    [ModelProperty.outcomeCode]: string;
    [ModelProperty.policeAdvCalls]: number;
    [ModelProperty.policeStId]: string;
    [ModelProperty.policeStName]: string;
    [ModelProperty.schemeId]: string;
    [ModelProperty.schemeName]: string;
    [ModelProperty.stageReached]: string;
    [ModelProperty.subClassMode]: number;
    [ModelProperty.youthChecked]: boolean;
}

export class InvClassCurrentTotalsViewModel {
    classCurrentTotalsFixedViewModel: TotalViewModel;
    classCurrentTotalsNonFixedViewModel: TotalViewModel;
}

export class TotalViewModel {
    additionalFixFee: number;
    additionalWorkFee: number;
    claimDisbursements: number;
    claimProfitCost: number;
    claimTravel: number;
    claimWaiting: number;
    disbursements: number;
    escapeAmount: number;
    feeEarnerTotal: number;
    fixedFee: number;
    profitCost: number;
    travel: number;
    waiting: number;
}

export class TotalViewDisplayModel extends TotalViewModel {
    fixedFeeColor: string;
    escapeAmountColor: string;
    additionalFixFeeColor: string;
    additionalWorkFeeColor: string;
}

export interface InvClassTotalsReqViewModel {
    CrimeClassIdentityViewModel: CrimeClassIdentityViewModel;
    ClosedDate: string;
    CDSDirectTAFChecked: boolean;
    DoNotClaimVATChecked: boolean;
}

export interface InvClassCurrentTotalsReqViewModel {
    CrimeClassIdentityViewModel: CrimeClassIdentityViewModel;
    ClosedDate: string;
    CDSDirectTAFChecked: boolean;
    SchemeId: string;
    DoNotClaimVATChecked: boolean;
    IsRecursiveFormDisplay: boolean;
}

export interface PoliceStationInfoViewModel {
    policeStId: string;
    policeStName: string;
    schemeId: string;
    schemeName: string;
}

export interface ClassClosingReqViewModel {
    CrimeClassIdentityViewModel: CrimeClassIdentityViewModel;
    StageReached: string;
    SubClassMode: number;
    NonFixedStageReached: string;
    PoliceStId: string;
    OutcomeCode: string;
    MatterType: string;
    AdditionalFixedFee: number;
    DSCCRef: string;
}


