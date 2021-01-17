
import {map} from 'rxjs/operators';
import { IVarValue } from '../../screen-view-core/models/request';
import { AppConfig } from '../../core/configs/app-config';
import { ScreenDefinitionDto, ScreenDefinition } from '../../screen-view-core/models/screen-definition';
import { IMainState } from '../models/screen-desingner-request';
import { ScreenComponentDto, ScreenContanerComponent } from '../../screen-view-core/models/screen-contaner-component';
import { ScreenComponent } from '../../screen-view-core/models/screen-component';

import { EMPTY as empty ,  Observable ,  of } from 'rxjs';
import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';



import { emit } from 'cluster';
import { FormView } from '../reducers/screen-desingner';


@Injectable()
export class ScreenDesingnerService {

    constructor(private http: HttpClient, private appConfig: AppConfig
    ) { }


    public deleteFieldProperties(appID, varControls) {
        return this.http.post<any>(this.appConfig.serviceBase + '/WorkFlow/DeleteVarListFromApp',
            { appID, varControls }).pipe(
            map(response => response));

    }

    public saveScreenComponen(formView: FormView, importXMLPath, rearrange) {

        const screenControlList: ScreenComponentDto[] = formView.screenContanerComponentList.map((item) => {
            if (item.screenComponentDto.isNewItem) {
                item.screenComponentDto.sC_ID = 0;
            }

            item.screenComponentDto.sC_Left =  Number(Number( item.screenComponentDto.sC_Left).toFixed());
            return item.screenComponentDto;
        });

        const screenViewModel = {
            screenControlList: screenControlList,
            screenDefinition: formView.screenDefinition.screenDefinitionDto,
        };

        return this.http.post<any>(this.appConfig.serviceBase + '/WorkFlow/SaveScreenDefinitionAndControls',
            { screenViewModel: screenViewModel, importXMLPath, rearrange: rearrange }
        ).pipe(
            map((response) => {
                return response;
            }));

    }


    public exportScreenComponens(appID: number, screenNumber: number, selectedVar: number, filter: string, orderBySquence: boolean) {

        // return this.http.post<any>(this.appConfig.serviceBase + '/WorkFlow/ExportScreenToXML',
        //     {
        //         appID: appID, screenNumber: screenNumber, selectedVar: selectedVar,
        //         filter: filter, orderBySquence: orderBySquence
        //     }
        // )
        return this.http.get<any>(this.appConfig.serviceBase + '/WorkFlow/ExportScreenToXML?appID='
            + appID + '&screenNumber=' + screenNumber + '&selectedVar='
            + selectedVar + '&filter= ' + filter + '&orderBySquence = ' + orderBySquence).pipe(
            map((response) => {
                if (response.data && response.data) {

                    if (window.navigator.userAgent.indexOf('Edge') > -1) {
                        const binary_string = window.atob(response.data);
                        const blobObject = new Blob([this.base64ToArrayBuffer(response.data)]);
                        return window.navigator.msSaveBlob(blobObject, response.data.name);
                    } else {
                        const url = 'data:application/zip;base64,' + response.data;
                        const link: any = document.createElement('a');
                        link.download = response.data.name;
                        link.href = url;
                        link.click();
                    }
                }

            }));

    }



    public exportScreenOvList(appID: number, screenNumber: number, selectedVar: number, filter: string, orderBySquence: boolean) {

        // return this.http.get<any>(this.appConfig.serviceBase + '/WorkFlow/GetApplicationVarListExcel',
        //     {
        //         appID: appID, screenNumber: screenNumber, selectedVar: selectedVar,
        //         filter: filter, orderBySquence: orderBySquence
        //     }
        // )
        return this.http.get<any>(this.appConfig.serviceBase + '/WorkFlow/GetApplicationVarListExcel?appID='
            + appID + '&screenNumber=' + screenNumber + '&selectedVar=' + selectedVar + '&filter='
            + filter + '&orderBySquence = ' + orderBySquence).pipe(
            map((response) => {
                if (response.data && response.data && response.data.base64String) {

                    if (window.navigator.userAgent.indexOf('Edge') > -1) {
                        const binary_string = window.atob(response.data.Base64String);
                        const blobObject = new Blob([this.base64ToArrayBuffer(response.data.base64String)]);
                        return window.navigator.msSaveBlob(blobObject, response.data.name);
                    } else {
                        const url = 'data:application/zip;base64,' + response.data.base64String;
                        const link: any = document.createElement('a');
                        link.download = response.data.name;
                        link.href = url;
                        link.click();
                    }
                }

            }));

    }

