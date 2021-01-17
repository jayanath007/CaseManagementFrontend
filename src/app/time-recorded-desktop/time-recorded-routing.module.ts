import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TimeRecordedManagerRouterHostComponent } from './containers/time-recorded-manager-router-host.component';

const myRoutes: Routes = [{
    path: '', component: TimeRecordedManagerRouterHostComponent,
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
export class TimeRecordedRoutingModule { }
