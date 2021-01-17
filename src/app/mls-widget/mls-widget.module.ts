import { StoreModule } from '@ngrx/store';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MlsWidgetLayoutComponent } from './components/mls-widget-layout/mls-widget-layout.component';
import { MlsWidgetItemComponent } from './components/mls-widget-item/mls-widget-item.component';
import { MlsWidgetManagerComponent } from './containers/mls-widget-manager.component';
import {
  MatToolbarModule, MatIconModule, MatButtonModule, MatMenuModule, MatProgressBarModule,
  MatListModule, MatProgressSpinnerModule
} from '@angular/material';
import { EffectsModule } from '@ngrx/effects';
import { MlsWidgetEffect } from './effects/mls-widget-effect';
import { reducers } from './reducers';
import { MlsWidgetServices } from './services/mls-widget-services';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatListModule,
    EffectsModule.forFeature([MlsWidgetEffect]),
    StoreModule.forFeature('dpsMLSWidget', reducers)
  ],
  providers: [MlsWidgetServices],
  declarations: [MlsWidgetManagerComponent, MlsWidgetLayoutComponent, MlsWidgetItemComponent],
  exports: [MlsWidgetManagerComponent]
})
export class MlsWidgetModule { }
