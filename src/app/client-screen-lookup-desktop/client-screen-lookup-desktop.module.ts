import { ScreenLookupGridFixRowComponent } from './components/screen-lookup-grid-fix-row/screen-lookup-grid-fix-row.component';
import { ClientScreenLookupListComponent } from './components/client-screen-lookup-list/client-screen-lookup-list.component';
import { ClientScreenLookupHeaderComponent } from './components/client-screen-lookup-header/client-screen-lookup-header.component';
import { ClientScreenLookupLayoutComponent } from './components/client-screen-lookup-layout/client-screen-lookup-layout.component';
import { AuthInterceptorService } from '../auth/services/auth-interceptor.service';
import { ExceptionInterceptor } from '../shared/services/exception-interceptor.service';
import { ClientScreenLookupManagerComponent } from './containers/client-screen-lookup-manager.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import {
    MatButtonModule, MatMenuModule, MatSnackBarModule, MatToolbarModule,
    MatDialogModule, MatListModule, MatSelectModule, MatProgressBarModule,
    MatIconModule, MatChipsModule, MatCheckboxModule, MatPaginatorModule
} from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientScreenLookupPopupComponent } from './containers/client-screen-lookup-popup.component';
import { GridFilterDesktopModule } from '../grid-filter-desktop';
import { SharedModule } from '../shared/shared.module';
import { ClientScreenLookupCoreModule } from '../client-screen-lookup-core/client-screen-lookup-core.module';

@NgModule({
    imports: [FormsModule,
        SharedModule,
        MatIconModule,
        CommonModule,
        MatProgressBarModule,
        HttpClientModule,
        MatChipsModule,
        SharedModule,
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
        ClientScreenLookupCoreModule,
        ReactiveFormsModule],


    declarations: [
        ClientScreenLookupPopupComponent,
        ClientScreenLookupManagerComponent,
        ClientScreenLookupLayoutComponent,
        ClientScreenLookupHeaderComponent,
        ClientScreenLookupListComponent,
        ScreenLookupGridFixRowComponent
    ]
    ,
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
    entryComponents: [ClientScreenLookupPopupComponent]
})
export class ClientScreenLookupDesktopModule {
    popupComponent = ClientScreenLookupPopupComponent;
}
