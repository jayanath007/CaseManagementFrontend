
import {forkJoin as observableForkJoin,  combineLatest ,  of ,  from ,  Observable } from 'rxjs';

import {map, catchError, take, switchMap, mergeMap, tap, filter} from 'rxjs/operators';
import { FileLocation } from './../models/screen-definition';
import { UnlinkContactRequest } from '../../screen-contact-core/models/screen-contact-request';
import {
    getCurentFormViewDataByToken, getMatterDetailsByToken, getCurentFormScreenDefinition,
    getContactSearchCurrentContactId,
} from '../reducers';
import { FormViewRequest, ScreenViewRequest, MainStateRequest } from '../models/request';
import { Injectable } from '@angular/core';
import { Store, Action } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';
import * as ScreenView from '../actions/core';
import * as ScreenContactCore from '../../screen-contact-core/actions/core';
import { ScreenDesignService } from '../services/screen-view.service';
import {
    INIT_SCREEN_VIEW, InitScreenView, GetContactsOnFile, GetContactsOnFileSuccess,
    GET_CURRENT_SCREEN_CONTACT_ID
} from '../actions/core';
import { getFormViewResponsListDataByToken, getFormViewResponsDataByIndex, getMainState, getInitialInfor } from '..';
import { FormViewRespons } from '../reducers/screen-view';


@Injectable()
export class ScreenViewEffects {
    constructor(private actions$: Actions, private store: Store<any>, private service: ScreenDesignService) { }




    @Effect()
    initNewViewPoup$ = this.actions$.pipe(ofType<ScreenView.FormViewChange>(ScreenView.FORM_VIEW_CHANGE),
        filter((data) => data.payload.kind === ScreenView.ViewChangeKind.InitialLoad),
        tap((data) => console.log('Initial Load', data)),
        mergeMap((action) => {
            return from([
                new ScreenView.LoadFormViewListData(action.token, new ScreenViewRequest(action.payload.value.appId,
                    action.payload.value.screenId, action.payload.value.screenList)),
                new ScreenView.LoadFormViewData(action.token, new FormViewRequest(action.payload.value))
            ]);
        }),);

    @Effect()
    formViewChange$ = this.actions$.pipe(ofType<ScreenView.FormViewChange>(ScreenView.FORM_VIEW_CHANGE),
        filter((data) => (
            data.payload.kind === ScreenView.ViewChangeKind.GoToNext ||
            data.payload.kind === ScreenView.ViewChangeKind.GoToPrevious
        )),
        tap((data) => console.log('GoToNext  GoToPrevious', data)),
        mergeMap((action) => {
            return from([
                new ScreenView.LoadFormViewData(action.token, new FormViewRequest(action.payload.value))
            ]);
        }),);

    @Effect()
    loadFormViewList$ = this.actions$.pipe(ofType<ScreenView.LoadFormViewListData>
        (ScreenView.LOAD_FORM_VIEW_LIST_DATA),
        switchMap((action) => {
            return this.store.select(getFormViewResponsListDataByToken(action.token)).pipe(
                map((formViewResponsList) => {
                    const hasFormListData = (formViewResponsList && formViewResponsList.length > 0) ? true : false;
                    return { action: action, hasFormListData: hasFormListData };
                }),take(1),);
        }),
        filter((info) => !info.hasFormListData),
        switchMap((data) => {
            const observableBatch = [];
            data.action.request.screenList.forEach((screenId) => {
                observableBatch.push(this.service.getFormViewData(data.action.request.appId, screenId.toString())
                    // .map((request) => {
                    //     return request.data;
                    // })
                );
            });
            return observableForkJoin(observableBatch).pipe(
                map((responseList: any) => {

                    const formViewResponsList = [];
                    responseList.forEach((response: any, index) => {
                        const formViewRespons: FormViewRespons = {
                            screenControlList: response.screenControlList,
                            screenDefinition: response.screenDefinition,
                            initialInfor: response.initialInfor,
                            index: index,
                        };
                        formViewResponsList.push(formViewRespons);
                    });
                    return new ScreenView.LoadFormViewListSuccess(data.action.token,
                        { response: formViewResponsList, request: data.action.request });
                }),catchError((error) => {
                    return of(new ScreenView.LoadFormViewDataFail(data.action.token, error));
                }),);
        }),);

