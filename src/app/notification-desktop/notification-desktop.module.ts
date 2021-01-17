import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { FlexLayoutModule } from '@angular/flex-layout';
import {
  MatButtonModule,
  MatIconModule,
  MatCardModule,
  MatListModule
} from '@angular/material';


import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { OutlookNotificationsModule } from '../outlook-notifications/outlook-notifications.module';
import { NewMailIndicatorManagerComponent } from './containers/new-mail-indicator-manager.component';
import { NewMailEffects } from './effects/new-mail.effects';
import { reducers } from './reducers';
import { NewMailIndicatorComponent } from './components/new-mail-indicator/new-mail-indicator.component';
import { SharedModule } from '../shared/shared.module';
import { NewMailIndicatorItemComponent } from './components/new-mail-indicator-item/new-mail-indicator-item.component';
import { RemindersEffects } from './effects/reminders.effects';
import { ReminderIndicatorItemComponent } from './components/reminder-indicator-item/reminder-indicator-item.component';
import { AutoReplyMsgItemComponent } from './components/auto-reply-msg-item/auto-reply-msg-item.component';

@NgModule({
  imports: [
    CommonModule,
    OutlookNotificationsModule,
    OverlayModule,
    PortalModule,
    SharedModule,
    FlexLayoutModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatCardModule,
    StoreModule.forFeature('dpsNotification', reducers),
    EffectsModule.forFeature([NewMailEffects, RemindersEffects]),
  ],
  entryComponents: [NewMailIndicatorManagerComponent],
  declarations: [
    NewMailIndicatorManagerComponent,
    NewMailIndicatorComponent,
    NewMailIndicatorItemComponent,
    ReminderIndicatorItemComponent,
    AutoReplyMsgItemComponent
  ]
})

export class NotificationDesktopModule {
  mainComponent = NewMailIndicatorManagerComponent;
}
