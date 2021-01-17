import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { PostOfficeActionLayoutComponent } from './components/post-office-action-layout/post-office-action-layout.component';
import { PostOfficeActionPopupComponent } from './containers/post-office-action-popup.component';
import { PostOfficeActionCoreModule } from '../post-office-action-core/post-office-action-core.module';
import { PostOfficeActionManagerComponent } from './containers/post-office-action-manager.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ExceptionInterceptor } from '../shared/services/exception-interceptor.service';
import { AuthInterceptorService } from '../auth';
import {
  MAT_DATE_LOCALE, MatToolbarModule, MatDatepickerModule, MatProgressBarModule,
  MatButtonModule, MatNativeDateModule, MatInputModule,
  MatCheckboxModule, MatSelectModule, MatIconModule, MatTabsModule, MatCardModule, MatRadioModule
} from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    PostOfficeActionCoreModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatCheckboxModule,
    MatProgressBarModule,
    MatButtonModule,
    FlexLayoutModule,
    MatToolbarModule,
    MatIconModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    PostOfficeActionCoreModule,
    MatTabsModule,
    MatCardModule,
    MatRadioModule,
  ],
  declarations: [
    PostOfficeActionLayoutComponent,
    PostOfficeActionPopupComponent,
    PostOfficeActionManagerComponent,
  ],
  providers: [
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
  entryComponents: [PostOfficeActionPopupComponent]

})



export class PostOfficeActionDesktopModule {
  popupComponent = PostOfficeActionPopupComponent;
}