    @Effect()
    loadFormViewData$ = this.actions$.pipe(ofType<ScreenView.LoadFormViewData>(ScreenView.LOAD_FORM_VIEW_DATA),
        tap((data) => console.log('$initNewView', data)),
        switchMap((action) => {

            const initialInfor$ = this.store.select(getInitialInfor(action.token)).pipe(take(1));
            const mainState$ = this.store.select(getMainState(action.token)).pipe(take(1),
                switchMap((mainState) => {
                    if (mainState) {
                        return of(mainState);
                    } else {
                        return this.service.getUpdatedMainState();
                    }
                }),take(1),);
            const formViewData$ = this.store.select(getFormViewResponsDataByIndex
                (action.token, action.request.filterOptions.currentIndex)).pipe(take(1),
                switchMap((formViewData) => {
                    if (formViewData) {
                        return of(formViewData);
                    } else {
                        return this.service.getFormViewData(action.request.filterOptions.appId,
                            action.request.filterOptions.screenId);
                        // .map((request) => {
                        //     return request.data;
                        // });
                    }
                }),take(1),);
            // const currentContactId$ = combineLatest(
            //         this.store.select(getMatterDetailsByToken(action.token)),
            //         this.store.select(getContactSearchCurrentContactId(action.token)),
            //         (matter, currentContactId) => ({matter, currentContactId})
            //     )
            //     .take(1)
            //     .switchMap<any, any>((data) => {
            //         if (data.currentContactId > 0) {
            //             return of(data.currentContactId);
            //         } else {
            //             return this.service.getCurrentScreenContactID(data.matter.AppId, data.matter.FileId,
            //                 data.matter.BranchId, data.screenDef.contactType, data.screenDef.screenNumber);
            //         }
            //     }).take(1);
            return combineLatest(
                mainState$,
                formViewData$,
                initialInfor$,
                ((mainState, curentFormView, initialInfor) => ({
                    mainState: mainState,
                    curentFormView: curentFormView,
                    initialInfor: initialInfor,
                }))
            ).pipe(take(1),
                switchMap<any, any>((response) => {
                    return combineLatest(
                        this.store.select(getMatterDetailsByToken(action.token)),
                        this.store.select(getContactSearchCurrentContactId(action.token)),
                        (matter, currentContactId) => ({ matter, currentContactId })
                    ).pipe(
                        take(1),
                        switchMap<any, any>((data) => {
                            if (data.currentContactId > 0) {
                                return of({
                                    mainState: response.mainState,
                                    curentFormView: response.curentFormView,
                                    initialInfor: response.initialInfor,
                                    currentContactId: data.currentContactId
                                });
                            } else {
                                return combineLatest(this.service.getCurrentScreenContactID(data.matter.AppId, data.matter.FileId,
                                    data.matter.BranchId, response.curentFormView.screenDefinition.sD_ContactType,
                                    response.curentFormView.screenDefinition.sD_Number),
                                    (currentContactId) => ({
                                        mainState: response.mainState,
                                        curentFormView: response.curentFormView,
                                        initialInfor: response.initialInfor,
                                        currentContactId: currentContactId
                                    })
                                );
                            }
                        }),take(1),);
                }),
                mergeMap((response) => {
                    const drowScreenControlList
                        = this.service.drowComponentList(response.curentFormView.screenControlList, response.mainState,
                            response.curentFormView.screenDefinition, response.currentContactId, action.request.filterOptions.ov);
                    const drowScreenDefinition = this.service.drowForm(response.curentFormView.screenDefinition, response.mainState);
                    const formView = {
                        screenContanerComponentList: drowScreenControlList,
                        screenDefinition: drowScreenDefinition,
                        index: action.request.filterOptions.currentIndex
                    };
                    const actions: any = [
                        new ScreenView.LoadFormViewDataSuccess(action.token,
                            { response: formView, request: action.request }),
                        new ScreenView.LoadMainStateSuccess(action.token,
                            { response: response.mainState, request: action.request }),
                        new ScreenView.GetCureentScreenContactIdSuccess(
                            action.token,
                            { currentContactId: parseInt(response.currentContactId, null) }
                        )
                    ];
                    if (!response.initialInfor) {
                        actions.push(new ScreenView.InitialDatainforUpdateLoading(action.token,
                            {
                                masages: response.curentFormView.initialInfor.errorMasages,
                                screenList: action.request.filterOptions.screenList
                            }));
                    }
                    return from(actions);
                }),catchError((error) => {
                    return of(new ScreenView.LoadFormViewDataFail(action.token, error));
                }),);
        }),);



