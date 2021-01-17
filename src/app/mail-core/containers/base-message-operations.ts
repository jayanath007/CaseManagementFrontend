import { Store } from '@ngrx/store';
import {
    ClearViewingItem, EnsureViewChange, ViewPreviousItem,
    ViewNextItem, CheckItem, ViewItem
} from '../actions/items';

import { MessageListActions } from '../models/enums';
import { OpenEmailAttachemnt } from '../../document-view';

import {
    DeleteItems, FlagItems, ReadUnreadItems, MeetingResponse, DownloadAttachment,
    CreateReplyForward, NewMailWithItemAttachment, MoveItems, SetAutoReadItemId
} from '../../mail-item-core/actions/item';


import { MessageItemWrapper } from '../../mail-item-core';

export class BaseMessageOperations {
    constructor(protected store: Store<any>) { }

    public viewItem(item: MessageItemWrapper, viewId: string) {
        this.store.dispatch(new ViewItem({ item: item, viewId: viewId }));
    }

    public ensureItemViewChanges(changes: { kind: MessageListActions, value: any }[], viewId: string) {
        this.store.dispatch(new EnsureViewChange({ changes, viewId }));
    }

    public onItemCheck(item) {
        this.store.dispatch(new CheckItem({ item: item }));
    }

    public onItemsReadUnread({ items, isRead }) {
        this.store.dispatch(new ReadUnreadItems({ items: items, isRead: isRead }));
    }

    public onItemsFlag({ items, flag }) {
        this.store.dispatch(new FlagItems({ items: items, flag: flag }));
    }

    public onItemsDelete({ items, deleteOnlyList }) {
        this.store.dispatch(new DeleteItems({ items: items, deleteOnlyList: deleteOnlyList === true }));
    }

    viewNext(item: MessageItemWrapper) {
        this.store.dispatch(new ViewNextItem({ item }));
    }

    viewPrevious(item: MessageItemWrapper) {
        this.store.dispatch(new ViewPreviousItem({ item }));
    }

    clearViewingItem(item?: MessageItemWrapper) {
        this.store.dispatch(new ClearViewingItem({ item: item }));
    }

    onItemDelete({ item, deleteOnlyList }) {
        this.store.dispatch(new DeleteItems({ items: [item], deleteOnlyList: deleteOnlyList === true }));
    }

    onItemReadUnread({ item, isRead }) {
        this.store.dispatch(new ReadUnreadItems({ items: [item], isRead: isRead }));
    }
    onSetAutoReadItemId(event) {
        this.store.dispatch(new SetAutoReadItemId({ itemId: event }));
    }

    onItemFlag({ item, flag }) {
        this.store.dispatch(new FlagItems({ items: [item], flag: flag }));
    }

    onMeetingResponse({ item, comment, sendResponse, type }) {
        this.store.dispatch(new MeetingResponse({ item: item, comment: comment, sendResponse: sendResponse, type: type }));
    }

    onDownloardFileAttachment({ owner, itemId, attachment, type }) {
        this.store.dispatch(new DownloadAttachment({ owner, itemId, attachment, type, isEmail: true }));
    }
    onMoveToFolder({ items, folderId, owner }) {
        this.store.dispatch(new MoveItems({ items, folderId, owner }));
    }
    // onOpenUrlPoup(item) {
    //     this.store.dispatch(new OpenMailUrlPopup({ itemId: item.data.id, token: 'mailItem' }));
    // }

    replyForward({ item, type, token }) {
        this.store.dispatch(new CreateReplyForward({ item, type, token }));
    }
    attachToNewMail(attachments, token, type) {
        this.store.dispatch(new NewMailWithItemAttachment({ token: token, attachments: attachments, type: type }));
    }

    openAttachemnt({ item, attachment }) {
        this.store.dispatch(new OpenEmailAttachemnt({
            owner: item.owner,
            itemId: item.data.id,
            attachement: attachment,
            isEmail: true
        }));
    }

}
