
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import {
  MatToolbarModule, MatIconModule, MatListModule, MatDividerModule,
  MatProgressBarModule, MatButtonModule, MatMenuModule, MatProgressSpinnerModule
} from '@angular/material';
import { StoreModule } from '@ngrx/store';
import { reducers } from './reducers';
import { EffectsModule } from '@ngrx/effects';
import { WorkDoneWidgetEffects } from './effects/work-done-widget-effect';
import { WorkDoneWidgetLayoutComponent } from './components/work-done-widget-layout/work-done-widget-layout.component';
import { WorkDoneWidgetManagerComponent } from './containers/work-done-widget-manager';
import { WorkDoneWidgetService } from './services/work-done-widget-services';
import { WorkDoneWidgetItemComponent } from './components/work-done-widget-item/work-done-widget-item.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatDividerModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatMenuModule,
    StoreModule.forFeature('dpsWorkDoneWidget', reducers),
    EffectsModule.forFeature([WorkDoneWidgetEffects])
  ],
  providers: [WorkDoneWidgetService, DatePipe],
  declarations: [WorkDoneWidgetManagerComponent,
    WorkDoneWidgetLayoutComponent,
    WorkDoneWidgetItemComponent],
  exports: [WorkDoneWidgetManagerComponent]
})
export class WorkDoneWidgetModule { }
