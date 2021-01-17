import { EditableControlBaseModule } from '../editable-control-base/editable-control-base.module';
import { MatTabsModule } from '@angular/material/tabs';
import { MaterCreationRouterHostComponent } from './containers/matter-creation-router-host.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptorService } from '../auth/services/auth-interceptor.service';
import {
  MatSelectModule, MatInputModule, MatToolbarModule, MatButtonModule,
  MatIconModule, MatSlideToggleModule, MatTableModule, MatExpansionModule,
  MatListModule, MatSnackBarModule, MatProgressBarModule, MatSidenavModule, MatFormFieldModule, MatRadioModule,
  MAT_DATE_LOCALE, MatCheckboxModule, MatMenuModule
} from '@angular/material';
import { ExceptionInterceptor } from '../shared/services/exception-interceptor.service';
import { MatterCreationManagerComponent } from './containers/matter-creation-manager.component';
import { MatterCreationMainLayoutComponent } from './components/matter-creation-main-layout/matter-creation-main-layout.component';
import { MatterCreationHeaderComponent } from './components/matter-creation-header/matter-creation-header.component';
import { MatterCreationCoreModule } from '../matter-creation-core/matter-creation-core.module';
import { DocRegisterViewDataComponent } from './components/doc-register-view-data/doc-register-view-data.component';
import { GridFilterDesktopModule } from '../grid-filter-desktop';
import { EffectsModule } from '@ngrx/effects';
import { MatterCreationDesktopEffects } from './effects/matter-creation.effects';
import { MatterLinkedDesktopModule } from '../matter-linked-desktop/matter-linked-desktop.module';
import { ClientViewDataComponent } from './components/client-view-data/client-view-data.component';


@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    SharedModule,
    MatSidenavModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    MatTableModule,
    MatExpansionModule,
    MatListModule,
    MatSnackBarModule,
    MatProgressBarModule,
    MatTabsModule,
    MatRadioModule,
    EditableControlBaseModule,
    GridFilterDesktopModule,
    MatterCreationCoreModule,
    MatterLinkedDesktopModule,
    MatMenuModule,
    HttpClientModule,
    EffectsModule.forFeature([MatterCreationDesktopEffects]),
  ],
  declarations: [
    MaterCreationRouterHostComponent,
    MatterCreationManagerComponent,
    MatterCreationMainLayoutComponent,
    MatterCreationHeaderComponent,
    DocRegisterViewDataComponent,
    ClientViewDataComponent

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
  entryComponents: [MaterCreationRouterHostComponent,
  ]
})
export class MatterCreationDesktopModule {
  popupComponent = MaterCreationRouterHostComponent;
}
