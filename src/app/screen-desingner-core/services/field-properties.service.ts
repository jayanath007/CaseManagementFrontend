
import {map} from 'rxjs/operators';
import { forEach } from '@angular/router/src/utils/collection';
import { AppConfig } from '../../core/configs/app-config';

import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { ConfirmDialogData } from '../../shared/models/dialog';
import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material';
import { ScreenComponentDto, ScreenContanerComponent } from '../../screen-view-core/models/screen-contaner-component';
import { InforDialogComponent } from '../../shared';

@Injectable()
export class FieldPropertiesService {

    constructor(private http: HttpClient, private dialog: MatDialog, private appConfig: AppConfig) { }


    public deleteFieldProperties(screenContanerComponent: ScreenContanerComponent) {

        const screenNo = screenContanerComponent.screenComponentDto.sC_ScreenNo;
        const varNo = screenContanerComponent.screenComponentDto.avD_VarNo;
        const description = screenContanerComponent.screenComponentDto.avD_Text;
        const appID = screenContanerComponent.screenComponentDto.sC_AppID;


        return this.http.post<any>(this.appConfig.serviceBase + '/WorkFlow/DeleteScreenControl?appID='
            + appID + '&description=' + description + '&screenNumber=' + screenNo + '&varNo=' + varNo,
            {}).pipe(map((response) => {

                if (response['data']) {
                    const message = response['detailStatus'][0].message;
                    const title = response['detailStatus'][0].reference;
                    this.deleteMessage(message, title);
                    return response;
                } else {
                    return response;
                }
            }));

    }   // DeleteVarListFromApp

    deleteMessage(message, title) {
        const dialogData: ConfirmDialogData = {
            content: {
                title: title,
                message: message,
                acceptLabel: 'Yes'

            },
            contentParams: {},
            data: { messageType: 'general'}
        };
        const dialogRef = this.dialog.open(InforDialogComponent, {
            data: dialogData,
            width: '300px',
            disableClose: true,
            panelClass: 'dps-notification' 
        });

    }

    public getLookupFiles(dataAppID: number) {
        return this.http.get<any>(this.appConfig.serviceBase + '/WorkFlow/GetLookupFiles?dataAppID=' + dataAppID).pipe(
            map((response) => {
                return response;
            }));
    }

    public getLookupFileContent(appId: number, fileName: string) {
        return this.http.get<any>(this.appConfig.serviceBase + '/WorkFlow/GetLookupFileContent?dataAppID='
            + appId + '&fileName=' + fileName).pipe(
            map((response) => {

                return response;
            }));
    }

    public updateLookupFileContent(fileName: string, appId: number, fileContent: string[]) {
        let fileContentstring = '';

        fileContent.forEach((value) => {
            fileContentstring = fileContentstring + '&fileContent=' + value;
        });
        if (fileContentstring === '') {
            fileContentstring = '&fileContent=""';
        }
        return this.http.get<any>(this.appConfig.serviceBase + '/WorkFlow/UpdateLookupFileContent?fileName=' + fileName + '&dataAppID='
            + appId + fileContentstring).pipe(
            map((response) => {
                return response.data;
            }));
    }


    public createLookupFile(newFileName: string, dataAppID: number, createNew: boolean) {

        return this.http.get<any>(this.appConfig.serviceBase + '/WorkFlow/CreateLookupFile?newFileName=' + newFileName + '&dataAppID='
            + dataAppID + '&createNew=' + createNew).pipe(
            map((response) => {
                return response;
            }));


    }

}
