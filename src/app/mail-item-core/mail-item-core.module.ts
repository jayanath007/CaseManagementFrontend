import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { EffectsModule } from '@ngrx/effects';
import { MsgraphClientMailItemService } from './services/msgraph-client-mail-item.service';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
  ],
  providers: [MsgraphClientMailItemService]
})
export class MailItemCoreModule {

  constructor() {
  }

}
