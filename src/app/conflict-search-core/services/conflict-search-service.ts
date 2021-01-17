import { OpportunityConflictSearchSaveRequest } from './../models/interfaces';
import { map } from 'rxjs/operators';
import {
  ConflictSearchClientResponse, ConflictSearchClientRequest,
  ConflictSearchClientDetailResponse,
  ClientResponse,
  ConflictSearchSaveRequest,
  OpportunityConflictSearchRequest
} from '../models/interfaces';
import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../../core';

@Injectable()
export class ConflictSearchService {

  constructor(private http: HttpClient, private appConfig: AppConfig) { }

  public getClientList(request: ConflictSearchClientRequest) {
    return this.http.post<ConflictSearchClientResponse>
      (this.appConfig.serviceBase + `/Client/GetClientConflictCheckList`,
        request.toPost());
  }
  public getClientDetailList(clientRef: string) {
    return this.http.get<ConflictSearchClientDetailResponse>(this.appConfig.serviceBase
      + '/Client/GetAllMattersByClientRef?clientRef=' + clientRef).pipe(map(response => response));
  }
  public getClient(clientRef: string) {
    return this.http.get<ClientResponse>(this.appConfig.serviceBase
      + '/Client/GetClientInformationByClientRef?clientRef=' + clientRef).pipe(map(response => response));
  }
  public conflictSearchSave(request: ConflictSearchSaveRequest) {
    return this.http.post<ConflictSearchClientResponse>
      (this.appConfig.serviceBase + `/Client/SaveConflictCheck`, request.toPost());
  }
  public getOpportunityClientList(request: OpportunityConflictSearchRequest) {
    return this.http.post<ConflictSearchClientResponse>
      (this.appConfig.serviceBase + `/Opportunity/GetOpportunityConflictSearchResults`,
        request.toPost());
  }
  public opportunityConflictSave(request: OpportunityConflictSearchSaveRequest) {
    return this.http.post<ConflictSearchClientResponse>
      (this.appConfig.serviceBase + `/Opportunity/SaveOpportunityConflictSearch`,
        request.toPost());
  }
}
