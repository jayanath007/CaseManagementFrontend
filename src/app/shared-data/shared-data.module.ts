import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';
import { OpenTimeRecordEffects } from './effects/open-time-recording.effects';
import { TimeRecordServices } from './services/time-record.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptorService } from '../auth';
import { ExceptionInterceptor } from '../shared/services/exception-interceptor.service';
import { StoreModule } from '@ngrx/store';
import { reducers } from './reducers';
import { MasterDataEffects } from './effects/master-data.effects';
import { MasterDataServices } from './services/master-data.service';


@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature('dpsSharedata', reducers),
    EffectsModule.forFeature([OpenTimeRecordEffects, MasterDataEffects]),
  ],
  declarations: [],
  providers: [
    TimeRecordServices,
    MasterDataServices,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ExceptionInterceptor,
      multi: true,
    },

  ],
})
export class SharedDataModule { }
