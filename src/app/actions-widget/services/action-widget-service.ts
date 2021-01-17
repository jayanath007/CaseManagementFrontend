import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../../core';
import { PDFBundleHeaderViewModel } from './../../core/lib/bundle';

@Injectable()
export class ActionWidgetService {
    constructor(private http: HttpClient, private appConfig: AppConfig) { }

    public getBundleMonitorList(itemFor: string, bundleId: number) {
        return this.http.get<{ data: PDFBundleHeaderViewModel[] }>(this.appConfig.serviceBase2 +
            `/PDFBundle/GetBundleMonitorList?upToDate=${itemFor}&bundleID=${bundleId}`).pipe(
                map(response => response.data));
    }
}
