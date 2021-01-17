import { Store } from '@ngrx/store';
import { getSelectedConversation, getSelectedGroup } from '../reducers';
import { getUser, User } from '../../auth';
import { OpenMailUrlPopup, DownloadAttachment } from '../../mail-item-core';
import { OpenEmailAttachemnt } from '../../document-view';
import { CreateForwardAndPopup, DeletePost } from '../actions/groups';
import { Observable } from 'rxjs/internal/Observable';

export class BasePostsManager {
    selectedConversation$;
    selectedGroup$;
    user$: Observable<User>;
    constructor(protected store: Store<any>) {
        this.selectedConversation$ = store.select(getSelectedConversation);
        this.selectedGroup$ = store.select(getSelectedGroup);
        this.user$ = store.select(getUser);
    }
    onOpenUrlPoup(event) {
        this.store.dispatch(new OpenMailUrlPopup({ owner: 'me', itemId: event, token: 'postItem' }));
    }
    onDownloardFileAttachment({ itemId, attachment, type }) {
        this.store.dispatch(new DownloadAttachment({ owner: 'me', itemId, attachment, type }));
    }
    openAttachemnt({ itemId, attachment }) {
        this.store.dispatch(new OpenEmailAttachemnt({
            owner: 'me',
            itemId: itemId,
            attachement: attachment
        }));
    }
    onForward(event) {
        this.store.dispatch(new CreateForwardAndPopup({ id: event }));
    }
    onDeleteReply(event) {
        this.store.dispatch(new DeletePost(event));
    }
}
