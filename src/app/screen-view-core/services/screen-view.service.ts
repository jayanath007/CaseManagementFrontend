
import {map} from 'rxjs/operators';

import { IMainState } from '../models/request';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ScreenComponentDto, ScreenContanerComponent, UiComponentType } from '../models/screen-contaner-component';
import { ScreenComponent } from '../models/screen-component';
import { ScreenDefinition, ScreenDefinitionDto } from '../models/screen-definition';
import { IVarValue } from '../../workflow-core';
import { AppConfig } from '../../core';
import { UnlinkContactRequest } from '../../screen-contact-core/models/screen-contact-request';
import { UnlinkContactResponse } from '../../screen-contact-core/models/contact-screen-response';


@Injectable()
export class ScreenDesignService {

    constructor(private http: HttpClient,
        private appConfig: AppConfig) { }


    public documnetUpload(data) {
        const headers = new Headers({ 'Content-Type': undefined });
        return this.http.post<any>(this.appConfig.serviceBase + '/WorkFlow/SaveScreenAttachment', data).pipe(
            map((response) => response));
    }
    public oneDrivedocumnetUpload(data) {
        return this.http.post<any>(this.appConfig.serviceBase + '/WorkFlow/SaveDriveScreenAttachment', data).pipe(
            map((response) => response));
    }


    public getUpdatedNextUfn(branchId: Number, appId: number, ufnDate: string) {
        ///////////////// get data from back end call
        return this.http.get<any>(this.appConfig.serviceBase + '/WorkFlow/GetUpdatedNextUfn?branchId=' + branchId + '&appId='
            + appId + '&ufnDate=' + ufnDate).pipe(
            map((response) => {
                return response;
            }));
    }

    public getUpdatedMainState() {
        ///////////////// get data from back end call
        return this.http.get<any>(this.appConfig.serviceBase + '/WorkFlow/GetScreenSettings').pipe(
            map((response) => {
                // existing app need to discuss
                response.disabilityColors = response.useDisabilityColors;
                return response;
            }));
    }


    public drowComponentList(screenComponent: ScreenComponentDto[], mainState: IMainState, screenDefnition: any,
        currentContactId: number, ov?: IVarValue[]): ScreenContanerComponent[] {

        try {
            const screenControlList: ScreenContanerComponent[] = [];
            screenComponent.forEach((screenComponentDtO) => {
                const valueItem = ov.filter((item) => item.controlerID === screenComponentDtO.sC_ID)[0];
                if (valueItem) {
                    screenComponentDtO.field_Value = valueItem.value;
                    /// to-do-post-code
                }
                if (screenDefnition.sD_DataSource === 3 && currentContactId > 0) { // set component background color if mapped contact field
                    screenComponentDtO.onContact = true;
                } else {
                    screenComponentDtO.onContact = false;
                }
                if (screenComponentDtO.avD_Type === UiComponentType.AddressSearch || UiComponentType.PostCode) {
                    screenComponentDtO.PosCodeVarValues = [];
                }
                if (screenComponentDtO.avD_Type === UiComponentType.PostCode ||
                    screenComponentDtO.avD_Type === UiComponentType.AddressSearch) {
                    const screenIdList = [];
                    // screenComponentDtO.lookup_Text =  ['28', '29', '7', '56'];
                    try {
                        screenComponentDtO.lookup_Text.forEach((varNo) => {
                            const data = screenComponent.filter((item) => item.sC_VarNo === +varNo)[0];
                            if (data) {
                                screenIdList.push(data.sC_ID);
                            }
                        });
                        screenComponentDtO.lookup_Text = screenIdList;
                    } catch (error) {
                        screenComponentDtO.lookup_Text = [];
                    }
                }

                const component = new ScreenComponent(screenComponentDtO, mainState);
                // IVarValue
                screenControlList.push(component);
            });
            return screenControlList;
        } catch (err) {
            throw err;
        }
    }

    public drowForm(screenDefinitionDto: ScreenDefinitionDto, mainState: IMainState): ScreenDefinition {
        const screenDefinition = new ScreenDefinition(screenDefinitionDto, mainState);
        return screenDefinition;
    }

    public getFormViewData(appId: Number, screenId: string) {
        // return this.http.get<any>('./assets/form-view.json')
        // .map((response) => {
        //     const data = response['data'];
        //     data.initialInfor = { errorMasages: response['detailStatus'] };
        //     return data;
        // });
        return this.http.get<any>(this.appConfig.serviceBase + '/WorkFlow/GetScreenControls?appId=' + appId + '&screenId='
            + screenId).pipe(
            map((response) => {
                const data = response['data'];
                data.initialInfor = { errorMasages: response['detailStatus'] };
                return data;
            }));
    }

    public getContactsOnFileCount(appId: number, fileId: number, branchId: number, contactTypeId: number) {
        return this.http.get<string>(this.appConfig.serviceBase +
            `/Contacts/ContactsOnfileCount?appId=${appId.toString()}&branchId=${branchId.toString()}`
            + `&fileId=${fileId.toString()}&typeId=${contactTypeId.toString()}`);
    }

    public getCurrentScreenContactID(appId: number, fileId: number, branchId: number, contactTypeId: number, screenNo: number) {
        return this.http.get<string>(this.appConfig.serviceBase +
            `/Contacts/GetCurrentScreenContactID?appId=${appId}&branchId=${branchId}` +
            `&contactType=${contactTypeId}&fileId=${fileId}&screenNo=${screenNo}`);
    }

    public unlinkContact(request: UnlinkContactRequest) {
        return this.http.get<UnlinkContactResponse>(this.appConfig.serviceBase + `/WorkFlow/UnlinkContact?${request.queryString()}`);
    }

    extractUId(screenIdsString: string): any {

        const self = this;
        const screenViewModel = null;

        const end = screenIdsString.length;
        let screenIdString = '';
        let pUSComEnd;
        let pComUSstart = screenIdsString.indexOf('US', 0);
        // if (pComUSstart == -1)
        //    return ReturnCode.Fail;


        // check for xml format
        pUSComEnd = screenIdsString.indexOf(']', pComUSstart + 2);
        if (pUSComEnd !== -1) {
            // xml format, extract screen number
            screenIdString = screenIdsString.substring(pComUSstart + 2, pUSComEnd);
        } else {
            // check for old style \US format  MPP 1.10.07
            pComUSstart = screenIdsString.indexOf('\\US', 0);
            if (pComUSstart !== -1) {
                screenIdString = screenIdsString.substring(pComUSstart + 3, end - pComUSstart - 3);
            } else {
                // ShowMessageBox("incorrect US format - please ensure command uses \\US or xml [] format");
                // return ReturnCode.Fail;
                // CYR added for testing purpose but needs to remove
                // screenIdString = screenId;
            }
        }

        screenIdString.trim();
        const spaceIndex = screenIdString.indexOf(' ');
        if (spaceIndex > 0) {
            screenIdString = screenIdString.substring(0, spaceIndex);
        }

        if (screenIdString.length < 3) {
            screenIdString = '000' + screenIdString;
            screenIdString = screenIdString.substring(screenIdString.length - 3);  // -3 gives last 3 chars
        }

        const array = [];

        for (let i = 0; i < screenIdString.length; i += 3) {
            array.push(screenIdString.substring(i, i + 3));
        }

        return array;
    }


}
