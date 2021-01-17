import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DictationsManagerRouterHostComponent } from './containers/dictations-manager-router-host.component';
import { DictationAudioPlayerManagerComponent } from './containers/dictation-audio-player-managet.component';


const myRoutes: Routes = [{
  path: 'index', component: DictationsManagerRouterHostComponent,
}];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(myRoutes)],
  declarations: []
})
export class DictationsRoutingModule { }

const urlPopupRoutes: Routes = [{
  path: ':jobId', component: DictationAudioPlayerManagerComponent,
}];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(urlPopupRoutes)],
})
export class DictationAudioPlayerRoutingModule { }

