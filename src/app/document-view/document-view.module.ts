import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';
import { WindowPopupsManagerService } from './services/window-popups-manager.service';
import { FileUrlResolverService } from './services/file-url-resolver.service';
import { WindowPopupsEffects } from './effects/window-popups.effects';
import { DocumentEditingEffect } from './effects/document-editing.effects';
import { DocumentViewPageComponent } from './components/document-view-page/document-view-page.component';
import { MatIconModule, MatProgressBarModule, MatButtonModule, MatToolbarModule, MatSnackBarModule } from '@angular/material';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DocumentViewPopupComponent } from './components/document-view-popup/document-view-popup.component';
import { ExceptionInterceptor } from '../shared/services/exception-interceptor.service';
import { AuthInterceptorService } from '../auth';
import { DriveMailIntegration } from '../core';


@NgModule({
  imports: [
    HttpClientModule,
    CommonModule,
    EffectsModule.forFeature([WindowPopupsEffects, DocumentEditingEffect]),
    MatIconModule,
    MatProgressBarModule,
    MatButtonModule,
    FlexLayoutModule,
    MatSnackBarModule
  ],
  exports: [DocumentViewPageComponent],
  declarations: [DocumentViewPageComponent],
  providers: [WindowPopupsManagerService, FileUrlResolverService,
    // {
    //   provide: HTTP_INTERCEPTORS,
    //   useClass: ExceptionInterceptor,
    //   multi: true,
    // },
    // {
    //   provide: HTTP_INTERCEPTORS,
    //   useClass: AuthInterceptorService,
    //   multi: true,
    // },
    { provide: DriveMailIntegration, useClass: FileUrlResolverService }
  ]
})
export class DocumentViewModule { }

@NgModule({
  imports: [
    HttpClientModule,
    CommonModule,
    MatIconModule,
    MatButtonModule,
    FlexLayoutModule,
    DocumentViewModule,
    MatToolbarModule
  ],
  declarations: [DocumentViewPopupComponent],
  entryComponents: [DocumentViewPopupComponent]
})
export class DocumentViewPopupModule {
  popupComponent = DocumentViewPopupComponent;
}

