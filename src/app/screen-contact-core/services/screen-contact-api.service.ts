
import {tap} from 'rxjs/operators';
import { AppConfig } from '../../core';

import { GetSearchFieldsRequest,
     SearchAllContactsRequest,
      SearchFileContactsRequest,
       MattersForContactRequest,
       DeleteContactRequest,
       RemoveContactFromFileRequest,
       UnlinkContactRequest,
       SaveContactSearchFieldsRequest } from '../models/screen-contact-request';

import { GetSearchFieldsReponse,
     ContactSearchResponse,
     MattersForContactResponse,
     ContactScreenResponse,
     UnlinkContactResponse } from '../models/contact-screen-response';

import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ScreenContactAPIService {

    constructor(private http: HttpClient, private appConfig: AppConfig) { }

    public getContactSearchFields(request: GetSearchFieldsRequest) {
        return this.http.get<GetSearchFieldsReponse>(this.appConfig.serviceBase +
            '/Contacts/GetContactSearchFields?' + request.queryString());
    }

    public searchAllContacts(request: SearchAllContactsRequest) {
        const data = this.http.get<ContactSearchResponse>(this.appConfig.serviceBase +
             '/Contacts/ContactsSearchByType?' + request.queryString());
        return data;
    }

    public searchContactsOnFile(request: SearchFileContactsRequest) {
        return this.http.get<ContactSearchResponse>(this.appConfig.serviceBase + '/Contacts/ContactsOnfile?' + request.queryString());
    }

    public getMattersForContact(request: MattersForContactRequest) {
        // return this.http.get<MattersForContactResponse>(this.appConfig.serviceBase +
        //     `/WorkFlow/GetContactMatters?${request.queryString()}`);

        return this.http.post<MattersForContactResponse>(this.appConfig.serviceBase + `/WorkFlow/GetContactMatters`, {
            contactId : request.contactId,
            dataSourceRequestViewModel:
            {
                take: 0,
                skip: 0,
                sort: [],
                filter: null,
                aggregators: null,
            }
        }).pipe(tap(() => {

        }));


    }

    public deleteContact(request: DeleteContactRequest) {
        return this.http.get<ContactScreenResponse>(this.appConfig.serviceBase + `/Contacts/DeleteContact?${request.queryString()}`);
    }

    public removeContactFromFile(request: RemoveContactFromFileRequest) {
        return this.http.post<ContactScreenResponse>(this.appConfig.serviceBase +
            `/Contacts/DeleteContactFromFile`, request.toPost());
    }

    public saveContactSearchFields(request: SaveContactSearchFieldsRequest) {
        return this.http.post<ContactScreenResponse>(this.appConfig.serviceBase + `/Contacts/SaveContactSearchFields`, request.toPost());
    }
}
