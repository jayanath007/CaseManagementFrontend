
import { map } from 'rxjs/operators';
import { CaseTaskRequest } from '../models/case-task-request';
import { CaseTaskResponse, TREnableResponse, RequestToCompleteTask } from '../models/interface';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../../core';

@Injectable()
export class CaseTaskService {

    constructor(private http: HttpClient, private appConfig: AppConfig) { }

    public getCaseTaskData(request: CaseTaskRequest) {
        return this.http.post<CaseTaskResponse>(this.appConfig.serviceBase + '/MyTasks/GetTasks', request.toPost());
    }
    public isTimeRecordingEnabled(matterRef: string) {
        return this.http.get<TREnableResponse>(this.appConfig.serviceBase +
            '/TimeRecording/IsTimeRecordingEnabled?matterRef=' + matterRef).pipe(
                map((response) => response.data.isTimeRecordingEnabled));
    }
    public completeTask(request: RequestToCompleteTask) {
        return this.http.post<{ data: string }>(this.appConfig.serviceBase + '/Diary/AddUpdateDpsTask',
            request.CompleteTaskToPost()).pipe(
                map((response) => response.data));
    }
}
