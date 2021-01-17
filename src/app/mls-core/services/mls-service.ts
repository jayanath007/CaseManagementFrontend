import { map } from 'rxjs/operators';
import { AppConfig } from '../../core/configs/app-config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MLSUser, MlsCaseMassageResponce } from './../../core/lib/mls';
import { SendMessageRequest } from '../models/request';
import { DPSConstants } from '../../core/lib/dpsConstant';
import { MatterInfo } from '../../core/lib/matter';

@Injectable()
export class MlsService {

    constructor(private http: HttpClient, private appConfig: AppConfig) {
    }

    public getCaseUsersByMatter(appId: number, fileID: number, branchID: number) {
        let header = new HttpHeaders();
        header = header.append(DPSConstants.ControlerAndMethod, 'WebApi/GetCaseUsersByMatter');
        header = header.append(DPSConstants.RequiredDBPointerHttpHeader, 'true');
        return this.http.get<{ data: MLSUser[] }>
            (`${this.appConfig.serviceBase}/mls/DoMLSFunction?appID=${appId}&fileID=${fileID}&branchID=${branchID}&suppressErrors=true`,
                { headers: header }).pipe(
                    map((response) => response.data));
    }

    public getChatMessgeByUserEmail(appId: number, fileID: number, branchID: number, userEmail: string, page: number, pageSize: number) {
        let header = new HttpHeaders();
        header = header.append(DPSConstants.ControlerAndMethod, 'WebApi/GetCaseMessagesByEmail');
        header = header.append(DPSConstants.RequiredDBPointerHttpHeader, 'true');
        return this.http.get<{ data: MlsCaseMassageResponce }>
            (`${this.appConfig.serviceBase}/mls/DoMLSFunction?appID=${appId}&fileID=${fileID}&branchID=${branchID}&userEmail=${userEmail}
            &page=${page}&pageSize=${pageSize}`,
                { headers: header }).pipe(
                    map((response) => response.data));
    }

    public sendMessage(request: SendMessageRequest) {
        const appId = request.appID;
        const branchID = request.branchID;
        let header = new HttpHeaders();
        header = header.append(DPSConstants.ContentTypeHttpHeader, 'application/json');
        header = header.append(DPSConstants.ControlerAndMethod, 'WebApi/SendMessage');
        header = header.append(DPSConstants.RequiredDBPointerHttpHeader, 'true');
        return this.http.post<{ data: MlsCaseMassageResponce }>
            (`${this.appConfig.serviceBase}/mls/DoMLSFunction?appID=${appId}&branchID=${branchID}`,
                request.toPost(),
                { headers: header }).pipe(
                    map((response) => response.data));
    }

    public ChangeCanViewMilestone(matterDetails: MatterInfo, userID, visible: boolean) {
        let header = new HttpHeaders();
        header = header.append(DPSConstants.ControlerAndMethod, 'WebApi/SetUserMilestoneNotificationVisibility');
        header = header.append(DPSConstants.RequiredDBPointerHttpHeader, 'true');
        return this.http.get<{ data: MlsCaseMassageResponce }>
            (`${this.appConfig.serviceBase}/mls/DoMLSFunction?appID=
            ${matterDetails.AppId}&fileID=${matterDetails.FileId}&branchID=${matterDetails.BranchId}&userID=${userID}
            &visible=${visible}`,
                { headers: header }).pipe(
                    map((response) => response.data));
    }

    addUser(matterRef: string, message: string, emailAddresses: string) {
        return this.http.post<any>(this.appConfig.serviceBase + '/MLS/SendDocsToMLSAsync', {
            matterRef: matterRef,
            emailAddresses: [emailAddresses],
            message: message,
        }).pipe(map(res => res.data));
    }

}
