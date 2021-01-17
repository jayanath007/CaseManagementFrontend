import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { ModulePreloadStrategy } from './shell-desktop';
import { AuthGuardService } from './auth';
import { LoginComponent } from './auth/components/login/login.component';

const appRoutes: Routes = [

  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'main', loadChildren: 'app/layout-desktop/layout-desktop.module#LayoutDesktopModule',
    canActivateChild: [AuthGuardService]
  },
  {
    path: 'mail-item', loadChildren: 'app/mail-url-popup-layout/mail-url-popup-layout.module#MailItemUrlPopupLayoutModule',
    canActivateChild: [AuthGuardService]
  },
  {
    path: 'bundled', loadChildren: 'app/bundling-desktop/bundling-desktop.module#BundlingDesktopModule',
    canActivateChild: [AuthGuardService]
  },
  {
    path: 'pdfbundlemonitor', loadChildren: 'app/bundle-monitor-desktop/bundle-monitor-desktop.module#BundleMonitorDesktopModule',
    canActivateChild: [AuthGuardService]
  },
  {
    path: 'pdfbundlemonitor/:bundleid', loadChildren: 'app/bundle-monitor-desktop/bundle-monitor-desktop.module#BundleMonitorDesktopModule',
    canActivateChild: [AuthGuardService]
  },
  {
    path: 'time-recorded', loadChildren: 'app/time-recorded-desktop/time-recorded-desktop.module#TimeRecordedDesktopModule',
    canActivateChild: [AuthGuardService]
  },
  {
    path: 'mail', loadChildren: 'app/mail-url-popup-layout/mail-url-popup-layout.module#MailUrlPopupLayoutModule',
    canActivateChild: [AuthGuardService]
  },
  {
    path: 'calendar', loadChildren: 'app/calendar-url-popup/calendar-url-popup.module#CalendarUrlPopupModule',
    canActivateChild: [AuthGuardService]
  },
  {
    path: 'dictation_audio_player', loadChildren: 'app/dictations-desktop/dictations-desktop.module#DictationAudioPlayerURLPopupModule',
    canActivateChild: [AuthGuardService]
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      appRoutes,
      {
        // enableTracing: true,
        preloadingStrategy: ModulePreloadStrategy
      }
    )
  ],
  providers: [
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }

export const routingComponents = [];
