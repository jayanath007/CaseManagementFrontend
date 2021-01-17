import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoreModule } from '@ngrx/store';

import { MSGraphCalendarClientService } from './services/msgraph-client.service';
import { reducers } from './reducers';
import { EffectsModule } from '@ngrx/effects';
import { EventEffects } from './effects/event.effects';
import { EventEditeEffects } from './effects/edit-event.effects';
import { CalendarFoldersEffects } from './effects/calendar-folder.effects';
import { KeyValuesPipe } from '../shared/pipes/key-values.pipe';
import { CalendarTranslationsService } from './services/calendar-translations.service';
import { CalendarGroupTranslationsService } from './services/calendarGroup-translations.service';
import { AuthInterceptorService } from '../auth';
import { MatSnackBarModule } from '@angular/material';

@NgModule({
  imports: [
    MatSnackBarModule,
    CommonModule,
    StoreModule.forFeature('dpsCalendarCore', reducers),
    EffectsModule.forFeature([CalendarFoldersEffects, EventEditeEffects, EventEffects]),
  ],
  declarations: [],
  providers: [MSGraphCalendarClientService, KeyValuesPipe, CalendarTranslationsService,
    CalendarGroupTranslationsService, AuthInterceptorService],
})
export class CalendarCoreModule { }
