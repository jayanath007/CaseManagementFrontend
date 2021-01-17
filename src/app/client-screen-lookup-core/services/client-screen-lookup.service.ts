
import {map, tap} from 'rxjs/operators';
import { LookupList } from '../../core/lib/screen-edit';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfig, LookupViewModel, DPSResponse } from '../../core';

@Injectable()
export class ClientScreenLookupService {

    constructor(private http: HttpClient, private appConfig: AppConfig) { }

    public getScreenLookupList(lookupTypeTag: string) {
        return this.http.get<DPSResponse<LookupViewModel>>(this.appConfig.serviceBase +
            '/Lookup/GetLookupType?lookupTypeTag=' + lookupTypeTag).pipe(
            tap(response => console.log('GetLookupList', response)),
            map(response => response.data),);
    }

    public lookupDataSubmit(postRequest: LookupViewModel) {

        return this.http.post<any>(this.appConfig.serviceBase + '/Lookup/InsertUpdateOrDeleteLookupType',
            { deletedLookupIds: [], updatedLookupViewTypeModel: postRequest }).pipe(
            map(response => response),
            tap(response => console.log('save', response.status)),);
    }

    public deleteScreenLookup(lookupID: number) {
        return this.http.get<DPSResponse<any>>(this.appConfig.serviceBase + '/Lookup/DeleteLookup?lookUpId=' + lookupID);
    }

}
