import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConfig, DropdownListData } from '../../core';
import { DPSConstants } from '../../core/lib/dpsConstant';
import {
  PropertyQuoteType, WebQuoteLocalSearch, PropertyQuReport,
  WebQuoteVars, WebQuoteCompnayDetails, WebQuoteBranch, WebQuoteCost
} from '../models/interfaces';
import { Observable } from 'rxjs';
import { PropertyQuRequest, PropertyQuoteSend } from '../models/request';
import { PropertyQuoteApp } from '../../core/lib/web-quote';


@Injectable()
export class PropertyQuoteService {
  constructor(private http: HttpClient, private appConfig: AppConfig) { }

  public getTypeList(): Observable<PropertyQuoteType[]> {
    let header = new HttpHeaders();
    header = header.append(DPSConstants.ControlerAndMethod, 'Apps/GetApps');
    return this.http.get<PropertyQuoteType[]>
      (`${this.appConfig.serviceBase}/WebQuote/DoWebQuoteFunction?suppressFail=true`,
        { headers: header });
  }

  public getBranchs(): Observable<WebQuoteBranch[]> {
    let header = new HttpHeaders();
    header = header.append(DPSConstants.ControlerAndMethod, 'Branches/GetBranches');
    return this.http.get<WebQuoteBranch[]>
      (`${this.appConfig.serviceBase}/WebQuote/DoWebQuoteFunction?suppressFail=true`,
        { headers: header });
  }

  public getLocalAuth(): Observable<WebQuoteLocalSearch[]> {
    let header = new HttpHeaders();
    header = header.append(DPSConstants.ControlerAndMethod, 'LocalSearchRate/GetLocalSearchRate');
    return this.http.get<WebQuoteLocalSearch[]>
      (`${this.appConfig.serviceBase}/WebQuote/DoWebQuoteFunction?suppressFail=true`,
        { headers: header });
  }

  public getRepoertData(request: PropertyQuRequest): Observable<PropertyQuReport> {
    let header = new HttpHeaders();
    header = header.append(DPSConstants.ContentTypeHttpHeader, 'application/json');
    header = header.append(DPSConstants.ControlerAndMethod, 'Report/CreateReport');
    return this.http.post<PropertyQuReport>
      (`${this.appConfig.serviceBase}/WebQuote/DoWebQuoteFunction?suppressFail=true`,
        request.toPost(),
        { headers: header });
  }

  public sendQuote(request: PropertyQuoteSend): Observable<{ ewsId: string, id: string }> {
    return this.http.post<{ data: { ewsId: string, id: string } }>
      (this.appConfig.serviceBase + '/Opportunity/OpportunityPropertyQuoteSend', request.toPost()).pipe(
        map(responce => responce.data)
      );
  }

  public loadWebQuoteVars(): Observable<WebQuoteVars[]> {
    let header = new HttpHeaders();
    header = header.append(DPSConstants.ControlerAndMethod, 'VarMapping/GetVarMapping');
    return this.http.get<WebQuoteVars[]>
      (`${this.appConfig.serviceBase}/WebQuote/DoWebQuoteFunction?suppressFail=true`,
        { headers: header });
  }
  public getWebQuoteCompnayDetails(): Observable<WebQuoteCompnayDetails> {
    let header = new HttpHeaders();
    header = header.append(DPSConstants.ControlerAndMethod, 'Company/GetCompany');
    return this.http.get<WebQuoteCompnayDetails>
      (`${this.appConfig.serviceBase}/WebQuote/DoWebQuoteFunction?suppressFail=true`,
        { headers: header });
  }
  public getExistingRepoertData(reportId: number): Observable<PropertyQuReport> {
    let header = new HttpHeaders();
    header = header.append(DPSConstants.ControlerAndMethod, 'Report/GetReport?reportId=' + reportId);
    return this.http.get<PropertyQuReport>
      (`${this.appConfig.serviceBase}/WebQuote/DoWebQuoteFunction?suppressFail=true`,
        { headers: header });
  }

  public saveRepotrtData(report: PropertyQuReport, appId: PropertyQuoteApp): Observable<number> {
    let header = new HttpHeaders();
    header = header.append(DPSConstants.ContentTypeHttpHeader, 'application/json');
    header = header.append(DPSConstants.ControlerAndMethod, 'Report/SaveReport');
    return this.http.post<number>
      (`${this.appConfig.serviceBase}/WebQuote/DoWebQuoteFunction?suppressFail=true`, { appId: appId, report: report },
        { headers: header });
  }

  public getCost(): Observable<WebQuoteCost[]> {
    let header = new HttpHeaders();
    header = header.append(DPSConstants.ControlerAndMethod, 'Cost/getCost');
    return this.http.get<WebQuoteCost[]>
      (`${this.appConfig.serviceBase}/WebQuote/DoWebQuoteFunction?suppressFail=true`,
        { headers: header });
  }
}
