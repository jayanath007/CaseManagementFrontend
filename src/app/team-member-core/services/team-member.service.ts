
import { map } from 'rxjs/operators';
import { ParameterList, TeamMemberServiceRespond } from '../models/interfaces';
import { TeamMemberRequest, TeamMemberResponse } from '../../core/lib/team-members';
import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthInfoStateService } from '../../auth';
import { combineLatest } from 'rxjs';

import { AppConfig } from '../../core';
import { TeamMemberOpenFrom } from '../models/enums';

@Injectable()
export class TeamMemberService {

    constructor(private http: HttpClient, private appConfig: AppConfig, private authHelper: AuthInfoStateService) { }

    public getTeamMembers(data: TeamMemberRequest) {

        if (data.openFrom === TeamMemberOpenFrom.PostOffice) {

            return this.http.post<TeamMemberServiceRespond>(this.appConfig.serviceBase + '/PostOffice/GetUserListFromGroup', {
                'DataSourceRequestViewModel': {
                    'take': 0,
                    'skip': 0
                },
                'EmployeeFilterOptionViewModel': {
                    'User': data.user,
                    'DepartmentId': data.departmentId,
                    'UserNameSearch': data.membereSearchText,
                    'IsInactiveFeeearners': data.isInactiveFeeEarners
                }
            }).pipe(map(response => response.data));

        } else {

            return this.http.post<TeamMemberServiceRespond>(this.appConfig.serviceBase + '/Dashboard/GetEmployeesList', {
                'DataSourceRequestViewModel': {
                    'take': 0,
                    'skip': 0
                },
                'EmployeeFilterOptionViewModel': {
                    'User': data.user,
                    'DepartmentId': data.departmentId,
                    'UserNameSearch': data.membereSearchText,
                    'IsInactiveFeeearners': data.isInactiveFeeEarners
                }
            }).pipe(map(response => response.data));

        }



    }

    // public getAllMembersData() {
    //     return this.http.get<any>(this.appConfig.serviceBase + '/Graph/GetUsersWithExtension')
    //         .map(response => response.data);
    // }
}
