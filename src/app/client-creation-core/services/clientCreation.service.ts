
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { Observable } from 'rxjs';
import { AppConfig, DropdownListData, LookupViewModel, MatClientRefViewModel } from '../../core';

import { RiskAssesmentRequest } from '../models/risk-assesment-request';
import {
    ClientModel, Client, ClientDefaultModel,
    ClientNoteModel, MatterGridResponce, RiskAssessmentData, CaseFileIdentity
} from '../models/interfaces';
import { MatterGridRequevt } from '../models/matter-grid-requevt';

@Injectable()
export class ClientCreationService {
    constructor(private http: HttpClient, private appConfig: AppConfig, private datePipe: DatePipe) {
    }

    public deleteClient(clientId): Observable<any> {
        return this.http.get<any>(this.appConfig.serviceBase + '/Client/DeleteClient?clientId=' + clientId).pipe(
            map(response => response.data));
    }


    public deleteClientEvent(eventId): Observable<any> {
        return this.http.get<any>(this.appConfig.serviceBase + '/Client/DeleteClientEvent?eventId=' + eventId).pipe(
            map(response => response.data));
    }

    public copyMatter(matterId): Observable<any> {
        return this.http.get<any>(this.appConfig.serviceBase + '/Matters/DuplicateMatter?matterId=' + matterId).pipe(
            map(response => response.data));
    }

    public getClientEventFile(eventId): Observable<any> {
        return this.http.get<any>(this.appConfig.serviceBase + '/Client/GetClientEventFile?eventId=' + eventId).pipe(
            map(response => response.data));
    }


    public addUpdateClient(clientModel: ClientModel, updateClientNotes: ClientNoteModel[], deleteClientNotes: number[],
        caseFileIdentity: CaseFileIdentity) {
        // const client = this.clientDateFieldUpdate(clientModel.client);
        const clientVm = {
            clientDetails: {
                ...clientModel.client,
                startDate: clientModel.client.startDate ?
                    this.datePipe.transform(clientModel.client.startDate, 'yyyy-MM-ddTHH:mm:ss') : clientModel.client.startDate
            },
            clientNotes: updateClientNotes,
            deleteClientNotes: deleteClientNotes,
            caseFileIdentity: caseFileIdentity ? caseFileIdentity : null
        };

        return this.http.post<any>(this.appConfig.serviceBase + '/Client/AddUpdateClient', clientVm).pipe(
            map(response => response.data));
    }

    private clientDateFieldUpdate(client: Client) {
        const dateFields = {
            dateOfBirth: client.dateOfBirth,
            startDate: client.startDate,
            dateOfDeath: client.dateOfDeath,
            directorDOB: client.directorDOB,
            dOB1: client.doB1,
            dOB2: client.doB2,
            dOB3: client.doB3,
            dOB4: client.doB4,
            dateStageSet: client.dateStageSet,
            aMLLastSearch: client.amlLastSearch,
            closeDate: client.closeDate
        };

        Object.keys(dateFields).forEach((key) => {
            client[key] = this.datePipe.transform(key, 'yyyy-MM-dd HH:mm');
        });
    }

    public addAMLCheckForClient(clientModel: ClientModel) {

        return this.http.post<any>(this.appConfig.serviceBase + '/Client/AmlCheckAsync', clientModel.client).pipe(
            map(response => response.data));
    }

    public getAMLProvider(): Observable<boolean> {
        return this.http.get<any>(this.appConfig.serviceBase + '/Client/GetAMLProvider').pipe(
            map(response => {
                const value = String(response.data);
                if (value.toLowerCase() !== 'none') {
                    return true;
                } else {
                    return false;
                }

                //  return false;
            }));
    }

    public getAllClientDetails(clientId, gridPara?: Array<string>): Observable<ClientModel> {
        const tab = (gridPara) ? gridPara.toString() : '';
        return this.http.get<any>(this.appConfig.serviceBase + '/Client/GetAllClientDetails?clientId=' +
            clientId + '&Tabs?' + tab).pipe(
                map(response => {
                    if (response.data) {
                        return response.data;
                    } else {
                        throw new Error(`Can't find`);
                    }
                }));
    }

    public getMatterAndClientID(client) {
        return this.http.post<any>(this.appConfig.serviceBase + '/File/GetMatterAndClientID', client).pipe(
            map(response => response.data));
    }


    public getUserDefaultBranch(): Observable<DropdownListData[]> {
        return this.http.get<any>(this.appConfig.serviceBase + '/Client/GetUserDefaultBranch').pipe(
            map(response => response.data));
    }

