import { ContactRequest } from '../models/contact-core-request';
import { ContactResponse } from '../models/interface';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ContactService {

    constructor(private http: HttpClient) { }

    public getContact(request: ContactRequest) {
        if (request.filterOptions.SearchText) {
            return this.http.get<ContactResponse>('assets/contact.json');
        } else {
            return this.http.get<ContactResponse>('assets/contact.json');
        }
    }

    public getContactFilter(serchText: string) {

    }

}
