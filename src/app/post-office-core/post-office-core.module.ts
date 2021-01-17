import { EffectsModule } from '@ngrx/effects';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { StoreModule } from '@ngrx/store';

import { reducers } from './reducers';
import { PostOfficeEffects } from './effects/post-office.effects';
import { PostOfficeService } from './services/post-office-services';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    StoreModule.forFeature('dpsPostOfficeCore', reducers),
    EffectsModule.forFeature([PostOfficeEffects])
  ],
  providers: [PostOfficeService, DatePipe],
  declarations: []
})
export class PostOfficeCoreModule { }
