import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MSGraphClientService } from './services/msgraph-client.service';
import { reducers } from './reducers';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { FoldersEffects } from './effects/folders.effects';
import { ItemsEffects } from './effects/items.effects';
import { CoreEffects } from './effects/core.effects';
import { NotificationEffects } from './effects/notification.effects';
import { SharedModule } from '../shared/shared.module';
import { MailTranslationsService } from './services/mail-translations.service';
import { MailItemCoreModule } from '../mail-item-core/mail-item-core.module';
import { GroupsEffects } from './effects/groups.effects';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature('dpsMailsCore', reducers),
    EffectsModule.forFeature([FoldersEffects, ItemsEffects, CoreEffects, NotificationEffects, GroupsEffects]),
    SharedModule,
    MailItemCoreModule,
  ],
  providers: [MSGraphClientService, DatePipe, MailTranslationsService],
  declarations: []
})
export class MailCoreModule { }
