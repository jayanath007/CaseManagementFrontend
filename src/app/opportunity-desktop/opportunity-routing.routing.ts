import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OpportunityManagerRouterHostComponent } from './containers/opportunity-manager-router-host.component';

const routes: Routes = [
  {
    path: 'index', component: OpportunityManagerRouterHostComponent,
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)],
  declarations: []
})
export class OpportunityRouting { }
