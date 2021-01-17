import { HttpClientModule } from '@angular/common/http';
import { EffectsModule } from '@ngrx/effects';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';

@NgModule({
    imports: [
        CommonModule,
        //   StoreModule.forFeature('dpsAddNoteCore', reducers),
        //   EffectsModule.forFeature([AddNoteEffects]),
        HttpClientModule
    ],
    providers: [],
    declarations: []
})
export class AddNoteCoreModule { }
