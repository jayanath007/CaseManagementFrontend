import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { OrganizerHomeComponent } from './components/organizer-home/organizer-home.component';

const organizerRoutes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    component: OrganizerHomeComponent,
    children: [
      { path: '', redirectTo: 'mail', pathMatch: 'full' },
      {
        path: 'mail', loadChildren: 'app/mail-desktop/mail-desktop.module#MailDesktopModule',
        outlet: 'mail',
      }
    ],
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(organizerRoutes)
  ]
})
export class OrganizerRoutingModule { }
