import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { DesktopPopups } from '../shell-desktop';
import { LayoutCanLoadService } from '../layout-desktop/services/layout-can-load.service';
import { InitialSettingsService } from '../initial-settings-core/services/initial-settings.service';
import { CalendarPopupLayoutComponent } from './components/calendar-popup-layout/calendar-popup-layout.component';

const routes: Routes = [
  {
    path: 'layout',
    component: CalendarPopupLayoutComponent,
    canActivate: [LayoutCanLoadService],
    data: { preload: true },
    children: [{
      path: 'home', loadChildren: 'app/calendar-desktop/calendar-desktop.module#CalendarDesktopModule',
      data: { preload: true },
    }
    ]
  },
  {
    path: '_004_', // just a data module without ui
    loadChildren: DesktopPopups.MatterSearch,
  }
];

@NgModule({
  imports: [CommonModule,
    RouterModule.forChild(routes)
  ],
  declarations: [],
  providers: [LayoutCanLoadService, InitialSettingsService]
})

export class CalendarUrlPopupRoutingModule { }
