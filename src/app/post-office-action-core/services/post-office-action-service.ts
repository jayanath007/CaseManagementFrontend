
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../../core';
import { Injectable } from '@angular/core';
@Injectable()
export class PostOfficeActionService {

    constructor(private http: HttpClient, private appConfig: AppConfig) { }


    public getFeeEarnerList(groupId) {

        return this.http.post<any>(this.appConfig.serviceBase + '/PostOffice/GetUserListFromGroup', {
            'DataSourceRequestViewModel': {
                'take': 0,
                'skip': 0
            },
            'EmployeeFilterOptionViewModel': {
                'DepartmentId': groupId,
                'UserNameSearch': null,
                'IsInactiveFeeearners': false,
            }
        }).pipe(map(response => response.data));
    }

    public getGroups() {
        return this.http.get<any>(this.appConfig.serviceBase + '/PostOffice/GetGroupsList').pipe(
            map(response => response.data));
    }


    public savePost(model: any) {
        return this.http.post<any>(this.appConfig.serviceBase + '/PostOffice/PostOfficeAction',
            model).pipe(
                map(response => response.data));
    }



    public getActionList(appId) {
        // return this.http.get<any>(this.appConfig.serviceBase + '/CrimeTime/GetFeeEarnerLookupData').pipe(
        //     map(response => response.data));

        return this.http.get<any>(this.appConfig.serviceBase +
            `/Diary/GetDiaryTypes?startupMode=NewEvent&appId='+${appId}`).pipe(
                map(response => {
                    return response.data;
                }));
    }

    public getFolderList(appId) {

        return this.http.get<any>(this.appConfig.serviceBase2 + '/Diary/GetFoldersAsync?appId=' + appId).pipe(
            map(response => {
                return response.data;
            }));

    }

    public getWorkTypes() {
        return this.http.get<any>(this.appConfig.serviceBase + '/CrimeTime/GetFeeEarnerLookupData').pipe(
            map(response => response.data));
    }





}
