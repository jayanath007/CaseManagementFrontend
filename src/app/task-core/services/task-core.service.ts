import { TaskRequest } from '../models/task-core-request';
import { TaskResponse } from '../models/interface';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class TaskService {

    constructor(private http: HttpClient) { }

    public getTask(request: TaskRequest) {
        if (request.filterOptions.SearchText) {
            return this.http.get<TaskResponse>('assets/task.json');
        } else {
            return this.http.get<TaskResponse>('assets/task.json');
        }
    }

    public getTaskFilter(serchText: string) {

    }

}
