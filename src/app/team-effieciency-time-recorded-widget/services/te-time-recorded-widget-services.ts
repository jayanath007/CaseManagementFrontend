
import { map } from 'rxjs/operators';
import { AuthInfoStateService } from '../../auth';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ServiceEndpointConfig } from '../../core/configs/service-configs';
import { MsgraphClientBase, AppConfig } from '../../core';
import { TimeRecordRespone, DataRequestModel } from '../models/interfce';

@Injectable()
export class TETimeRecordedWidgetService {

    private matters$;
    public testData: any;

    constructor(private http: HttpClient, private appConfig: AppConfig) {
    }

    public getTimeRecordedData(request: DataRequestModel) {
        return this.http.get<TimeRecordRespone>(this.appConfig.serviceBase2 + '/Team/GetTimeRecordedValues??suppressErrors=true&users=' +
            request.user + '&month=' + request.month + '&byHourOrValue=' + request.option +
            '&department=' + request.department).pipe(
                map(response => response.data));
    }


}
