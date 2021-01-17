
import { map, take, tap, switchMap, filter } from 'rxjs/operators';
import { combineLatest, merge, Observable } from 'rxjs';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { BaseItemViewer } from '../../mail-core/containers';
import { ActivatedRoute, Router } from '@angular/router';
import { AddToVisibilityStack, PopFromVisibilityStack } from '../actions/folder-menu';
import { RouterOutlets } from '../models/enums';
import { AuthInfoStateService, User } from '../../auth';
import { ComposeMailManagerComponent } from '../../mail-desktop-shared/containers/compose-mail-manager.component';

@Component({
  selector: 'dps-compose-view-manager',
  template: `<div
  [ngClass]="{'dps-mail-reading-pane-right':(!(user$|async).emailReadingPaneMode || (user$|async).emailReadingPaneMode==='right'),
  'dps-is-group-mode':(isGroupMode$|async)}">
              <dps-compose-mail-store-manager *ngIf="(token$ | async) === 'newMail'">
                <dps-compose-mail-manager #newComposeManager [token]="token$ | async">
                  <dps-compose-mail-layout
                      *ngIf="(newComposeManager.composeItem$|async)?.isDraft"
                      [composeItem]="newComposeManager.composeItem$|async"
                      [followUpText]="newComposeManager.followUpText$|async"
                      [isAttachmentsUploding]="newComposeManager.isAttachmentsUploding$|async"
                      [isAttachmentsDeleting]="newComposeManager.isAttachmentsDeleting$|async"
                      [isComposeCloseItem]="newComposeManager.isComposeCloseItem$|async"
                      [isDirty]="newComposeManager.isDirty$|async"
                      (addAttachment)="newComposeManager.onAddAttachment($event)"
                      (close)="onClose($event)"
                      (send)="newComposeManager.onSend($event)"
                      (draft)="newComposeManager.onDraft($event)"
                      (discard)="newComposeManager.onDiscard($event)"
                      (addToRecipient)="newComposeManager.onAddToRecipient($event)"
                      (addCcRecipient)="newComposeManager.onAddCcRecipient($event)"
                      (addBccRecipient)="newComposeManager.onAddBccRecipient($event)"
                      (removeToRecipient)="newComposeManager.onRemoveToRecipient($event)"
                      (removeCcRecipient)="newComposeManager.onRemoveCcRecipient($event)"
                      (removeBccRecipient)="newComposeManager.onRemoveBccRecipient($event)"
                      (flagFollowUp)="newComposeManager.onFlagFollowUp($event)"
                      (importance)="newComposeManager.onImportance($event)"
                      (downloardFileAttachment)="newComposeManager.onDownloardFileAttachment($event)"
                      (deleteAttachment)="newComposeManager.onDeleteAttachment($event)"
                      (clear)="newComposeManager.onClear($event)"
                      (openUrlPoup)="newComposeManager.onOpenUrlPoup($event)"
                      (subjectChange)="newComposeManager.onSubjectChange($event)"
                      [signature]="(newComposeManager.user$|async).signature"
                      [profile]="(newComposeManager.user$|async).profile"
                      [hasEmailSendAsPermission]="(newComposeManager.user$|async)?.general?.isUserHasEmailSendAsPermission"
                      [enaableChaser]="(newComposeManager.user$|async).isChaserEnable"
                      [listAttachements]="newComposeManager.listAttachements$|async"
                      [lastInlineAttachment]="newComposeManager.lastInlineAttachment$|async"
                      [refItem]="newComposeManager.refItem$|async"
                      (openAttachement)="newComposeManager.onOpenAttachement($event)"
                      (bodyChange)="newComposeManager.onBodyChange($event)"
                      [token]="newComposeManager.token">
                  </dps-compose-mail-layout>
                </dps-compose-mail-manager>
            </dps-compose-mail-store-manager>
            <dps-compose-mail-manager #composeManager *ngIf="(token$ | async)==='replyForward'" [token]="token$ | async">
              <mat-progress-bar mode="indeterminate" *ngIf="!((composeManager.composeItem$|async)?.isDraft)"></mat-progress-bar>
              <dps-compose-mail-layout
                  *ngIf="(composeManager.composeItem$|async)?.isDraft"
                  [composeItem]="composeManager.composeItem$|async"
                  [followUpText]="composeManager.followUpText$|async"
                  [isAttachmentsUploding]="composeManager.isAttachmentsUploding$|async"
                  [isAttachmentsDeleting]="composeManager.isAttachmentsDeleting$|async"
                  [isComposeCloseItem]="composeManager.isComposeCloseItem$|async"
                  [isDirty]="composeManager.isDirty$|async"
                  (addAttachment)="composeManager.onAddAttachment($event)"
                  (close)="onClose($event)"
                  (send)="composeManager.onSend($event)"
                  (draft)="composeManager.onDraft($event)"
                  (discard)="composeManager.onDiscard($event)"
                  (addToRecipient)="composeManager.onAddToRecipient($event)"
                  (addCcRecipient)="composeManager.onAddCcRecipient($event)"
                  (addBccRecipient)="composeManager.onAddBccRecipient($event)"
                  (removeToRecipient)="composeManager.onRemoveToRecipient($event)"
                  (removeCcRecipient)="composeManager.onRemoveCcRecipient($event)"
                  (removeBccRecipient)="composeManager.onRemoveBccRecipient($event)"
                  (flagFollowUp)="composeManager.onFlagFollowUp($event)"
                  (importance)="composeManager.onImportance($event)"
                  (downloardFileAttachment)="composeManager.onDownloardFileAttachment($event)"
                  (deleteAttachment)="composeManager.onDeleteAttachment($event)"
                  (clear)="composeManager.onClear($event)"
                  (openUrlPoup)="composeManager.onOpenUrlPoup($event)"
                  (subjectChange)="composeManager.onSubjectChange($event)"
                  [signature]="(composeManager.user$|async).signature"
                  [profile]="(composeManager.user$|async).profile"
                  [hasEmailSendAsPermission]="(composeManager.user$|async)?.general?.isUserHasEmailSendAsPermission"
                  [enaableChaser]="(composeManager.user$|async).isChaserEnable"
                  [listAttachements]="composeManager.listAttachements$|async"
                  [lastInlineAttachment]="composeManager.lastInlineAttachment$|async"
                  [refItem]="composeManager.refItem$|async"
                  (openAttachement)="composeManager.onOpenAttachement($event)"
                  (bodyChange)="composeManager.onBodyChange($event)"
                  [token]="composeManager.token">
              </dps-compose-mail-layout>
            </dps-compose-mail-manager>
            </div>`,
  styles: [`.dps-mail-reading-pane-right {
                position: absolute;
                right: 0;
                top: 0;
                width: calc(100% - 400px);
                height: 100%;
                z-index: 2;
            }
            .dps-mail-reading-pane-right.dps-is-group-mode{
              width: calc(100% - 350px);
            }
            `]
})
export class ComposeViewManagerComponent extends BaseItemViewer implements OnInit, OnDestroy {

