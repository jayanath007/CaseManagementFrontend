import { Folder, Grade, DiaryType, ActionType, ExtraTimeType, FeeEarner, EditViewData } from './interfaces';
import { StatusType, DiaryRecType } from './enumeration';
import { DetailStatus } from '../../shared';

export interface FolderListResponse {
    data: Folder[];
    Status: StatusType;
}

export interface FolderResponse {
    data: number;
    Status: StatusType;
}

export interface UserGradeListResponse {
    data: Grade[];
    Status: StatusType;
}
export interface UserGradeResponse {
    data: Grade;
    Status: StatusType;
}

export interface DiaryTypeResponse {
    body: { typeId: DiaryRecType, description: string }[];
}

export interface ActionListResponse {
    data: ActionType[];
    Status: StatusType;
}

export interface ExtraTimeTypeListResponse {
    data: ExtraTimeType[];
    Status: StatusType;
}

export interface FeeEarnerResponse {
    data: FeeEarner[];
    Status: StatusType;
}

export interface EditViewResponse {
    data: EditViewData;
    Status: StatusType;
}

export interface GetItemRateResponse {
    data: number;
    Status: StatusType;
    detailStatus: DetailStatus[];
}

export interface GetLetterNameResponse {
    data: string;
    Status: StatusType;
}


