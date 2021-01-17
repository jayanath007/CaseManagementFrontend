import { getScreenLogicDocuments } from './../reducers/index';

import { mergeMap, take, filter, map, catchError, switchMap, tap } from 'rxjs/operators';

import { forkJoin as observableForkJoin, combineLatest, of, from, empty } from 'rxjs';
import { ScreenComponent } from '../../screen-view-core/models/screen-component';
import { ConfirmDialogData, ConfirmDialogResultKind, } from '../../shared/models/dialog';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material';
import { CheckoutTempalteFiles, FileManagerType, CheckinFile, FileUrlResolverService, DiscardCheckout } from '../../document-view';
import * as WindowPopup from '../../document-view/actions/window-popups';
import { getOvItemByToken } from '../reducers';
import { FormViewRequest, ScreenDesingnerRequest, SaveScreenDesignerRequest } from '../models/screen-desingner-request';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';
import * as ScreenDesingner from '../actions/core';
import * as OvItem from '../actions/ov-items';
import * as FieldProperties from '../actions/field-properties';

import { ScreenDesingnerService } from '../services/screen-desingner.service';
import { ScreenListItemsChangeKind, RowOvItemChangeKind } from '../actions/core';
import {
    getFormViewResponsListDataByToken,
    getFormViewResponsDataByIndex, getMainState,
    getInitialInfor,
    getUpdatedCurentFormViewDataByToken,
    getScreenDesingnerStateByToken,
    getCheckedOutScreenLogicDocuments,
} from '../reducers';
import { FormViewRespons } from '../reducers/screen-desingner';
import { FieldPropertiesService } from '../services/field-properties.service';
import { OvItemService } from '../services/ov-items.service';
import { ViewChangeKind } from '../actions/core';
import { fitWindow } from '../../utils/bounds';




@Injectable()
export class ScreenDesingnerEffects {
    constructor(private actions$: Actions, private store: Store<any>,
        private service: ScreenDesingnerService, private fieldProperties: FieldPropertiesService,
        private urlResolver: FileUrlResolverService,
        private ovItemService: OvItemService, private dialog: MatDialog) { }


    @Effect()
    initNewViewPoup$ = this.actions$.pipe(ofType<ScreenDesingner.InitScreenDesingnerPopup>(ScreenDesingner.INIT_SCREEN_DESIGNER_POPUP),
        tap((data) => console.log('$initNewView', data))).pipe(
            mergeMap((action) => {
                return from([
                    new ScreenDesingner.LoadScreenDesingnerFormViewListData(action.token, new ScreenDesingnerRequest(action.payload)),
                    new ScreenDesingner.LoadScreenDesingnerFormViewData(action.token, new FormViewRequest(action.payload)),
                    new OvItem.LoadOvItemList(action.token)
                ]);
            }));

