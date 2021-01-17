import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AuthValidationComponent} from './containers/auth-validation/auth-validation.component';

const authRoutes: Routes = [{path: 'auth', component: AuthValidationComponent}];

@NgModule({
    imports: [
      RouterModule.forChild(authRoutes)
    ],
    exports: [
      RouterModule
    ]
  })
  export class AuthRoutingModule { }





