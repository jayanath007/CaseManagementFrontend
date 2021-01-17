import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TimeInformationLayoutComponent } from './components/time-information-layout/time-information-layout.component';
import { TimeInformationPopupComponent } from './containers/time-information-popup.component';
import { TimeInformationCoreModule } from '../time-information-core/time-information-core.module';
import { TimeInformationManagerComponent } from './containers/time-information-manager.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ExceptionInterceptor } from '../shared/services/exception-interceptor.service';
import { AuthInterceptorService } from '../auth';
import {
  MAT_DATE_LOCALE, MatToolbarModule, MatDatepickerModule, MatProgressBarModule,
  MatButtonModule, MatNativeDateModule, MatInputModule,
  MatCheckboxModule, MatSelectModule, MatIconModule, MatTabsModule, MatCardModule, MatRadioModule, MatChipsModule, MatTooltipModule
} from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { GridFilterDesktopModule } from '../grid-filter-desktop';
import { TimeRecordGridItemComponent } from './components/time-record-grid-item/time-record-grid-item.component';
import { CkEditorModule } from '../ck-editor/ck-editor.module';

import { EffectsModule } from '@ngrx/effects';
import { TimeInformationEffects } from './effects/time-information-effects';
import { Investigationic1Component } from './components/investigation-ic1/investigation-ic1.component';
import { InvestigationIc2Component } from './components/investigation-ic2/investigation-ic2.component';
import { InvestigationIc3Component } from './components/investigation-ic3/investigation-ic3.component';
import { TimeRecordGridComponent } from './components/time-record-grid/time-record-grid.component';
import { TimeRecordGridPopupComponent } from './components/time-record-grid-popup/time-record-grid-popup.component';
import { ProceedingsRc1Component } from './components/proceedings-rc1/proceedings-rc1.component';
import { ProceedingsRc2Component } from './components/proceedings-rc2/proceedings-rc2.component';
import { LgfsCc1Component } from './components/lgfs-cc1/lgfs-cc1.component';
import { LgfsCc2Component } from './components/lgfs-cc2/lgfs-cc2.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    GridFilterDesktopModule,
    TimeInformationCoreModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatCheckboxModule,
    MatProgressBarModule,
    MatButtonModule,
    FlexLayoutModule,
    MatToolbarModule,
    MatIconModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    TimeInformationCoreModule,
    MatTabsModule,
    MatCardModule,
    MatRadioModule,
    CkEditorModule,
    MatChipsModule,
    MatTooltipModule,
    EffectsModule.forFeature([TimeInformationEffects])
  ],
  declarations: [
    TimeInformationLayoutComponent,
    TimeInformationPopupComponent,
    TimeInformationManagerComponent,
    TimeRecordGridComponent,
    TimeRecordGridPopupComponent,
    TimeRecordGridItemComponent,
    Investigationic1Component,
    InvestigationIc2Component,
    InvestigationIc3Component,
    ProceedingsRc1Component,
    ProceedingsRc2Component,
    LgfsCc1Component,
    LgfsCc2Component
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
  entryComponents: [TimeInformationPopupComponent, TimeRecordGridPopupComponent]

})

export class TimeInformationDesktopModule {
  popupComponent = TimeInformationPopupComponent;
}
