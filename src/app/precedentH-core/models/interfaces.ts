export interface PrecedentHS {
    phaseID: number;
    description: string;
    estimatedValue: number;
    actualValue: number;
    phE_ID: number;
}
export interface WorkType {
    workTypeID: number;
    description: string;
}
export interface PrecedentHInput {
    AppId: number;
    FileId: number;
    BranchId: number;
    eBilling?: string;
}
export interface ActualAndEstimatedTotal {
    actualTotal: any;
    estimatedTotal: any;
}

export interface DropdownListData {
    key: number;
    value: string;
}

export interface GrandTotals {
    actualDisbursmentTotal: number;
    actualTimeCostTotal: number;
    estimateDisbursmentTotal: number;
    estimateTimeCostTotal: number;
    totalCost: number;
}

// fine
export interface EstimateGridData {
    workTypeId: number;
    id: number;
    feeEarnerStatus: string;
    units: number;
    rate: number;
    cost: number;
    actualCost: number;
}

export interface WorkTypeData {
    text: string;
    value: number;
}

export interface FeeEarnerTimeCost {
    workTypeId: number;
    feeEarnerTimeRates: EstimateGridData[];
}

export interface EstimateViewData {
    workTypeId: number;
    phsId: number;
    estimateValues: EstimateValues;
    assumptions: any;
    isRecord: boolean;
}

// fine
export interface EstimateValues {
    workTypeId: number;
    totalProfitCost: number;
    expertFees: number;
    expertDisbursements: number;
    leadingCounsel: number;
    juniorCounsel: number;
    courtFees: number;
    otherDisbursements: number;
    totalDisbursements: number;
    total: number;
}

export interface ActualViewData {
    workTypeId: number;
    actualValues: ActualValues;

}

// fine
export interface ActualValues {
    workTypeId: number;
    totalProfitCost: number;
    expertFees: number;
    expertDisbursements: number;
    leadingCounsel: number;
    juniorCounsel: number;
    courtFees: number;
    otherDisbursements: number;
    totalDisbursements: number;
    total: number;
}


export interface DefaultFeeEarnerTimeCost {
    feeEarnerStatus: string;
    rate: number;
}

export interface FeeEarnerTimeRatesSave {
    pheId: number;
    units: number;
    rate: number;
    cost: number;
    feeEarnerStatus: string;
}

export interface EstimateValueChanges {
    phsId: number;
    isRecord: boolean;
}


export interface TotalsValues {
    totalProfitCost: number;
    totalDisbursment: number;
    total: number;
}


