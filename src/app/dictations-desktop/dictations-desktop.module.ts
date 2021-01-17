import { DictationsCoreModule } from './../dictations-core/dictations-core.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatCardModule, MatInputModule, MatIconModule, MatTooltipModule,
  MatTabsModule, MatProgressBarModule, MatSelectModule, MatCheckboxModule,
  MatPaginatorModule, MatToolbarModule, MatExpansionModule, MatListModule,
  MatSliderModule, MatSidenavModule, MatChipsModule, MatDatepickerModule, MatFormFieldModule, MatNativeDateModule, MatMenuModule,
} from '@angular/material';
import { GridFilterDesktopModule } from '../grid-filter-desktop';
import { SharedModule } from '../shared/shared.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ExceptionInterceptor } from '../shared/services/exception-interceptor.service';
import { AuthInterceptorService } from '../auth/services/auth-interceptor.service';
import { DictationsLayoutComponent } from './components/dictations-layout/dictations-layout.component';
import { DictationsRoutingModule, DictationAudioPlayerRoutingModule } from './dictations-routing.module';
import { DictationsManagerComponent } from './containers/dictations-manager.component';
import { DictationsManagerRouterHostComponent } from './containers/dictations-manager-router-host.component';
import { DictationAudioPlayerComponent } from './components/dictation-audio-player/dictation-audio-player.component';
import { DictationAudioPlayerManagerComponent } from './containers/dictation-audio-player-managet.component';

import { DictationLayoutContentComponent } from './components/dictation-layout-content/dictation-layout-content.component';
import { DictationsHeaderComponent } from './components/dictations-header/dictations-header.component';
import { DictationsGridComponent } from './components/dictations-grid/dictations-grid.component';
import { DictationsGridRowComponent } from './components/dictations-grid-row/dictations-grid-row.component';
import { DictationsGridButtonDetailsComponent } from './components/dictations-grid-button-details/dictations-grid-button-details.component';
import { DocumentViewModule } from '../document-view/document-view.module';
import { AzureStorageModule } from '../azure-storage/azure-storage.module';
import { DictationProfilingPopupComponent } from './components/dictation-profiling-popup/dictation-profiling-popup.component';
import { DictationProfilingPopupManagerComponent } from './containers/dictation-profiling-popup-manager.component';

@NgModule({
  imports: [
    CommonModule,
    DictationsCoreModule,
    DictationsRoutingModule,
    MatCardModule,
    MatInputModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatTooltipModule,
    MatExpansionModule,
    FlexLayoutModule,
    MatTabsModule,
    MatProgressBarModule,
    MatSelectModule,
    MatCheckboxModule,
    GridFilterDesktopModule,
    MatPaginatorModule,
    SharedModule,
    MatSliderModule,
    MatSidenavModule,
    MatChipsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatMenuModule

  ],
  declarations: [DictationsLayoutComponent,
    DictationsManagerComponent,
    DictationsManagerRouterHostComponent,
    DictationsHeaderComponent,
    DictationLayoutContentComponent,
    DictationsGridComponent,
    DictationsGridRowComponent,
    DictationsGridButtonDetailsComponent,
    DictationProfilingPopupComponent,
    DictationProfilingPopupManagerComponent],

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
    }
  ],
  entryComponents: [DictationProfilingPopupManagerComponent]
})
export class DictationsDesktopModule { }


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    HttpClientModule,
    DocumentViewModule,
    DictationsCoreModule,
    DictationAudioPlayerRoutingModule,
    MatToolbarModule,
    MatIconModule,
    MatProgressBarModule,
    AzureStorageModule
  ],
  declarations: [DictationAudioPlayerComponent, DictationAudioPlayerManagerComponent],
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
    }],
})

export class DictationAudioPlayerURLPopupModule { }
