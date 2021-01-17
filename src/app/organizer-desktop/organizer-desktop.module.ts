import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrganizerHomeComponent } from './components/organizer-home/organizer-home.component';
import { TopMenuComponent } from './components/top-menu/top-menu.component';
import { OrganizerRoutingModule } from './organizer-routing.module';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { MatTabsModule, MatIconModule, MatSidenavModule, MatListModule, MatCheckboxModule, MatSelectModule,
          MatSlideToggleModule, MatButtonModule} from '@angular/material';
import { SettingsViewComponent } from './components/settings-view/settings-view.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    OrganizerRoutingModule,
    RouterModule,
    MatTabsModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatCheckboxModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatButtonModule,
  ],
  declarations: [OrganizerHomeComponent, TopMenuComponent, SettingsViewComponent]
})
export class OrganizerDesktopModule { }
