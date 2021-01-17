import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { reducers } from './reducers';
import { DiaryFolderEffects } from './effects/diary-folder.effects';
import { DiaryFolderService } from './services/diary-folder.service';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    StoreModule.forFeature('dpsDiaryFolderCore', reducers),
    EffectsModule.forFeature([DiaryFolderEffects])
  ],
  declarations: [],
  providers: [DiaryFolderService]
})
export class DiaryFolderCoreModule { }
