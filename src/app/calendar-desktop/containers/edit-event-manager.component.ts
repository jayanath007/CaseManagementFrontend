import { FileUrlResolverService } from '../../document-view/services/file-url-resolver.service';
import { EventEmitter, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { OnInit, Component } from '@angular/core';
import { EditEventBaseManager } from '../../calendar-core/containers/edit-event-base-manager';
import { Attendee, FileAttachment, Attachment } from '../../core/lib/microsoft-graph';
import { EventEditInfo } from '../../calendar-core/models/interfaces';
import { AuthInfoStateService, User } from '../../auth';
import * as MsGraphBeta from '../../core/lib/microsoft-graph';
import { MainMenuService } from '../../layout-desktop';
import { BodyHandlerService } from '../../organizer-desktop-shared';
import { Observable } from 'rxjs';

@Component({
    selector: 'dps-edit-event-manager',
    template: '<ng-content></ng-content>',
    styles: []
})
export class EditEventManagerComponent extends EditEventBaseManager implements OnInit {
    constructor(store: Store<any>, protected service: AuthInfoStateService, urlResolver: FileUrlResolverService,
        bodyHandlerService: BodyHandlerService, private layoutMenu: MainMenuService) {
        super(store, urlResolver, bodyHandlerService);
    }
    user$: Observable<User>;
    @Output() closePopup = new EventEmitter<string>();

    ngOnInit() {
        this.user$ = this.service.getUser();
    }

    onAddAttendee(item: Attendee) {
        this.addAttendee(item);
    }

    onRemoveAttendee(item: Attendee) {
        this.removeAttendee(item);
    }

    onUpdateEventData(updateInfo: EventEditInfo) {
        this.updateEventData(updateInfo);
    }

    onSaveAndSend(evnet: MsGraphBeta.Event) {
        this.saveAndSend(evnet);
    }

    onDelete(evnet: MsGraphBeta.Event) {
        this.onEventDelete(evnet);
    }

    onAddAttachment(attachmentData: { attachment: FileAttachment, uid: string, type: string, event: MsGraphBeta.Event }) {
        this.onUploadAttachmnet(attachmentData);
    }

    onDeleteAttachment(attachmentData: { event: MsGraphBeta.Event, attachmentId: string }) {
        this.onDeleteAttachmnet(attachmentData);
    }

    onOpenAttachement(attachmentData: { itemId: string, attachement: Attachment, urlCache: null }) {
        this.onViewAttachement(attachmentData);
    }

    onDownloardFileAttachment(attachmentData: { itemId: string, attachment: Attachment, type }) {
        this.downloardFileAttachment(attachmentData);
    }

    onClose(event: { type: string, attachmentChange: boolean, event: MsGraphBeta.Event }) {
        this.editPopupClose(event.attachmentChange, event.event, event.type);
        this.closePopup.emit(event.type);
    }
    onOpenMatter(subject: string) {
        if (window.opener && window.opener !== window) {
            localStorage.setItem('viewDpsFile', JSON.stringify({ subject }));
            localStorage.removeItem('viewDpsFile');
        } else {
            this.layoutMenu.goToOpenCaseByMailSubjectOrDiaryId({ subject, diaryId: null });
        }
    }
}
