import { Store } from '@ngrx/store';
import { Component, OnInit, Input } from '@angular/core';
import { MessageListItem } from '../../mail-item-core';
import { EventMessage } from '../../core/lib/microsoft-graph';
import { OpenEmailAttachemnt } from '../../document-view';
import { UrlPopupDownloadAttachment, UrlPopupCreateReplyForward } from '../../mail-url-popup-core/actions/core';

@Component({
    selector: 'dps-item-attachment-view-manager',
    template: `
        <mat-progress-bar *ngIf="!itemAttachment.data" mode="indeterminate"></mat-progress-bar>
        <dps-mail-view-content *ngIf="itemAttachment.data"
            [item]="itemAttachment"
            [timeZone]="timeZone"
            [companyCode]="companyCode"
            [isItemAttachment]="true"
            openFrom="mail"
            (openAttachement)="onOpenAttachement($event)"
            (replyForward)="onReplyForward($event)"
            (viewDpsFile)="onViewDpsFile($event)"
            (downloardFileAttachment)="onDownloardFileAttachment($event)">
        </dps-mail-view-content>`
})
export class ItemAttachmentViewManagerComponent implements OnInit {
    @Input() itemAttachment: MessageListItem<Readonly<EventMessage>>;
    @Input() timeZone: string;
    @Input() companyCode: any;
    @Input() parentItemId: string;
    constructor(private store: Store<any>) { }
    ngOnInit() {
    }
    onOpenAttachement(attachment) {
        this.store.dispatch(new OpenEmailAttachemnt({
            owner: this.itemAttachment.owner,
            itemId: this.parentItemId,
            attachmentId: this.itemAttachment.data.id,
            attachement: attachment,
            isEmail: true
        }));
    }
    onReplyForward({ item, type }) {
        this.store.dispatch(new UrlPopupCreateReplyForward('replyForward', { item: this.itemAttachment, type, isItemAttachement: true }));
    }
    onDownloardFileAttachment({ owner, itemId, attachment, type }) {
        this.store.dispatch(new UrlPopupDownloadAttachment('replyForward',
            { owner, itemId: this.parentItemId, attachmentId: this.itemAttachment.data.id, attachment, type }));
    }
    onViewDpsFile(event) {
        window.blur();
        localStorage.setItem('viewDpsFile', JSON.stringify(event));
        localStorage.removeItem('viewDpsFile');
    }
}
