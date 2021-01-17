import { ScreenContactSearchInputComponent } from './components/screen-contact-search-input/screen-contact-search-input.component';
import { ScreenContactGridRowComponent } from './components/screen-contact-grid-row/screen-contact-grid-row.component';
import { ScreenContactManagerComponent } from './containers/screen-contact-manager.component';
import { ScreenContactLayoutComponent } from './components/screen-contact-layout/screen-contact-layout.component';
import { ScreenContactCoreModule } from '../screen-contact-core/screen-contact-core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CommonModule, DatePipe } from '@angular/common';
import {
  MatTabsModule, MatInputModule, MatPaginatorModule, MatTableModule,
  MatExpansionModule, MatIconModule, MatButtonModule, MatProgressBarModule, MatListModule, MatToolbarModule
} from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { ScreenContactSearchComponent } from './components/screen-contact-search/screen-contact-search.component';
import { GridFilterDesktopModule } from '../grid-filter-desktop';
import { ScreenContactPopupManagerComponent } from './containers/screen-contact-popup-manager.component';
import { ScreenConfigContactSearchComponent } from './components/screen-config-contact-search/screen-config-contact-search.component';
import { ScreenContactSearchConfigHeaderComponent } from './components/screen-contact-search-config-header/screen-contact-search-config-header.component';
import { ScreenContactSearchConfigRowComponent } from './components/screen-contact-search-config-row/screen-contact-search-config-row.component';
// import { ScreenContactSearchInputComponent } from './components/screen-contact-search-input/screen-contact-search-input.component';
@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    MatPaginatorModule,
    MatExpansionModule,
    CommonModule,
    FlexLayoutModule,
    ScreenContactCoreModule,
    FormsModule,
    MatToolbarModule,
    MatInputModule,
    MatPaginatorModule,
    MatTableModule,
    MatExpansionModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatTabsModule,
    MatListModule,
    GridFilterDesktopModule,
    ReactiveFormsModule,
  ],
  exports: [ScreenContactManagerComponent,
    ScreenContactGridRowComponent, ScreenContactSearchComponent],
  declarations: [ScreenContactManagerComponent,
    ScreenContactGridRowComponent,
    ScreenContactSearchComponent,
    ScreenContactLayoutComponent,
    ScreenContactPopupManagerComponent,
    ScreenContactSearchInputComponent,
    ScreenConfigContactSearchComponent,
    ScreenContactSearchConfigHeaderComponent,
    ScreenContactSearchConfigRowComponent,
  ],
  entryComponents: [
    ScreenContactPopupManagerComponent,
  ],
  providers: [
    DatePipe
  ],
})
export class ScreenContactDesktopModule {
  popupComponent = ScreenContactPopupManagerComponent;
 }
