import { OvItemService } from './services/ov-items.service';
import { OvItemEffects } from './effects/ov-items.effects';
import { HttpClientModule } from '@angular/common/http';
import { reducers } from './reducers';
import { EffectsModule } from '@ngrx/effects';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScreenDesingnerService } from './services/screen-desingner.service';
import { StoreModule, ActionReducer } from '@ngrx/store';
import { ScreenDesingnerEffects } from './effects/screen-designer-effects';
import { FieldPropertiesEffects } from './effects/field-properties-effects';
import { FieldPropertiesService } from './services/field-properties.service';
import { environment } from '../../environments/environment';
import { storeLogger } from 'ngrx-store-logger';

export function logger(reducer: ActionReducer<any>): any {
  // default, no options
  return storeLogger()(reducer);
}
export const metaReducers = environment.production ? [] : [logger];

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    StoreModule.forFeature('dpsScreenDesingner', reducers), // , {metaReducers}
    EffectsModule.forFeature([ScreenDesingnerEffects, FieldPropertiesEffects, OvItemEffects])
  ],
  declarations: [],
  providers: [ScreenDesingnerService, OvItemService, FieldPropertiesService],
})
export class ScreenDesingnerCoreModule { }
