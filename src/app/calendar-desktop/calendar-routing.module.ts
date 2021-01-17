import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { CalendarManagerComponent } from './containers/calendar-manager.component';

const routes: Routes = [
    {
        path: 'index', component: CalendarManagerComponent,
    },
];
@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(routes)
    ],
    declarations: [],
    exports: [RouterModule]
})
export class CalendarRoutingModule { }
