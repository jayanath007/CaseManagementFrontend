import { Store } from '@ngrx/store';
import { getPeople, getSearchedPeople } from '../reducers';
import { AddPerson, SearchUsers, LoadPeople } from '../actions/people';
import { Person } from '../../core/lib/microsoft-graph';
import { AuthInfoStateService } from '../../auth';
export class BaseRecipientInputManager {
    constructor(protected store: Store<any>, protected authHelper: AuthInfoStateService) {
        this.store.dispatch(new LoadPeople());
    }
    getPeople() {
        return this.store.select(getPeople);
    }
    getSearchedUsers() {
        return this.store.select(getSearchedPeople);
    }
    searcheUsers(text: string) {
        return this.store.dispatch(new SearchUsers({ text: text }));
    }
    addPerson(person: Person) {
        return this.store.dispatch(new AddPerson({ person: person }));
    }
}
