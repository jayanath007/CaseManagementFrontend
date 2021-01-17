
import { map, filter, switchMap } from 'rxjs/operators';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { of, merge, Observable } from 'rxjs';

import { ActivatedRoute, Router } from '@angular/router';

import { BaseItemViewer } from '../../mail-core/containers';
import { RouterOutlets } from '../models/enums';
import { ViewManagerService } from '../services/view-manager.service';
import { MainMenuService } from '../../layout-desktop';
import { OpenMailUrlPopup } from '../../mail-item-core/actions/item';
import { GetEventMessageEvent, RemoveFromCalendar, MessageItemWrapper } from '../../mail-item-core';
import { AuthInfoStateService } from '../../auth';
import { STICKY_ROUTES } from '../models/const';
import { CidToAttachemntUrlPipe } from '../../organizer-desktop-shared';

@Component({
  selector: 'dps-item-view-manager',
  template: `<dps-mail-item-viwer
              [item]="currentItem$ | async"
              [hasNext]="hasNext$ | async"
              [hasPrevious]="hasPrevious$ | async"
              (next)="viewNext($event)"
              (previous)="viewPrevious($event)"
              (close)="onClose($event)"
              (itemReadUnread)="onItemReadUnread($event)"
              (itemFlag)="onItemFlag($event)"
              (itemDelete)="onItemDelete($event)"
              (meetingResponse)="onMeetingResponse($event)"
              (replyForward)="onReplyForward($event)"
              (downloardFileAttachment)="onDownloardFileAttachment($event)"
              (viewDpsFile)="onViewDpsFile($event)"
              (openUrlPoup)="onOpenUrlPoup($event)"
              (attachToNewMail)="onAttachToNewMail($event)"
              (openAttachement)="openAttachemnt($event)"
              [companyCode]="(user$|async)?.general?.companyCode"
              [timeZone]="(user$|async)?.userTimeZone?.info.alias"
              [emailReadingPaneMode]="(user$|async)?.emailReadingPaneMode"
              (setAutoReadItemId)="onSetAutoReadItemId($event)"
              (getEventMessageEvent)="onGetEventMessageEvent($event)"
              [autoReadItemId]="autoReadItemId$|async"
              (removeFromCalendar)="onRemoveFromCalendar($event)"
              >
              </dps-mail-item-viwer>`,
  styles: []
})
export class ItemViewManagerComponent extends BaseItemViewer implements OnInit, OnDestroy {

  currentItem$: Observable<MessageItemWrapper>;
  hasNext$: any;
  hasPrevious$: any;
  user$: Observable<any>;
  autoReadItemId$: any;
  constructor(store: Store<any>, private route: ActivatedRoute, private router: Router,
    private viewManager: ViewManagerService, private layoutMenu: MainMenuService, public service: AuthInfoStateService,
    private cidPipe: CidToAttachemntUrlPipe) {
    super(store, service);
  }

  private cleners = [];

  ngOnInit() {
    if (STICKY_ROUTES.includes(this.route.parent.outlet as RouterOutlets)) {

      const viewId$ = merge(this.route.parent.params, this.route.parent.data).pipe(
        filter((data) => !!data.mailFolderId),
        map((data) => data.mailFolderId),
        switchMap((mailFolderId) =>
          this.getItemViewIdByFolderId(mailFolderId)
        ));

      this.currentItem$ = viewId$.pipe(switchMap((viewId) =>
        this.getViewingItemByViewId(viewId)
      ));
      this.hasNext$ = viewId$.pipe(switchMap((viewId) =>
        this.hasNext(viewId)
      ));
      this.hasPrevious$ = viewId$.pipe(switchMap((viewId) =>
        this.hasPrevious(viewId)
      ));

    } else {
      this.currentItem$ = this.getCurrentViewItem();
      this.hasNext$ = this.hasNext();
      this.hasPrevious$ = this.hasPrevious();
    }

    this.currentItem$ = this.currentItem$.pipe(
      switchMap((item) => {
        if (item && item.data.body.contentType === 'html') {
          return this.cidPipe.transform(item.owner, item.data.body.content, item.data, 'messages').pipe(
            map((newBody) => {
              return { ...item, data: { ...item.data, ...{ body: { ...item.data.body, content: newBody } } } };
            }));
        } else {
          return of(item);
        }
      }));

    this.user$ = this.getUser();
    this.autoReadItemId$ = this.getAutoReadItemId();
  }

  onClose(item) {
    this.viewManager.clearViewingItem();
  }
  // onOpenUrlPoup(item) {

  // }
  onOpenUrlPoup(item: MessageItemWrapper) {
    this.store.dispatch(new OpenMailUrlPopup({ owner: item.owner, itemId: item.data.id, token: 'mailItem' }));
  }
  onGetEventMessageEvent(event) {
    this.store.dispatch(new GetEventMessageEvent({ item: event }));
  }
  onRemoveFromCalendar(event) {
    this.store.dispatch(new RemoveFromCalendar(event));
  }
  onReplyForward({ item, type }) {
    this.viewManager.showReplayForward(item, type);
  }

  ngOnDestroy(): void {
  }
  onViewDpsFile(event) {
    if (window.opener && window.opener !== window) {
      localStorage.setItem('viewDpsFile', JSON.stringify(event));
      localStorage.removeItem('viewDpsFile');
    } else {
      this.layoutMenu.goToOpenCaseByMailSubjectOrDiaryId(event);
    }
  }
  onAttachToNewMail(itemAttachments) {
    const token = 'newMail';
    this.router.navigate([{ outlets: { [RouterOutlets.MessageItemCommon]: ['compose', token] } }], { relativeTo: this.route.parent });
    this.attachToNewMail(itemAttachments, token, 'itemAttachment');
  }
  // openAttachemnt({ item, attachment }) {
  //   const urlCache = item.attachmentUrls ? item.attachmentUrls[attachment.id] : null;
  //   if (msgExtentions.includes(attachment.name)) {
  //     if (urlCache.view) {

  //       this
  //     }
  //   } else {
  //     super.openAttachemnt({ item, attachment });
  //   }
  // }
}
