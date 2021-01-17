
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptorService } from '../auth';
import {
    MatIconModule, MatSelectModule, MatInputModule,
    MatDatepickerModule, MatNativeDateModule, MatCheckboxModule,
    MatToolbarModule, MatProgressBarModule, MAT_DATE_LOCALE, MatListModule,
    MatExpansionModule, MatButtonModule, MatTooltipModule
// tslint:disable-next-line:import-spacing
}from '@angular/material';
import { SharedModule } from '../shared/shared.module';
import { ExceptionInterceptor } from '../shared/services/exception-interceptor.service';
import { EChitDesktopManagerComponent } from './containers/e-chit-desktop-manager.component';
import { EChitDesktopPopupComponent } from './containers/e-chit-desktop-popup.component';
import { EChitLayoutComponent } from './components/e-chit-layout/e-chit-layout.component';
import { EChitCoreModule } from '../e-chit-core/echit-core.module';
import { EditableControlBaseModule } from '../editable-control-base/editable-control-base.module';



@NgModule({
    imports: [FormsModule,
        ReactiveFormsModule,
        CommonModule,
        SharedModule,
        MatIconModule,
        MatSelectModule,
        MatDatepickerModule,
        MatInputModule,
        MatCheckboxModule,
        MatNativeDateModule,
        MatToolbarModule,
        MatProgressBarModule,
        EChitCoreModule,
        MatButtonModule,
        MatExpansionModule,
        MatListModule,
        EditableControlBaseModule,
        MatTooltipModule
    ],
    declarations: [EChitLayoutComponent,
        EChitDesktopManagerComponent,
        EChitDesktopPopupComponent,
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
    entryComponents: [EChitDesktopPopupComponent]
})
export class EChitDesktopModule {
    popupComponent = EChitDesktopPopupComponent;
}