    @Effect()
    loadMainState$ = this.actions$.pipe(ofType<ScreenView.LoadMainState>(ScreenView.LOAD_MAIN_STATE),
        switchMap((action) => {
            return this.store.select(getMainState(action.token)).pipe(
                map((mainState) => {
                    const hasMainState = (mainState) ? true : false;
                    return { action: action, hasMainState: hasMainState };
                }),take(1),);
        }),
        filter((info) => !info.hasMainState),
        switchMap((data) =>
            this.service.getUpdatedMainState().pipe(
                map((result) => new ScreenView
                    .LoadMainStateSuccess(data.action.token, { response: result, request: data.action.payload.request })),
                catchError((error) => of(new ScreenView.LoadMainStateFail(data.action.token, error))),)
        ),);

    @Effect()
    loadData$ = this.actions$.pipe(ofType<ScreenView.LoadFormViewDataSuccess>
        (ScreenView.LOAD_FORM_VIEW_DATA_LOAD_SUCCESS),
        switchMap((action) => {
            return combineLatest(
                this.store.select(getMatterDetailsByToken(action.token)),
                this.store.select(getCurentFormScreenDefinition(action.token)),
                (matter, screenDef) => ({ matter, screenDef })
            ).pipe(
                take(1),
                mergeMap<any, any>((data) => {
                    return [new ScreenView.GetContactsOnFile(action.token, {
                        appId: data.matter.AppId,
                        fileId: data.matter.FileId,
                        branchId: data.matter.BranchId,
                        contactTypeId: data.screenDef.contactType
                    }),
                        // new ScreenView.GetCureentScreenContactId(action.token, {
                        //     appId: data.matter.AppId,
                        //     fileId: data.matter.FileId,
                        //     branchId: data.matter.BranchId,
                        //     contactTypeId: data.screenDef.contactType,
                        //     screenNo: data.screenDef.screenNumber
                        // })
                    ];
                }),);
        }));

    @Effect()
    contactsOnFile$ = this.actions$.pipe(ofType<ScreenView.GetContactsOnFile>(ScreenView.GET_CONTACTS_ON_FILE),
        tap(action => console.log('GET_CONTACTS_ON_FILE')),
        switchMap(action => {
            return this.service.getContactsOnFileCount(action.payload.appId, action.payload.fileId,
                action.payload.branchId, action.payload.contactTypeId).pipe(
                map(response => new ScreenView.GetContactsOnFileSuccess(
                    action.token,
                    { contactsOnFile: parseInt(response, null) }
                )),
                catchError(error => of(new ScreenView.GetContactsOnFileFailed(
                    action.token,
                    null
                ))),);
        }),);






