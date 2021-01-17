import { EffectsModule } from '@ngrx/effects';
import { ChaserPopupComponent } from './containers/chaser-popup.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ChaserContainerComponent } from './components/chaser-container/chaser-container.component';
import { ChaserCoreModule } from '../chaser-core/chaser-core.module';
import { ChaserMainComponent } from './components/chaser-main/chaser-main.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatIconModule, MatSelectModule, MatInputModule, MatButtonModule, MatTableModule,
  MatExpansionModule, MatSlideToggleModule, MatListModule, MatToolbarModule, MatSnackBarModule,
   MatProgressBarModule, MAT_DATE_LOCALE, MatCheckboxModule
} from '@angular/material';
import { SharedModule } from '../shared/shared.module';
import { ChaserContentManagerComponent } from './containers/chaser-content-manager.component';
import { AuthInterceptorService } from '../auth';
import { ExceptionInterceptor } from '../shared/services/exception-interceptor.service';
import { UnlinkEmailAddressesComponent } from './components/unlink-email-addresses/unlink-email-addresses.component';
import { GridFilterDesktopModule } from '../grid-filter-desktop';
import { ChaserEffects } from './effects/chaser.effects';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    SharedModule,
    ChaserCoreModule,
    MatSelectModule,
    MatInputModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule,
    MatTableModule,
    MatExpansionModule,
    MatListModule,
    MatSnackBarModule,
    MatProgressBarModule,
    GridFilterDesktopModule,
    MatCheckboxModule,
    EffectsModule.forFeature([ChaserEffects]),
  ],
  declarations: [ChaserMainComponent,
    ChaserContainerComponent,
    ChaserContentManagerComponent,
    ChaserPopupComponent,
    UnlinkEmailAddressesComponent
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
  entryComponents: [ChaserPopupComponent, UnlinkEmailAddressesComponent]
})
export class ChaserDesktopModule {
  popupComponent = ChaserPopupComponent;
}
