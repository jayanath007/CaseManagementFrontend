import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PostOfficeManagerRouterHostComponent } from './containers/post-office-manager-router-host.component';

const myRoutes: Routes = [{
  path: 'index', component: PostOfficeManagerRouterHostComponent,
}];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(myRoutes)],
  declarations: []
})
export class PostOfficeRoutingModule { }
