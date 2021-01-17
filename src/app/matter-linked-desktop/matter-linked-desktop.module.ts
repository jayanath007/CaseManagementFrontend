
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
import { BillingGuideCoreModule } from '../billing-guide-core/billing-guide-core.module';
import { DocumentViewModule } from '../document-view/document-view.module';
import { MatterLinkedCoreModule } from '../matter-linked-core/matter-linked.module';
import { MatterLinkedLayoutComponent } from './components/matter-linked-layout/matter-linked-layout.component';
import { MatterLinkedDesktopPopupComponent } from './containers/matter-linked-desktop-popup.component';
import { MatterLinkedDesktopManagerComponent } from './containers/matter-linked-desktop-manager.component';
import { LinkedMatterViewDataComponent } from './components/linked-matter-view-data/linked-matter-view-data.component';
import { MatterLinkedDialogComponent } from './components/matter-linked-dialog/matter-linked-dialog.component';
import { EffectsModule } from '@ngrx/effects';
import { MatterLinkedEffects } from './effects/matter-linked.effects';



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
        MatterLinkedCoreModule,
        GridFilterDesktopModule,
        MatListModule,
        EffectsModule.forFeature([MatterLinkedEffects])
    ],
    declarations: [MatterLinkedLayoutComponent,
        MatterLinkedDesktopManagerComponent,
        MatterLinkedDesktopPopupComponent,
        LinkedMatterViewDataComponent,
        MatterLinkedDialogComponent
    ],
    exports: [MatterLinkedDesktopManagerComponent, MatterLinkedLayoutComponent],
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
    entryComponents: [MatterLinkedDesktopPopupComponent,
        MatterLinkedDialogComponent]
})
export class MatterLinkedDesktopModule {
    popupComponent = MatterLinkedDesktopPopupComponent;
}


