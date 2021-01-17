
import { filter, map, catchError, switchMap, take, mergeMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';






import { ContactsAndPeopleService } from '../services/contacts-and-people.service';
import * as People from '../actions/people';
import { getPeople } from '../reducers';
import { AuthInfoStateService, getUser } from '../../auth';

@Injectable()
export class PeopleEffects {
    constructor(private actions$: Actions, private store: Store<any>, private service: ContactsAndPeopleService,
        private authHelper: AuthInfoStateService) { }

    @Effect()
    loadPeoples$ = this.actions$.pipe(ofType<People.LoadPeople>(People.LOAD_PEOPLE),
        switchMap((action) =>
            this.store.select(getPeople).pipe(take(1), map((people) => people && people.length > 0))
        ),
        filter((hasPeople) => !hasPeople),
        switchMap((action) =>
            this.store.select(getUser).pipe(
                filter(user => !!(user.profile && user.profile.upn)),
                take(1),
                map((user) => user.profile.upn.replace(/.*@/, ''))
            )
        ),
        mergeMap((domain) =>
            this.service.getPeoples(domain).pipe(
                map(data => new People.PeopleLoadSucess({ people: data })),
                catchError(error => of(new People.PeopleLoadFail())))
        ));
    @Effect()
    searchUsers$ = this.actions$.pipe(ofType<People.SearchUsers>(People.SEARCH_USERS),
        filter(() => !this.authHelper.isGoogle()),
        switchMap((action) =>
            this.service.searchUsers(action.payload.text).pipe(
                map(data => new People.SearchUsersSucess({ text: action.payload.text, people: data })),
                catchError(error => of(new People.SearchUsersFail({ error: error, text: action.payload.text }))))
        ));

}
