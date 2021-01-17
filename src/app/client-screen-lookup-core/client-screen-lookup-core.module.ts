import { ClientScreenLookupService } from './services/client-screen-lookup.service';
import { ClientScreenLookupEffects } from './effects/client-screen-lookup-effects';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { reducers } from './reducers';


@NgModule({
    imports: [
        CommonModule,
        HttpClientModule,
        StoreModule.forFeature('dpsClientScreenLookupCore', reducers),
        EffectsModule.forFeature([ClientScreenLookupEffects])
    ],
    providers: [ClientScreenLookupService],
    declarations: []
})
export class ClientScreenLookupCoreModule { }
