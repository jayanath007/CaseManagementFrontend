import { ServiceEndpointConfig } from './../../core/configs/service-configs';
import { HttpClient } from '@angular/common/http';
import { AuthInfoStateService } from './../../auth';
import { AppConfig, OutlookClientBase } from './../../core';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

@Injectable()
export class MsgraphClientService {

  private outlookClient: OutlookClientBase = null;

  constructor(private authInfo: AuthInfoStateService, private httpClient: HttpClient,
    private configs: ServiceEndpointConfig, private appConfig: AppConfig) {
  }

  private getOrCreateClient() {
    if (!this.outlookClient) {
      this.outlookClient = new OutlookClientBase(this.authInfo, this.httpClient, this.configs.getGraphApiConfig());
    }
    return this.outlookClient;
  }
  public createAttachemntRawContentPath(owner: string, itemId: string, attId: string, type: string) {
    return this.getOrCreateClient().createAttachemntRawContentPath(owner, itemId, attId, type)
      .pipe(map(path => this.appConfig.inlineAttachmentBase + path));
  }

}
