
import {map} from 'rxjs/operators';
import { CaseContactRequest, MainContactRequest, ScreensContactTypeRequest } from '../models/case-contact-request';
import { CaseContactResponse } from '../models/interface';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../../core';

@Injectable()
export class CaseContactService {

    constructor(private http: HttpClient, private appConfig: AppConfig) { }

    public getCaseContactData(request: CaseContactRequest | MainContactRequest) {
        if (request instanceof MainContactRequest) {
            return this.http.post<CaseContactResponse>(this.appConfig.serviceBase + '/Contacts/ContactsSearch', request.toPost());
        } else {
            return this.http.post<CaseContactResponse>(this.appConfig.serviceBase + '/Contacts/GetContacts', request.toPost());
        }
    }


    public getContactTypeScreensLoad(request: ScreensContactTypeRequest) {
        return this.http.post<any>(this.appConfig.serviceBase
            + '/Contacts/GetAllContactScreens', request.toPost()).pipe(map((data) => {
                return data.data.data;
            }));
    }


}
