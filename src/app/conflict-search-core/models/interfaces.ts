import { DPSResponse } from '../../core/lib/data-response';
import { ConflictCheckType, ConflictSearchOpenFrom } from './enum';
import { DatePipe } from '@angular/common';
export interface ConflictSearchData {
    surname: string;
    forname: string;
    postCode: string;
    company: string;
    includeClientWithNoMatter: boolean;
    isClientTypeCompany: boolean;
    matterDetails: boolean;
    ref: string;
    name: string;
    details: string;
    dob: string;
    match: string;
}

export interface ConflictSearchPopupInput {
    conflictCheckType: ConflictCheckType;
    clientDto?: any;
    openFrom: ConflictSearchOpenFrom;
    commonPara: CommonPara;
}
export interface CommonPara {
    // Add any para to this
    data: any;
    status: string;
}
export interface ClientMatter {
    matterId: number;
    matterFileID?: number;
    matterRef: string;
    matterAppCode: string;
    matterDetails: string;
    matterFeeEarner: string;
    matterStartDate: string;
    isClosedMatter: boolean;

}
export interface Client {

    clientId: number;
    clientName: string;
    appId: number;
    branchId: number;
    fileID: number;
    clientAddress1: string;
}

export interface ConflictSearchMsg {
    isError: boolean;
    msg: string;
}

export interface SearchModel {
    surname: string;
    forname: string;
    dOB: string;
    postCode: string;
    company: string;
    matterDetails: string;
    includeClientWithNoMatter: boolean;
    isClientTypeCompany: boolean;

}
export interface OpportunitySearchModel {
    lastName: string;
    firstName: string;
    postCode: string;
    companyName: string;
    companyNameList: string[];
    enquiryId: number;
    matterDetails: string;
    includeClientWithNoMatter: boolean;
    isClientTypeCompany: boolean;
    dOB?: string;
}
export interface OpportunityConflictSearchSaveRequestViewModel extends OpportunitySearchModel {
    birthDate: string;
}
export interface ConflictSearchGridRowItem<T> {
    data: T;
    selected: boolean;
    index: number;
}
export type ConflictSearchGridRowItemWrapper = ConflictSearchGridRowItem<Readonly<ConflictSearchData>>;



export interface ConflictSearchGridRowItem<T> {
    data: T;
    selected: boolean;
    index: number;
}
export type ClientMatterRowItemWrapper = ConflictSearchGridRowItem<Readonly<ClientMatter>>;

export enum SearchState {
    BeforeSearchApply = 'BeforeSearchApply',
    AfterSearchApplySucsess = 'AfterSearchApplySucsess',
    AfterSearchApplyFail = 'AfterSearchApplyFail',
    SaveSearchSucsess = 'SaveSearchSucsess',
    OpportunitySearchSucsess = 'OpportunitySearchSucsess',
    OpportunitySaveSucsess = 'OpportunitySaveSucsess',
}

export interface ConflictSearchClientResponseData {
    data: ConflictSearchData[];
    total: number;
}
export class ConflictSearchClientRequest {
    constructor(public model: SearchModel) {
    }
    public toPost() {
        let surname = null;
        if (this.model.surname) {
            surname = this.model.surname;
        }
        let forname = null;
        if (this.model.forname) {
            forname = this.model.forname;
        }
        let dOB = null;
        if (this.model.dOB) {
            dOB = this.model.dOB;
        }
        let postCode = null;
        if (this.model.postCode) {
            postCode = this.model.postCode;
        }
        let company = null;
        if (this.model.company) {
            company = this.model.company;
        }
        let matterDetails = null;
        if (this.model.matterDetails) {
            matterDetails = this.model.matterDetails;
        }
        const data = {
            conflictCheckViewModel:
            {
                surname: surname,
                forname: forname,
                dOB: dOB,
                postCode: postCode,
                company: company,
                includeClientWithNoMatter: this.model.includeClientWithNoMatter,
                matterDetails: matterDetails,
            },
            dataSourceRequestViewModel: { take: 0, skip: 0 }
        };
        return data;
        // return {
        //     conflictCheckViewModel:
        //         { surname: this.model.surname, forname: null, dOB: null,
        // postCode: null, company: null, includeClientWithNoMatter: true },
        //     dataSourceRequestViewModel: { take: 0, skip: 0 }
        // };
    }
}
export class OpportunityConflictSearchRequest {
    constructor(public model: OpportunitySearchModel) {
    }
    public toPost() {
        const datePipe = new DatePipe('en-US');
        const data = {
            opportunityConflictCheckDetailsViewModel:
            {
                lastName: this.model.lastName,
                firstName: this.model.firstName,
                postCode: this.model.postCode,
                companyName: this.model.companyName,
                companyNameList: this.model.companyNameList,
                enquiryId: this.model.enquiryId,
                includeClientWithNoMatter: this.model.includeClientWithNoMatter,
                isClientTypeCompany: this.model.isClientTypeCompany,
                matterDetails: this.model.matterDetails,
                birthDate: datePipe.transform(this.model.dOB, 'yyyy-MM-dd'),
            },
            dataSourceRequestViewModel: { take: 0, skip: 0 }
        };
        return data;
    }
}

export type ConflictSearchClientResponse = DPSResponse<ConflictSearchClientResponseData>;

// export type OpportunityConflictSearchResponse = DPSResponse<ConflictSearchClientResponseData>;
export class ConflictSearchDetailRequest {
    constructor(public clientRef: string) {
    }
}
export type ConflictSearchClientDetailResponse = DPSResponse<ClientMatter[]>;


// export interface ConflictSearchClientDetailResponseData {
//     data: ClientMatter[];
// }


// export interface ClientResponseData {
//     client: Client;
// }


export type ClientResponse = DPSResponse<Client>;

export interface ConflictSearchSaveData {
    conflictsList: ConflictSearchData[];
    conflictCheckDeatils: SearchModel;
    clientRef: Client;
    checkDate: Date;
    conflictCheckType: string;
    fileRequestViewModel: { appId: number, branchId: number, fileId: number };
}

export class ConflictSearchSaveRequest {
    constructor(
        public conflictsList: ConflictSearchData[],
        public conflictCheckDeatils: SearchModel,
        public clientRef: Client,
        public checkDate: Date,
        public conflictCheckType: string,
        public fileRequestViewModel: { appId: number, branchId: number, fileId: number }
    ) { }

    public toPost() {
        return {
            conflictsList: this.conflictsList,
            conflictCheckDeatils: this.conflictCheckDeatils,
            clientRef: this.clientRef,
            checkDate: this.checkDate.toDpsString(),
            conflictCheckType: this.conflictCheckType,
            fileRequestViewModel: this.fileRequestViewModel,
        };
    }
}
export class OpportunityConflictSearchSaveRequest {
    constructor(
        public conflictsList: ConflictSearchData[],
        public OpportunityConflictCheckViewModel: OpportunityConflictSearchSaveRequestViewModel,
    ) { }

    public toPost() {
        return {
            clientConflictCheckListViewModels: this.conflictsList,
            opportunityConflictCheckDetailsViewModel: this.OpportunityConflictCheckViewModel,
        };
    }
}


