
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../../core';
import { DataListResponce } from '../models/interfaces';

@Injectable()
export class BundleMonitorService {
    constructor(private http: HttpClient, private appConfig: AppConfig) { }

    public getBundleMonitorList(itemFor: string, bundleId: number) {
        return this.http.get<DataListResponce>(this.appConfig.serviceBase +
            `/PDFBundle/GetBundleMonitorList?upToDate=${itemFor}&bundleID=${bundleId}`).pipe(
                map(response => response.data));
    }
    public deleteInactiveBundles(bundleIds: number[]) {
        return this.http.post(this.appConfig.serviceBase + `/PDFBundle/DeleteInactiveBundles`, bundleIds);
    }
}
