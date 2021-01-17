import { FlexLayoutModule } from '@angular/flex-layout';
import { CommonModule } from '@angular/common';
import {
  MatTabsModule, MatInputModule, MatPaginatorModule, MatTableModule,
  MatExpansionModule, MatIconModule, MatButtonModule, MatProgressBarModule,
  MatListModule, MatToolbarModule, MatSidenavModule, MatDatepickerModule, MatChipsModule,
  MatDividerModule, MatCheckboxModule, MatSelectModule, MatDialogModule, MatTooltipModule, MAT_DATE_LOCALE, MAT_DATE_FORMATS, DateAdapter
} from '@angular/material';
import { AngularSplitModule } from 'angular-split';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { GridFilterDesktopModule } from '../grid-filter-desktop';
import { BundlingLayoutComponent } from './components/bundling-layout/bundling-layout.component';
import { BundlingManagerComponent } from './containers/bundling-manager.component';
import { BundlingDocumentViewPageComponent } from './components/bundling-document-view-page/bundling-document-view-page.component';
import { BundlingItemGridComponent } from './components/bundling-item-grid/bundling-item-grid.component';
import { BundlingCoreModule } from '../bundling-core/bundling-core.module';
import { BundlingItemGridRowComponent } from './components/bundling-item-grid-row/bundling-item-grid-row.component';
import { TreeModule } from 'angular-tree-component';
import { BundlingItemGridGroupComponent } from './components/bundling-item-grid-group/bundling-item-grid-group.component';
import { DocumentViewModule } from '../document-view/document-view.module';
import { MailDesktopSharedModule } from '../mail-desktop-shared/mail-desktop-shared.module';
import { BundledProfileComponent } from './components/bundled-profile/bundled-profile.component';
import { BundleRoutingModule } from './bundling-routing.module';
import { BundleManagerRouterHostComponent } from './containers/bundling-manager-router-host.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ExceptionInterceptor } from '../shared/services/exception-interceptor.service';
import { AuthInterceptorService } from '../auth';
import { BundledOptionsComponent } from './components/bundled-options/bundled-options.component';
import { BundlingOptionManagerComponent } from './containers/bundling-option-manager.component';
import { BundlingExistingManagerComponent } from './containers/bundling-existing-manager.component.component';
import { GenaralPopupDesktopModule } from '../general-popup-desktop/genaral-popup-desktop.module';
import { BundledExisitingRecordRowComponent } from './components/bundled-exisiting-record-row/bundled-exisiting-record-row.component';
import { CoreBundlingManagerComponent } from './containers/core-bundling-manager.component';
import { EffectsModule } from '@ngrx/effects';
import { BundlingEffects } from './effects/bundling.effects';
import { AddBundleNamePopupComponent } from './components/add-bundle-name-popup/add-bundle-name-popup.component';
import { BundleNameSavePopupManagerComponent } from './containers/bundle-name-save-popup-manager.Component';
import { CoreBundleRecordRowComponent } from './components/core-bundle-record-row/core-bundle-record-row.component';
import { CoreBundleRecordLayoutComponent } from './components/core-bundle-record-layout/core-bundle-record-layout.component';
import { MsgViewerModule } from '../msg-viewer/msg-viewer.module';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';


@NgModule({
  imports: [
    BundleRoutingModule,
    CommonModule,
    SharedModule,
    MatPaginatorModule,
    MatExpansionModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatToolbarModule,
    MatPaginatorModule,
    MatTableModule,
    MatIconModule,
    MatExpansionModule,
    MatButtonModule,
    MatDatepickerModule,
    MatProgressBarModule,
    MatTabsModule,
    MatSidenavModule,
    MatListModule,
    GridFilterDesktopModule,
    BundlingCoreModule,
    TreeModule,
    MatChipsModule,
    DocumentViewModule,
    MailDesktopSharedModule,
    AngularSplitModule,
    MatDividerModule,
    MatCheckboxModule,
    MatSelectModule,
    MatDialogModule,
    MatTooltipModule,
    GenaralPopupDesktopModule,
    EffectsModule.forFeature([BundlingEffects]),
    MsgViewerModule
  ],
  exports: [
    BundlingManagerComponent
  ],
  declarations: [
    BundleManagerRouterHostComponent,
    BundlingManagerComponent,
    BundlingLayoutComponent,
    BundledProfileComponent,
    BundlingItemGridComponent,
    BundlingDocumentViewPageComponent,
    BundlingItemGridRowComponent,
    BundlingItemGridGroupComponent,
    BundledOptionsComponent,
    BundlingOptionManagerComponent,
    BundlingExistingManagerComponent,
    BundledExisitingRecordRowComponent,
    CoreBundlingManagerComponent,
    CoreBundleRecordRowComponent,
    CoreBundleRecordLayoutComponent,
    AddBundleNamePopupComponent,
    BundleNameSavePopupManagerComponent
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ExceptionInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true,
    },
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ],
  entryComponents: [BundlingOptionManagerComponent, BundlingExistingManagerComponent,
    CoreBundlingManagerComponent, BundleNameSavePopupManagerComponent]
})

export class BundlingNameTextModule {
  popupComponent = BundleNameSavePopupManagerComponent;
}
@NgModule({
  imports: [
    BundleRoutingModule,
    BundlingNameTextModule
  ],
  declarations: [
  ],

})

export class BundlingOptionDesktopModule {
  popupComponent = BundlingOptionManagerComponent;
}
@NgModule({
  imports: [
    BundleRoutingModule,
    BundlingOptionDesktopModule
  ],
  declarations: [
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true,
    }
  ]

})
export class BundlingExistingDesktopModule {
  popupComponent = BundlingExistingManagerComponent;
}
@NgModule({
  imports: [
    BundleRoutingModule,
    BundlingExistingDesktopModule
  ],
  declarations: [
  ],

})

export class CoreBundleDesktopModule {
  popupComponent = CoreBundlingManagerComponent;
}

@NgModule({
  imports: [
    BundleRoutingModule,
    CoreBundleDesktopModule
  ],
  declarations: [
  ],

})

export class BundlingDesktopModule { }



