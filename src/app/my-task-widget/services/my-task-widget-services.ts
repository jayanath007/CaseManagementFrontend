
import { map } from 'rxjs/operators';
import { DataObjectResponse } from '../models/interfce';
import { AppConfig } from '../../core/configs/app-config';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DataRequest, RequestToCompleteTask } from '../models/request';

@Injectable()
export class MyTaskWidgetService {

    private matters$;
    public testData: any;

    constructor(private http: HttpClient, private appConfig: AppConfig) {
    }

    public loadMyTaskData(request: DataRequest) {
        return this.http.post<DataObjectResponse>(this.appConfig.serviceBase2 + '/MyTasks/GetMyTasks?suppressErrors=true',
            request.DataRequestToPost()).pipe(
                map((response) => response.data));
    }

    public completeTask(request: RequestToCompleteTask) {
        return this.http.post<any>(this.appConfig.serviceBase2 + '/Diary/AddUpdateDpsTask', request.CompleteTaskToPost()).pipe(
            map((response) => response.data));
    }


}
