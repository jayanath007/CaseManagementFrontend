
export interface MasterDataViewModel<T> {
    data: T;
    isLoading: boolean;
}

export interface DropdownListItem {
    key: number;
    value: string;
    description1: string;
    description2: string;
}

export interface DepartmentWithMatterAndAppCode {
    departmentId: number;
    departmentName: string;
    deptAppId: number;
    deptAppCode: string;
    matCategoryWithAppInfo: MatterCategoryWithhAppInfo[];
}

export interface MatterCategoryWithhAppInfo {
    matCategoryId: number;
    matCategoryDescription: string;
    matCategoryAppId: number;
    matCategoryAppCode: string;
}

export interface FeeEarnerInfo {
    userId: string;
    userName: string;
    userBranchId: number;
    userDepartmentId: number;
    userSupervisorRef: string;
}

