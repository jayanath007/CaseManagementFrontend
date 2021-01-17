import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material';
import { SharedModule } from '../shared/shared.module';
import { GenaralPopupDesktopModule } from '../general-popup-desktop/genaral-popup-desktop.module';
import { PoliceStationSearchPopupComponent } from './containers/police-station-search-popup.component';
import { PoliceStationGridFixRowComponent } from './components/police-station-grid-fix-row/police-station-grid-fix-row.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    MatListModule,
    GenaralPopupDesktopModule,
  ],
  declarations: [PoliceStationSearchPopupComponent, PoliceStationGridFixRowComponent],
  entryComponents: [PoliceStationSearchPopupComponent]
})
export class PoliceStationSearchDesktopModule {
  popupComponent = PoliceStationSearchPopupComponent;
}


