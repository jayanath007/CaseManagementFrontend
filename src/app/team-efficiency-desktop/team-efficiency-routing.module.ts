import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { TeamEfficiencyRouterHostComponent } from './containers/team-efficiency-router-host.components';
import { CommonModule } from '@angular/common';

const myRoutes: Routes = [{
    path: 'index', component: TeamEfficiencyRouterHostComponent
}];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(myRoutes)],
    declarations: []
})

export class TeamEfficiencyRoutingModule { }
