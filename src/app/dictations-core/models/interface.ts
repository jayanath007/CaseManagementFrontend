
export interface DropdownListData {
    key: number;
    value: string;
}

export interface GridRowData {
    id: number;
    createdDate?: string;
    matterRef: string;   // job name
    sentBy: number;  // submitted
    length: number;
    sentTime: string;
    dueDate: string;
    sentByName: string;
    secFor: number;
    secForName: string;
    lockedByName: string; // lockedBy
    completedByName: string;
    level: number;
    userCat: number;
    email: string;
    statusDescription: string;
    comment: string; // jobDescription
    urgency: number;
    // duration: string;
    dictFileName: string;
    origDictFileName: string;
    origFileName: string;
    fileName: string;
    isDPSDoc: boolean;
    dpsFileID: number;
    dpsBranchId: number;
    dpsAppPrefix: string;
    urgentValue: number;
    selected?: boolean;
    expanded?: boolean;
    groupFor?: number;
    clientName?: string;
    matterReferenceNo?: string;
    branchId?: number;
    appId?: number;
    appCode?: string;
    fileId?: number;
    feeEarner?: string;
    checkoutDocDetails?: TeamTalkCheckOutDocResponce;
}


export interface GridDataWithSummary {
    jobInfo: GridRowData[];
    jobCountStatistics: JobCountStatistics[];
    rowCount: number;
}

export interface JobCountStatistics {
    status: number;
    count: number;
}


export interface GridResponceBody {
    jobInfo: GridRowData[];
}

export interface GroupInfo {
    id: number;
    name: string;
}
export interface GroupResponceBody {
    groupInfo: GroupInfo[];
}

export interface LoginUser {
    userType: string;
    id: number;
    level: number;
    groupInfo: GroupInfo[];
    authorInfo: TeamTalkAuthors[];
}

export interface GridDataFilter {
    jobFor?: GroupInfo;
    jobStage?: DropdownListData;

}

export interface GridDataRequestModel {
    userId: number;
    jobFolder: number;
    upToDate: string;

}

export interface DictationFinishModel {
    jobId: number;
    status: number;
}


export interface StatusSummaryModel {

    // newJob: number;
    // aDraft: number;
    // sent: number;
    // tAmend: number;
    // tDraft: number;
    // transcribed: number;
    // approved: number;
    // completed: number;
    status: number;
    count: number;


}


export interface TeamTalkAuthors {
    code: string;
    id: number;
    level: number;
    name: string;
}


export interface TeamTalkTemplateUrlViewModel {
    jobId: number;
}

export interface TeamTalkCheckOutDocResponce {
    url: string;
    hashKey: string;
    changedExtension: string;
    parentReferencePath: string;
    fileName: string;
}

export interface AddTeamTalkDiaryViewModel {
    jobId: number;
    userId: number;
    length: number;
    urgentValue: number;
    fileName: string;
    jobDescription: string;
    jobName: string;
    secFor: number;
    groupForString: string;
    privateJob: boolean;
    privatePassword: boolean;
    matterRef: string;
    isDPSTask: boolean;
    noteForTask: string;
    feeEarner: string;
    dueDate: string;
    dPSDueDate: string;
    sentTime: string;
    jobSource: number;
    appId: number;
    fileId: number;
    branchId: number;
    dPSBranchId: number;
    dPSFileID: number;
    dPSAppPrefix: string;

}


export interface CheckInFileBaseViewModel {
    hashKey: string;
    fileManagerType: string;
}



export interface TeamTalkCheckInViewModel {
    hashKey: string;
    jobId: number;
}



export interface DocPathValidateViewModel {
    jobId: number;
    userId: number;
}


export interface DocPathValidateResponceModel {
    jobId: number;
    filePath: string;
}

export interface TeamTalkAttachMatter {

    clientName: string;
    matterReferenceNo: string;
    branchId: number;
    appId: number;
    appCode: string;
    fileId: number;
    feeEarner: string;

}
export interface DownloadTokenResponce {
    token: string;
    fileName: string;

}


export interface TeamTalkUserSuccessInfo {
    message: string;
    errorCode: string;
    errorDetailstring;

}
export interface DictationJobModel {
    userId: number;
    fileName: string;
    sentTime: string;
    dueDate: string;
    jobDescription: string;
    secFor: number;
    jobName: string;
    urgentValue: number;

}

export interface ProfilingRequestModel {
    matterDetails: TeamTalkAttachMatter;
    jobName: string;  // matterRef
    jobDescription: string;   // comment
    dueDate: string;
    secFor: number;
    groupFor: number;
    password: string;
    urgency: number;
    privateJob: boolean;
    jobInfo: GridRowData;
    secretary: string;
}

export interface ProfileGroupList {
    groupId: number;
    groupName: string;
    groupType: number;

}