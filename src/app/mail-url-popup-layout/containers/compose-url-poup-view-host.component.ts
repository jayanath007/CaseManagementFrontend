
import { map, takeUntil, switchMap } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { ComponentBase, LocalStorageKey } from '../../core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import * as itemCore from '../../mail-url-popup-core';
import { UrlPopupMailItemInit, UrlPopupMailItemLoad, UrlPopupItemAttachmentLoad } from '../../mail-url-popup-core/actions/core';
import { LoadPeople } from '../../contacts-and-people-core';
import { UpdateUserFromLocalStorage } from '../../auth/actions/auth';
import { getIsMailSendingByToken, getIsMailDeleteingByToken } from '../../compose-mail-core';
import { LoadHomeCurrencySuccess, InitSettingCore } from '../../setting-core';
import { User } from '../../auth/models/auth';
import { of, from } from 'rxjs';
import { CidToAttachemntUrlPipe, BodyHandlerService } from '../../organizer-desktop-shared';
import { getIsSendFailByToken } from '../../compose-mail-core/reducers';
import { getParentItemIdByToken } from '../../mail-url-popup-core/reducers';


@Component({
  selector: 'dps-compose-url-poup-view-host',
  template: `<dps-compose-url-popup-view-manager-component *ngIf="token==='draftMail'"
              [mailItem]="item$ | async"
              [recipientsList]="recipientsList"
              [token]="token"
              [companyCode]="user?.general?.companyCode"
              [timeZone]="user?.userTimeZone?.info.alias"
              [isComposeMailSending]="isComposeMailSending$ | async"
              [isComposeMailSendFail]="isComposeMailSendFail$ | async"
              [isComposeMailDeleting]="isComposeMailDeleting$ | async">
            </dps-compose-url-popup-view-manager-component>
            <dps-item-attachment-view-manager *ngIf="token==='itemAttachment'"
            [itemAttachment]="item$ | async"
            [companyCode]="user?.general?.companyCode"
            [parentItemId]="parentItemId$| async"
            [timeZone]="user?.userTimeZone?.info.alias">
            </dps-item-attachment-view-manager>
     `,
})
export class ComposeUrlPoupViewHostComponent extends ComponentBase implements OnInit {

  isComposeMailSending$: any;
  isComposeMailSendFail$: any;
  isComposeMailDeleting$: any;
  token$;
  item$;
  isDiscard$;
  parentItemId$;
  token = '';
  recipientsList;
  user: User;

  constructor(private store: Store<any>, private route: ActivatedRoute, private cidPipe: CidToAttachemntUrlPipe,
    private bodyHandler: BodyHandlerService) {
    super();
  }

  ngOnInit() {
    this.store.dispatch(new LoadPeople());
    this.store.dispatch(new InitSettingCore());
    this.user = JSON.parse(localStorage.getItem(LocalStorageKey.LoginUser));
    const homeCurrency: string = JSON.parse(localStorage.getItem(LocalStorageKey.HomeCurrency));
    this.recipientsList = JSON.parse(localStorage.getItem(LocalStorageKey.SECommandEmailList));
    localStorage.removeItem(LocalStorageKey.SECommandEmailList);

    this.store.dispatch(new UpdateUserFromLocalStorage({ user: this.user }));
    this.store.dispatch(new LoadHomeCurrencySuccess({ homeCurrency: homeCurrency }));

    this.token$ = this.route.params.subscribe((params) => {
      const owner = params.owner ? atob(decodeURIComponent(params.owner)) : null;
      const itemId = params.itemId;
      const attachmentId = params.attachmentId;
      if (owner && itemId && !attachmentId) {
        this.token = 'draftMail';
        this.item$ = this.getMailItemByToken(owner);
        this.store.dispatch(new UrlPopupMailItemInit(this.token));
        this.store.dispatch(new UrlPopupMailItemLoad(this.token, { owner: owner, itemId: itemId }));
        this.isComposeMailSending$ = this.store.select(getIsMailSendingByToken(this.token));
        this.isComposeMailSendFail$ = this.store.select(getIsSendFailByToken(this.token));
        this.isComposeMailDeleting$ = this.store.select(getIsMailDeleteingByToken(this.token));
      } else if (owner && itemId && attachmentId) {
        this.token = 'itemAttachment';
        this.item$ = this.getMailItemAttachmentByToken(owner, itemId, attachmentId);
        this.parentItemId$ = this.store.select(getParentItemIdByToken(this.token));
        this.store.dispatch(new UrlPopupMailItemInit(this.token));
        this.store.dispatch(new UrlPopupItemAttachmentLoad(this.token,
          { owner: owner, itemId: itemId, attachmentId: attachmentId }
        ));
      }
      this.isDiscard$ = this.store.select(itemCore.getMailItemIsDiscardByToken(this.token)).pipe(
        takeUntil(this.destroy$)).subscribe((data) => {
          if (data) {
            window.close();
          }
        });
    });
  }
  getMailItemByToken(owner) {
    return this.store.select(itemCore.getMailItemByToken(this.token)).pipe(switchMap((item) => {
      if (item && item.data && item.data.body && item.data.body.contentType === 'html') {
        return this.cidPipe.transform(owner, item.data.body.content, item.data, 'messages').pipe(
          map((newBody) => {
            return { ...item, data: { ...item.data, ...{ body: { ...item.data.body, content: newBody } } } };
          }));
      } else {
        return of(item);
      }
    }
    ));
  }

  getMailItemAttachmentByToken(owner, itemId, attachmentId) {
    return this.store.select(itemCore.getMailItemByToken(this.token)).pipe(switchMap((item) => {
      if (item && item.data && item.data.body && item.data.body.contentType === 'html') {
        return from(this.bodyHandler.substituteInlineAttachementPathForEmail(item.data.body.content, item.data.attachments as any[],
          owner, itemId, attachmentId, 'eml')).pipe(
            map((newBody) => {
              return { ...item, data: { ...item.data, ...{ body: { ...item.data.body, content: newBody } } } };
            }));
      } else {
        return of(item);
      }
    }
    ));
  }
}
