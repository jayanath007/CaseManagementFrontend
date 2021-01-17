import { CaseTimeGridRowComponent } from './components/case-time-grid-row/case-time-grid-row.component';

import { CaseTimeManagerComponent } from './containers/case-time-manager.component';
import { CaseTimeLayoutComponent } from './components/case-time-layout/case-time-layout.component';
import { CaseTimeCoreModule } from '../case-time-core/case-time-core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CommonModule } from '@angular/common';
import {
  MatTabsModule, MatInputModule, MatPaginatorModule, MatTableModule,
  MatExpansionModule, MatIconModule, MatButtonModule, MatProgressBarModule, MatListModule, MatToolbarModule
} from '@angular/material';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { CaseTimeComponent } from './components/case-time/case-time.component';
import { GridFilterDesktopModule } from '../grid-filter-desktop';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    MatPaginatorModule,
    MatExpansionModule,
    CommonModule,
    FlexLayoutModule,
    CaseTimeCoreModule,
    FormsModule,
    MatInputModule,
    MatToolbarModule,
    MatPaginatorModule,
    MatTableModule,
    MatExpansionModule,
    MatButtonModule,
    MatProgressBarModule,
    MatTabsModule,
    MatListModule,
    GridFilterDesktopModule,
    MatIconModule
  ],
  exports: [CaseTimeManagerComponent,
    CaseTimeGridRowComponent, CaseTimeComponent],
  declarations: [CaseTimeManagerComponent, CaseTimeGridRowComponent, CaseTimeComponent,
    CaseTimeLayoutComponent,
  ]
})
export class CaseTimeDesktopModule { }