    @Effect()
    createlookupFile$ = this.actions$
        .pipe(ofType<ScreenDesingner.ScreenDesignerCreatelookupFile>(ScreenDesingner.SCREEN_DESIGNER_CREATE_LOOKUP_FILE),
            tap((data) => console.log('$createlookupFile', data)),
            switchMap((action) => {
                return this.fieldProperties.createLookupFile(action.payload.row.control.action, action.payload.value, false).pipe(
                    switchMap((response) => {
                        if (response && response.status === 0 && response.detailStatusDtos) {

                            // const messageText = response.detailStatusDtos[0].message;
                            // const headingText = response.detailStatusDtos[0].reference;

                            const dialogData: ConfirmDialogData = {
                                content: {
                                    message: response.detailStatusDtos[0] ? response.detailStatusDtos[0].message : '',
                                    title: response.detailStatusDtos[0] ? response.detailStatusDtos[0].reference : ''
                                },
                                contentParams: {},
                                data: null
                            };
                            const dialogRef = this.dialog.open(ConfirmDialogComponent, {
                                data: dialogData,
                                width: '400px',
                                disableClose: true,
                                panelClass: 'dps-notification'
                            });

                            return dialogRef.afterClosed().pipe(
                                switchMap((dialogResult) => {
                                    if (dialogResult.kind === ConfirmDialogResultKind.Confirmed) {
                                        return this.fieldProperties.createLookupFile(action.payload.row.control.action,
                                            action.payload.value, true).pipe(
                                                mergeMap((data) => {
                                                    if (data && data.status === 0) {
                                                        return empty();
                                                    } else {

                                                        const screenComponentDto = { ...action.payload.row.screenComponentDto };
                                                        screenComponentDto.sC_Action = action.payload.row.control.action;
                                                        const component = new ScreenComponent(screenComponentDto,
                                                            action.payload.row.mainState);
                                                        return from([
                                                            new ScreenDesingner.ScreenDesignerComponentChange(action.token,
                                                                { kind: ScreenListItemsChangeKind.UpdateValue, row: component, value: '' }),
                                                            new FieldProperties.LookupFilesUpdate(action.token,
                                                                { value: action.payload.row.control.action })

                                                        ]);

                                                    }
                                                }));

                                    } else {
                                        const screenComponentDto = { ...action.payload.row.screenComponentDto };
                                        screenComponentDto.sC_Action = '';
                                        const component = new ScreenComponent(screenComponentDto, action.payload.row.mainState);
                                        return of(new ScreenDesingner.ScreenDesignerComponentChange(action.token,
                                            { kind: ScreenListItemsChangeKind.UpdateValue, row: component, value: '' }));
                                    }
                                }));
                            // .map((result) => ({ result, menuItem, newMenuItem }));
                            // return
                        }
                        return empty();
                    }),
                    catchError((error) => of(new ScreenDesingner.ScreenDesignerCreatelookupFileFail(action.token, error))));

            }));

    @Effect()
    treeItemChangeEditTemplate$ = this.actions$.pipe(ofType<ScreenDesingner.LogicDodumentView>(ScreenDesingner.LOGIC_DODUMENT_VIEW),
        tap((data) => {
            console.log('LOGIC_DODUMENT_VIEW' + data);
        }),
        switchMap((action) => {

            return combineLatest(
                this.store.select(getScreenDesingnerStateByToken(action.token)).pipe(take(1)),
                this.store.select(getScreenLogicDocuments(action.token)).pipe(take(1)),
                ((state, ScreenLogicDocuments) => ({
                    state: state,
                    ScreenLogicDocuments: ScreenLogicDocuments,
                }))
            ).pipe(take(1),
                switchMap<any, any>((data) => {

                    const document = data.ScreenLogicDocuments.filter((item) => {
                        return item.id === action.screenLogic;
                    })[0];


                    const screenDefinition = data.state.formView.screenDefinition;
                    const fileName = screenDefinition.screenDefinitionDto.sD_Number.toString() + document.fileName;
                    const appId = +screenDefinition.application;


                    if (document.checkedOutByUser && document.checkedOutByUser !== '' &&
                        (!document.checkedOutHashKey || document.checkedOutHashKey === '')) {
                        // view
                        return this.urlResolver.getTemplateDataUrl(appId, fileName).pipe(map((url) =>
                            new WindowPopup.OpenByUrl({
                                id: appId + '_' + fileName,
                                url: url,
                                spec: {
                                    ...fitWindow(),
                                },
                                attachmentName: ''
                            })
                        ));
                    } else {

                        const templateType = document.id.toString();
                        return of(new CheckoutTempalteFiles({
                            appId: appId,
                            fileName: fileName,
                            templateType: templateType,
                        }));

                    }

                }));


        }));

    @Effect()
    formViewChange$ = this.actions$.pipe(ofType<ScreenDesingner.ScreenDesingnerFormViewChange>
        (ScreenDesingner.SCREEN_DESIGNER_FORM_VIEW_CHANGE),
        filter(action =>
            action.payload.kind === ViewChangeKind.GoToNext ||
            action.payload.kind === ViewChangeKind.GoToPrevious),
        tap((data) => console.log('$initNewView', data))).pipe(
            mergeMap((action) => {
                return from([
                    new ScreenDesingner.SaveScreenDesigner(action.token, new SaveScreenDesignerRequest('', false, false))
                ]);
            }));

