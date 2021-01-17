import { SharedDataModule } from './../shared-data/shared-data.module';
import { CommonModule } from '@angular/common';
// FOR testing
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatButtonModule, MatChipsModule, MatExpansionModule, MatIconModule, MatInputModule,
  MatListModule, MatPaginatorModule, MatProgressBarModule, MatTableModule, MatToolbarModule, MatTooltipModule
} from '@angular/material';
import { AuthInterceptorService } from '../auth';
import { ClientSearchCoreModule } from '../client-search-core/matter-search-core.module';
import { GridFilterDesktopModule } from '../grid-filter-desktop';
import { ExceptionInterceptor } from '../shared/services/exception-interceptor.service';
import { SharedModule } from '../shared/shared.module';
import { ClientSearchRoutingModule } from './client-search-routing.module';
import { ClientGridFixRowPopupComponent } from './components/client-grid-fix-row-popup/client-grid-fix-row-popup.component';
import { ClientGridFixRowComponent } from './components/client-grid-fix-row/client-grid-fix-row.component';
import { ClientGridComponent } from './components/client-grid/client-grid.component';
import { ClientSearchBoxComponent } from './components/client-search-box/client-search-box.component';
import { ClientSearchLayoutComponent } from './components/client-search-layout/client-search-layout.component';
import { ClientSearchPopupComponent } from './components/client-search-popup/client-search-popup.component';
import { ClientSearchViewsComponent } from './components/client-search-views/client-search-views.component';
import { GridButtonDetailsComponent } from './components/grid-button-details/grid-button-details.component';
import { MatterGridFixRowComponent } from './components/matter-grid-fix-row/matter-grid-fix-row.component';
import { MatterGridComponent } from './components/matter-grid/matter-grid.component';
import { ClientSearchManagerRouterHostComponent } from './containers/client-search-manager-router-host.component';
import { ClientSearchManagerComponent } from './containers/client-search-manager.component';
import { ClientSearchPopupManagerComponent } from './containers/client-search-popup-manager.component';





@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    SharedDataModule,
    ClientSearchCoreModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    MatTableModule,
    MatExpansionModule,
    GridFilterDesktopModule,
    MatProgressBarModule,
    FormsModule,
    MatToolbarModule,
    MatChipsModule,
    MatListModule,
    ReactiveFormsModule,
    MatTooltipModule
  ],
  declarations: [
    ClientSearchManagerRouterHostComponent,
    ClientSearchPopupManagerComponent,
    ClientSearchManagerComponent,
    ClientSearchLayoutComponent,
    ClientGridComponent,
    ClientSearchViewsComponent,
    ClientSearchBoxComponent,
    ClientGridFixRowComponent,
    MatterGridComponent,
    MatterGridFixRowComponent,
    GridButtonDetailsComponent,
    ClientSearchPopupComponent,
    ClientGridFixRowPopupComponent
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ExceptionInterceptor,
      multi: true,
    }
  ],
  entryComponents: [ClientSearchPopupManagerComponent]

})
export class ClientSearchDesktopGeneric {
  popupComponent = ClientSearchPopupManagerComponent; // use in popup service as entry component
}

@NgModule({
  imports: [
    ClientSearchRoutingModule,
    ClientSearchDesktopGeneric
  ],
  declarations: [
  ],

})
export class ClientSearchDesktopModule {
}
