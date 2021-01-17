import { GenaralPopupDesktopModule } from './../general-popup-desktop/genaral-popup-desktop.module';
import { CommonModule } from '@angular/common';


import {MatListModule
} from '@angular/material';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { SupplierPopupGridFixRowComponent } from './components/supplier-popup-grid-fix-row/supplier-popup-grid-fix-row.component';
import { SupplierPopupComponent } from './containers/supplier-popup.component';


@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        MatListModule,
        GenaralPopupDesktopModule,
    ],
    declarations: [
        SupplierPopupGridFixRowComponent,
        SupplierPopupComponent
    ],
    entryComponents: [SupplierPopupComponent]
})
export class GeneralSupplierDesktopModule {
    popupComponent = SupplierPopupComponent;
}
