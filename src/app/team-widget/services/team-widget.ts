import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../../core';
import { map } from 'rxjs/operators';
import { CurrentActivitySum } from '../../team-efficiency-core/models/interfaces';

@Injectable()
export class TeamWidgetService {
    constructor(private http: HttpClient, private appConfig: AppConfig) { }

    public getActivityYearByDepartment(user: string) {
        return this.http.get<{ data: CurrentActivitySum[] }>(this.appConfig.serviceBase
            + '/ActivityTraker/GetAllDayEventsCountByUserCurrentYear?userId=' + user).pipe(map(response => response.data));
    }
}
