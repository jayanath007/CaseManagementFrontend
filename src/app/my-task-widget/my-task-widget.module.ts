
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import {
  MatToolbarModule, MatIconModule, MatListModule, MatDividerModule,
  MatProgressBarModule, MatButtonModule, MatMenuModule, MatProgressSpinnerModule
} from '@angular/material';
import { StoreModule } from '@ngrx/store';
import { reducers } from './reducers';
import { EffectsModule } from '@ngrx/effects';
import { MyTaskWidgetEffects } from './effects/my-task-widget-effect';
import { MyTaskWidgetLayoutComponent } from './components/my-task-widget-layout/my-task-widget-layout.component';
import { MyTaskWidgetManagerComponent } from './containers/my-task-widget-manager';
import { MyTaskWidgetService } from './services/my-task-widget-services';
import { MyTaskWidgetItemComponent } from './components/my-task-widget-item/my-task-widget-item.component';
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
    StoreModule.forFeature('dpsTaskWidget', reducers),
    EffectsModule.forFeature([MyTaskWidgetEffects])
  ],
  providers: [MyTaskWidgetService, DatePipe],
  declarations: [MyTaskWidgetManagerComponent,
    MyTaskWidgetLayoutComponent,
    MyTaskWidgetItemComponent],
  exports: [MyTaskWidgetManagerComponent]
})
export class MyTaskWidgetModule { }
