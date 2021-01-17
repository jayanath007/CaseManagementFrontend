import { TeamMemberOpenFrom } from '../../team-member-core/models/enums';

export interface TeamMember {
    user: string;
    fullName: string;
    userMobileNo: string;
    userEmail: string;
    path: string;
    designation: string;
    enabled: number;
    selected: boolean;
    userId: number;
    jobTitle: string;
    directDialNo: string;
    // upn: string;
}
export interface TeamMemberRequest {
    user?: string;
    departmentId?: number;
    // userNameSearch?: string;
    isInactiveFeeEarners?: boolean;
    membereSearchText?: string;
    openFrom?: TeamMemberOpenFrom;
}
export interface TeamMemberResponse {
    aggregates: string;
    data: TeamMember[];
    total: number;
}
export interface TeamMemberDataSourceRequest {
    take: number;
    skip: number;
    page: number;
    pageSize: number;
    sort: any[];
    group: any[];
}
// export interface AllMembers {
//     id: string;
//     email: string;
//     user: string;
//     userPrincipalName: string;
// }
