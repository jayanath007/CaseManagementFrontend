
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatToolbarModule, MatIconModule, MatListModule, MatTooltipModule,
  MatDividerModule, MatProgressBarModule, MatButtonModule, MatChipsModule, MatMenuModule, MatProgressSpinnerModule
} from '@angular/material';
import { StoreModule } from '@ngrx/store';
import { reducers } from './reducers';
import { EffectsModule } from '@ngrx/effects';
import { MailWidgetEffects } from './effects/mail-widget-effect';
import { MailWidgetLayoutComponent } from './components/mail-widget-layout/mail-widget-layout.component';
import { MailWidgetManagerComponent } from './containers/mail-widget-manager';
import { MailWidgetService } from './services/mail-widget.service';
import { MailWidgetItemComponent } from './components/mail-widget-item/mail-widget-item.component';
import { SharedModule } from '../shared/shared.module';
@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatDividerModule,
    MatButtonModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatMenuModule,
    MatTooltipModule,
    StoreModule.forFeature('dpsMailWidget', reducers),
    EffectsModule.forFeature([MailWidgetEffects])
  ],
  providers: [MailWidgetService],
  declarations: [MailWidgetManagerComponent,
    MailWidgetLayoutComponent,
    MailWidgetItemComponent
  ],

  exports: [MailWidgetManagerComponent]
})
export class MailWidgetModule { }
