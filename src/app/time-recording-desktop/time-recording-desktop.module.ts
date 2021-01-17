import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptorService } from '../auth';
import { TimeRecordingManagerComponent } from './containers/time-recording-manager.component';
import { TimeRecordingLayoutComponent } from './components/time-recording-layout/time-recording-layout.component';
import {
    MatIconModule, MatSelectModule, MatInputModule, MatDatepickerModule, MatCheckboxModule,
    MatNativeDateModule, MatChipsModule, MatProgressBarModule, MatSnackBarModule,
    MatToolbarModule, MatListModule, MAT_DATE_LOCALE, MatTabsModule, MatTooltipModule
} from '@angular/material';
import { TimeRecordingPopupComponent } from './containers/time-recording-popup.component';
import { TimeRecordingCoreModule } from '../time-recording-core/time-recording-core.module';
import { SharedModule } from '../shared/shared.module';
import { ExceptionInterceptor } from '../shared/services/exception-interceptor.service';
import { RootLayoutModule } from './../layout-desktop/layout-desktop.module';
import { CkEditorModule } from '../ck-editor/ck-editor.module';

@NgModule({
    imports: [FormsModule,
        ReactiveFormsModule,
        CommonModule,
        SharedModule,
        MatIconModule,
        MatSelectModule,
        MatDatepickerModule,
        MatChipsModule,
        MatInputModule,
        MatCheckboxModule,
        MatNativeDateModule,
        MatChipsModule,
        MatToolbarModule,
        MatProgressBarModule,
        MatSnackBarModule,
        TimeRecordingCoreModule,
        MatListModule,
        RootLayoutModule,
        MatTabsModule,
        CkEditorModule,
        MatTooltipModule
    ],
    declarations: [TimeRecordingLayoutComponent,
        TimeRecordingManagerComponent,
        TimeRecordingPopupComponent
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
    entryComponents: [TimeRecordingPopupComponent]
})
export class TimeRecordingDesktopModule {
    popupComponent = TimeRecordingPopupComponent;
}
