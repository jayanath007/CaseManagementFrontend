import { MatSnackBarModule } from '@angular/material';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { DriveEffects } from './effects/drive.effects';
import { HttpClientModule } from '@angular/common/http';
import { reducers } from './reducers';
import { MSGraphClientService } from './services/msgraph-client.service';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature('dpsDriveCore', reducers),
    EffectsModule.forFeature([DriveEffects]),
    HttpClientModule,
    MatSnackBarModule
  ],
  providers: [MSGraphClientService]
})
export class DriveCoreModule { }
