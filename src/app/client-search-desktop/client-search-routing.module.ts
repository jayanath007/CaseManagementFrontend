import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { ClientSearchManagerRouterHostComponent } from './containers/client-search-manager-router-host.component';

const myRoutes: Routes = [{
  path: 'index', component: ClientSearchManagerRouterHostComponent,
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
export class ClientSearchRoutingModule { }
