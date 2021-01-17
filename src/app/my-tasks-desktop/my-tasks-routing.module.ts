import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MyTasksManagerRouterHostComponent } from './containers/my-tasks-manager-router-host.component';

const myRoutes: Routes = [{
  path: 'index', component: MyTasksManagerRouterHostComponent,

}];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(myRoutes)],
  declarations: []
})
export class MyTasksRoutingModule { }


