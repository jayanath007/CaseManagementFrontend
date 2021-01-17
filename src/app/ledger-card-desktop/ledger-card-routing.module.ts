import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LedgerCardManagerRouterHostComponent } from './containers/ledger-card-manager-router-host.component';

const myRoutes: Routes = [{
    path: 'index', component: LedgerCardManagerRouterHostComponent,
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
export class LedgerCardRoutingModule { }
