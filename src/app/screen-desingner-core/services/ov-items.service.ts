
import {throwError as observableThrowError,  of ,  EMPTY as empty ,  Observable } from 'rxjs';

import {map, switchMap} from 'rxjs/operators';
import { AppConfig } from '../../core/configs/app-config';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';

import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ScreenComponentDto } from '../../screen-view-core/models/screen-contaner-component';
import { OvItem } from '../models/application-component';
import { ConfirmDialogData, ConfirmDialogResultKind, InforDialogComponent } from '../../shared';
import { MatDialog } from '@angular/material';

@Injectable()
export class OvItemService {

    constructor(private http: HttpClient, private appConfig: AppConfig, public dialog: MatDialog) { }


    public getOVItems(appId: Number, screenNumber: number) {
        return this.http.get<any>(this.appConfig.serviceBase + '/WorkFlow/GetScreenApplicationData?appID=' + appId + '&filter='
            + '&orderBySquence=true&screenNumber=' + screenNumber + '&selectedVar=0').pipe(
            map((response) => {
                return this.drowOvList(response.data);
            }));
    }

    public addUpdateOVItem(ovItem: OvItem) {

        const appID = ovItem.appID, varNo = ovItem.varNo, fieldType = ovItem.fieldType,
            inputLength = ovItem.inputLength, description = ovItem.description, help = ovItem.help;

        return this.http.get<any>(this.appConfig.serviceBase + '/WorkFlow/InsertOrUpdateAppVarDef?appID='
            + appID + '&varNo=' + varNo + '&type=' + fieldType
            + '&inputLength=' + inputLength
            + '&description=' + description
            + '&help=' + help
        );
    }

    public deleteOVItem(ovItems: OvItem[]) {
        return this.messageConfirm(ovItems);
    }
    deleteConfirmMessage(message) {
        const dialogData: ConfirmDialogData = {
            content: {
                title: 'Delete variable definition',
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



    public messageConfirm(selectedOvItems: OvItem[]) {
        let message: string;
        if (selectedOvItems.length > 1) {
            // tslint:disable-next-line:max-line-length
            message = 'You have selected multiple variables for deletion.They will be deleted from the application and any screen(s) that contain them.\n\n';
            message += 'Continue?';
        } else {
            // tslint:disable-next-line:max-line-length
            message = 'The selected variable will be deleted from the application and any screen(s) that contains it.\n\n Continue?';

        }
        const dialogData: ConfirmDialogData = {
            content: {
                title: 'Delete variable definition',
                message: message,
                acceptLabel: 'OK',
                rejectLabel: 'Cancel'
            },
            data: null
        };
        const confirmDialogRef = this.dialog.open(ConfirmDialogComponent, {
            data: dialogData,
            disableClose: true,
            width: '350px',
            panelClass: 'dps-notification'
        });
        return confirmDialogRef.afterClosed().pipe(switchMap(dialogResult => {
            if (dialogResult.kind === ConfirmDialogResultKind.Confirmed) {

                const appID = selectedOvItems[0].appID;
                const varControls: Array<any> = selectedOvItems.map((item) => {
                    return { 'AVD_VarNo': item.varNo };
                });
                //  this.deleteMessage(ovItems);
                return this.http.post<any>(this.appConfig.serviceBase + '/WorkFlow/DeleteVarListFromApp',
                    { appID, varControls }).pipe(
                    map((response) => {
                        const errorListCount = response.data;
                        const errorList = response.detailStatus;
                        if (errorListCount > 0) {
                            for (let i = 0; i < errorListCount; i++) {
                                this.deleteConfirmMessage(errorList[i].message);
                            }
                        }
                        // else {
                        //     this.deleteConfirmMessage(appID, message);
                        // }
                        return response;
                    }));
            } else {
                return of(observableThrowError('close'));
            }
        }));

    }


    public exportOVItems(appID, currentScreenNo) {
        return this.http.get<any>(this.appConfig.serviceBase + 'WorkFlow/export?appID=' + appID + '&currentScreenNo=' + currentScreenNo).pipe(
            map((response) => {
                return response;
            }));
    }

    private drowOvList(applicationComponent: ScreenComponentDto[]): OvItem[] {
        try {
            const aplicationControlList: OvItem[] = [];
            applicationComponent.forEach((screenComponentDtO) => {
                // screenComponentDtO.field_Value = ov.filter((item) => item.ControlerID === screenComponentDtO.sC_ID);
                const component = new OvItem(screenComponentDtO);
                aplicationControlList.push(component);
            });
            return aplicationControlList;
        } catch (err) {
            throw err;
        }
    }



}
