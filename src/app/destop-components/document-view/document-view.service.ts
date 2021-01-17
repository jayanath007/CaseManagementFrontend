import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class DocumentViewService {
    constructor(private http: HttpClient) { }


    editeUrl = 'https://stackoverflow.com/questions/3142837/capture-iframe-load-complete-event';

    public getFilehistory(request: any) {

    }
}
