import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { DesktopPopups } from '../shell-desktop';
import { ComposeUrlPoupViewHostComponent } from './containers/compose-url-poup-view-host.component';
import { LayoutCanLoadService } from '../layout-desktop/services/layout-can-load.service';
import { InitialSettingsService } from '../initial-settings-core/services/initial-settings.service';
import { MailPopupLayoutComponent } from './components/mail-popup-layout/mail-popup-layout.component';

const mailItemRoutes: Routes = [
  {
    path: ':owner/:itemId',
    component: ComposeUrlPoupViewHostComponent,
  },
  {
    path: ':owner/:itemId/:attachmentId',
    component: ComposeUrlPoupViewHostComponent,
  },
  {
    path: '_002_', // just a data module without ui
    loadChildren: DesktopPopups.Chaser,
  },
  {
    path: '_004_', // just a data module without ui
    loadChildren: DesktopPopups.MatterSearch,
  }
];

@NgModule({
  imports: [CommonModule,
    RouterModule.forChild(mailItemRoutes)
  ],
  declarations: []
})

export class MailItemUrlPopupLayoutRoutingModule { }

const mailRoutes: Routes = [
  {
    path: 'layout',
    component: MailPopupLayoutComponent,
    canActivate: [LayoutCanLoadService],
    data: { preload: true },
    children: [{
      path: 'home',
      data: { preload: true },
      loadChildren: 'app/mail-desktop/mail-desktop.module#MailDesktopModule',
    }
    ]
  },
  {
    path: '_002_', // just a data module without ui
    loadChildren: DesktopPopups.Chaser,
  },
  {
    path: '_004_', // just a data module without ui
    loadChildren: DesktopPopups.MatterSearch,
  }
];

@NgModule({
  imports: [CommonModule,
    RouterModule.forChild(mailRoutes)
  ],
  declarations: [],
  providers: [LayoutCanLoadService, InitialSettingsService]
})

export class MailUrlPopupLayoutRoutingModule { }