    @Effect()
    formViewSave$ = this.actions$.pipe(ofType<ScreenDesingner.SaveScreenDesigner>(ScreenDesingner.SAVE_SCREEN_DESIGNER),
        switchMap((action) => {
            //  return of('');

            return combineLatest(
                this.store.select(getScreenDesingnerStateByToken(action.token)).pipe(take(1)),
                this.store.select(getCheckedOutScreenLogicDocuments(action.token)).pipe(take(1)),
                ((state, ScreenLogicDocuments) => ({
                    state: state,
                    ScreenLogicDocuments: ScreenLogicDocuments,
                }))
            ).pipe(take(1), switchMap((data) => {

                data.ScreenLogicDocuments.forEach((item) => {
                    const checkout = {
                        hashKey: item.checkedOutHashKey,
                        url: null,
                        name: null,
                        path: null,
                        fileManagerType: FileManagerType.TemplateManager
                    };
                    this.store.dispatch(new CheckinFile(checkout));
                });
                return this.service.saveScreenComponen(data.state.formView, action.request.importXMLPath, action.request.rearrange).pipe(
                    map((result) => {

                        const appId = +data.state.formView.screenDefinition.application;
                        const screenId = data.state.screenIds[data.state.curentIndex];
                        return new ScreenDesingner.LoadScreenDesingnerFormViewData(action.token,
                            new FormViewRequest({ appId: appId, screenId: screenId }));
                    }),
                    catchError((error) => of(new ScreenDesingner.SaveScreenDesignerFail(action.token, error))));
            }));



        }));





    @Effect()
    exportScreenToXMLScreenDesigner$ = this.actions$.pipe(ofType<ScreenDesingner.ExportScreenToXMLScreenDesigner>
        (ScreenDesingner.EXPORT_SCREEN_TO_XML_SAVE_SCREEN_DESIGNER),
        switchMap((action) => {
            return this.store.select(getScreenDesingnerStateByToken(action.token)).pipe(take(1),
                switchMap((state) => {
                    return this.service.exportScreenComponens(+state.formView.screenDefinition.application,
                        state.formView.screenDefinition.screenNumber, 0, '', true).pipe(
                            map((result: any) => {
                                return new ScreenDesingner.ExportScreenToXMLScreenDesignerSuccess(action.token, { response: result });
                            }),
                            catchError((error) => of(new ScreenDesingner.ExportScreenToXMLScreenDesignerFail(action.token, error))));
                }));
        }));


    @Effect()
    exportOvlist$ = this.actions$.pipe(ofType<ScreenDesingner.ExportScreenDesignerOvList>(ScreenDesingner.EXPORT_SCREEN_DESIGNER_OV_LIST),
        switchMap((action) => {
            return this.store.select(getScreenDesingnerStateByToken(action.token)).pipe(take(1),
                switchMap((state) => {

                    return this.service.exportScreenOvList(+state.formView.screenDefinition.application,
                        state.formView.screenDefinition.screenNumber, 0, '', true).pipe(
                            map((result: any) => {
                                return new ScreenDesingner.ExportScreenDesignerOvListSuccess(action.token, { response: result });
                            }),
                            catchError((error) => of(new ScreenDesingner.ExportScreenDesignerOvListFail(action.token, error))));
                }));
        }));

    @Effect()
    loadFormViewList$ = this.actions$.pipe(ofType<ScreenDesingner.LoadScreenDesingnerFormViewListData>
        (ScreenDesingner.LOAD_SCREEN_DESIGN_FORM_VIEW_LIST_DATA),
        switchMap((action) => {
            return this.store.select(getFormViewResponsListDataByToken(action.token)).pipe(
                map((formViewResponsList) => {
                    const hasFormListData = (formViewResponsList && formViewResponsList.length > 0) ? true : false;
                    return { action: action, hasFormListData: hasFormListData };
                }), take(1));
        }),
        filter((info) => !info.hasFormListData),
        switchMap((data) => {
            const observableBatch = [];
            data.action.request.filterOptions.screenIds.forEach((screenId) => {
                observableBatch.push(this.service.getFormViewData(data.action.request.filterOptions.appId, screenId, false)
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


                    return new ScreenDesingner.LoadScreenDesingnerListSuccess(data.action.token,
                        { response: formViewResponsList, request: data.action.request });
                }), catchError((error) => {
                    return of(new ScreenDesingner.LoadScreenDesingnerFormViewDataFail(data.action.token, error));
                }));
        }));

