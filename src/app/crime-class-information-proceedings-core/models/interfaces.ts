import { ModelProperty, CommittedToCrownCourtType } from './enum';
import { CrimeClassTotalsSummaryViewModel } from '../../core/lib/crime-managment';

export interface ProceedingClassInfoResponce {
    dropDownValues: {
        caseTypes: string[];
        matterTypes: string[];
        outcomeCodes: string[];
        stageReachedCodes: string[];
    };
    proceedingClassInf: ProceedingClassInfoViewModal;
    classTotalSummary: CrimeClassTotalsSummaryViewModel;
    leadUfnTotalSummary: LeadUfnTotalSummary;
}

export interface TotalData {
    classTotal: TotalDataItem;
    leadUfnTotal: TotalDataItem;
    standardFeeTotal: {
        standardFee: number;
        amountToTheNextBand: number;
        pecentageOfNextBandAmount: string;
        feeType: string;
    };
    claimTotal: TotalDataItem;
    classTotalSummary: CrimeClassTotalsSummaryViewModel;
}

export interface ProceedingClassInfoViewModal {
    [ModelProperty.branchId]: number;
    [ModelProperty.fileId]: number;
    [ModelProperty.classId]: number;
    [ModelProperty.stageReached]: string;
    [ModelProperty.matterType]: string;
    [ModelProperty.outcomeCode]: string;
    [ModelProperty.dsccRef]: string;
    [ModelProperty.noOfDefendants]: string;
    [ModelProperty.caseType]: string;
    [ModelProperty.youthChecked]: boolean;
    [ModelProperty.dutySoliChecked]: boolean;
    [ModelProperty.doNotClaimVATChecked]: boolean;
    [ModelProperty.gender]: string;
    [ModelProperty.disability]: string;
    [ModelProperty.ethnicCode]: string;
    [ModelProperty.dateOfMainOffences]: string;
    [ModelProperty.dateFirstInstructed]: string;
    [ModelProperty.preOrderWorkDate]: string;
    [ModelProperty.urbanRates]: boolean;
    [ModelProperty.representationOrderDateAppliedFor]: string;
    [ModelProperty.representationOrderWithdrawnDate]: string;
    [ModelProperty.maatid]: string;
    [ModelProperty.wasAssignedCounselInstructed]: boolean;
    [ModelProperty.s61Committal]: boolean;
    [ModelProperty.counselAsigned]: boolean;
    [ModelProperty.advacacyAssistanceInCrownCourt]: boolean;
    [ModelProperty.wastedCostOrderMade]: boolean;
    [ModelProperty.extradition]: boolean;
    [ModelProperty.locationId]: string;
    [ModelProperty.locationName]: string;
    [ModelProperty.isEnhancedRates]: boolean;
    [ModelProperty.travUplifts]: number;
    [ModelProperty.waitUplifts]: number;
    [ModelProperty.attUplifts]: number;
    [ModelProperty.prepUplifts]: number;
    [ModelProperty.advoUplifts]: number;
    [ModelProperty.letterUplifts]: number;
    [ModelProperty.callsUplifts]: number;
    [ModelProperty.openedDate]: string;
    [ModelProperty.billedDate]: string;
    [ModelProperty.closedDate]: string;
    [ModelProperty.excludeFromCDS6Checked]: boolean;
    [ModelProperty.roNotGranted]: boolean;
    [ModelProperty.seriousFraudCase]: boolean;
    [ModelProperty.isDesignatedAreaEnabled]: boolean;
    [ModelProperty.committedToCrownCourt]: boolean;
    [ModelProperty.committedToCrownCourtType]: CommittedToCrownCourtType;
    classTotal: TotalDataItem;
    leadUfnTotal: TotalDataItem;
    standardFeeTotal: {
        standardFee: number;
        amountToTheNextBand: number;
        pecentageOfNextBandAmount: string;
        feeType: string;
    };
    claimTotal: TotalDataItem;
}

export interface TotalDataItem {
    profitCost: number;
    travetTot: number;
    waitTot: number;
    disbsTot: number;
    feeEarnerTot: number;
    leadUfnNumber?: string;
    feeType?: string;
}

export interface TotalViewDisplayModel extends TotalData {
    fixedFeeColor: string;
    escapeAmountColor: string;
    additionalFixFeeColor: string;
    additionalWorkFeeColor: string;
}

export interface LeadUfnTotalSummary {
    isLeadUfnClientMatter: boolean;
    isLeadUfnMatter: boolean;
    isMasterLeadUfnMatter: boolean;
    leadUfnSummary: boolean;
}