    @Effect()
    screenViewUploadAtachment$ = this.actions$.pipe(ofType<ScreenView.ScreenViewUploadAtachment>(ScreenView.SCREEN_VIEW_UPLOAD_ATACHMENT),
        switchMap((action) => {
            return combineLatest(
                this.store.select(getMatterDetailsByToken(action.token)),
                this.store.select(getCurentFormViewDataByToken(action.token)),
                (matter, curentFormView) => ({ matter, curentFormView })
            ).pipe(
                take(1),map((data) => {
                    return { matter: data.matter, curentFormView: data.curentFormView, action: action };
                }),);
        }),
        switchMap<any, any>(infor => {

            if (infor.action.payload.value['fileLocation'] === FileLocation.Cloud) {

                const attachements: Array<any> = infor.action.payload.value['attachement'];
                const attachement = attachements[0];
                const fileItemIds = attachements.map((item) => {
                    return item.id;
                });

                const caseFileIdentityWithAppIdViewModel = {
                    BranchId: infor.matter.BranchId,
                    AppId: infor.matter.AppId,
                    FileId: infor.matter.FileId,
                    displayDataString: '',
                };
                const screenAttachmentViewModel = {
                    type: infor.action.payload.type,
                    caseFileIdentityWithAppIdViewModel: caseFileIdentityWithAppIdViewModel,
                    screenId: infor.curentFormView.screenDefinition.id,
                    driveId: attachement.parentReference.driveId,
                    fileItemIds: fileItemIds,
                    fileName: attachement.name,
                };
                // const sScreenAttachmentViewModel = JSON.stringify(screenAttachmentViewModel);
                // data.append('screenAttachmentViewModel', sScreenAttachmentViewModel);

                return this.service.oneDrivedocumnetUpload(screenAttachmentViewModel).pipe(map((response) =>
                    new ScreenView.ScreenViewUploadAtachmentSuccess(infor.action.token, {
                        response: response,
                        controler: infor.action.payload.controler,
                    })),
                    catchError(error => of(new ScreenView.ScreenViewUploadAtachmentFail(infor.action.token, {
                        value: error
                    }))),);



            } else {
                const data = new FormData();
                const caseFileIdentityWithAppIdViewModel = {
                    BranchId: infor.matter.BranchId,
                    AppId: infor.matter.AppId,
                    FileId: infor.matter.FileId,
                    displayDataString: '',
                };
                const screenAttachmentViewModel = {
                    type: infor.action.payload.type,
                    caseFileIdentityWithAppIdViewModel: caseFileIdentityWithAppIdViewModel,
                    screenId: infor.curentFormView.screenDefinition.id,
                };
                const sScreenAttachmentViewModel = JSON.stringify(screenAttachmentViewModel);
                data.append('screenAttachmentViewModel', sScreenAttachmentViewModel);
                data.append('files', infor.action.payload.value['file']);

                return this.service.documnetUpload(data).pipe(map((response) =>
                    new ScreenView.ScreenViewUploadAtachmentSuccess(infor.action.token, {
                        response: response,
                        controler: infor.action.payload.controler,
                    })),
                    catchError(error => of(new ScreenView.ScreenViewUploadAtachmentFail(infor.action.token, {
                        value: error
                    }))),);

            }

        }),);





    @Effect()
    currentContactId$ = this.actions$.pipe(ofType<ScreenView.GetCureentScreenContactId>(ScreenView.GET_CURRENT_SCREEN_CONTACT_ID),
        tap(action => console.log('GET_CURRENT_SCREEN_CONTACT_ID')),
        switchMap(action => {
            return this.service.getCurrentScreenContactID(action.payload.appId, action.payload.fileId,
                action.payload.branchId, action.payload.contactTypeId, action.payload.screenNo).pipe(
                map(response => new ScreenView.GetCureentScreenContactIdSuccess(
                    action.token,
                    { currentContactId: parseInt(response, null) }
                )),
                catchError(error => of(new ScreenView.GetCureentScreenContactId(
                    action.token,
                    null
                ))),);
        }),);

    @Effect()
    onUnlinkContact$ = this.actions$.pipe(ofType<ScreenContactCore.UnlinkContact>(ScreenContactCore.UNLINK_CONTACT),
        tap((data) => console.log('UNLINK_CONTACT')),
        switchMap((action) => {
            return combineLatest(
                this.store.select(getMatterDetailsByToken(action.token)),
                this.store.select(getCurentFormScreenDefinition(action.token)),
                (matter, screenDef) => ({ matter, screenDef })
            ).pipe(
                take(1),
                mergeMap((result) => {
                    const unlinkContactReq = new UnlinkContactRequest(
                        result.matter.AppId.toString(),
                        result.matter.FileId.toString(),
                        result.matter.BranchId.toString(),
                        result.screenDef.contactType.toString(),
                        action.payload.contactId
                    );
                    return this.service.unlinkContact(unlinkContactReq).pipe(
                        map(response => new ScreenContactCore.UnlinkContactSuccess(
                            action.token,
                            { contactId: action.payload.contactId }
                        )),
                        catchError(error => of(new ScreenContactCore.UnlinkContactFailed(
                            action.token,
                            action.payload
                        ))),);
                }),);
        }),);


}






