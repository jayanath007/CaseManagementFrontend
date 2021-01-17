
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { AppConfig } from '../../core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BillingNarrativesSaveRequestViewModel } from '../models/interfaces';

@Injectable()
export class BillingNarrativeService {

    constructor(private http: HttpClient, private appConfig: AppConfig) {

    }

    public getNarrativeGroupInfo(): Observable<any> {
        return this.http.get<any>(this.appConfig.serviceBase + '/BillingRequest/GetNarrativeGroupsOrderByNameAsync').pipe(
            map(response => response.data));
    }

    // public getNarrativeItemInfo(): Observable<any> {
    // return this.http.get<any>(this.appConfig.serviceBase + '/BillingRequest/GetNarrativeGroupsOrderByNameAsync').pipe(
    //     map(response => response.data));
    // }

    public getNarrativeItemInfoById(groupId: number): Observable<any> {
        return this.http.post<any>(this.appConfig.serviceBase +
            '/BillingRequest/GetNarrativeItemsOrderByDescriptionAsync', groupId).pipe(
                map(response => response.data));


    }


    public saveUpdateNarrativeData(info) {
        return this.http.post<any>(`${this.appConfig.serviceBase}/BillingRequest/SaveUpdateNarrativesAsync`,
            {
                narrativeGroupId: info.narrativeGroupId,
                narrativeGroupDescription: info.narrativeGroupDescription,
                narrativeItemId: info.narrativeItemId,
                narrativeItemGroupId: info.narrativeItemGroupId,
                narrativeItemDescription: info.narrativeItemDescription,
                narrativeItemText: info.narrativeItemText
            }
        );
    }


    public deleteSelectedNarrativeItem(narraiveItemId: number) {
        return this.http.post<any>(this.appConfig.serviceBase +
            '/BillingRequest/DeleteNarrativeItemAsync', [narraiveItemId]).pipe(
                map(response => response.data));


    }

    public deleteSelectedGroup(narrativeGroupId: number) {
        return this.http.post<any>(this.appConfig.serviceBase +
            '/BillingRequest/DeleteGroupItemAsync', [narrativeGroupId]).pipe( map(response => response.data));
    }


}
