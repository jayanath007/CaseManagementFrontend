import { FormsModule } from '@angular/forms';

import { NgModule, Injectable } from '@angular/core';
import {
    MatTabsModule, MatSelectModule, MatIconModule
    , MatSlideToggleModule, MatListModule
    , MatCheckboxModule, MatButtonModule,
    MatChipsModule, MatToolbarModule, MatProgressBarModule, MatSnackBarModule, MatTooltipModule,
    MatProgressSpinnerModule, MatRadioModule, MatDatepickerModule, MatFormFieldModule, MatButtonToggleModule,
    MatAutocompleteModule,
    MAT_DATE_LOCALE,
    DateAdapter,
    MatExpansionModule
} from '@angular/material';
import { CommonModule } from '@angular/common';


import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AppSettingsLayoutComponent } from './components/app-settings-layout/app-settings-layout.component';
import { AppSettingsRouterHostComponent } from './containers/app-settings-router-host.component';
import { AppSettingsManagerComponent } from './containers/app-settings-manager.component';

import {
    OrganizerSettingsLayoutComponent
} from '../organizer-settings-desktop/components/organizer-settings-layout/organizer-settings-layout.component';

import { AuthInterceptorService } from '../auth';
import { OrganizerSettingsManagerComponent } from '../organizer-settings-desktop/containers/organizer-settings-manager.component';

import { OrganizerSettingsCoreModule } from '../organizer-settings-core/organizer-settings-core.module';

import { ExceptionInterceptor } from '../shared/services/exception-interceptor.service';
import { AppSettingsOverlayComponent } from './containers/app-settings-overlay.component';
import { SharedModule } from '../shared/shared.module';
import { CkEditorModule } from '../ck-editor/ck-editor.module';
import { OrganizerSignatureDesktopModule } from '../organizer-signature-desktop/organizer-signature-desktop.module';
import {
    OrganizerSignatureLayoutComponent
} from '../organizer-settings-desktop/components/organizer-signature-layout/organizer-signature-layout.component';
import { SettingsSnackBarComponent } from '../organizer-settings-desktop/components/settings-snack-bar/settings-snack-bar.component';
import {
    AutomaticRepliesSettingsComponent
} from '../organizer-settings-desktop/components/automatic-replies-settings/automatic-replies-settings.component';
import { MatMomentDateModule, MomentDateAdapter } from '@angular/material-moment-adapter';
import { GlobalSignatureCreatorLayoutComponent } from '../organizer-settings-desktop/components/global-signature-creator-layout/global-signature-creator-layout.component';

@Injectable()
export class DpsDateAdapter extends MomentDateAdapter {

    getFirstDayOfWeek(): number {
        return 0;
    }

}
@NgModule({
    imports: [FormsModule,
        MatTabsModule,
        MatIconModule,
        CommonModule,
        OrganizerSignatureDesktopModule,
        MatProgressBarModule,
        HttpClientModule,
        MatChipsModule,
        SharedModule,
        MatSelectModule,
        CkEditorModule,
        MatSlideToggleModule,
        MatListModule,
        MatCheckboxModule,
        MatButtonModule,
        MatToolbarModule,
        OrganizerSettingsCoreModule,
        MatTooltipModule,
        MatSnackBarModule,
        MatProgressSpinnerModule,
        MatRadioModule,
        MatDatepickerModule,
        MatFormFieldModule,
        MatButtonToggleModule,
        MatMomentDateModule,
        MatAutocompleteModule,
        MatExpansionModule
    ],
    declarations: [
        AppSettingsManagerComponent,
        AppSettingsRouterHostComponent,
        AppSettingsLayoutComponent,
        OrganizerSettingsManagerComponent,
        OrganizerSettingsLayoutComponent,
        OrganizerSignatureLayoutComponent,
        AppSettingsOverlayComponent,
        SettingsSnackBarComponent,
        AutomaticRepliesSettingsComponent,
        GlobalSignatureCreatorLayoutComponent
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
        { provide: DateAdapter, useClass: DpsDateAdapter }

    ],
    entryComponents: [AppSettingsOverlayComponent, SettingsSnackBarComponent,
        OrganizerSignatureLayoutComponent, GlobalSignatureCreatorLayoutComponent]
})

export class AppSettingsDesktopModule {
    popupComponent = AppSettingsOverlayComponent;
}
