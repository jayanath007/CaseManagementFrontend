
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule, MatButtonModule } from '@angular/material';

import { RemindersListManagerComponent } from './containers/reminders-list-manager.component';
import { ReminderListComponent } from './components/reminder-list/reminder-list.component';
import { SharedModule } from '../shared/shared.module';
import { FlexLayoutModule } from '@angular/flex-layout';


@NgModule({
  imports: [
    CommonModule,
    MatExpansionModule,
    SharedModule,
    FlexLayoutModule,
    MatButtonModule,
  ],
  declarations: [RemindersListManagerComponent, ReminderListComponent],
  exports: [RemindersListManagerComponent]
})
export class RemindersDesktopModule { }
