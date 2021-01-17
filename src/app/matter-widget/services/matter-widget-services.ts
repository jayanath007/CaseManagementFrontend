
import { map } from 'rxjs/operators';
import { DataObjectResponse } from '../models/interfce';
import { AppConfig } from '../../core/configs/app-config';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DataRequest } from '../models/request';
import { GridRowItemWrapper, MatterInfoResponse } from '../../matter-search-core';

@Injectable()
export class MatterWidgetService {

    private matters$;
    public testData: any;

    constructor(private http: HttpClient, private appConfig: AppConfig) {
    }

    public loadMatterData(request: DataRequest) {
        return this.http.post<DataObjectResponse>(this.appConfig.serviceBase2 +
            '/Matters/GetMatters?suppressErrors=true', request.toPost()).pipe(
                map((response) => response.data));
    }
    public getMatterInfoByCaseIdentity(request: GridRowItemWrapper) {
        return this.http.get<MatterInfoResponse>(this.appConfig.serviceBase + `/Matters/GetMatterInfoByCaseIdentity?appId=${
            request.data.appID}&branchId=${request.data.branchID}&fileId=${request.data.fileID}`).pipe(map((response) => response.data));
    }

}
