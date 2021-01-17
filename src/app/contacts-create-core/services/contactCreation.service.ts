
import {map} from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfig } from '../../core';

@Injectable()
export class ContactCreationService {
    constructor(private http: HttpClient, private appConfig: AppConfig) { }

    public getContactById(contactId: number) {
        return this.http.get<any>(`${this.appConfig.serviceBase}/Contacts/GetContactDetailsById?contactId=${contactId}`).pipe(
            map(responce => responce.data));
    }

    public getContactType(appId: number) {
        const pram = appId === 0 ? '' : `$contactId=${appId}`;
        return this.http.get<any>(`${this.appConfig.serviceBase}/Contacts/GetContactTypesBaseForApp${pram}`).pipe(
            map(responce => responce.data));
    }

}
