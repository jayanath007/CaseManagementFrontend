import { map, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { empty, of, Observable } from 'rxjs';

import {
    getComposeItemByToken, getFollowUpTextByToken, getIsMailSavingByToken,
    getIsMailSendingByToken, getIsMailDeleteingByToken, getIsAttachmentsUplodingByToken,
    getIsAttachmentsDeletingByToken,
    getIsComposeCloseItemByToken,
    getListAttachmentsByToken,
    getLastInlineAttachmentByToken,
    getRefItemByToken,
    getIsDirtyByToken
} from '../reducers';
import {
    FlagFollowUp, SetImportance, AddToRecipient, AddCcRecipient, AddBccRecipient,
    RemoveToRecipient, RemoveCcRecipient, RemoveBccRecipient, DraftItem, DiscardItem,
    SendItem, AddAttachment,
    DownloadAttachment, DeleteAttachment, ClearComposeMail, SetSubject, OpenInUrlPopupComposeMail, SetBody
} from '../actions/compose';
import { Message, Recipient, Attachment, Importance } from '../../core/lib/microsoft-graph';
import { AttachmentType } from '../../core/lib/graph-enums';
import { AuthInfoStateService, User } from '../../auth';
import { FileUrlResolverService, OpenEmailAttachemnt } from '../../document-view';
import { CidToAttachemntUrlPipe, MsgraphClientService } from '../../organizer-desktop-shared';


export class BaseComposeMailManager {

    public composeItem$: Observable<Message>;
    public refItem$: any;
    public followUpText$: any;
    public isMailSending$: any;
    public isMailSaveing$: any;
    public isMailDeleting$: any;
    public isComposeCloseItem$: any;
    public listAttachements$: any;
    public user$: Observable<User>;
    public isAttachmentsUploding$: any;
    public isAttachmentsDeleting$: any;
    public lastInlineAttachment$: any;
    public isDirty$: any;
    constructor(protected store: Store<any>, protected service: AuthInfoStateService, protected urlResolver: FileUrlResolverService,
        protected inlineAttHandler: CidToAttachemntUrlPipe, private graphClient: MsgraphClientService) { }

    public getUser() {
        return this.service.getUser();
    }
    public getComposeMailByToken(token: string) {
        return this.store.select(getComposeItemByToken(token)).pipe(
            withLatestFrom(this.getRefMailByToken(token), (item, oldRef) => ({ item, oldRef })),
            mergeMap(({ item, oldRef }) => {
                if (item && oldRef && item.body && item.body.contentType === 'html') {
                    return this.inlineAttHandler.transform('me', item.body.content, oldRef, 'messages').pipe(
                        map((newBody) => ({ ...item, body: { ...item.body, content: newBody } })));
                } else {
                    return of(item);
                }
            }));
    }
    public getRefMailByToken(token: string) {
        return this.store.select(getRefItemByToken(token));
    }
    public getFollowUpTextByToken(token: string) {
        return this.store.select(getFollowUpTextByToken(token));
    }
    public getIsMailSendingByToken(token: string) {
        return this.store.select(getIsMailSendingByToken(token));
    }
    public getIsMailSaveingByToken(token: string) {
        return this.store.select(getIsMailSavingByToken(token));
    }
    public getIsMailDeleteingByToken(token: string) {
        return this.store.select(getIsMailDeleteingByToken(token));
    }
    public getListAttachmentsByToken(token: string) {
        return this.store.select(getListAttachmentsByToken(token));
    }
    public getIsComposeCloseItemByToken(token: string) {
        return this.store.select(getIsComposeCloseItemByToken(token));
    }
    public getIsDirtyByToken(token: string) {
        this.store.select(getIsDirtyByToken(token));
    }
    public addAttachment(token: string, item: Message, attachment: Attachment, uid: string, type: AttachmentType) {
        return this.store.dispatch(new AddAttachment(token, { item: item, attachment: attachment, uid: uid, type: type }));
    }
    onDownloardFileAttachment({ itemId, attachment, type }) {
        this.store.dispatch(new DownloadAttachment({ itemId: itemId, attachment: attachment, type }));
    }
    public deleteAttachment(token: string, itemId: string, attachmentId: string) {
        this.store.dispatch(new DeleteAttachment(token, { itemId: itemId, attachmentId: attachmentId }));
    }
    public openAttachement(itemId: string, attachment) {
        this.store.dispatch(new OpenEmailAttachemnt({ owner: 'me', itemId: itemId, attachement: attachment, isEmail: true }));
    }
    public flagFollowUp(type: string, token: string) {
        this.store.dispatch(new FlagFollowUp(token, { type: type }));
    }
    public changeImportance(importance: Importance, token: string) {
        this.store.dispatch(new SetImportance(token, { importance: importance }));
    }
    public changeSubject(subject: string, token: string) {
        this.store.dispatch(new SetSubject(token, { subject: subject }));
    }
    public changeBody(body: string, token: string) {
        this.store.dispatch(new SetBody(token, { body: body }));
    }
    public addToRecipient(recipient: Recipient, token: string) {
        this.store.dispatch(new AddToRecipient(token, { recipient: recipient }));
    }
    public addCcRecipient(recipient: Recipient, token: string) {
        this.store.dispatch(new AddCcRecipient(token, { recipient: recipient }));
    }
    public addBccRecipient(recipient: Recipient, token: string) {
        this.store.dispatch(new AddBccRecipient(token, { recipient: recipient }));
    }
    public removeToRecipient(recipient: Recipient, token: string) {
        this.store.dispatch(new RemoveToRecipient(token, { recipient: recipient }));
    }
    public removeCcRecipient(recipient: Recipient, token: string) {
        this.store.dispatch(new RemoveCcRecipient(token, { recipient: recipient }));
    }
    public removeBccRecipient(recipient: Recipient, token: string) {
        this.store.dispatch(new RemoveBccRecipient(token, { recipient: recipient }));
    }
    public draft(composeItem: { message: Message, isSuppressErrors: boolean }, token: string) {
        this.store.dispatch(new DraftItem(token, composeItem));
    }
    public openUrlPoup(composeItem, token: string) {
        this.store.dispatch(new OpenInUrlPopupComposeMail(token, { message: composeItem }));
    }
    public discard(composeItem, token: string) {
        this.store.dispatch(new DiscardItem(token, { message: composeItem }));
    }
    public send(composeItem, token: string) {
        this.store.dispatch(new SendItem(token, { message: composeItem }));
    }
    public clear(id, token: string) {
        this.store.dispatch(new ClearComposeMail(token, { itemId: id }));
    }
    public getIsAttachmentsUplodingByToken(token: string) {
        return this.store.select(getIsAttachmentsUplodingByToken(token));
    }
    public getIsAttachmentsDeletingByToken(token: string) {
        return this.store.select(getIsAttachmentsDeletingByToken(token));
    }

    public getLastInlineAttachmentByToken(token: string) {
        return this.store.select(getLastInlineAttachmentByToken(token)).pipe(
            withLatestFrom(this.getComposeMailByToken(token), ((wrapper, item) => ({ wrapper, item }))),
            switchMap(({ wrapper, item }) => {
                if (wrapper && wrapper.attachment) {
                    return this.graphClient.createAttachemntRawContentPath('me', item.id, wrapper.attachment.id, 'messages')
                        .pipe(map(path => ({ ...wrapper, downloadUrl: path })));
                    // return this.urlResolver.getAttachementDownloadUrl(wrapper.attachment).pipe(
                    //     map((path) => ({ ...wrapper, downloadUrl: path })));

                }
                return empty();
            }));
    }

}
