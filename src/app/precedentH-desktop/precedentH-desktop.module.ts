

import { FlexLayoutModule } from '@angular/flex-layout';
import { EffectsModule } from '@ngrx/effects';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatIconModule, MatSelectModule, MatInputModule, MatButtonModule, MatTableModule, MatTabsModule, MatCheckboxModule,
  MatExpansionModule, MatSlideToggleModule, MatListModule, MatToolbarModule, MatSnackBarModule, MatProgressBarModule, MAT_DATE_LOCALE
} from '@angular/material';
import { SharedModule } from '../shared/shared.module';
import { AuthInterceptorService } from '../auth';
import { ExceptionInterceptor } from '../shared/services/exception-interceptor.service';
import { PrecedentHPopupManagerComponent } from './containers/precedentH-popup-manager.component';
import { PrecedentHContentManagerComponent } from './containers/precedentH-content-manager.component';
import { PrecedentHEffects } from '../precedentH-core/effects/precedentH-effects';
import { PrecedenthMainLayoutComponent } from './components/precedenth-main-layout/precedenth-main-layout.component';
import { PrecedentHCoreModule } from '../precedentH-core/precedentH-core.module';
import { PresidenthSummaryGridDataComponent } from '../precedentH-desktop/components/presidenth-summary-grid-data/presidenth-summary-grid-data.component';
import { PresidenthEstimatedGridDataComponent } from '../precedentH-desktop/components/presidenth-estimated-grid-data/presidenth-estimated-grid-data.component';



@NgModule({
  imports: [
    FormsModule,
    FlexLayoutModule,
    MatTabsModule,
    CommonModule,
    SharedModule,
    PrecedentHCoreModule,
    MatSelectModule,
    MatInputModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule,
    MatTableModule,
    MatExpansionModule,
    MatListModule,
    MatSnackBarModule,
    MatProgressBarModule,
    MatCheckboxModule,
    EffectsModule.forFeature([PrecedentHEffects]),
  ],
  declarations: [
    PrecedentHContentManagerComponent,
    PrecedentHPopupManagerComponent,
    PrecedenthMainLayoutComponent,
    PresidenthSummaryGridDataComponent,
    PresidenthEstimatedGridDataComponent
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ExceptionInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true,
    },
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
  ],
  entryComponents: [PrecedentHPopupManagerComponent]
})
export class PrecedentHDesktopModule {
  popupComponent = PrecedentHPopupManagerComponent;
}
