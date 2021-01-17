import { UserMovementDesktopPopupComponent } from './containers/user-movement-desktop-popup.component';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

const myRoutes: Routes = [{
    path: 'index', component: UserMovementDesktopPopupComponent
}];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(myRoutes)],
    declarations: []
})

export class UserMovementRoutingModule { }
