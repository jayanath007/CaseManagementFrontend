import { ConflictSearchGridRowComponent } from './components/conflict-search-grid-row/conflict-search-grid-row.component';
import { BrowserModule } from '@angular/platform-browser';
import { ConflictSearchCoreModule } from '../conflict-search-core/conflict-search.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptorService } from '../auth';
import { ConflictSearchManagerComponent } from './containers/conflict-search-manager.component';
import { ConflictSearchLayoutComponent } from './components/conflict-search-layout/conflict-search-layout.component';
import {
    MatIconModule, MatSelectModule, MatInputModule, MatDatepickerModule, MatCheckboxModule,
    MatNativeDateModule, MatChipsModule, MatProgressBarModule, MatTooltipModule,
     MatSnackBarModule, MatToolbarModule, MatListModule, MAT_DATE_LOCALE, MatPaginatorModule, MatProgressSpinnerModule, MatSidenavModule
} from '@angular/material';
import { ConflictSearchPopupComponent } from './containers/conflict-search-popup.component';
import { SharedModule } from '../shared/shared.module';
import { ExceptionInterceptor } from '../shared/services/exception-interceptor.service';
import { ClientMatterGridRowComponent } from './components/client-matter-grid-row/client-matter-grid-row.component';
import { GridFilterDesktopModule } from '../grid-filter-desktop';
import { ClientMatterGridContantComponent } from './components/client-matter-grid-contant/client-matter-grid-contant.component';
import { ConflictSearchGridContantComponent } from './components/conflict-search-grid-contant/conflict-search-grid-contant.component';

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
        MatSidenavModule,
        MatProgressBarModule,
        MatSnackBarModule,
        ConflictSearchCoreModule,
        MatListModule,
        MatPaginatorModule,
        MatProgressSpinnerModule,
        GridFilterDesktopModule,
        MatTooltipModule,
    ],
    declarations: [ConflictSearchLayoutComponent,
        ConflictSearchManagerComponent,
        ConflictSearchPopupComponent,
        ConflictSearchGridRowComponent,
        ClientMatterGridRowComponent,
        ClientMatterGridContantComponent,
        ConflictSearchGridContantComponent
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
    entryComponents: [ConflictSearchPopupComponent]
})
export class ConflictSearchDesktopModule {
    popupComponent = ConflictSearchPopupComponent;
}

