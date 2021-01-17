import { TeamMemberResponse } from '../../core/lib/team-members';

export interface ParameterList {
    department: number;
    isInactiveFeeEarners: boolean;
    membereSearchText: string;
    selectedUser: string;
}
export interface TeamMemberServiceRespond {
    data: TeamMemberResponse;
    detailStatus: any[];
    messageBody: string;
    messageHeader: string;
    status: string;
}
