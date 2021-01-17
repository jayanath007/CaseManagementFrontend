import { Store } from '@ngrx/store';
import { GetUsersWithFileSecurityRights, HasRightsChange, ChangeUsersWithFileSecurityRights } from '../actions/core';
import { getIsLoading, getUsers, getOriginalUsers } from '../reducers';

export class BaseFileSecurityRightsManager {
    public isLoading$;
    public users$;
    public originalUsers$;
    constructor(protected store: Store<any>) {

    }
    initSelectors(matterId: number) {
        this.store.dispatch(new GetUsersWithFileSecurityRights(matterId));
        this.isLoading$ = this.store.select(getIsLoading);
        this.users$ = this.store.select(getUsers);
        this.originalUsers$ = this.store.select(getOriginalUsers);
    }
    onHasRightsChange(event) {
        this.store.dispatch(new HasRightsChange(event));
    }
    onChangeUsers(event) {
        this.store.dispatch(new ChangeUsersWithFileSecurityRights(event));
    }
}
