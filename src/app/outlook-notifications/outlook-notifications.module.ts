import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';
import { NotificationBoostrapComponent } from './containers/notification-boostrap.component';
import { NotificationEffects } from './effects/notification.effects';
import { NotificationClientService } from './services/notification-client.service';
import { RemindersEffects } from './effects/reminders.effects';
import { ReminderClientService } from './services/reminder-client.service';

@NgModule({
  imports: [
    CommonModule,
    EffectsModule.forFeature([NotificationEffects, RemindersEffects]),
  ],
  declarations: [NotificationBoostrapComponent],
  providers: [NotificationClientService, ReminderClientService],
  exports: [NotificationBoostrapComponent]

})
export class OutlookNotificationsModule {
  constructor() {
  }

}
