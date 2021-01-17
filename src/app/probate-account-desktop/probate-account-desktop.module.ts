import { ProbateAccountDesktopManagerComponent } from './containers/probate-account-desktop-manager.component';

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
import { GridFilterDesktopModule } from '../grid-filter-desktop';
import { DocumentViewModule } from '../document-view/document-view.module';
import { EffectsModule } from '@ngrx/effects';
import { ProbateAccountLayoutComponent } from './components/probate-account-layout/probate-account-layout.component';
import { ProbateAccountCoreModule } from '../probate-account-core/probate-account.module';
import { ProbateAccountDesktopPopupComponent } from './containers/probate-account-desktop-popup.component';
import { ProbateAccountEffects } from '../probate-account-core/effects/probate-account.effects';
import { ProbateAccountContentComponent } from './components/probate-account-content/probate-account-content.component';



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
        ProbateAccountCoreModule,
        GridFilterDesktopModule,
        MatListModule,
        EffectsModule.forFeature([ProbateAccountEffects])
    ],
    declarations: [ProbateAccountLayoutComponent,
        ProbateAccountDesktopPopupComponent,
        ProbateAccountDesktopManagerComponent,
        ProbateAccountContentComponent

    ],
    exports: [ProbateAccountDesktopManagerComponent, ProbateAccountLayoutComponent],
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
    entryComponents: [ProbateAccountDesktopPopupComponent]
})
export class ProbateAccountDesktopModule {
    popupComponent = ProbateAccountDesktopPopupComponent;
}


