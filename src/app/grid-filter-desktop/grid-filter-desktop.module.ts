import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { OverlayModule } from '@angular/cdk/overlay';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';

import {
  MatDialogModule,
  MatButtonModule,
  MatMenuModule,
  MatSelectModule,
  MatOptionModule,
  MatIconModule,
  MatCardModule,
  MatInputModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatCheckboxModule,
  MatRadioModule,
  MatPaginatorModule,
  MatProgressBarModule

} from '@angular/material';

import { GridFieldFilterComponent } from './components/grid-field-filter/grid-field-filter.component';
import { ColumnHeaderComponent } from './components/column-header/column-header.component';
import { FilterConditionComponent } from './components/filter-condition/filter-condition.component';
import { SharedModule } from '../shared/shared.module';
import { GridContainerComponent } from './components/grid-container/grid-container.component';

@NgModule({
  imports: [
    CommonModule,
    OverlayModule,
    FlexLayoutModule,
    MatDialogModule,
    MatButtonModule,
    MatMenuModule,
    MatSelectModule,
    MatOptionModule,
    MatIconModule,
    MatCardModule,
    FormsModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    SharedModule,
    MatCheckboxModule,
    MatRadioModule,
    MatPaginatorModule,
    MatProgressBarModule,
  ],
  declarations: [
    GridFieldFilterComponent,
    ColumnHeaderComponent,
    FilterConditionComponent,
    GridContainerComponent,
  ],
  exports: [GridFieldFilterComponent, ColumnHeaderComponent , GridContainerComponent]
})
export class GridFilterDesktopModule { }
