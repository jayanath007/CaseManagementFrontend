import { TeamEfficiencyCoreModule } from '../team-efficiency-core/team-efficiency-core';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { CommonModule, DecimalPipe } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ExceptionInterceptor } from '../shared/services/exception-interceptor.service';
import { AuthInterceptorService } from '../auth';
import { TeamEfficiencyRouterHostComponent } from './containers/team-efficiency-router-host.components';
import { TeamEfficiencyLayoutComponent } from './components/team-efficiency-layout/team-efficiency-layout.component';
import { TeamUserBarChartComponent } from './components/team-user-bar-chart/team-user-bar-chart.component';

import { TeamEfficiencyManagerComponent } from './containers/team-efficiency-manager.components';
import { TeamEfficiencyRoutingModule } from './team-efficiency-routing.module';
import {
    MatButtonToggleModule, MatSelectModule, MatProgressBarModule,
    MatSidenavModule, MatIconModule, MatChipsModule, MatListModule, MatProgressSpinnerModule, MatDatepickerModule, MatTooltipModule
} from '@angular/material';
import { ChartsModule } from 'ng2-charts';
import { CurrencySymbolsPipe } from '../shared/pipes/currency-symbols.pipe';
import { TeamUserYearActivityComponent } from './components/team-user-year-activity/team-user-year-activity.component';
import { TeamUserGridRowComponent } from './components/team-user-grid-row/team-user-grid-row.component';
import { MovementTypeIconPipe } from '../shared/pipes/movement-type-icon.pipe';
import { DpsMovementTheamPipe } from '../shared/pipes/dps-movement-theam.pipe';




@NgModule({
    imports: [SharedModule,
        CommonModule,
        MatButtonToggleModule,
        MatSelectModule,
        MatProgressBarModule,
        MatSidenavModule,
        MatIconModule,
        MatChipsModule,
        MatListModule,
        MatProgressSpinnerModule,
        TeamEfficiencyCoreModule,
        TeamEfficiencyRoutingModule,
        ChartsModule,
        MatDatepickerModule,
        MatTooltipModule
    ],
    declarations: [TeamEfficiencyRouterHostComponent,
        TeamEfficiencyManagerComponent,
        TeamEfficiencyLayoutComponent,
        TeamUserBarChartComponent,
        TeamUserYearActivityComponent,
        TeamUserGridRowComponent,
        // MovementTypeIconPipe,
        // DpsMovementTheamPipe,
    ],
    providers: [{
        provide: HTTP_INTERCEPTORS,
        useClass: ExceptionInterceptor,
        multi: true,
    },
    {
        provide: HTTP_INTERCEPTORS,
        useClass: AuthInterceptorService,
        multi: true,
    }],
    entryComponents: []
})

export class TeamEfficiencyDesktopModule {

}