    @Effect()
    loadFormViewData$ = this.actions$.pipe(ofType<ScreenDesingner.LoadScreenDesingnerFormViewData>
        (ScreenDesingner.LOAD_SCREEN_DESIGNER_FORM_VIEW_DATA),
        tap((data) => console.log('$initNewView', data)),
        switchMap((action) => {

            const ovItems$ = this.store.select(getOvItemByToken(action.token)).pipe(
                switchMap((ovItems) => {
                    if (ovItems) {
                        return of(ovItems);
                    } else {
                        return this.ovItemService.getOVItems(action.request.filterOptions.appId, +action.request.filterOptions.screenId);
                    }
                }), take(1));
            const mainState$ = this.store.select(getMainState(action.token)).pipe(take(1),
                switchMap((mainState) => {
                    if (mainState) {
                        return of(mainState);
                    } else {
                        return this.service.getUpdatedMainState();
                    }
                }), take(1));
            const formViewData$ = this.store.select(getFormViewResponsDataByIndex
                (action.token, action.request.filterOptions.currentIndex)).pipe(take(1),
                    switchMap((formViewData) => {
                        if (formViewData && formViewData.screenDefinition) {
                            return of(formViewData);
                        } else {
                            return this.service.getFormViewData(action.request.filterOptions.appId,
                                action.request.filterOptions.screenId, action.request.filterOptions.createScreen);
                            // .map((request) => {
                            //     return request.data;
                            // });
                        }
                    }), take(1));
            const initialInfor$ = this.store.select(getInitialInfor(action.token)).pipe(take(1));
            return combineLatest(
                ovItems$,
                mainState$,
                formViewData$,
                initialInfor$,
                ((ovItems, mainState, curentFormView, initialInfor) => ({
                    ovItems: ovItems,
                    mainState: mainState,
                    curentFormView: curentFormView,
                    initialInfor: initialInfor,
                }))
            ).pipe(take(1)).pipe(mergeMap((response) => {

                if (!(response.curentFormView && response.curentFormView.screenDefinition)) {

                    const filterOptions = action.request.filterOptions;
                    filterOptions.createScreen = true;
                    return from([new ScreenDesingner.LoadScreenDesingnerFormViewData(action.token,
                        new FormViewRequest(action.request.filterOptions))]);
                }

                const drowScreenControlList = this.service.drowComponentList(response.curentFormView.screenControlList,
                    response.mainState, []);
                const drowScreenDefinition = this.service.drowForm(response.curentFormView.screenDefinition, response.mainState);
                const formView = {
                    screenContanerComponentList: drowScreenControlList,
                    screenDefinition: drowScreenDefinition,
                    index: action.request.filterOptions.currentIndex
                };

                const actions: any = [
                    new ScreenDesingner.LoadScreenDesingnerFormViewDataSuccess(action.token,
                        { response: formView, request: action.request }),
                    new ScreenDesingner.LoadMainStateSuccess(action.token,
                        { response: response.mainState, request: action.request }),
                    new OvItem.OvListItemsUpdate(action.token, { ovItem: response.ovItems, formView: formView })
                ];
                if (!response.initialInfor) {
                    actions.push(new ScreenDesingner.InitialDatainforUpdateLoading(action.token,
                        {
                            masages: response.curentFormView.initialInfor.errorMasages,
                            screenIds: action.request.filterOptions.screenIds
                        }));
                }
                return from(actions);
            }), catchError((error) => {
                return of(new ScreenDesingner.LoadScreenDesingnerFormViewDataFail(action.token, error));
            }));
        }));