    base64ToArrayBuffer(base64) {
        const binary_string = window.atob(base64);
        const len = binary_string.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binary_string.charCodeAt(i);
        }
        return bytes.buffer;
    }



    public getUpdatedMainState() {
        ///////////////// get data from back end call
        return this.http.get<any>(this.appConfig.serviceBase + '/WorkFlow/GetScreenSettings').pipe(
            map((response) => {
                return response;
            }));
        // return this.http.get<any>('./assets/main.json')
        //     .map((response) => {
        //         // const data = response['data'];
        //         // data.initialInfor = { errorMasages: response['detailStatus'] };
        //         return response;
        //     });
    }


    public drowComponentList(screenComponent: ScreenComponentDto[], mainState: IMainState, ov?: IVarValue[]): ScreenContanerComponent[] {
        try {
            const screenControlList: ScreenContanerComponent[] = [];
            screenComponent.forEach((screenComponentDtO) => {
                // screenComponentDtO.field_Value = ov.filter((item) => item.ControlerID === screenComponentDtO.sC_ID);
                const component = new ScreenComponent(screenComponentDtO, mainState);
                screenControlList.push(component);
            });
            return screenControlList;
        } catch (err) {
            throw err;
        }
    }


    public calculateControlLabelWidth(textValue: string): number {
        const myJSON = [{ 'Key': '\u0000', 'Value': 11 }, { 'Key': '\u0001', 'Value': 10 },
        { 'Key': '\u0002', 'Value': 12 }, { 'Key': '\u0003', 'Value': 10 },
        { 'Key': '\u0004', 'Value': 10 }, { 'Key': '\u0005', 'Value': 10 },
        { 'Key': '\u0006', 'Value': 10 }, { 'Key': '\u0007', 'Value': 10 },
        { 'Key': '\b', 'Value': 10 }, { 'Key': '\t', 'Value': 0 }, { 'Key': '\n', 'Value': 0 },
        { 'Key': '\u000b', 'Value': 0 }, { 'Key': '\f', 'Value': 0 },
        { 'Key': '\r', 'Value': 0 }, { 'Key': '\u000e', 'Value': 10 },
        { 'Key': '\u000f', 'Value': 10 }, { 'Key': '\u0010', 'Value': 10 },
        { 'Key': '\u0011', 'Value': 10 }, { 'Key': '\u0012', 'Value': 10 },
        { 'Key': '\u0013', 'Value': 10 }, { 'Key': '\u0014', 'Value': 10 },
        { 'Key': '\u0015', 'Value': 10 }, { 'Key': '\u0016', 'Value': 10 },
        { 'Key': '\u0017', 'Value': 10 }, { 'Key': '\u0018', 'Value': 10 },
        { 'Key': '\u0019', 'Value': 10 }, { 'Key': '\u001a', 'Value': 10 },
        { 'Key': '\u001b', 'Value': 10 }, { 'Key': '\u001c', 'Value': 7 },
        { 'Key': '\u001d', 'Value': 7 }, { 'Key': '\u001e', 'Value': 7 },
        { 'Key': '\u001f', 'Value': 7 }, { 'Key': ' ', 'Value': 10 },
        { 'Key': '!', 'Value': 10 }, { 'Key': '"', 'Value': 12 },
        { 'Key': '#', 'Value': 14 }, { 'Key': '$', 'Value': 13 }, { 'Key': '%', 'Value': 15 },
        { 'Key': '&', 'Value': 7 }, { 'Key': '\'', 'Value': 9 },
        { 'Key': '(', 'Value': 10 }, { 'Key': ')', 'Value': 10 },
        { 'Key': '*', 'Value': 11 },
        { 'Key': '+', 'Value': 13 }, { 'Key': ',', 'Value': 10 },
        { 'Key': '-', 'Value': 10 }, { 'Key': '.', 'Value': 10 },
        { 'Key': '/', 'Value': 12 },
        { 'Key': '0', 'Value': 13 }, { 'Key': '1', 'Value': 13 },
        { 'Key': '2', 'Value': 13 }, { 'Key': '3', 'Value': 13 },
        { 'Key': '4', 'Value': 13 },
        { 'Key': '5', 'Value': 13 }, { 'Key': '6', 'Value': 13 },
        { 'Key': '7', 'Value': 13 }, { 'Key': '8', 'Value': 13 }, { 'Key': '9', 'Value': 13 },
        { 'Key': ':', 'Value': 10 }, { 'Key': ';', 'Value': 10 },
        { 'Key': '<', 'Value': 13 }, { 'Key': '=', 'Value': 13 }, { 'Key': '>', 'Value': 13 },
        { 'Key': '?', 'Value': 13 }, { 'Key': '@', 'Value': 18 },
        { 'Key': 'A', 'Value': 14 }, { 'Key': 'B', 'Value': 14 }, { 'Key': 'C', 'Value': 14 },
        { 'Key': 'D', 'Value': 15 }, { 'Key': 'E', 'Value': 14 }, { 'Key': 'F', 'Value': 13 },
        { 'Key': 'G', 'Value': 15 }, { 'Key': 'H', 'Value': 15 },
        { 'Key': 'I', 'Value': 10 }, { 'Key': 'J', 'Value': 12 },
        { 'Key': 'K', 'Value': 14 }, { 'Key': 'L', 'Value': 13 }, { 'Key': 'M', 'Value': 16 },
        { 'Key': 'N', 'Value': 15 }, { 'Key': 'O', 'Value': 15 },
        { 'Key': 'P', 'Value': 14 }, { 'Key': 'Q', 'Value': 15 }, { 'Key': 'R', 'Value': 15 },
        { 'Key': 'S', 'Value': 14 }, { 'Key': 'T', 'Value': 14 },
        { 'Key': 'U', 'Value': 15 }, { 'Key': 'V', 'Value': 14 }, { 'Key': 'W', 'Value': 18 },
        { 'Key': 'X', 'Value': 14 }, { 'Key': 'Y', 'Value': 14 },
        { 'Key': 'Z', 'Value': 14 }, { 'Key': '[', 'Value': 10 }, { 'Key': '\\', 'Value': 12 },
        { 'Key': ']', 'Value': 10 }, { 'Key': '^', 'Value': 13 },
        { 'Key': '_', 'Value': 13 }, { 'Key': '`', 'Value': 10 }, { 'Key': 'a', 'Value': 13 },
        { 'Key': 'b', 'Value': 13 }, { 'Key': 'c', 'Value': 13 },
        { 'Key': 'd', 'Value': 13 }, { 'Key': 'e', 'Value': 13 }, { 'Key': 'f', 'Value': 10 },
        { 'Key': 'g', 'Value': 13 }, { 'Key': 'h', 'Value': 13 },
        { 'Key': 'i', 'Value': 9 }, { 'Key': 'j', 'Value': 9 },
        { 'Key': 'k', 'Value': 13 },
        { 'Key': 'l', 'Value': 9 }, { 'Key': 'm', 'Value': 15 },
        { 'Key': 'n', 'Value': 13 }, { 'Key': 'o', 'Value': 13 }, { 'Key': 'p', 'Value': 13 },
        { 'Key': 'q', 'Value': 13 }, { 'Key': 'r', 'Value': 10 },
        { 'Key': 's', 'Value': 12 }, { 'Key': 't', 'Value': 10 }, { 'Key': 'u', 'Value': 13 },
        { 'Key': 'v', 'Value': 13 }, { 'Key': 'w', 'Value': 15 },
        { 'Key': 'x', 'Value': 12 }, { 'Key': 'y', 'Value': 12 }, { 'Key': 'z', 'Value': 12 },
        { 'Key': '{', 'Value': 11 }, { 'Key': '|', 'Value': 9 },
        { 'Key': '}', 'Value': 11 }, { 'Key': '~', 'Value': 14 }, { 'Key': '', 'Value': 10 },
        { 'Key': '', 'Value': 7 }];

        let textLength = 0;
        let i: number;
        let j: string;

        for (i = 0; i < textValue.length; i++) {
            for (j in myJSON) {
                if (myJSON[j].Key === textValue[i]) {
                    textLength += myJSON[j].Value;
                    break;
                }
            }
        }
        textLength = textLength - (textValue.length - 1) * 7;
        return textLength;
    }



    public drowForm(screenDefinitionDto: ScreenDefinitionDto, mainState: IMainState): ScreenDefinition {
        const screenDefinition = new ScreenDefinition(screenDefinitionDto, mainState);
        return screenDefinition;
    }

    public getFormViewData(appId: Number, screenId: string, createScreen?: boolean) {

        return this.http.get<any>(this.appConfig.serviceBase + '/WorkFlow/GetScreenControls?appId=' + appId + '&screenId='
            + screenId + '&createNewScreen=' + createScreen + '&fromScreenEdit=' + true).pipe(
            map((response) => {

                if (response['data']) {
                    const data = response['data'];
                    data.initialInfor = { errorMasages: response['detailStatus'] };
                    return data;
                } else {
                    return response;
                }
            }));
    }


}
