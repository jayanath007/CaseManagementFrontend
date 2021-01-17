
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProbateDesktopPopupComponent } from './containers/probate-desktop-popup/probate-desktop-popup.component';

const myRoutes: Routes = [{
    path: 'index', component: ProbateDesktopPopupComponent
}];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(myRoutes)],
    declarations: []
})

export class ProbateRoutingModule { }