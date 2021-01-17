import { CaseContactGridRowComponent } from './components/case-contact-grid-row/case-contact-grid-row.component';
import { CaseContactManagerComponent } from './containers/case-contact-manager.component';
import { CaseContactLayoutComponent } from './components/case-contact-layout/case-contact-layout.component';
import { CaseContactCoreModule } from '../case-contact-core/case-contact-core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CommonModule } from '@angular/common';
import {
  MatTabsModule, MatInputModule, MatPaginatorModule, MatTableModule,
  MatExpansionModule, MatButtonModule, MatProgressBarModule, MatListModule, MatToolbarModule, MatTooltipModule
} from '@angular/material';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { CaseContactComponent } from './components/case-contact/case-contact.component';
import { GridFilterDesktopModule } from '../grid-filter-desktop';



@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    MatPaginatorModule,
    MatExpansionModule,
    CommonModule,
    FlexLayoutModule,
    CaseContactCoreModule,
    FormsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatInputModule,
    MatPaginatorModule,
    MatTableModule,
    MatExpansionModule,
    MatButtonModule,
    MatProgressBarModule,
    MatTabsModule,
    MatListModule,
    GridFilterDesktopModule,
  ],
  exports: [CaseContactManagerComponent,
    CaseContactGridRowComponent, CaseContactComponent],
  declarations: [CaseContactManagerComponent, CaseContactGridRowComponent, CaseContactComponent,
    CaseContactLayoutComponent,

  ]
})
export class CaseContactDesktopModule { }
