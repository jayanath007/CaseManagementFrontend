import { FormsLibraryEffects } from './effects/forms-library.effects';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ExceptionInterceptor } from '../shared/services/exception-interceptor.service';
import { AuthInterceptorService } from '../auth';
import {
  MAT_DATE_LOCALE, MatToolbarModule, MatIconModule,
  MatButtonModule, MatInputModule,
  MatListModule, MatProgressBarModule
} from '@angular/material';
import { MatTreeModule } from '@angular/material/tree';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { reducers } from './reducers';
import { SharedModule } from '../shared/shared.module';
import { FormsLibraryRouterHostComponent } from './containers/forms-library-router-host.component';
import { FormsLibraryManagerComponent } from './containers/forms-library-manager.component';
import { FormsLibraryLayoutComponent } from './components/forms-library-layout/forms-library-layout.component';
import { FormsLibraryService } from './services/forms-library.service';
import { FormsLibraryTreeComponent } from './components/forms-library-tree/forms-library-tree.component';
import { FormsLibraryTreeDetailsComponent } from './components/forms-library-tree-details/forms-library-tree-details.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatListModule,
    MatProgressBarModule,
    StoreModule.forFeature('dpsFormsLibrary', reducers),
    EffectsModule.forFeature([FormsLibraryEffects]),
    MatTreeModule
  ],
  declarations: [
    FormsLibraryRouterHostComponent,
    FormsLibraryManagerComponent,
    FormsLibraryLayoutComponent,
    FormsLibraryTreeComponent,
    FormsLibraryTreeDetailsComponent,
  ],
  providers: [
    FormsLibraryService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ExceptionInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true,
    },
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
  ],
  entryComponents: [FormsLibraryRouterHostComponent]
})
export class FormsLibraryModule {
  popupComponent = FormsLibraryRouterHostComponent;
}
