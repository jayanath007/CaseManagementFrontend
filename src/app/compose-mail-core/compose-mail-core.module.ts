import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { reducers } from './reducers';
import { ComposeTranslationsService } from './services/compose-translations.service';
import { ComposeMailService } from './services/compose-mail.service';
import { ComposeEffects } from './effects/compose.effects';
import { AuthInterceptorService } from '../auth';
import { MatSnackBarModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    MatSnackBarModule,
    StoreModule.forFeature('dpsComposeMail', reducers),
    EffectsModule.forFeature([ComposeEffects]),
  ],
  declarations: [],
  providers: [ComposeTranslationsService,
    ComposeMailService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true,
    }]

})
export class ComposeMailCoreModule { }
