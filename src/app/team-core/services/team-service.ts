
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AppConfig, DropdownListData } from '../../core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { SearchDocumentViewModel } from '../models/team-request';
import { Observable } from 'rxjs';
import { DatePipe } from '@angular/common';
import { FieldType } from '../../odata';
import { TeamUserRequest, TeamMemberResponse, UserRequestViewModel, UserRequestByDepartmentViewModel } from '../models/interface';



@Injectable()
export class TeamService {

    constructor(private http: HttpClient, private appConfig: AppConfig, private datePipe: DatePipe) { }



    public getDepartmentList(): Observable<DropdownListData[]> {
        return this.http.get<any>(this.appConfig.serviceBase + '/Team/GetDepartments').pipe(
            map(response => response.data));
    }


    public getTeamMembers(param: any) {
        return this.http.post<TeamMemberResponse>(this.appConfig.serviceBase + '/Dashboard/GetEmployeesList', {
            'DataSourceRequestViewModel': {
                'take': 0,
                'skip': 0
            },
            'EmployeeFilterOptionViewModel': {
                'User': param.user,
                'DepartmentId': param.departmentId,
                'UserNameSearch': param.membereSearchText,
                'IsInactiveFeeearners': param.isInactiveFeeEarners
            }
        }).pipe(map(response => response.data));
    }




    public getUserLastMovement(userList) {
        const userIds = userList.map(x => x.user);
        if (userIds) {
            return this.http.post<any>(this.appConfig.serviceBase + `/ActivityTraker/GetUserLastMovement`, userIds).pipe(
                map(response => response.data));
        }
    }




    public getActivityByMonth(param: UserRequestViewModel) {
        const qs = Object.keys(param).map((key) => `${key}=${param[key]}`).join('&');
        return this.http.get<any>(this.appConfig.serviceBase + '/ActivityTraker/GetUserMovementsByMonth?' + qs)
            .pipe(map(response => response.data));
    }

    // public getActivityByYear(param: UserRequestViewModel) {

    //     return this.http.get<any>(this.appConfig.serviceBase + '/ActivityTraker/GetAllDayEventsCountByMonths?userId='+
    //     param.userId + '&year=' + param.year).pipe(map(response => response));


    // }

    // public getActivityByYear(param: UserRequestViewModel) {
    //     return this.http.get<any>(this.appConfig.serviceBase + '/ActivityTraker/GetAllDayEventsCountByMonthAsync?userId=' +
    //     param.userId + '&year=' + param.year ).pipe(
    //             map(response => response.data));

    // }

    public getActivityYearByDepartment(param: UserRequestByDepartmentViewModel) {
        return this.http.get<any>(this.appConfig.serviceBase
            + '/ActivityTraker/GetAllDayEventsByDepartment?departmentId=' + param.departmentId +
            '&year=' + param.year).pipe(map(response => response.data));
    }

    public getUserMovementDetailsById(userMovementIds) {
        const userIds = userMovementIds[0] ? userMovementIds[0].userMovementTypes.map(a => a.key) : null;
        if (userIds) {
            return this.http.post<any>(this.appConfig.serviceBase + `/ActivityTraker/GetUserMovementsById`, userIds).pipe(
                map(response => response.data));
        }
    }



    public getActivityYearByUser(param: UserRequestViewModel) {
        return this.http.get<any>(this.appConfig.serviceBase
            + '/ActivityTraker/GetAllDayEventsByUser?userId=' + param.userId +
            '&year=' + param.year).pipe(map(response => response.data));
    }


}









    // public getOpenCaseMaterDataFromMatterRef(matterRef: string) {
    //     return this.http.get<any>(this.appConfig.serviceBase
    //         + '/Matters/GetMatterBranchFileAppId?matterRef=' + matterRef).pipe(map(result => {
    //             const materData: GridRowItemWrapper = {
    //                 data: {
    //                     appID: result.data.maT_AppID,
    //                     fileID: result.data.maT_FileID,
    //                     app_Code: result.data.maT_APCode,
    //                     branchID: result.data.maT_BranchID,
    //                     feeEarner: result.data.maT_Fee_Earner,
    //                     reviewDate: result.data.maT_Start_Date,
    //                     clientName: result.data.maT_Client_Name,
    //                     reviewNote: result.data.maT_Details,
    //                     company_Name: '',
    //                     matterDetails: result.data.maT_Details,
    //                     matterReferenceNo: result.data.maT_Ref,
    //                     matterCounter: result.data.maT_Counter,
    //                     ufnValue: result.data.maT_UFN,
    //                     eBilling: result.data.eBilling,
    //                     isPlotMatter: result.data.isPlotMatter,
    //                     isPlotMasterMatter: result.data.
    //                 }
    //             };

    //             return materData;

    //         }

    //         ));
    // }

    // public getShareDataFromMatterRef(matterRef: string, diaryId: number) {
    //     return this.http.get<any>(this.appConfig.serviceBase
    //         + '/Matters/GetMatterBranchFileAppId?matterRef=' + matterRef).pipe(map(result => {
    //             const inputData: InputData = {
    //                 signTokens: null,
    //                 safeBoxFileList: null,
    //                 fileCredentials: [{ diaryId: diaryId, password: null }],
    //                 submitType: SubmitType.Share,
    //                 url: null,
    //                 matterData: {
    //                     MatterReferenceNo: result.data.maT_Ref,
    //                     FileID: result.data.maT_FileID,
    //                     AppCode: result.data.maT_APCode,
    //                     AppID: result.data.maT_AppID,
    //                     BranchID: result.data.maT_BranchID,
    //                     ClientName: result.data.maT_Client_Name,
    //                     RateCategory: null,
    //                     FeeEarner: null,
    //                     eBilling: result.data.eBilling
    //                 }
    //             };

    //             return inputData;

    //         }

    //         ));
    // }


