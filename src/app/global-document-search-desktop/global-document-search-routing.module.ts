import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GlobalDocumentSearchManagerRouterHostComponent } from './containers/global-document-search-manager-router-host.component';

// import { GridFilterDesktopModule } from '../grid-filter-desktop';


const myRoutes: Routes = [{
  path: 'index', component: GlobalDocumentSearchManagerRouterHostComponent,
}];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(myRoutes)],
  declarations: []
})
export class GlobalDocumentSearchRoutingModule { }
