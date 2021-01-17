import {
  Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy, ViewContainerRef,
  ViewChild, SimpleChange, OnChanges, AfterViewInit
} from '@angular/core';
import {
  Overlay, OverlayConfig, ConnectionPositionPair, OverlayRef
} from '@angular/cdk/overlay';

import {
  CdkPortal
} from '@angular/cdk/portal';
import { InboxMessageNotification } from '../../../core/notifications/interfaces';
import { UrlPopupService } from '../../../shell-desktop/services/url-popup.service';
import { InforDialogData, InforDialogComponent } from '../../../shared';
import { MatDialog } from '@angular/material';
import { Reminder } from '../../../core/lib/microsoft-graph';

@Component({
  selector: 'dps-new-mail-indicator',
  templateUrl: './new-mail-indicator.component.html',
  styleUrls: ['./new-mail-indicator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewMailIndicatorComponent implements OnInit, OnChanges, AfterViewInit {

  position: ConnectionPositionPair[] = [new ConnectionPositionPair({ originX: 'end', originY: 'bottom' },
    { overlayX: 'end', overlayY: 'top' })];

  @Input() lastEvent: InboxMessageNotification;
  @Input() mailList;
  @Input() showList;

  @Input() newReminders: Reminder[];
  @Input() curentTime: Reminder[];

  showProfileImg = false;
  @Output() toggle = new EventEmitter();
  @Output() lastEventClick = new EventEmitter();

  @Output() closeReminders = new EventEmitter();
  @Output() snooze = new EventEmitter();
  @Output() dismiss = new EventEmitter();

  // @Output() closeAutoReplyMSG = new EventEmitter();
  @Output() offAutoReply = new EventEmitter();

  overlayRef: OverlayRef;
  remindersOverlayRef: OverlayRef;
  autoReplyOverlayRef: OverlayRef;
  @ViewChild('notificationOverlay') notificationOverlay: CdkPortal;
  @ViewChild('reminderOverlay') reminderOverlay: CdkPortal;
  @ViewChild('autoReplyOverlay') autoReplyOverlay: CdkPortal;

  constructor(public overlay: Overlay,
    public viewContainerRef: ViewContainerRef,
    public urlPopupService: UrlPopupService,
    private dialog: MatDialog
  ) { }
  @Input() set openLastEvent(value: boolean) {
    if (!this.overlayRef) {
      return;
    }
    if (value && this.remindersOverlayRef && this.remindersOverlayRef.hasAttached()) {
      this.remindersOverlayRef.detach();
    }
    if (value && this.autoReplyOverlayRef && this.autoReplyOverlayRef.hasAttached()) {
      this.autoReplyOverlayRef.detach();
    }
    if (value && !this.overlayRef.hasAttached()) {
      this.overlayRef.attach(this.notificationOverlay);
      this.ngAfterViewInit();
    } else if (!value && this.overlayRef.hasAttached()) {
      this.overlayRef.detach();
    }
  }
  @Input() set openAutoReplyMSG(value: boolean) {
    if (!this.autoReplyOverlayRef) {
      return;
    }
    if (value && this.remindersOverlayRef && this.remindersOverlayRef.hasAttached()) {
      this.remindersOverlayRef.detach();
    }
    if (value && this.overlayRef && this.overlayRef.hasAttached()) {
      this.overlayRef.detach();
    }
    if (value && !this.autoReplyOverlayRef.hasAttached()) {
      this.autoReplyOverlayRef.attach(this.autoReplyOverlay);
      this.ngAfterViewInit();
    } else if (!value && this.autoReplyOverlayRef.hasAttached()) {
      this.autoReplyOverlayRef.detach();
    }
  }
  @Input() set showLastReminder(value: boolean) {
    if (!this.remindersOverlayRef) {
      return;
    }
    if (value && this.overlayRef && this.overlayRef.hasAttached()) {
      this.overlayRef.detach();
    }
    if (value && this.autoReplyOverlayRef && this.autoReplyOverlayRef.hasAttached()) {
      this.autoReplyOverlayRef.detach();
    }
    if (value && !this.remindersOverlayRef.hasAttached()) {
      this.remindersOverlayRef.attach(this.reminderOverlay);
      this.ngAfterViewInit();
    } else if (!value && this.remindersOverlayRef.hasAttached()) {
      this.remindersOverlayRef.detach();
    }
  }

  ngOnChanges() {
    if (this.lastEvent) {
      this.showProfileImg = false;
    }
  }

  ngOnInit() {
    const config = new OverlayConfig();

    config.positionStrategy = this.overlay.position()
      .global()
      .right(`10px`)
      .top(`60px`);
    this.overlayRef = this.overlay.create(config);

    const remindersConfig = new OverlayConfig();
    remindersConfig.positionStrategy = this.overlay.position()
      .global()
      .right(`10px`)
      .top(`60px`);
    this.remindersOverlayRef = this.overlay.create(remindersConfig);

    const autoReplyConfig = new OverlayConfig();
    autoReplyConfig.positionStrategy = this.overlay.position()
      .global()
      .right(`10px`)
      .top(`60px`);
    this.autoReplyOverlayRef = this.overlay.create(autoReplyConfig);
  }
  ngAfterViewInit() {

    setTimeout(() => {
      if (this.overlayRef.overlayElement.parentElement.className === 'cdk-global-overlay-wrapper') {
        this.overlayRef.overlayElement.parentElement.className += ' dps-notification-overlay-wrapper';
      }
      if (this.remindersOverlayRef.overlayElement.parentElement.className === 'cdk-global-overlay-wrapper') {
        this.remindersOverlayRef.overlayElement.parentElement.className += ' dps-notification-overlay-wrapper';
      }
      if (this.autoReplyOverlayRef.overlayElement.parentElement.className === 'cdk-global-overlay-wrapper') {
        this.autoReplyOverlayRef.overlayElement.parentElement.className += ' dps-notification-overlay-wrapper';
      }
    }, 100);

  }
  openPoup(itemId) {
    const encodeId = encodeURIComponent(itemId);
    const urlPath = `/mail-item/${encodeURIComponent(btoa('me'))}/` + encodeId;
    const opened = this.urlPopupService.openWithUrlPoup(urlPath, itemId, false, false);
    if (!opened) {
      this.warningMessage();
    }
  }

  overlayClick() {
    this.lastEventClick.emit();
  }

  indicatorClick() {
    this.toggle.emit();
  }
  onClose(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.lastEventClick.emit();
  }
  onReminderClose(event) {
    event.preventDefault();
    event.stopPropagation();
    this.closeReminders.emit();
  }
  onDismiss(event) {
    this.dismiss.emit(event);
  }
  onSnooze(event) {
    this.snooze.emit(event);
  }
  onAutoReplyMSGClose(event) {
    event.preventDefault();
    event.stopPropagation();
    // this.closeAutoReplyMSG.emit();
    if (this.autoReplyOverlayRef.hasAttached()) {
      this.autoReplyOverlayRef.detach();
    }
  }
  onAutoReplyOff(event) {
    this.offAutoReply.emit(event);
    if (this.autoReplyOverlayRef.hasAttached()) {
      this.autoReplyOverlayRef.detach();
    }
  }
  warningMessage() {
    const dialogData: InforDialogData = {
      content: {
        title: 'Popup has been blocked',
        message: `Please allow popup for this domain`
      },
      contentParams: { displayName: '' },
      data: { messageType: 'warning' }
    };

    const deleteDialogRef = this.dialog.open(InforDialogComponent, {
      data: dialogData,
      width: '350px',
      panelClass: 'dps-notification'
    });
  }
}
