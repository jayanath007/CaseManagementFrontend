import { ExceptionDesktopModule } from '../exception-desktop/exception-desktop.module';
import { SettingCoreModule } from '../setting-core/setting-core.module';
import { TeamMemberCoreModule } from '../team-member-core/team-member-core.module';

import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';
import { HeaderBarComponent } from './components/header-bar/header-bar.component';
import {
  MatIconModule, MatToolbarModule, MatButtonModule,
  MatSidenavModule, MatListModule, MatMenuModule, MatTooltipModule, MatInputModule,
  MatTabsModule, MatProgressSpinnerModule, MatRadioModule, MatCheckboxModule,
  MatExpansionModule
} from '@angular/material';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ImageCropperModule } from 'ngx-image-cropper';

import { AuthInterceptorService } from '../auth';
import { MainMenuMiniNavListComponent } from './components/main-menu-mini-nav-list/main-menu-mini-nav-list.component';
import { MainMenuNavListComponent } from './components/main-menu-nav-list/main-menu-nav-list.component';
import { reducers } from './reducers';
import { ShellComponent } from './containers/shell/shell.component';
import { MainMenuEffects } from './effects/main-menu.effects';
import { DashboardDesktopModule } from '../dashboard-desktop/dashboard-desktop.module';
import { ExceptionInterceptor } from '../shared/services/exception-interceptor.service';
import { LayoutRoutingModule } from './layout-routing.module';
import { SharedModule } from '../shared/shared.module';
import { MainMenuItemResolverService } from './services/main-menu-item-resolver.service';
import { MainMenuService } from './services/main-menu.service';
import { DocumentViewModule } from '../document-view/document-view.module';
import { CashDocumentViewComponent } from './components/cash-document-view/cash-document-view.component';
import { LayoutService } from './services/layout.service';
import { RemindersDesktopModule } from '../reminders-desktop/reminders-desktop.module';
import { SettingsSidenavComponent } from './components/settings-sidenav/settings-sidenav.component';
import { LayoutModule } from '@angular/cdk/layout';
import { DatabaseSelectComponent } from './components/database-select/database-select.component';
import { ThemeComponent } from './components/theme/theme.component';
import { DashboardWidgetEnableComponent } from './components/dashboard-widget-enable/dashboard-widget-enable.component';
import { UserImageCropperPopupComponent } from './components/user-image-cropper-popup/user-image-cropper-popup.component';
import { DocumentOpenComponent } from './components/document-open/document-open.component';

@NgModule({
  providers: []
})
export class RootLayoutModule { }

@NgModule({
  imports: [
    CommonModule,
    RootLayoutModule,
    SharedModule,
    LayoutRoutingModule,
    FlexLayoutModule,
    DocumentViewModule,
    MatIconModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatProgressSpinnerModule,
    MatListModule,
    MatMenuModule,
    MatRadioModule,
    MatTooltipModule,
    TeamMemberCoreModule,
    SettingCoreModule,
    MatInputModule,
    MatTabsModule,
    MatCheckboxModule,
    MatExpansionModule,
    StoreModule.forFeature('dpsLayout', reducers),
    EffectsModule.forFeature([MainMenuEffects]),
    DashboardDesktopModule,
    ExceptionDesktopModule,
    RemindersDesktopModule,
    LayoutModule,
    ImageCropperModule
  ],
  declarations: [
    ShellComponent,
    HeaderBarComponent,
    MainMenuMiniNavListComponent,
    MainMenuNavListComponent,
    DatabaseSelectComponent,
    DocumentOpenComponent,
    ThemeComponent,
    // TmpHomeComponent,
    CashDocumentViewComponent,
    SettingsSidenavComponent,
    DashboardWidgetEnableComponent,
    // TeamMemberListComponent,
    // TeamMemberManagerComponent,
    UserImageCropperPopupComponent
  ],
  entryComponents: [UserImageCropperPopupComponent],
  exports: [FlexLayoutModule, RouterModule],
  providers: [
    MainMenuItemResolverService,
    LayoutService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ExceptionInterceptor,
      multi: true,
    },

  ],


})
export class LayoutDesktopModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: RootLayoutModule,
      providers: [MainMenuService],
    };
  }
}
