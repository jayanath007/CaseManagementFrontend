import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ExceptionInterceptor } from '../shared/services/exception-interceptor.service';
import { AuthInterceptorService } from '../auth';
import { SharedModule } from '../shared/shared.module';
import { TaskAddEditRouterHostComponent } from './containers/task-add-edit-router-host.component';
import { TaskAddEditManagerComponent } from './containers/task-add-edit-manager.component';
import { TaskAddEditLayoutComponent } from './components/task-add-edit-layout/task-add-edit-layout.component';
import {
  MatSelectModule, MatInputModule, MatButtonModule, MatIconModule, MatListModule,
  MatSnackBarModule, MatProgressBarModule, MatToolbarModule,
   MatDatepickerModule, MatNativeDateModule, MatTooltipModule, MAT_DATE_LOCALE, MatChipsModule,
} from '@angular/material';
import { TaskAddEditContainerComponent } from './components/task-add-edit-container/task-add-edit-container.component';
import { AddEditTaskFileUploadComponent } from './components/task-add-edit-file-upload/add-edit-task-file-upload.component';
import { TaskAddEditCoreModule } from '../task-add-edit-core/task-add-edit-core.module';


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    TaskAddEditCoreModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatProgressBarModule,
    MatToolbarModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTooltipModule,
    MatChipsModule,
    MatSnackBarModule
  ],
  declarations: [
    TaskAddEditRouterHostComponent,
    TaskAddEditManagerComponent,
    TaskAddEditLayoutComponent,
    TaskAddEditContainerComponent,
    AddEditTaskFileUploadComponent,
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
    DatePipe
  ],
  entryComponents: [TaskAddEditRouterHostComponent]
})
export class TaskAddEditDesktopModule {
  popupComponent = TaskAddEditRouterHostComponent;
}

