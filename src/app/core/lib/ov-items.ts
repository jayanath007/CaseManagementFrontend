
export interface OvItem {
    avD_AppID: number;
    avD_Help: string;
    avD_ID: number;
    avD_Length: number;
    avD_Text: string;
    avD_Type: number;
    avD_TypeText: string;
    avD_VarNo: number;
    dM_CField: string;
    dM_TPID: number;
    error_Message: string;
    field_Value: string;
    lookup_Text: Array<string>;
    label_Width: number;
    onScreen: boolean;
    sC_Action: string;
    sC_AppID: number;
    sC_BackCol: null;
    sC_Border: false;
    sC_Enabled: true;
    sC_Force: false;
    sC_Height: number;
    sC_ID: number;
    sC_Left: number;
    sC_Mask: string;
    sC_Multiline: boolean;
    sC_Protected: boolean;
    sC_ScreenNo: number;
    sC_Search: number;
    sC_Sequence: number;
    sC_TemplateLine: number;
    sC_TextCol: number;
    sC_Top: number;
    sC_VarNo: number;
    sC_Version: number;
    sC_Visible: boolean;
    sD_ContactType: number;
}
export interface OvItemRequest {
    user?: string;
    departmentId?: number;
    // userNameSearch?: string;
    isInactiveFeeEarners?: boolean;
    membereSearchText?: string;
}
export interface OvItemResponse {
    aggregates: string;
    data: OvItem[];
    total: number;
}
export interface OvItemResponse {
    aggregates: string;
    data: OvItem[];
    total: number;
}
export interface OvItemDataSourceRequest {
    take: number;
    skip: number;
    page: number;
    pageSize: number;
    sort: any[];
    group: any[];
}

export interface AllOvItems {
    id: string;
    email: string;
    user: string;
    userPrincipalName: string;
}

export interface OvItemServiceRespond {
    data: OvItemResponse;
    detailStatus: any[];
    messageBody: string;
    messageHeader: string;
    status: string;
}