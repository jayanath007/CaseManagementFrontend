
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../../core';
import { ColumnFolderRequest } from '../models/request';
import { Observable } from 'rxjs';
import { DiaryFolder } from '../models/interfaces';


@Injectable()
export class DiaryFolderService {
    constructor(private http: HttpClient, private appConfig: AppConfig) { }

    public getFolders(appId: number): Observable<DiaryFolder[]> {
        return this.http.get<any>(`${this.appConfig.serviceBase}/Diary/GetFoldersAsync?appId=` + appId).pipe(
            map(responce => responce.data));
    }
    public saveFolders(request: ColumnFolderRequest) {
        return this.http.post<any>(`${this.appConfig.serviceBase}/Diary/AddUpdateDiaryColumnFolders`, request.toPost()).pipe(
            map(responce => responce.data));
    }

    public saveTreeData(request: ColumnFolderRequest) {
        return this.http.post<any>(`${this.appConfig.serviceBase}/Diary/AddUpdateDiaryColumnFolders`, request.toPost()).pipe(
            map(responce => responce.data));
    }



}
