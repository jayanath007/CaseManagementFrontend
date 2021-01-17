
import {map, switchMap, catchError} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';;
import { of } from 'rxjs';
import * as Core from '../actions/core';
import { FileSecurityRightsService } from '../servicers/file-security-rights.service';


@Injectable()
export class FileSecurityRightsEffects {
    constructor(private actions$: Actions, private service: FileSecurityRightsService) { }

    @Effect()
    getUsersWithFileSecurityRights$ = this.actions$.pipe(ofType<Core.GetUsersWithFileSecurityRights>(Core.GET_USERS_WITH_FILE_SECURITY_RIGHT),
        switchMap((action) => {
            return this.service.getUsersWithFileSecurityRights(action.payload).pipe(
                map((result) => new Core.GetUsersWithFileSecurityRightsSuccess(result)),
                catchError((error) => {
                    return of(new Core.GetUsersWithFileSecurityRightsFail(error));
                }),);
        }));

    @Effect()
    changeUsersWithFileSecurityRights$ = this.actions$.pipe(ofType<Core.ChangeUsersWithFileSecurityRights>
        (Core.CANGE_USERS_WITH_FILE_SECURITY_RIGHT),
        switchMap((action) => {
            return this.service.changeUsersWithFileSecurityRights(action.payload.matterId, action.payload.userListWithRights).pipe(
                map((result) => new Core.ChangeUsersWithFileSecurityRightsSuccess()),
                catchError((error) => {
                    return of(new Core.ChangeUsersWithFileSecurityRightsFail(error));
                }),);
        }));
}
