import { Store } from '@ngrx/store';
import { getPeople, getSearchedPeople } from '../reducers';
import { SearchUsers } from '../actions/people';
export class BaseSearchMailFromListManager {
    public people$: any;
    public searcheUsers$: any;
    constructor(protected store: Store<any>) {
    }
    getPeople() {
        this.people$ = this.store.select(getPeople);
    }
    getSearchedUsers() {
        this.searcheUsers$ = this.store.select(getSearchedPeople);
    }
    searcheUsers(text: string) {
        return this.store.dispatch(new SearchUsers({ text: text }));
    }
}
