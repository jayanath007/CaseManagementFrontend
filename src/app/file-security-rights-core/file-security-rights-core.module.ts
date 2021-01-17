import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { reducers } from './reducers';
import { FileSecurityRightsEffects } from './effects/file-security-rights.efects';
import { FileSecurityRightsService } from './servicers/file-security-rights.service';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature('dpsFileSecurityRights', reducers),
    EffectsModule.forFeature([FileSecurityRightsEffects]),
  ],
  declarations: [],
  providers: [FileSecurityRightsService],
})
export class FileSecurityRightsCoreModule { }