  token$;
  user$: Observable<User>;
  isGroupMode$;
  item$;

  @ViewChild('newComposeManager') newComposeManager: ComposeMailManagerComponent;
  constructor(store: Store<any>, private route: ActivatedRoute, private router: Router, public service: AuthInfoStateService) {
    super(store, service);
  }

  ngOnInit() {
    this.user$ = this.getUser();
    this.user$.pipe(tap((user: any) => {
      if (user.emailReadingPaneMode === 'hide') {
        this.store.dispatch(new AddToVisibilityStack(RouterOutlets.MessageItemCommon));
      }
    }));
    this.token$ = merge(this.route.data, this.route.params).pipe(
      map((data) => data.composeToken),
      filter((token) => !!token));
    this.isGroupMode$ = this.getIsGroupMode();
    this.item$ = combineLatest(this.isGroupMode$, this.getSelectedGroup(), this.user$, this.token$,
      (isGroupMode, selectedGroup, user, token: string) => ({ isGroupMode, selectedGroup, user, token })).pipe(
        take(1))
      .subscribe(a => {
        if (a.token === 'newMail' && a.isGroupMode) {
          setTimeout(() => {
            this.newComposeManager.addToRecipient(
              { emailAddress: { address: a.selectedGroup.data.EmailAddress, name: a.selectedGroup.data.displayName } },
              a.token
            );
          }, 10);
        }
      });
    this.item$ = this.isGroupMode$.pipe(switchMap(val => this.getSelectedGroup().pipe(map(group => {
      if (val) {

      }
      return null;
    }))));
  }

  onClose(item) {
    const myRoute = [{ outlets: { [RouterOutlets.MessageItemCommon]: null } }];
    this.router.navigate(myRoute, { relativeTo: this.route.parent });
  }

  ngOnDestroy(): void {
    this.store.dispatch(new PopFromVisibilityStack(RouterOutlets.MessageItemCommon));
  }

}
