
export interface GeneralPopupResponse {
    data: GeneralDataObject;
    status: string;
    messageBody: string;
    messageHeader: string;
    detailStatus: DetailStatusViewModel[];
}



export interface GeneralDataObject {
    data: GeneralGridRowResponce[];
    total: number;
    aggregates: Array<AggregatorViewModel>;
}


export interface AggregatorViewModel {
    field: string;
    aggregate: string;
}

export interface GeneralGridRowResponce {
    puR_Account_Ref: string;
    puR_Account_Name: string;
    puR_Category: string;
}

export interface DetailStatusViewModel {
    code: string;
    message: string;
    reference: string;
    messageType: string;
    severityLevel: string;
    exceptionType: string;
}
