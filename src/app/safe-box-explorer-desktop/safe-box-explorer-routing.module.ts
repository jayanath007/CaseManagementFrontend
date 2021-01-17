import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SafeBoxExplorerManagerRouterHostComponent } from './containers/safe-box-explorer-manager-router-host.component';



const myRoutes: Routes = [{
  path: 'index',
  component: SafeBoxExplorerManagerRouterHostComponent,
}];

@NgModule({
  imports: [
    HttpClientModule,
    CommonModule,
    RouterModule.forChild(myRoutes)],
    declarations: [],
})
export class SafeBoxExplorerRoutingModule { }


