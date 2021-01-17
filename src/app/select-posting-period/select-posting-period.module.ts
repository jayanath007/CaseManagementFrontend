import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ExceptionInterceptor } from '../shared/services/exception-interceptor.service';
import { AuthInterceptorService } from '../auth';
import { PostingPeriodRouterHostComponent } from './containers/posting-period-router-host.component';
import {
  MAT_DATE_LOCALE, MatToolbarModule, MatIconModule,
  MatButtonModule, MatInputModule,
  MatListModule, MatProgressBarModule
} from '@angular/material';
import { PostingPeriodManagerComponent } from './containers/posting-period-manager.component';
import { PostingPeriodLayoutComponent } from './components/posting-period-layout/posting-period-layout.component';
import { EffectsModule } from '@ngrx/effects';
import { PostingPeriodEffects } from './effects/posting-period.effects';
import { StoreModule } from '@ngrx/store';
import { reducers } from './reducers';
import { PostingPeriodService } from './services/posting-period.service';
import { SharedModule } from '../shared/shared.module';

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
    StoreModule.forFeature('dpsPostingPeriod', reducers),
    EffectsModule.forFeature([PostingPeriodEffects])
  ],
  declarations: [
    PostingPeriodRouterHostComponent,
    PostingPeriodManagerComponent,
    PostingPeriodLayoutComponent,
  ],
  providers: [
    PostingPeriodService,
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
  entryComponents: [PostingPeriodRouterHostComponent]
})
export class SelectPostingPeriodModule {
  popupComponent = PostingPeriodRouterHostComponent;
}
