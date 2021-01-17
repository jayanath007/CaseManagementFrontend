import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatToolbarModule, MatIconModule, MatProgressBarModule,
  MatPaginatorModule, MatListModule, MatCheckboxModule
} from '@angular/material';

import { SharedModule } from '../shared/shared.module';

import { FileSecurityRightsPopupComponent } from './containers/file-security-rights-popup.component';
import { FileSecurityRightsManagerComponent } from './containers/file-security-rights-manager.component';

import { FileSecurityRightsLayoutComponent } from './components/file-security-rights-layout/file-security-rights-layout.component';
import { FileSecurityRightsCoreModule } from '../file-security-rights-core/file-security-rights-core.module';
import { GridFilterDesktopModule } from '../grid-filter-desktop';


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FileSecurityRightsCoreModule,
    MatToolbarModule,
    MatIconModule,
    MatProgressBarModule,
    MatPaginatorModule,
    MatListModule,
    MatCheckboxModule,
    GridFilterDesktopModule,
  ],
  declarations: [
    FileSecurityRightsPopupComponent,
    FileSecurityRightsLayoutComponent,
    FileSecurityRightsManagerComponent
  ],
  entryComponents: [FileSecurityRightsPopupComponent]
})
export class FileSecurityRightsDesktopModule {
  popupComponent = FileSecurityRightsPopupComponent;
}
