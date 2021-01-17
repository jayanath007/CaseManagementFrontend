import { map } from 'rxjs/operators';
import { AppConfig } from '../../core/configs/app-config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MlsCaseMassageResponce } from '../../core/lib/mls';
import { GetAllCaseMessagesByHandler } from '../models/interface';
import { CaseFileIdentityWithAppIdViewModel } from '../../core/lib/files';
import { SendMessageRequest } from './../../mls-core/models/request';
import { DPSConstants } from '../../core/lib/dpsConstant';
import { MatterRefMap } from './../models/interface';

@Injectable()
export class MlsWidgetServices {

    private matters$;
    public testData: any;

    constructor(private http: HttpClient, private appConfig: AppConfig) {
    }

    public loadData(request: GetAllCaseMessagesByHandler) {
        let header = new HttpHeaders();
        header = header.append(DPSConstants.ControlerAndMethod, 'WebApi/GetAllCaseMessagesByHandler');
        header = header.append(DPSConstants.RequiredDBPointerHttpHeader, 'false');
        return this.http.get<{ data: MlsCaseMassageResponce }>
            // tslint:disable-next-line:max-line-length
            (`${this.appConfig.serviceBase2}/mls/DoMLSFunction?handlerEmail=${request.handlerEmail}&pageSize=${request.pageSize}&page=${request.page}&suppressErrors=true`, { headers: header }).pipe(
                map((response) => response.data));
    }

    public getFullMatterDetails(request: CaseFileIdentityWithAppIdViewModel) {
        return this.http.post<{ data: any }>(`${this.appConfig.serviceBase2}/mls/GetMatterByMLSFileIds`, request)
            .pipe(map(responce => responce.data));
    }

    public sendMessage(request: SendMessageRequest) {
        // const appId = 6;
        // const branchID = 1;
        const appId = request.appID;
        const branchID = request.branchID;
        let header = new HttpHeaders();
        header = header.append(DPSConstants.ContentTypeHttpHeader, 'application/json');
        header = header.append(DPSConstants.ControlerAndMethod, 'WebApi/SendMessage');
        header = header.append(DPSConstants.RequiredDBPointerHttpHeader, 'true');
        header = header.append(DPSConstants.MLSAppIDHttpHeader, 'true');
        return this.http.post<{ data: MlsCaseMassageResponce }>
            (`${this.appConfig.serviceBase2}/mls/DoMLSFunction?appID=${appId}&branchID=${branchID}`,
                request.toPost(),
                { headers: header }).pipe(
                    map((response) => response.data));
    }

    public LoadMatterRef(request: { processAppId: number, fileId: number, branchId: number }[]) {
        return this.http.post<{ data: MatterRefMap[] }>(
            `${this.appConfig.serviceBase2}/mls/GetMatterRef?suppressErrors=true`, { MatterDataRequestList: request }
        ).pipe(map(responce => responce.data));
    }

}
