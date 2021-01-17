import { Store } from '@ngrx/store';
import { getAddEditGroup, getIsGroupSaving, getIsGroupSaved } from '../reducers';
import { GetGroup, UpdateAddEditGroup, SaveGroup } from '../actions/groups';
import { Group } from '../../core/lib/microsoft-graph';

export class BaseAddEditGroupManager {
    group$;
    isGroupSaving$;
    isGroupSaved$;
    constructor(protected store: Store<any>) {
    }
    onInit(groupId: string) {
        this.store.dispatch(new GetGroup({ id: groupId }));
        this.group$ = this.store.select(getAddEditGroup);
        this.isGroupSaving$ = this.store.select(getIsGroupSaving);
        this.isGroupSaved$ = this.store.select(getIsGroupSaved);
    }
    onValueChange(event) {
        this.store.dispatch(new UpdateAddEditGroup(event));
    }
    onSaveGroup(group: Group) {
        this.store.dispatch(new SaveGroup(group));
    }
}
