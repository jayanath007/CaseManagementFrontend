import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { WorkDoneManagerRouterHostComponent } from './containers/work-done-manager-router-host.component';
// import { GridFilterDesktopModule } from '../grid-filter-desktop';


const myRoutes: Routes = [{
  path: 'index', component: WorkDoneManagerRouterHostComponent,
}];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(myRoutes)],
  declarations: []
})
export class WorkDoneRoutingModule { }
