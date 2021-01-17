

// export interface NarrativeDataModel {
//     naI_ID: number;
//     naI_Description: string;
//     narrativeItems: NarrativeItem[];
// }
export interface NarrativeItem {
    naI_ID: number;
    naI_Description: string;
    naI_NAGID: number;
    naI_Text: string;
    state: boolean;
}

export interface WorkflowMenuMetaItem {
    atN_ID: number;
    atN_ParentID: number;
    atN_AppID: number;
    atN_Type: number;
    atN_Order: number;
    atN_Command: string;
    atN_Desc: string;
    atN_Level: number;
    atN_Help: string;
    atN_ParentMenu: string;
    nodeStatus: number;
    createUser: string;
    dateDone: string;
}


export interface WorkflowMenuMetaItem {
    atN_ID: number;
    atN_ParentID: number;
    atN_AppID: number;
    atN_Type: number;
    atN_Order: number;
    atN_Command: string;
    atN_Desc: string;
    atN_Level: number;
    atN_Help: string;
    atN_ParentMenu: string;
    nodeStatus: number;
    createUser: string;
    dateDone: string;
}
export interface NarrativeGroup {
    naG_ID: number;
    naG_Name: string;
    naG_UserID: string;
    state: boolean;

}

export interface NarrativeItem {
    narrativeItemId: number;
    narrativeItemDescription: string;
    narrativeGroupId: number;
    narrativeItemText: string;
    selected: boolean;

}

export interface NarrativesInfo {
    narrativeGroupId: number;
    narrativeGroupDescription: string;
    narrativeItemId: number;
    narrativeItemGroupId: number;
    narrativeItemDescription: string;
    narrativeItemText: string;
}


export interface BillingNarrativesSaveRequestViewModel {
    billingNarrativesSaveRequestViewModel: NarrativesInfo;

}

export interface NarrativeDataModel {
    narrativeGroupId: number;
    narrativeGroupName: string;
    narrativeGroupUserId: string;
    narrativeItems: NarrativeItem[];
    selected: boolean;

}



