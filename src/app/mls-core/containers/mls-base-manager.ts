import { Store } from '@ngrx/store';
import { InitMls, ChangeUser, SendMessage, LoadMore, MLSRefresh, ChangeCanViewMilestone, AddUser } from '../actions/core';
import { MatterInfo } from './../../core/lib/matter';
import {
    getIsChatListLoading, getCaseUsersByToken, getIsChatMessageLoadingByToken,
    getMessageListByToken, getSelectedUserByToken, getIsSendingByToken, hasNotLoadedItemByToken
} from '../reducers';
import { MLSUser } from './../../core/lib/mls';
import { Observable } from 'rxjs';
import { getUser, User } from '../../auth';

export class MlsBaseManager {

    isChatListLoading$: any;
    users$: Observable<MLSUser[]>;
    isChatMessageLoading$: any;
    messages$: any;
    selectedUser$: any;
    user$: Observable<User>;
    isSending$: any;
    notLoadedItem$: any;
    constructor(protected store: Store<any>) {
    }

    initMLS(token: string, matterInfo: MatterInfo) {
        this.store.dispatch(new InitMls(token, { matterData: matterInfo }));
        this.isChatListLoading$ = this.store.select(getIsChatListLoading(token));
        this.users$ = this.store.select(getCaseUsersByToken(token));
        this.isChatMessageLoading$ = this.store.select(getIsChatMessageLoadingByToken(token));
        this.messages$ = this.store.select(getMessageListByToken(token));
        this.selectedUser$ = this.store.select(getSelectedUserByToken(token));
        this.user$ = this.store.select(getUser);
        this.isSending$ = this.store.select(getIsSendingByToken(token));
        this.notLoadedItem$ = this.store.select(hasNotLoadedItemByToken(token));
    }

    onSelectUser(token: string, user: MLSUser) {
        this.store.dispatch(new ChangeUser(token, { user: user }));
    }

    onSendMessage(token: string, msg: string) {
        this.store.dispatch(new SendMessage(token, { msg: msg }));
    }
    onLoadMore(token: string) {
        this.store.dispatch(new LoadMore(token));
    }
    refresh(token) {
        this.store.dispatch(new MLSRefresh(token));
    }
    onChangeCanViewMilestone(token) {
        this.store.dispatch(new ChangeCanViewMilestone(token));
    }
    onAddUser(token: string, event) {
        this.store.dispatch(new AddUser(token, event));
    }
}
