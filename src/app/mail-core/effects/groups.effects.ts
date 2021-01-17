
import { take, filter, switchMap, catchError, map, mergeMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { MSGraphClientService } from '../services/msgraph-client.service';

import { of } from 'rxjs';

import * as Groups from '../actions/groups';
import { SelectFolder, FOLDER_SELECT } from '../actions/folders';
import { getSelectedGroupId, getSelectedConversationId, getSelectedGroup, getGroupState, getIsConversationsLoading } from '../reducers';
import { OpenMailUrlPopup } from '../../mail-item-core';
import { NewItemsRecived, NEW_MAIL_ITEMS_RECEIVED } from '../actions/items';
import { getUser } from '../../auth';

@Injectable()
export class GroupsEffects {
    constructor(private actions$: Actions, private store: Store<any>, private service: MSGraphClientService) { }

    @Effect()
    loadGroups$ = this.actions$.pipe(ofType<Groups.LoadGroupList>(Groups.LOAD_GROUP_LIST),
        mergeMap(action =>
            this.service.getjoinedGroups().pipe(
                map(data => new Groups.LoadGroupListSuccess(data)),
                catchError(error => of(new Groups.LoadGroupListFail(error))))
        ));

    @Effect()
    selectGroup$ = this.actions$.pipe(ofType<Groups.SelectGroup>(Groups.SELECT_GROUP),
        map(action => new Groups.LoadConversations({ id: action.payload.id, currentCount: 0, isConversationsLoading: false })));

    @Effect()
    loadMoreConversations$ = this.actions$.pipe(ofType<Groups.LoadMoreConversations>(Groups.LOAD_MORE_CONVERSATIONS),
        switchMap(action =>
            this.store.select(getIsConversationsLoading).pipe(take(1), map(loading => ({ loading, action })))
        ),
        filter(({ loading, action }) => !loading && action.payload.currentCount >= 0),
        map(({ loading, action }) =>
            new Groups.LoadConversations({
                id: action.payload.id, currentCount: action.payload.currentCount, isConversationsLoading: loading
            })));

    @Effect()
    selectGroupMembers$ = this.actions$.pipe(ofType<Groups.SelectGroup>(Groups.SELECT_GROUP),
        map(action => new Groups.LoadMembers(action.payload)));
    @Effect()
    loadMembers$ = this.actions$.pipe(ofType<Groups.LoadMembers>(Groups.LOAD_MEMBERS),
        mergeMap(action =>
            this.service.loadMembers(action.payload.id).pipe(
                map(data => new Groups.LoadMembersSuccess({ members: data.members, owners: data.owners, groupId: action.payload.id })),
                catchError(error => of(new Groups.LoadMembersFail(error))))
        ));
    @Effect()
    deleteConversation$ = this.actions$.pipe(ofType<Groups.DeleteConversation>(Groups.DELETE_CONVERSATION),
        mergeMap(action =>
            this.service.deleteConversation(action.payload.groupsId, action.payload.id).pipe(
                map(data => new Groups.DeleteConversationSuccess(action.payload)),
                catchError(error => of(new Groups.DeleteConversationFail(error))))
        ));
    @Effect()
    loadConversations$ = this.actions$.pipe(ofType<Groups.LoadConversations>(Groups.LOAD_CONVERSATIONS),
        switchMap(action =>
            this.store.select(getGroupState).pipe(take(1), map(state => ({ state, action })))
        ),
        filter(({ state, action }) => !action.payload.isConversationsLoading &&
            (state.totalConversations < 0 || action.payload.currentCount < state.totalConversations)),
        mergeMap(({ state, action }) =>
            this.service.getConversations(action.payload.id, action.payload.currentCount, state.itemPerPage).pipe(
                map(data => new Groups.LoadConversationsSuccess({
                    groupId: action.payload.id, conversations: data.value, totalCount: data.count, currentCount: action.payload.currentCount
                })),
                catchError(error => of(new Groups.LoadConversationsFail(error))))
        ));
    @Effect()
    loadConversationsSuccess$ = this.actions$.pipe(ofType<Groups.LoadConversationsSuccess>(Groups.LOAD_CONVERSATIONS_SUCCESSS),
        filter(action => action.payload.currentCount === 0),
        switchMap(action =>
            this.store.select(getSelectedConversationId).pipe(take(1))
        ),
        filter(conversationId => !!conversationId),
        map(conversationId => new Groups.SelectConversation({ id: conversationId })));

    @Effect()
    selectFolder$ = this.actions$.pipe(ofType<SelectFolder>(FOLDER_SELECT),
        map(action => new Groups.ChangeGroupMode({ isGroupMode: false })));

    @Effect()
    selectConversation$ = this.actions$.pipe(ofType<Groups.SelectConversation>(Groups.SELECT_CONVERSATION),
        map(action => new Groups.LoadConversationPosts(action.payload)));

    @Effect()
    loadConversationPosts$ = this.actions$.pipe(ofType<Groups.LoadConversationPosts>(Groups.LOAD_CONVERSATION_POSTS),
        switchMap(action =>
            this.store.select(getSelectedGroupId).pipe(take(1), map(groupId => ({ groupId, action })))
        ), mergeMap(({ groupId, action }) =>
            this.service.getPosts(action.payload.id, groupId).pipe(
                map(data => new Groups.LoadConversationPostsSuccess({ conversationId: action.payload.id, posts: data })),
                catchError(error => of(new Groups.LoadConversationPostsFail(error))))
        ));
    @Effect()
    createForwardAndPopup$ = this.actions$.pipe(ofType<Groups.CreateForwardAndPopup>(Groups.CREATE_FORWARD_AND_POPUP),
        switchMap(action =>
            this.service.mailItemServies.createForward(action.payload.id).pipe(
                map(data => new OpenMailUrlPopup({ owner: 'me', itemId: data.id, token: 'postItem' })),
                catchError(error => of()))
        ));
    @Effect()
    deletePost$ = this.actions$.pipe(ofType<Groups.DeletePost>(Groups.DELETE_POST),
        switchMap(action =>
            this.service.mailItemServies.deleteMailItem(action.payload.id, 'me').pipe(
                map(data => new Groups.DeletePostSuccess({ conversationId: action.payload.conversationId, id: action.payload.id })),
                catchError<any, any>(error => {
                    if (error && error.status === 404) {
                        return of(new Groups.DeletePostSuccess({ conversationId: action.payload.conversationId, id: action.payload.id }));
                    }
                    return of(new Groups.DeletePostFail(error));
                }))
        ));
    @Effect()
    newItemsRecived$ = this.actions$.pipe(ofType<NewItemsRecived>(NEW_MAIL_ITEMS_RECEIVED),
        switchMap(action =>
            this.store.select(getSelectedGroup).pipe(take(1), map(group => ({ group, action })))
        ),
        filter(({ group, action }) => {
            if (!group) {
                return false;
            }
            if ((action.payload.item.toRecipients && action.payload.item.toRecipients
                .find(val => val.emailAddress.address.toLowerCase() === group.data.EmailAddress.toLowerCase())) ||
                (action.payload.item.ccRecipients && action.payload.item.ccRecipients
                    .find(val => val.emailAddress.address.toLowerCase() === group.data.EmailAddress.toLowerCase())) ||
                (action.payload.item.bccRecipients && action.payload.item.bccRecipients
                    .find(val => val.emailAddress.address.toLowerCase() === group.data.EmailAddress.toLowerCase())) ||
                (action.payload.item.sender &&
                    action.payload.item.sender.emailAddress.address.toLowerCase() === group.data.EmailAddress.toLowerCase()) ||
                (action.payload.item.from &&
                    action.payload.item.from.emailAddress.address.toLowerCase() === group.data.EmailAddress.toLowerCase())
            ) {
                if (action.payload.wellKnownName === 'inbox' || action.payload.wellKnownName === 'sentitems') {
                    return true;
                }

            }
            return false;
        }),
        map(({ group, action }) => new Groups.SelectGroup({ id: group.data.id })));
    @Effect()
    getGroup$ = this.actions$.pipe(ofType<Groups.GetGroup>(Groups.GET_GROUP),
        filter(action => !!action.payload.id),
        switchMap(action =>
            this.service.getGroup(action.payload.id).pipe(
                map(data => new Groups.GetGroupSuccess(data)),
                catchError(error => of(new Groups.GetGroupFail(error))))
        ));
    @Effect()
    editGroup$ = this.actions$.pipe(ofType<Groups.SaveGroup>(Groups.SAVE_GROUP),
        filter(action => !!action.payload.id),
        switchMap(action =>
            this.service.editGroup(action.payload)
                .map(data => new Groups.SaveGroupSuccess(data))
                .catch(error => of(new Groups.SaveGroupFail(error)))
        ));
    @Effect()
    addGroup$ = this.actions$.pipe(ofType<Groups.SaveGroup>(Groups.SAVE_GROUP),
        filter(action => !action.payload.id),
        switchMap(action =>
            this.store.select(getUser).pipe(take(1), map(user => ({ user, action })))),
        switchMap(({ user, action }) => {
            action.payload['members@odata.bind'] = [`https://graph.microsoft.com/v1.0/users/${user.profile.upn}`];
            return this.service.createGroup(action.payload)
                .map(data => new Groups.SaveGroupSuccess(data))
                .catch(error => of(new Groups.SaveGroupFail(error)));
        }
        ));
}
