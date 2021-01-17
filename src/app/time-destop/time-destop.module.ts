import { TimeGridComponent } from './components/time-grid/time-grid.component';

import { DocumentViewModule } from '../destop-components/document-view/document-view.module';
import { TimeCoreModule } from '../time-core/time-core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CommonModule } from '@angular/common';
import {
  MatTabsModule, MatInputModule, MatPaginatorModule, MatTableModule,
  MatExpansionModule, MatIconModule, MatButtonModule, MatProgressSpinnerModule
} from '@angular/material';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { TimeHomeComponent } from './containers/time-home/time-home.component';


@NgModule({

  imports: [
    MatPaginatorModule,
    MatTableModule,
    MatExpansionModule,
    CommonModule,
    FlexLayoutModule,
    TimeCoreModule,
    FormsModule,
    MatInputModule,
    MatPaginatorModule,
    MatTableModule,
    MatExpansionModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    DocumentViewModule
  ],
  exports: [TimeHomeComponent, TimeGridComponent],
  declarations: [TimeHomeComponent, TimeGridComponent]
})
export class TimeDestopModule { }
