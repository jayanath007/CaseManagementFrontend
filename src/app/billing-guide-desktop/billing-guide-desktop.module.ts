
import { BrowserModule } from '@angular/platform-browser';
import { ConflictSearchCoreModule } from '../conflict-search-core/conflict-search.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptorService } from '../auth';
import {
    MatIconModule, MatSelectModule, MatInputModule,
    MatDatepickerModule, MatNativeDateModule, MatCheckboxModule,
    MatToolbarModule, MatProgressBarModule, MAT_DATE_LOCALE,
    MatListModule, MatRadioModule, MatSlideToggleModule, MatExpansionModule, MatTooltipModule
} from '@angular/material';
import { SharedModule } from '../shared/shared.module';
import { ExceptionInterceptor } from '../shared/services/exception-interceptor.service';
import { BillingGuideDesktopManagerComponent } from './containers/billing-guide-desktop-manager.component';
import { BillingGuideDesktopPopupComponent } from './containers/billing-guide-desktop-popup.component';
import { BillingGuideLayoutComponent } from './components/billing-guide-layout/billing-guide-layout.component';
import { BillingGuideCoreModule } from '../billing-guide-core/billing-guide-core.module';
import { DocumentViewModule } from '../document-view/document-view.module';



@NgModule({
    imports: [FormsModule,
        ReactiveFormsModule,
        CommonModule,
        SharedModule,
        MatIconModule,
        MatRadioModule,
        MatSelectModule,
        MatSlideToggleModule,
        MatDatepickerModule,
        MatInputModule,
        MatCheckboxModule,
        DocumentViewModule,
        MatTooltipModule,
        MatNativeDateModule,
        MatToolbarModule,
        MatProgressBarModule,
        MatExpansionModule,
        BillingGuideCoreModule,
        MatListModule,
    ],
    declarations: [BillingGuideLayoutComponent,
        BillingGuideDesktopManagerComponent,
        BillingGuideDesktopPopupComponent,
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
    entryComponents: [BillingGuideDesktopPopupComponent]
})
export class BillingGuideDesktopModule {
    popupComponent = BillingGuideDesktopPopupComponent;
}


