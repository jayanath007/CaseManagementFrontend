
export interface GetAllCaseMessagesByHandler {
    handlerEmail: string;
    pageSize?: number;
    page?: number;
}

export interface MatterRefMap {
    appId: number;
    branchId: number;
    fileId: number;
    processAppId: number;
    matterRef: string;
}
