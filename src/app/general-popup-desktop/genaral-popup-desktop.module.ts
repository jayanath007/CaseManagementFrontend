
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import {
    MatButtonModule, MatMenuModule, MatSnackBarModule, MatToolbarModule,
    MatDialogModule, MatListModule, MatSelectModule, MatProgressBarModule,
    MatIconModule, MatChipsModule, MatCheckboxModule, MatPaginatorModule
} from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridFilterDesktopModule } from '../grid-filter-desktop';
import { SharedModule } from '../shared/shared.module';
import { GeneralPopupSearchBoxComponent } from './components/general-popup-search-box/general-popup-search-box.component';
import { GeneralPopupComponent } from './containers/general-popup.component';
import { GeneralPopupLayoutComponent } from './components/general-popup-layout/general-popup-layout.component';
import { GeneralPopupManagerComponent } from './containers/general-popup-manager.component';
import { GeneralPopupCoreModule } from '../general-popup-core/general-popup-core.module';
import { ExceptionInterceptor } from '../shared/services/exception-interceptor.service';
import { AuthInterceptorService } from '../auth';



@NgModule({
    imports: [FormsModule,
        SharedModule,
        MatIconModule,
        CommonModule,
        MatProgressBarModule,
        HttpClientModule,
        MatChipsModule,
        MatSelectModule,
        MatListModule,
        MatButtonModule,
        MatDialogModule,
        MatToolbarModule,
        MatCheckboxModule,
        MatSnackBarModule,
        MatMenuModule,
        MatPaginatorModule,
        GridFilterDesktopModule,
        ReactiveFormsModule,
        GeneralPopupCoreModule
    ],
    declarations: [
        GeneralPopupSearchBoxComponent,
        GeneralPopupLayoutComponent,
        GeneralPopupManagerComponent,
        GeneralPopupComponent,
    ],
    exports: [
        GeneralPopupSearchBoxComponent,
        GeneralPopupLayoutComponent,
        GeneralPopupManagerComponent,
        GeneralPopupComponent,
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
        }],
})
export class GenaralPopupDesktopModule {
}
