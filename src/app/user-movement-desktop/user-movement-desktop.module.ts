import { UserMovementRoutingModule } from './user-movement-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptorService } from '../auth';
import {
    MatIconModule, MatSelectModule, MatInputModule,
    MatDatepickerModule, MatNativeDateModule, MatCheckboxModule,
    MatToolbarModule, MatProgressBarModule, MAT_DATE_LOCALE,
    MatListModule, MatRadioModule, MatSlideToggleModule, MatExpansionModule,
    MatTooltipModule, MatChipsModule, MatButtonToggleModule, DateAdapter, MatDividerModule, MatTabsModule
} from '@angular/material';
import { SharedModule } from '../shared/shared.module';
import { ExceptionInterceptor } from '../shared/services/exception-interceptor.service';
import { GridFilterDesktopModule } from '../grid-filter-desktop';
import { BillingGuideCoreModule } from '../billing-guide-core/billing-guide-core.module';
import { DocumentViewModule } from '../document-view/document-view.module';
import { EffectsModule } from '@ngrx/effects';
import { UserMovementDesktopManagerComponent } from './containers/user-movement-desktop-manager.component';
import { UserMovementLayoutComponent } from './components/user-movement-layout/user-movement-layout.component';
import { UserMovementDesktopPopupComponent } from './containers/user-movement-desktop-popup.component';
import { AddMovementPopupLayoutComponent } from './components/add-movement-popup-layout/add-movement-popup-layout.component';
import { AddMovementPopupContainerComponent } from './components/add-movement-popup-container/add-movement-popup-container.component';
import { UserMovementCoreModule } from '../user-movement-core/user-movement.module';
import { UserMovementsRowViewComponent } from './components/user-movements-row-view/user-movements-row-view.component';
import { UserMovementAddPopupComponent } from './containers/user-movement-add-popup.component';
import { UserMovementTimeLineComponent } from './components/user-movement-time-line/user-movement-time-line.component';
import { UserMovementRowComponent } from './components/user-movement-row/user-movement-row.component';
import { DpsDateAdapter } from '../app-settings-desktop/app-settings-desktop.module';

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
        MatTabsModule,
        MatToolbarModule,
        MatProgressBarModule,
        MatExpansionModule,
        GridFilterDesktopModule,
        MatListModule,
        UserMovementCoreModule,
        MatChipsModule,
        MatButtonToggleModule,
        MatDividerModule,
        UserMovementRoutingModule
        //  EffectsModule.forFeature([UserMovementEffects])
    ],
    declarations: [UserMovementLayoutComponent,
        UserMovementDesktopManagerComponent,
        UserMovementDesktopPopupComponent,
        AddMovementPopupContainerComponent,
        AddMovementPopupLayoutComponent,
        UserMovementsRowViewComponent,
        UserMovementAddPopupComponent,
        UserMovementTimeLineComponent,
        UserMovementRowComponent

    ],
    exports: [UserMovementDesktopManagerComponent, UserMovementLayoutComponent],
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
        // { provide: DateAdapter, useClass: DpsDateAdapter }
    ],
    entryComponents: [UserMovementAddPopupComponent]
})
export class UserMovementDesktopModule {
    // popupComponent = UserMovementDesktopPopupComponent;
}


