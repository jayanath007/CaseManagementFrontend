import { HttpClientModule } from '@angular/common/http';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MailUrlPopupEffects } from './effects/mail-url-popup-effects';
import { reducers } from './reducers';
import { MsgraphClientMailItemService } from '../mail-item-core/services/msgraph-client-mail-item.service';
import { MailItemCoreModule } from '../mail-item-core/mail-item-core.module';
import { FileUrlResolverService } from '../document-view';


@NgModule({
    imports: [
        CommonModule,
        HttpClientModule,
        MailItemCoreModule,
        StoreModule.forFeature('dpsMailItem', reducers),
        EffectsModule.forFeature([MailUrlPopupEffects])
    ],
    declarations: [],
    providers: [MsgraphClientMailItemService,
        FileUrlResolverService]
})
export class MailUrlPopupCoreModule {
}
