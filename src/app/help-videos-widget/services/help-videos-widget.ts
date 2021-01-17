import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../../core';
import { map } from 'rxjs/operators';
import { UrlData } from '../models/interfaces';

@Injectable()
export class HelpVideosWidgetService {
    constructor(private http: HttpClient, private appConfig: AppConfig) { }

    public getCountrySideUrlsWidget() {
        return this.http.get<{ data: UrlData[] }>(this.appConfig.serviceBase
            + '/Dashboard/GetCountrySideUrls').pipe(map(response => response.data));
    }
}
