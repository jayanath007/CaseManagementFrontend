import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ExceptionInterceptor } from '../shared/services/exception-interceptor.service';
import { AuthInterceptorService } from '../auth';
import {
  MAT_DATE_LOCALE, MatToolbarModule, MatIconModule,
  MatButtonModule, MatInputModule,
  MatListModule, MatProgressBarModule, MatCheckboxModule, MatTabsModule
} from '@angular/material';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { reducers } from './reducers';
import { SharedModule } from '../shared/shared.module';
import { PageSetupRouterHostComponent } from './containers/page-setup-router-host.component';
import { PageSetupManagerComponent } from './containers/page-setup-manager.component';
import { PageSetupLayoutComponent } from './components/page-setup-layout/page-setup-layout.component';
import { PageSetupEffects } from './effects/page-setup.effects';
import { PageSetupService } from './services/page-setup.service';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatListModule,
    MatProgressBarModule,
    MatCheckboxModule,
    MatTabsModule,
    StoreModule.forFeature('dpsPageSetup', reducers),
    EffectsModule.forFeature([PageSetupEffects])
  ],
  declarations: [
    PageSetupRouterHostComponent,
    PageSetupManagerComponent,
    PageSetupLayoutComponent,
  ],
  providers: [
    PageSetupService,
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
  entryComponents: [PageSetupRouterHostComponent]
})
export class PageSetupModule {
  popupComponent = PageSetupRouterHostComponent;
}
