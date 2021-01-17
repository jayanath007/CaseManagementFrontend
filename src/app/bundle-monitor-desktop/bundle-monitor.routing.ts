import { EffectsModule } from '@ngrx/effects';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { BundleMonitorManagerRouterHostComponent } from './containers/bundle-monitor-manager-router-host.component';
import { BundleMonitorEffect } from './effects/bundle-monitor.effect';

const routes: Routes = [
  {
    path: '', component: BundleMonitorManagerRouterHostComponent,
  }
];
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    EffectsModule.forFeature([BundleMonitorEffect])
  ],
  declarations: [],
  exports: [RouterModule]
})
export class BundleMonitorRoutes { }

