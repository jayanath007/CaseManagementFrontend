import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TeamManagerRouterHostComponent } from './containers/team-manager-router-host.component';


// import { GridFilterDesktopModule } from '../grid-filter-desktop';


const myRoutes: Routes = [{
  path: 'index', component: TeamManagerRouterHostComponent,
}];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(myRoutes)],
  declarations: []
})
export class TeamRoutingModule { }
