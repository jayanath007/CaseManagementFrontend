import { WorkflowDiaryService } from './services/workflow-diary-service';
import { SharedModule } from '../shared/shared.module';
import { SaveLinkedLettersScreenComponent } from './components/save-linked-letters-screen/save-linked-letters-screen.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkflowCoreModule } from '../workflow-core/workflow-core.module';
import { MessageBoxComponent } from './components/message-box/message-box.component';
import { WorkflowSessionManagerService } from './services/workflow-session-manager.service';
import { MatToolbarModule } from '@angular/material/toolbar';

import {
  MatDialogModule,
  MatButtonModule,
  MatSelectModule,
  MatOptionModule,
  MatIconModule,
  MatCardModule,
  MatInputModule,
  MatListModule,
  MatCheckboxModule,
  MatProgressSpinnerModule,


} from '@angular/material';

import { InputBoxComponent } from './components/input-box/input-box.component';
import { FileSessionComponent } from './containers/file-session.component';
import { OptionBoxComponent } from './components/option-box/option-box.component';
import { PostCodeMatchingBoxComponent } from './components/post-code-matching-box/post-code-matching-box.component';
import { ShowLinkedLettersScreenComponent } from './components/show-linked-letters-screen/show-linked-letters-screen.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FileUrlResolverService } from '../document-view';
import { WorkflowProgressComponent } from './components/workflow-progress/workflow-progress.component';
import { ScreenBackdropComponent } from './components/screen-backdrop/screen-backdrop.component';
import { ErrorPopupComponent } from './components/error-popup/error-popup.component';
import { ExceptionInterceptor } from '../shared/services/exception-interceptor.service';
import { AuthInterceptorService } from '../auth';
import { FileLogicIndicatorComponent } from './components/file-logic-indicator/file-logic-indicator.component';

@NgModule({
  imports: [
    CommonModule,
    WorkflowCoreModule,
    MatDialogModule,
    MatButtonModule,
    MatSelectModule,
    MatOptionModule,
    MatIconModule,
    MatCardModule,
    MatInputModule,
    MatListModule,
    MatCheckboxModule,
    HttpClientModule,
    MatProgressSpinnerModule,
    MatToolbarModule,
    SharedModule,
  ],

  declarations: [
    MessageBoxComponent,
    InputBoxComponent,
    FileSessionComponent,
    OptionBoxComponent,
    PostCodeMatchingBoxComponent,
    ShowLinkedLettersScreenComponent,
    SaveLinkedLettersScreenComponent,
    WorkflowProgressComponent,
    ScreenBackdropComponent,
    ErrorPopupComponent,
    FileLogicIndicatorComponent
  ],
  entryComponents: [
    MessageBoxComponent,
    InputBoxComponent,
    FileSessionComponent,
    OptionBoxComponent,
    ShowLinkedLettersScreenComponent,
    SaveLinkedLettersScreenComponent,
    ErrorPopupComponent,
    PostCodeMatchingBoxComponent
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
    }
  ],
})
export class WorkflowDesktopModule {
  overlayContainer = FileSessionComponent;

  static forRoot() {
    return {
      ngModule: WorkflowRootModule,
      providers: [WorkflowSessionManagerService, FileUrlResolverService, WorkflowDiaryService],
      HttpClientModule,
    };
  }
}

@NgModule({
})
export class WorkflowRootModule { }



