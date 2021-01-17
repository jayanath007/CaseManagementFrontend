export interface FeeEarner {
    groupId: number;
    groupName: string;
    selected?: boolean;
    jobTitle?: string;
    name?: string;
}

export interface FeeEarnerResponce {
    data: FeeEarner[];
    Status: StatusType;
}

export enum StatusType {
    Fail = 0,
    Success = 1,
}


