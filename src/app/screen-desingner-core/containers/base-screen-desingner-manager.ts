import { CloseScreenDesigner } from './../actions/core';

import { CheckinFile, DiscardCheckout } from './../../document-view/actions/document-editing';
import { ExportScreenDesignerRequest, ScreenLogicDocuments, ScreenLogic } from '../models/screen-desingner-request';
import { ScreenDefinition } from '../../screen-view-core/models/screen-definition';
import { getOvItemByToken, getScreenDesignComponentsLeftAlignController } from '../reducers';

import { ScreenContanerComponent } from '../../screen-view-core/models/screen-contaner-component';
import { OnInit } from '@angular/core';
import {
    ScreenDesingnerFormViewChange, ViewChangeKind, InitScreenDesingner, ScreenDesignerComponentChange,
    ScreenListItemsChangeKind, LoadScreenDesingnerFormViewData, IsFormDataLoading, LoadMainState,
    InitScreenDesingnerPopup, InitialDatainforUpdateLoading, RowOvItemChangeKind,
    ScreenDesignerScreenDefinitionChange, RowScreenDefinitionChangeKind, SaveScreenDesigner, LogicDodumentView, TabChangeKind,
    ScreenDesingnerTabChange, ExportScreenDesignerOvList, ExportScreenToXMLScreenDesigner, ScreenDesignerCreatelookupFile,



} from '../actions/core';
import { Store } from '@ngrx/store';
import {
    getCurentFormViewDataByToken, getScreenDesingnerStateByToken
    , getCurentFormScreenContanerComponentList, getCurentFormScreenDefinition,
    getScreenDesingnerStatus, getMainState, getInitialInfor, getLoadForm,
    getSelectedContanerComponentByToken, getLookupFiles, getSortedOvItemByToken,
    getSelectedOvItemByToken, getSearchtextToken,
    getScreenLogicDocuments, getCheckedOutScreenLogicDocuments, getScreenClosePopup
} from '..';

import { ScreenDesingnerInitials } from '../../core/lib/screen-desingner';
import { ScreenDesingnerRequestViewModel, SaveScreenDesignerRequest } from '../models/screen-desingner-request';
import {
    InitOvItem, ScreenDesignerUpdateOvItem, OvListSearchTextChange,
} from '../actions/ov-items';
import { GetLookupFilesData } from '../actions/field-properties';
import { LookupFilesRequest } from '../models/field-properties-request';
import { OvItem } from '../models/application-component';
import { FileManagerType } from '../../document-view';



export class BaseScreenDesingnerManager {

    public formView$: any;
    public ovItemList$: any;
    public screenDesingner$: any;
    public selectedContanerComponent$: any;
    public lookupFiles$: any;
    public selectedOvItem$: any;
    public searchText$: any;
    public activaTab$: any;
    public messageCount$: any;
    public screenLogicDocuments$: any;
    public checkedOutScreenLogicDocuments$: any;
    public closePopup$: any;


    constructor(protected store: Store<any>) {

    }

    OnInit(token, payload: ScreenDesingnerInitials) {
        this.store.dispatch(new InitScreenDesingner(token, payload));
    }

    onInitScreenDesingnerPopup(token, payload: ScreenDesingnerRequestViewModel) {
        this.store.dispatch(new InitScreenDesingnerPopup(token, payload));
        this.initSelectors(token);
    }

    onScreenDesingnerChange(token: string, value: { kind: ViewChangeKind.GoToNext, value: ScreenDesingnerRequestViewModel }) {
        this.store.dispatch(new ScreenDesingnerFormViewChange(token, value));
    }
    onSearchTextChange(token: string, event) {
        this.store.dispatch(new OvListSearchTextChange(token, { text: event.value }));
    }

    onLogicDodumentView(token: string, event: ScreenLogic) {
        this.store.dispatch(new LogicDodumentView(token, event));
    }
    onTabChange(token: string, value: { kind: TabChangeKind.GoToPropertyWindow, value: string }) {
        this.store.dispatch(new ScreenDesingnerTabChange(token, value));
    }

    onScreenDesingnerComponentChange(token: string, payload: {
        kind: ScreenListItemsChangeKind,
        row: ScreenContanerComponent, value: any
    }) {
        this.store.dispatch(new ScreenDesignerComponentChange(token, payload));
    }
    onScreenDesingnerScreenDefinitionChange(token: string, payload: {
        kind: RowScreenDefinitionChangeKind,
        row: ScreenDefinition, value: any
    }) {
        this.store.dispatch(new ScreenDesignerScreenDefinitionChange(token, payload));
    }

    onScreenDesingnerSave(token: string, event: { importXMLPath: string, rearrange: boolean }) {
        this.store.dispatch(new SaveScreenDesigner(token, new SaveScreenDesignerRequest(event.importXMLPath, event.rearrange, true)));
    }

    onExportOvList(token: string, event) {
        this.store.dispatch(new ExportScreenDesignerOvList(token));
    }

    onCreatelookupFile(token: string, event) {
        this.store.dispatch(new ScreenDesignerCreatelookupFile(token, event));
    }


    onExportScreenToXML(token: string, event) {
        this.store.dispatch(new ExportScreenToXMLScreenDesigner(token));
    }


    onScreenDesingnerOvUpdate(token: string, payload: { kind: RowOvItemChangeKind, row: OvItem, value: any }) {
        this.store.dispatch(new ScreenDesignerUpdateOvItem(token, payload));
    }

    getlookUpData(token: string, payload: any) {

        const appId = payload.payload.appId;
        this.store.dispatch(new GetLookupFilesData(token, { request: new LookupFilesRequest(appId) }));
    }

    onFormDataLoading(token: string, value: boolean) {
        this.store.dispatch(new IsFormDataLoading(token, { value }));
    }

    onCloseScreenDesigner(token: string) {
        this.store.dispatch(new CloseScreenDesigner(token));
    }


    doCheckin(item: ScreenLogicDocuments) {

        const checkout = {
            hashKey: item.checkedOutHashKey,
            url: null,
            name: null,
            path: null,
            fileManagerType: FileManagerType.TemplateManager
        };
        this.store.dispatch(new CheckinFile(checkout));
    }

    doDiscardCheckin(item: ScreenLogicDocuments) {
        const checkout = {
            hashKey: item.checkedOutHashKey,
            url: null,
            name: null,
            path: null,
            fileManagerType: FileManagerType.TemplateManager
        };
        this.store.dispatch(new DiscardCheckout(checkout));
    }



    protected initSelectors(token: string) {
        this.formView$ = this.store.select(getCurentFormViewDataByToken(token));
        this.ovItemList$ = this.store.select(getSortedOvItemByToken(token));
        this.screenDesingner$ = this.store.select(getScreenDesingnerStateByToken(token));
        this.selectedContanerComponent$ = this.store.select(getSelectedContanerComponentByToken(token));
        this.lookupFiles$ = this.store.select(getLookupFiles(token));
        this.selectedOvItem$ = this.store.select(getSelectedOvItemByToken(token));
        this.searchText$ = this.store.select(getSearchtextToken(token));
        this.messageCount$ = this.store.select(getScreenDesignComponentsLeftAlignController(token));
        this.screenLogicDocuments$ = this.store.select(getScreenLogicDocuments(token));
        this.checkedOutScreenLogicDocuments$ = this.store.select(getCheckedOutScreenLogicDocuments(token));
        this.closePopup$ = this.store.select(getScreenClosePopup(token));
    }


}
