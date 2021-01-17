
import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../../core';
import { UserWithRights } from '../models/interface';

@Injectable()
export class FileSecurityRightsService {

    constructor(private http: HttpClient, private appConfig: AppConfig) {
    }
    public getUsersWithFileSecurityRights(matterId: number) {
        return this.http.get<any>(this.appConfig.serviceBase + '/Matters/GetAllUsersWithFileSecurityRights?MatterId=' + matterId).pipe(
            map(response => {
                return response.data;
            }));
    }

    public changeUsersWithFileSecurityRights(matterId: number, userListWithRights: UserWithRights[]) {
        return this.http.post<any>(this.appConfig.serviceBase + '/Matters/ChangeUsersFileSecurityRights', {
            matterId: matterId,
            userWithFileSecurityRightViewModel: userListWithRights
        }).pipe(
            map(response => {
                return response.data;
            }));
    }
}
