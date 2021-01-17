import { Injectable } from '@angular/core';
import { NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as _ from 'lodash';

import { TemplateSession } from '../models/template-session';
import { AuthInfoStateService } from '../../auth';
import { UIContext } from '../models/ui-context';

@Injectable()
export class WorkflowSessionService {

  constructor(private zone: NgZone, private httpClient: HttpClient, private auth: AuthInfoStateService) { }

  public createTemplateSession(appId: number, fileId: number, branchId: number,
    templateId: string, templateDescription: string, uiContext: UIContext, isFormLibraryTemplate: boolean,
    formLibraryTemplatePath: boolean) {
    return new TemplateSession(this.zone, this.httpClient, () => this.auth.acquireDpsWebServiceToken(), '/hubs/workflow-streaming',
      appId, fileId, branchId, templateId, templateDescription, uiContext, isFormLibraryTemplate, formLibraryTemplatePath);
  }
}
