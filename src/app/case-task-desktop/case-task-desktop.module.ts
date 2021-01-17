import { CaseTaskGridRowComponent } from './components/case-task-grid-row/case-task-grid-row.component';
import { CaseTaskManagerComponent } from './containers/case-task-manager.component';
import { CaseTaskLayoutComponent } from './components/case-task-layout/case-task-layout.component';
import { CaseTaskCoreModule } from '../case-task-core/case-task-core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CommonModule } from '@angular/common';
import {
  MatTabsModule, MatInputModule, MatPaginatorModule, MatTableModule,
  MatExpansionModule, MatIconModule, MatButtonModule, MatProgressBarModule,
  MatListModule, MatToolbarModule , MatCheckboxModule
} from '@angular/material';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { CaseTaskComponent } from './components/case-task/case-task.component';
import { GridFilterDesktopModule } from '../grid-filter-desktop';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    MatPaginatorModule,
    MatExpansionModule,
    CommonModule,
    FlexLayoutModule,
    CaseTaskCoreModule,
    MatToolbarModule,
    FormsModule,
    MatInputModule,
    MatPaginatorModule,
    MatTableModule,
    MatExpansionModule,
    MatButtonModule,
    MatProgressBarModule,
    MatTabsModule,
    MatListModule,
    GridFilterDesktopModule,
    MatIconModule,
    MatCheckboxModule,
  ],
  exports: [CaseTaskManagerComponent,
    CaseTaskGridRowComponent, CaseTaskComponent],
  declarations: [CaseTaskManagerComponent, CaseTaskGridRowComponent, CaseTaskComponent,
    CaseTaskLayoutComponent,
  ]
})
export class CaseTaskDesktopModule { }
