
import { map } from 'rxjs/operators';
import { AuthInfoStateService } from '../../auth';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ServiceEndpointConfig } from '../../core/configs/service-configs';
import { MsgraphClientBase, AppConfig } from '../../core';
import { AgedDebtorRespone, DataRequestModel } from '../models/interfce';

@Injectable()
export class TEPieChartWidgetService {

    private matters$;
    public testData: any;

    constructor(private http: HttpClient, private appConfig: AppConfig) {
    }

    public getAgedDebtorsdData(request: DataRequestModel) {
        return this.http.get<AgedDebtorRespone>(this.appConfig.serviceBase2 + '/Team/GetAgedDebtorsValues?suppressErrors=true&users=' +
            request.users + '&month=' + request.month + '&department=' + request.department).pipe(
                map(response => response.data));
    }


}
