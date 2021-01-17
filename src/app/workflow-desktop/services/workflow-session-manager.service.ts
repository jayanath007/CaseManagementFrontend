
import { refCount, publishReplay, map } from 'rxjs/operators';
import { Injectable, Injector, ApplicationRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseSessionManager, FileLogicMetadata } from '../../workflow-core';
import { FileSessionService } from './file-session.service';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { OverlayModuleLoaderService } from '../../shell-desktop';
import { APP_ID, BRANCH_ID, FILE_ID, SESSION_TOKEN } from '../../core/lib/workflow-tokens';
import { AppConfig } from '../../core';

import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

@Injectable()
export class WorkflowSessionManagerService extends BaseSessionManager<FileSessionService> {

  private _commonTemplateData$: Observable<FileLogicMetadata[]> = null;

  constructor(private overlay: Overlay, private moduleLoader: OverlayModuleLoaderService, private appRef: ApplicationRef,
    private httpClient: HttpClient, private appConfig: AppConfig, protected store: Store<any>) { super(); }

  private sessionMap = new Map<string, { compRef: any, overlayRef: OverlayRef }>();

  createFileSession(appId: number, fileId: number, branchId: number, parentInjector: Injector, token: string, replace = false) {
    const hash = this.toHash(appId, fileId, branchId);
    if (this.sessionMap.has(hash)) {
      if (!replace) {
        return new Promise((resolve, reject) => {
          resolve(this.sessionMap.get(hash));
        });
      }
      this.destroyFileSession(appId, fileId, branchId);
    }

    return this.loadWorkflowModules(parentInjector, appId, fileId, branchId, token).then((moduleInfo) => {
      this.sessionMap.set(hash, moduleInfo);
      return moduleInfo;
    });
  }

  destroyFileSession(appId: number, fileId: number, branchId: number) {
    const hash = this.toHash(appId, fileId, branchId);
    if (this.sessionMap.has(hash)) {
      this.sessionMap.get(hash).overlayRef.detach();
      this.sessionMap.get(hash).overlayRef.dispose();
      this.sessionMap.delete(hash);
    }
  }

  public getCommonTemplateData() {
    return this.httpClient.get<{ data: FileLogicMetadata[] }>(this.appConfig.serviceBase2 + '/Workflow/GetCommonTemplateData').pipe(
      map(result => result.data));
  }

  public get commonTemplateData() {
    if (!this._commonTemplateData$) {
      this._commonTemplateData$ = this.getCommonTemplateData().pipe(
        publishReplay(1),
        refCount());
    }

    return this._commonTemplateData$;
  }

  public loadWorkflowModules(injector: Injector, appId: number, fileId: number, branchId: number, token: string) {
    const inputProviders = [
      { provide: APP_ID, useValue: appId },
      { provide: BRANCH_ID, useValue: branchId },
      { provide: FILE_ID, useValue: fileId },
      { provide: SESSION_TOKEN, useValue: token },
    ];
    return this.moduleLoader.createWorkflowSessionInstance(inputProviders, injector);
  }

}
