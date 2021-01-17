
export interface ChatMessage {
    id: string;
    text: string;
    messageSender: MLSUser;
    dateViewed: string;
    docVersionID: string;
    matterID: string;
    datePosted: string;
    sourceMessageID: string;
    documentDetails: DocumentDetails;
    xmlid: string;
    xmlStatus: string;
    appId: number;
    branchId: number;
    fileId: number;
}

export interface MLSUser {
    id: string;
    firstName: string;
    lastName: string;
    isProPicAvailable: boolean;
    emailAddress: string;
    userName: string;
    isFirstTimeLoging: boolean;
    welcomeTemplateContent: any;
    azureADObjectID: string;
    lastUsed: string;
    canViewMilestones: boolean;
}

export interface MlsCaseMassageResponce {
    chatMessageList: ChatMessage[];
    companyPointer: string;
    loggedUser: string;
    mode: string;
    sessionId: string;
    userId: string;
}

export interface DocumentDetails {
    aesKey: string;
    aesiv: string;
    docVersionID: string;
    lastAccessed: string;
    lettername: string;
    note: string;
    onDate: string;
    status: string;
    version: number;
}


