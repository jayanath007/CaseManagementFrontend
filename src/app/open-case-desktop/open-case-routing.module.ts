
import { CommonTabRouterHostComponent } from './containers/common-tab-router-host.component';
import { DummyRouterOutletComponent } from '../shared/components/dummy-router-outlet.component';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes, Resolve } from '@angular/router';
import { OpenCaseRouteGuardService } from './services/open-case-route-guard.service';
import { MainMenuItemResolverService } from '../layout-desktop';
import { OpenCaseRouterHostComponent } from './containers/open-case-router-host.component';
import { RouterOutlets } from '../open-case-core/models/enums';


const myRoutes: Routes = [
  {
    path: ':token', component: OpenCaseRouterHostComponent,
    canActivate: [OpenCaseRouteGuardService],
    resolve: {
      inputData: MainMenuItemResolverService
    }
  },
];

// const myRoutes: Routes = [
//   {
//     path: ':token', component: CommonTabRouterHostComponent,
//     canActivate: [OpenCaseRouteGuardService],
//     children: [
//       {
//         path: 'workflow-menu',
//         loadChildren: 'app/workflow-menu-desktop/workflow-menu-desktop.module#WorkflowMenuDesktopModule',
//         resolve: {
//           inputData: MainMenuItemResolverService
//         },
//       },
//       {
//         path: '',
//         component: OpenCaseRouterHostComponent,
//         // canActivate: [OpenCaseRouteGuardService],
//         resolve: {
//           inputData: MainMenuItemResolverService
//         },
//       },

//     ]
//   }];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(myRoutes)
  ],
  declarations: []
})
export class OpenCaseRoutingModule { }


