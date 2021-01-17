import { ContactGridComponent } from './components/contact-grid/contact-grid.component';

import { DocumentViewModule } from '../destop-components/document-view/document-view.module';
import { ContactCoreModule } from '../contact-core/contact-core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CommonModule } from '@angular/common';
import {
  MatTabsModule, MatInputModule, MatPaginatorModule, MatTableModule,
  MatExpansionModule, MatIconModule, MatButtonModule, MatProgressSpinnerModule
} from '@angular/material';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { ContactHomeComponent } from './containers/contact-home/contact-home.component';


@NgModule({

  imports: [
    MatPaginatorModule,
    MatTableModule,
    MatExpansionModule,
    CommonModule,
    FlexLayoutModule,
    ContactCoreModule,
    FormsModule,
    MatInputModule,
    MatPaginatorModule,
    MatTableModule,
    MatExpansionModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    DocumentViewModule
  ],
  exports: [ContactHomeComponent, ContactGridComponent],
  declarations: [ContactHomeComponent, ContactGridComponent]
})
export class ContactDestopModule { }