    @Effect()
    loadMainState$ = this.actions$.pipe(ofType<ScreenDesingner.LoadMainState>(ScreenDesingner.LOAD_MAIN_STATE),
        switchMap((action) => {
            return this.store.select(getMainState(action.token)).pipe(
                map((mainState) => {
                    const hasMainState = (mainState) ? true : false;
                    return { action: action, hasMainState: hasMainState };
                }), take(1));
        }),
        filter((info) => !info.hasMainState),
        switchMap((data) =>
            this.service.getUpdatedMainState().pipe(
                map((result) => new ScreenDesingner
                    .LoadMainStateSuccess(data.action.token, { response: result, request: data.action.payload.request })),
                catchError((error) => of(new ScreenDesingner.LoadMainStateFail(data.action.token, error))))
        ));

    @Effect()
    ovItemListUpdate$ = this.actions$.pipe(ofType<ScreenDesingner.ScreenDesignerComponentChange>
        (ScreenDesingner.SCREEN_DESIGNER_COMPONENT_CHANGE),
        tap((data) => console.log('SCREEN_DESIGNER_COMPONENT_CHANGE', data)),
        filter(action =>
            action.payload.kind === ScreenListItemsChangeKind.AddItem ||
            action.payload.kind === ScreenListItemsChangeKind.SequenceChange ||
            action.payload.kind === ScreenListItemsChangeKind.DeleteItem ||
            action.payload.kind === ScreenListItemsChangeKind.SequenceRearrangement ||
            action.payload.kind === ScreenListItemsChangeKind.UpdateValue ||
            action.payload.kind === ScreenListItemsChangeKind.RearrangementSequencePosition),
        switchMap((action) => {
            const curentFormView$ = this.store.select(getUpdatedCurentFormViewDataByToken(action.token)).pipe(take(1));
            const ovItems$ = this.store.select(getOvItemByToken(action.token)).pipe(take(1));
            return combineLatest(
                curentFormView$,
                ovItems$,
                ((curentFormView, ovItems) => ({
                    curentFormView: curentFormView,
                    ovItems: ovItems,
                }))
            ).pipe(take(1), map((response) => {
                console.log(response.curentFormView);
                return new OvItem.OvListItemsUpdate(action.token, { ovItem: response.ovItems, formView: response.curentFormView });
            }));
        }));

    @Effect()
    updateDeleteItemSuccess$ = this.actions$.pipe(ofType<OvItem.ScreenDesignerUpdateOvItem>(OvItem.SCREEN_DESIGNER_UPDATE_OV_ITEM),
        tap((data) => console.log('$deleteOvItem', data)),
        filter((p) => p.payload.kind === RowOvItemChangeKind.DeleteItemSuccess),
        map((action) => {
            return new ScreenDesingner.ScreenDesignerComponentChange(action.token,
                { kind: ScreenListItemsChangeKind.OvItemDeleteItem, row: null, value: action.payload.value });
        }));

    @Effect()
    ovItemListUpdateFromDb$ = this.actions$.pipe(ofType<ScreenDesingner.ScreenDesignerComponentChange>
        (ScreenDesingner.SCREEN_DESIGNER_COMPONENT_CHANGE),
        tap((data) => console.log('SCREEN_DESIGNER_COMPONENT_CHANGE', data)),
        filter(action =>
            action.payload.kind === ScreenListItemsChangeKind.DeleteItemFromDb),
        switchMap((action) => {
            return this.fieldProperties.deleteFieldProperties(action.payload.row).pipe(
                map((result) => {
                    return new ScreenDesingner.ScreenDesignerComponentChange(action.token,
                        { kind: ScreenListItemsChangeKind.DeleteItem, row: action.payload.row, value: '' });
                }),
                catchError((error) => of(empty())));
        }));



