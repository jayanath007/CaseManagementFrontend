
import {catchError, tap, map, switchMap, filter, mergeMap, take} from 'rxjs/operators';
import {
    getContactByToken, getContactHashByToken, getContactGridDataByToken,
    getIsDataLoadedByToken
} from '../reducers';
import { ContactRequest } from '../models/contact-core-request';
import { combineLatest ,  of } from 'rxjs';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';;
import * as ContactCore from '../actions/core';
import { ContactService } from '../services/contact-core.service';



@Injectable()
export class ContactEffects {
    constructor(private actions$: Actions, private store: Store<any>, private service: ContactService) { }

    @Effect()
    initNewView$ = this.actions$.pipe(ofType<ContactCore.InitContact>(ContactCore.INIT_CONTACT_CORE),
        tap((data) => console.log('$initNewView', data)),
        map((action) => new ContactCore.LoadContactDataWithCurrentState(action.token)),);


    @Effect()
    ContactViewChange$ = this.actions$.pipe(ofType<ContactCore.ContactViewChange>(ContactCore.CONTACT_CORE_CHANGE),
        map((action) => new ContactCore.LoadContactDataWithCurrentState(action.token)));


    @Effect()
    loadCurrentStateData$ = this.actions$.pipe(ofType<ContactCore.LoadContactDataWithCurrentState>
        (ContactCore.LOAD_CONTACT_CORE_DATA_WITH_CURRENT_STATE),
        switchMap<ContactCore.LoadContactDataWithCurrentState, { hasHash: boolean, token: string }>((action) =>
            this.store.select(getIsDataLoadedByToken(action.token)).pipe(
                map(hasHash => ({ token: action.token, hasHash: hasHash })),take(1),)
        ),
        filter((info) => !info.hasHash),
        tap((data) => {
            console.log('Effect excute', ContactCore.LOAD_CONTACT_CORE_GRID_DATA, ' ', data);
        }),
        mergeMap((action) =>
            combineLatest(this.store.select(getContactByToken(action.token)),
                this.store.select(getContactHashByToken(action.token)),
                (state, hash) => ({ state, hash })).pipe(
                map((info) =>
                    new ContactRequest({
                        BranchId: info.state ? info.state.matterInfo.BranchId : null,
                        AppId: info.state ? info.state.matterInfo.AppId : null,
                        FileId: info.state ? info.state.matterInfo.FileId : null,
                    }, {
                            Take: 0,
                            Filter: null,
                            Skip: 0,
                        },
                        info.hash)
                ),
                take(1),
                map((request) => new ContactCore.LoadContactGridData(action.token, request)),),
    ),);

    @Effect()
    loadGridData$ = this.actions$.pipe(ofType<ContactCore.LoadContactGridData>
        (ContactCore.LOAD_CONTACT_CORE_GRID_DATA),
        switchMap((action) =>
            this.service.getContact(action.request).pipe(
                // tslint:disable-next-line:max-line-length
                map((result) => new ContactCore
                    .LoadContactGridDataSuccess(action.token, { response: result, request: action.request })),
                catchError((error) => of(new ContactCore.LoadContactGridDataFail(action.token, error))),)
        ));


}






