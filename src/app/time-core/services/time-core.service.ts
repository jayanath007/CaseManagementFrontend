import { TimeRequest } from '../models/time-core-request';
import { TimeResponse } from '../models/interface';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class TimeService {

    constructor(private http: HttpClient) { }

    public getTime(request: TimeRequest) {
        if (request.filterOptions.SearchText) {
            return this.http.get<TimeResponse>('assets/time.json');
        } else {
            return this.http.get<TimeResponse>('assets/time.json');
        }
    }

    public getTimeFilter(serchText: string) {

    }

}