    @Effect()
    closeScreenDesigner$ = this.actions$.pipe(ofType<ScreenDesingner.CloseScreenDesigner>(ScreenDesingner.CLOSE_SCREEN_DESIGNER),
        switchMap((action) => {
            return combineLatest(
                this.store.select(getScreenDesingnerStateByToken(action.token)).pipe(take(1)),
                this.store.select(getCheckedOutScreenLogicDocuments(action.token)).pipe(take(1)),
                ((state, checkedOutScreenLogicDocuments) => ({
                    state: state,
                    checkedOutScreenLogicDocuments: checkedOutScreenLogicDocuments,
                }))
            ).pipe(take(1),
                switchMap<any, any>((data) => {

                    if (data.checkedOutScreenLogicDocuments.length > 0) {

                        const message = 'Your check-out file will be abort. Do you need proceed ?';
                        const dialogData: ConfirmDialogData = {
                            content: {
                                title: 'Screen Designer',
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

                        return confirmDialogRef.afterClosed().pipe(
                            switchMap<any, any>((dialogResult) => {

                                if (dialogResult.kind === ConfirmDialogResultKind.Confirmed) {
                                    data.checkedOutScreenLogicDocuments.forEach((item) => {
                                        const checkout = {
                                            hashKey: item.checkedOutHashKey,
                                            url: null,
                                            name: null,
                                            path: null,
                                            fileManagerType: FileManagerType.TemplateManager
                                        };
                                        this.store.dispatch(new DiscardCheckout(checkout));
                                    });

                                    return this.closeScreenDesigner(data, action);

                                } else {
                                    return of(new ScreenDesingner.CloseScreenDesignerFail(action.token));
                                }


                            }));

                    } else {
                        return this.closeScreenDesigner(data, action);
                    }

                }));
        }));

    closeScreenDesigner(data, action) {
        if (data.state.formView && data.state.formView.isFormViewChanged === true) {

            const messageSave = 'Save Screen Design?';
            const dialogData1: ConfirmDialogData = {
                content: {
                    title: 'Screen Designer',
                    message: messageSave,
                    acceptLabel: 'OK',
                    rejectLabel: 'No'
                },
                data: null
            };
            const confirmDialogRef1 = this.dialog.open(ConfirmDialogComponent, {
                data: dialogData1,
                disableClose: true,
                width: '350px',
                panelClass: 'dps-notification'
            });
            return confirmDialogRef1.afterClosed().pipe(
                mergeMap((dialogDataInfor) => {

                    if (dialogDataInfor && dialogDataInfor.kind === ConfirmDialogResultKind.Confirmed) {
                        return this.massageReOrder(action);
                    } else {
                        return from([new ScreenDesingner.CloseScreenDesignerSuccess(action.token)]);
                    }
                }));
        } else {
            return of(new ScreenDesingner.CloseScreenDesignerSuccess(action.token));
        }

    }

    massageReOrder(action) {
        const message = 'Do you want to rearrange control sequence according to their position?';

        const dialogData: ConfirmDialogData = {
            content: {
                title: 'Screen Designer',
                message: message,
                acceptLabel: 'OK',
                rejectLabel: 'No'
            },
            data: null
        };
        const confirmDialogRef = this.dialog.open(ConfirmDialogComponent, {
            data: dialogData,
            disableClose: true,
            width: '350px',
            panelClass: 'dps-notification'
        });
        return confirmDialogRef.afterClosed().pipe(mergeMap((dialogResult) => {
            if (dialogResult.kind === ConfirmDialogResultKind.Confirmed) {

                return from([
                    new ScreenDesingner.ScreenDesignerComponentChange(action.token,
                        { kind: ScreenListItemsChangeKind.RearrangementSequencePosition, row: null, value: null }),
                    new ScreenDesingner.SaveScreenDesigner(action.token, new SaveScreenDesignerRequest('', false, true)),
                    new ScreenDesingner.CloseScreenDesignerSuccess(action.token)
                ]);

            } else {
                return from([
                    new ScreenDesingner.SaveScreenDesigner(action.token, new SaveScreenDesignerRequest('', false, true)),
                    new ScreenDesingner.CloseScreenDesignerSuccess(action.token)
                ]);
            }

        }));



    }



}
