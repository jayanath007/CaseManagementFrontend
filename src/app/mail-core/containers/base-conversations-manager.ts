import { Store } from '@ngrx/store';
import { AuthInfoStateService } from '../../auth';
import { getSelectedGroup, getConversationsByOrder, getIsConversationsLoading, getSelectedConversation } from '../reducers';
import { SelectConversation, DeleteConversation, LoadMoreConversations } from '../actions/groups';

export class BaseConversationsManager {
    selectedGroup$;
    conversations$;
    isConversationsLoading$;
    selectedconversation$;
    user$;
    constructor(protected store: Store<any>, public service: AuthInfoStateService) {
        this.selectedGroup$ = store.select(getSelectedGroup);
        this.conversations$ = store.select(getConversationsByOrder);
        this.isConversationsLoading$ = store.select(getIsConversationsLoading);
        this.selectedconversation$ = store.select(getSelectedConversation);
    }
    protected getUser() {
        return this.service.getUser();
    }
    onConversationSelect(event) {
        this.store.dispatch(new SelectConversation({ id: event }));
    }
    onConversationDelete(event) {
        this.store.dispatch(new DeleteConversation(event));
    }
    onLoadMoreConversations(event) {
        this.store.dispatch(new LoadMoreConversations(event));
    }
}
