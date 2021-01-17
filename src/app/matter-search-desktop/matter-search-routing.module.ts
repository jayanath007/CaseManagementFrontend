import { MatterSearchManagerRouterHostComponent } from './containers/matter-search-manager-router-host.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

const myRoutes: Routes = [{
  path: 'index', component: MatterSearchManagerRouterHostComponent,
  // resolve: {
  //   inputData: PageTokenInputResolverService,
  // }
}];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(myRoutes)],
  declarations: []
})
export class MatterSearchRoutingModule { }
