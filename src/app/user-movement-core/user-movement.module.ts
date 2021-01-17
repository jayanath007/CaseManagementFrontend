import { UserMovementEffects } from './effects/user-movement.effects';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import { reducers } from './reducers';
import { UserMovementService } from './services/user-movement-service';



@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature('dpsUserMovementCore', reducers),
    EffectsModule.forFeature([UserMovementEffects]),
    HttpClientModule
  ],
  providers:  [UserMovementService, DatePipe],
  declarations: []
})
export class UserMovementCoreModule { }
