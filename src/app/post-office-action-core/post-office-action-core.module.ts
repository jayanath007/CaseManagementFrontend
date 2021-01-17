import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { HttpClientModule } from '@angular/common/http';
import { reducers } from './reducers';
import { PostOfficeActionEffects } from './effects/post-office-action-effects';
import { PostOfficeActionService } from './services/post-office-action-service';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature('dpsPostOfficeActionCore', reducers),
    EffectsModule.forFeature([PostOfficeActionEffects]),
    HttpClientModule
  ],
  providers: [PostOfficeActionService],
  declarations: []
})

export class PostOfficeActionCoreModule { }
