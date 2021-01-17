import { Store } from '@ngrx/store';
import { getIsExpanded, getIsGroupMode, getSelectedGroup, getGroupsByOrder } from '../reducers';
import { GroupsToggle, SelectGroup } from '../actions/groups';

export class BaseGroupManager {
    groups$;
    isExpanded$;
    isGroupMode$;
    selectedGroup$;
    constructor(protected store: Store<any>) {
        this.groups$ = this.store.select(getGroupsByOrder);
        this.isExpanded$ = this.store.select(getIsExpanded);
        this.isGroupMode$ = this.store.select(getIsGroupMode);
        this.selectedGroup$ = this.store.select(getSelectedGroup);
    }
    onGroupsToggle() {
        this.store.dispatch(new GroupsToggle());
    }
    onSelectGroup(event) {
        this.store.dispatch(new SelectGroup({ id: event }));
    }
}
