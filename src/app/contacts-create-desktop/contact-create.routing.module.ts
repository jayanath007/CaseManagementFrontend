import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ContactCreateRouterHostComponent } from './containers/contact-create-manager-router-host.component';


const myRoutes: Routes = [{
  path: 'index', component: ContactCreateRouterHostComponent,
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
export class ContactCreateRoutingModule { }
