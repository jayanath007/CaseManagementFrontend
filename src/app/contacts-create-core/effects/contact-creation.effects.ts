
import {map, switchMap, catchError, take} from 'rxjs/operators';
import { of } from 'rxjs';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { ContactCreationService } from '../services/contactCreation.service';
import * as Core from '../actions/core';
import { getSelectedContactByToken } from '../reducers';

@Injectable()
export class ContactCreationEffects {
    constructor(
        private actions$: Actions,
        private store: Store<any>, private service: ContactCreationService
    ) { }

    @Effect()
    init$ = this.actions$.pipe(ofType<Core.InitContactCreation>(Core.INIT_CONTACT_CREATION),
        map(action => new Core.GetContactType(action.token)));


    @Effect()
    getContacType$ = this.actions$.pipe(ofType<Core.GetContactType>(Core.GET_CONTACT_TYPE),
        switchMap(action =>
            this.store.select(getSelectedContactByToken(action.token)).pipe(
                map(contact => ({ contact: contact, token: action.token })),

                take(1),
                switchMap(info =>
                    this.service.getContactType(info.contact.appId)),
                map(responce => new Core.GetContactTypeSuccess(action.token, { types: responce })),
                catchError(e => of(new Core.GetContactTypeFail(action.token))),)
        ));

    @Effect()
    getContactById$ = this.actions$.pipe(ofType<Core.ChangeContact>(Core.CHANGE_CONTACT),
        switchMap(action =>
            this.service.getContactById(action.payload.contactId).pipe(
                map((result) => new Core.ChangeContactSuccess(action.token, { details: result })),
                catchError((error) => of(new Core.ChangeContactFail(action.token))),)
        ));
}
