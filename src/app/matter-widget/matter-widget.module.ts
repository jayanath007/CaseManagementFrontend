import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatToolbarModule, MatIconModule, MatListModule, MatDividerModule,
  MatProgressBarModule, MatButtonModule, MatMenuModule, MatProgressSpinnerModule
} from '@angular/material';
import { StoreModule } from '@ngrx/store';
import { reducers } from './reducers';
import { EffectsModule } from '@ngrx/effects';
import { SharedModule } from '../shared/shared.module';
import { MatterWidgetEffects } from './effects/matter-widget-effect';
import { MatterWidgetLayoutComponent } from './components/matter-widget-layout/matter-widget-layout.component';
import { MatterWidgetManagerComponent } from './containers/matter-widget-manager';
import { MatterWidgetService } from './services/matter-widget-services';
import { MatterWidgetItemComponent } from './components/matter-widget-item/matter-widget-item.component';
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
    MatMenuModule,
    StoreModule.forFeature('dpsMatterWidget', reducers),
    EffectsModule.forFeature([MatterWidgetEffects])
  ],
  providers: [MatterWidgetService],
  declarations: [MatterWidgetManagerComponent,
    MatterWidgetLayoutComponent,
    MatterWidgetItemComponent],
  exports: [MatterWidgetManagerComponent]
})
export class MatterWidgetModule { }
