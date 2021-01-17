import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { FlexLayoutModule } from '@angular/flex-layout';
import {
  MatButtonModule,
  MatIconModule,
  MatCardModule,
  MatListModule,
  MatExpansionModule,
  MatProgressBarModule,
  MatToolbarModule,
  MatDialogModule
} from '@angular/material';


import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { SharedModule } from '../shared/shared.module';


import { ExceptionIndicatorManagerComponent } from './containers/exception-indicator-manager.component';
// import { ExceptionEffects } from './effects/exception.effects';
import { reducers } from './reducers';
import { ExceptionIndicatorComponent } from './components/exception-indicator/exception-indicator.component';
import { ExceptionIndicatorItemComponent } from './components/exception-indicator-item/exception-indicator-item.component';
import { ExceptionIndicatorListManagerComponent } from './containers/exception-indicator-list-manager.component';
// import { ExceptionIndicatorItem }from './components/exception-indicator-item/exception-indicator-item';

@NgModule({
  imports: [
    CommonModule,
    OverlayModule,
    PortalModule,
    FlexLayoutModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatCardModule,
    MatExpansionModule,
    MatProgressBarModule,
    MatToolbarModule,
    MatDialogModule,
    StoreModule.forFeature('dpsException', reducers),
    // EffectsModule.forFeature([ExceptionEffects]),
  ],
  // entryComponents: [ExceptionIndicatorManagerComponent],
  // ExceptionIndicatorItem
  declarations: [ExceptionIndicatorManagerComponent,
    ExceptionIndicatorComponent ,
    ExceptionIndicatorItemComponent,
    ExceptionIndicatorListManagerComponent,
  ],
  exports: [
    ExceptionIndicatorManagerComponent,
    ExceptionIndicatorListManagerComponent
  ]
})
export class ExceptionDesktopModule { }
// export class ExceptionDesktopModule {
//   mainComponent = ExceptionIndicatorManagerComponent;
// }