    public getBranchList(): Observable<DropdownListData[]> {
        return this.http.get<any>(this.appConfig.serviceBase + '/Client/GetBranchIDAndNameList').pipe(
            map(response => response.data));
    }
    public getClientTypeList(): Observable<DropdownListData[]> {
        return this.http.get<any>(this.appConfig.serviceBase + '/Client/GetClientTypeList').pipe(
            map(response => response.data));
    }
    public getCreditControlStagesList(): Observable<DropdownListData[]> {
        return this.http.get<any>(this.appConfig.serviceBase + '/Client/GetCreditControlStagesList').pipe(
            map(response => response.data));
    }

    public getCreditAccountTypeList(): Observable<DropdownListData[]> {
        return this.http.get<any>(this.appConfig.serviceBase + '/Client/GetCreditAccountTypeList').pipe(
            map(response => response.data));
    }
    // ----------------------
    public getVATCodeAndDescriptionList(): Observable<DropdownListData[]> {
        return this.http.get<any>(this.appConfig.serviceBase + '/Client/GetVATCodeAndDescriptionList').pipe(
            map(response => response.data));
    }
    public getClientInterestSchemeList(): Observable<DropdownListData[]> {
        return this.http.get<any>(this.appConfig.serviceBase + '/Client/GetCurrencyCodeAndNameList').pipe(
            map(response => response.data));
    }
    public getFeeEarnerCodeAndNameList(): Observable<DropdownListData[]> {
        return this.http.get<any>(this.appConfig.serviceBase + '/Client/GetFeeEarnerCodeAndNameList').pipe(
            map(response => response.data));
    }

    public getEthnicOriginCodeAndNameList(): Observable<DropdownListData[]> {
        return this.http.get<any>(this.appConfig.serviceBase + '/Client/GetEthnicOriginCodeAndNameList').pipe(
            map(response => response.data));
    }


    public getDisabilityCodeAndNameList(): Observable<DropdownListData[]> {
        return this.http.get<any>(this.appConfig.serviceBase + '/Client/GetDisabilityCodeAndNameList').pipe(
            map(response => response.data));
    }

    public getCompanyProofsList(): Observable<DropdownListData[]> {
        return this.http.get<any>(this.appConfig.serviceBase + '/Client/GetCompanyProofsList').pipe(
            map(response => response.data));
    }

    public getAMLRiskLevelList(): Observable<DropdownListData[]> {
        return this.http.get<any>(this.appConfig.serviceBase + '/Client/GetAMLRiskLevelList').pipe(
            map(response => response.data));
    }
    public getGenderCodeAndNameList(): Observable<DropdownListData[]> {
        return this.http.get<any>(this.appConfig.serviceBase + '/Client/GetGenderCodeAndNameList').pipe(
            map(response => response.data));
    }

    public getCurrencyCodeAndNameList(): Observable<DropdownListData[]> {
        return this.http.get<any>(this.appConfig.serviceBase + '/Client/GetCurrencyCodeAndNameList').pipe(
            map(response => response.data));
    }

    public getClientLookupList(lookupTypeTag): Observable<LookupViewModel> {
        return this.http.get<any>(this.appConfig.serviceBase + '/Lookup/GetLookupType?lookupTypeTag=' + lookupTypeTag).pipe(
            map(response => response.data));

    }

    public getDefaultRiskAssesemntData(): Observable<RiskAssessmentData> {
        return this.http.get<{ data: RiskAssessmentData }>(this.appConfig.serviceBase + '/Client/GetRiskQuestionsAndAnswers').pipe(
            map(response => response.data));
    }

    // Document Upload
    public documnetUpload(data) {
        const headers = new Headers({ 'Content-Type': undefined });
        return this.http.post<any>(this.appConfig.serviceBase + '/Client/InserOrUpdateClientEvents', data).pipe(
            map((response) => response));
    }

    public getMatCliRefSettings(): Observable<MatClientRefViewModel> {
        return this.http.get<any>(this.appConfig.serviceBase + '/Client/GetMatCliRefSettings').pipe(
            map(response => response.data));
    }
    public getClientDefaults(): Observable<ClientDefaultModel> {
        return this.http.get<any>(this.appConfig.serviceBase + '/Client/GetClientDefaults').pipe(
            map(response => response.data));
    }

    public getHasCrimematters(clientRef): Observable<boolean> {
        return this.http.get<any>(this.appConfig.serviceBase + '/Client/GetHasCrimematters?clientRef=' + clientRef).pipe(
            map(response => response.data));
    }

    public addUpdateRiskAssessmentData(request: RiskAssesmentRequest): Observable<RiskAssessmentData> {
        return this.http.post<{ data: RiskAssessmentData }>(this.appConfig.serviceBase + '/Client/AddUpdateClientRisk',
            request.toPost()).pipe(
                map(response => response.data));
    }
    public getMatters(request: MatterGridRequevt) {
        return this.http.post<{ data: MatterGridResponce }>(this.appConfig.serviceBase + '/Matters/GetMattersByClientRef',
            request.toPost()).pipe(
                map((response) => {
                    return response.data;
                }));
    }



}
