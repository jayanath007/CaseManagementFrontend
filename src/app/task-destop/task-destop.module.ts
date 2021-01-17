import { TaskGridComponent } from './components/task-grid/task-grid.component';

import { DocumentViewModule } from '../destop-components/document-view/document-view.module';
import { TaskCoreModule } from '../task-core/task-core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CommonModule } from '@angular/common';
import {
  MatTabsModule, MatInputModule, MatPaginatorModule, MatTableModule,
  MatExpansionModule, MatIconModule, MatButtonModule, MatProgressSpinnerModule, MatListModule
} from '@angular/material';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { TaskHomeComponent } from './containers/task-home/task-home.component';


@NgModule({

  imports: [
    MatPaginatorModule,
    MatTableModule,
    MatExpansionModule,
    CommonModule,
    FlexLayoutModule,
    TaskCoreModule,
    FormsModule,
    MatInputModule,
    MatPaginatorModule,
    MatTableModule,
    MatExpansionModule,
    MatListModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    DocumentViewModule
  ],
  exports: [TaskHomeComponent, TaskGridComponent],
  declarations: [TaskHomeComponent, TaskGridComponent]
})
export class TaskDestopModule { }
