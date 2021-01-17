
import { Store } from '@ngrx/store';
import { EventEmitter } from 'events';
import { Output } from '@angular/core';
import {
    InitOpportunityPage, OpportunityDepartmentChange, OpportunityWorkTypeChange, OpportunityFeeEarnerChange,
    IntroductionSelectionChange, OpportunityStatusChange, OpportunityRefreshGridData, OpportunitySetSelectedClientData,
    OpportunityInputValueChange, OpportunityModelClear, SendAndSaveOpportunities,
    SaveAndQuoteOpportunities, ChangeTab, QuoteRun, GenarateQuote, GenarateQuoteRequest, CloseOpportunity,
    ConflictRunOpportunities, CloseOpportunitiesRejected, CloseOpportunitiesAccepted, OpportunityCaseFileCreate,
    GetLogFile, ChangePaginator, ApplyColumSort, UpdateSelectedRow, InitPropertyQuote,
    ChangePropertyQuoteRequest, RequestPropertyQuoteReport, ChangePropertQuStep, RequestToSendPropertyQuote, RequestToOpenMatter,
    ValidateMatterInfo, SaveScreenList, InitOppertunitySetting, ChangeSettingAppID, AddScreenItem,
    EditScreenItem, RemoveScreenItem, SaveEditOpportunities, InitOpertunityEdit, UploadEmailTemplete, OpenSettingPanel,
    SendNotification, ChangeReportData, ChangeColumFilteration
} from './../actions/core';
import {
    DropdownList, Introducer, FeeEarnerList, StatusList, OpportunitySaveViewModel,
    OpportunityClosedViewModel,
    ExtraColumnDef,
    OppertunityHistory,
    OpportunityGridDataViewModel,
    SaveScreenItem,
    PropertyQuReportview,
    OpportunityLoadingType,
} from './../models/interfaces';
import {
    getOpportunityColumnDefByToken, getDataLoadindByToken,
    getFeeEarnerListByToken, getIntroducerListByToken, getSaveOpportunityGridDataByToken,
    getStatusListByToken, getClientDataModelByToken,
    getOpportunitySelectedTabIndexByToken, getTempleteList, getQuoteRunLoading, closePopup,
    closeOpportunityPopupClose,
    opportunityViewHistory,
    getOpportunityPaginatorDefByToken,
    propertyQuoteTypeList, propertyQuoteRequest, getwebQuoteData, getPropertyQuCurrentStep, getPropertyQuReportData, getOpportunityStats,
    getScreenList, getAppCodes, getOpportuniySettingIsLoading, getAddedScreenList, editOppertunityData, getEmailTemplete, defuiltNote,
    getPreviesEmailTemplete, getWequoteCompanyDetails
} from './../reducers/index';
import { getHomeCurrency } from './../../setting-core/reducers/index';
import { ComponentBase } from '../../core/lib/component-base';
import { createDefultColumnDef } from '../../core/lib/grid-helpers';
import { PaginatorDef, ColumnDef } from '../../core/lib/grid-model';
import { Observable } from 'rxjs';
import { User, getUser } from '../../auth';
import { take } from 'rxjs/operators';
import { PropertyQuoteRequestKey } from '../models/enums';
import { LocalStorageKey } from '../../core';
import { MainMenuItem } from '../../layout-desktop';
import { getDepartmentList, getLookupListByType } from '../../shared-data';
import { MatterCategoryWithhAppInfo } from '../../shared-data/model/interface';
import { FieldType } from '../../odata';


export class BaseOpportunityManager extends ComponentBase {

    @Output() closePopup = new EventEmitter();

    public isLoading$: Observable<OpportunityLoadingType>;
    public gridColoum$: any;
    public paginatorDef$: any;
    public opportunityDispayData$: any;
    public loadOpportunityGridData$: any;
    public departmentList$: any;
    public feeEarnerList$: any;
    public workTypeList$: any;
    public introducerList$: any;
    public statusList$: any;
    public clientDataModel$: any;
    public selectedTabIndex$: any;
    public templete$: any;
    public isQuoteRunLoading$: any;
    public homeCurrency$: any;
    public closePopup$: any;
    public closeOpportunityPopupClose$: any;
    public historyData$: any;
    public paginetorDef$: any;
    public propertyQuoteType$: any;
    public propertyQuRequest$: any;
    public webQuoteData$: any;
    public user$: Observable<User>;
    public propertyQuStep$: any;
    public propertyQuReport$: any;
    public stats$: any;
    public screen$: any;
    public appCodeList$: any;
    public settingIsLoading$: any;
    public addedScreenList$: any;
    public editItem$: any;
    public emailTemplete$: any;
    public previousEmailTemplete$: any;
    public defuiltNote$: any;
    public webQuoteCompany$: any;
    public salTitle$: any;

    columnDef = [];
    paginatorDef = { currentPage: 0, itemPerPage: 50 };

    extraColumnDef: ExtraColumnDef = {};

    historyColumDef = [createDefultColumnDef('Type', { label: 'Type', fxFlex: '100px', filterAnchor: 'end', filterHidden: true }),
    createDefultColumnDef('Date', { label: 'Date', fxFlex: '132px', filterAnchor: 'end', filterHidden: true }),
    createDefultColumnDef('UserBy', { label: 'User by', fxFlex: '100px', filterAnchor: 'end', filterHidden: true }),
    createDefultColumnDef('UserFor', { label: 'User For', fxFlex: '100px', filterAnchor: 'start', filterHidden: true }),
    createDefultColumnDef('Details', { label: 'Details', fxFlex: '', filterAnchor: 'start', filterHidden: true })];

    constructor(protected store: Store<any>) {
        super();
    }
    protected initSelectors(opportunityToken: string, isPopup: boolean, oppertunityId: number) {
        this.user$ = this.store.select(getUser);

        // this.store.select(getMainMenuItems).subscribe(menuItem => {
        const menuItem: MainMenuItem<any>[] = JSON.parse(sessionStorage.getItem(LocalStorageKey.MenuItems));
        this.extraColumnDef = {
            [2]: [createDefultColumnDef('QuoteRunDate', { label: 'Quoted', fxFlex: '100px', filterAnchor: 'end', filterHidden: true })],
            [3]: [createDefultColumnDef('QuoteRunDate', { label: 'Quoted', fxFlex: '100px', filterAnchor: 'end', filterHidden: true }),
            createDefultColumnDef('ClosedDate', { label: 'Close Date', fxFlex: '100px', filterAnchor: 'end', filterHidden: true }),
            createDefultColumnDef('CloseNote', { label: 'Close Notes', fxFlex: '100px', filterAnchor: 'end', filterHidden: true }),
            createDefultColumnDef('MatterRef',
                {
                    label: `${menuItem.find(i => i.id === 'matter_search').label} Ref`, fxFlex: '100px',
                    filterAnchor: 'end', filterHidden: true
                })],
            [4]: [createDefultColumnDef('Quote', { label: 'Quoted', fxFlex: '100px', filterAnchor: 'end', filterHidden: true }),
            createDefultColumnDef('ClosedDate', { label: 'Close Date', fxFlex: '100px', filterAnchor: 'end', filterHidden: true }),
            createDefultColumnDef('CloseNote', { label: 'Close Notes', fxFlex: '100px', filterAnchor: 'end', filterHidden: true }),
            createDefultColumnDef('MatterRef',
                {
                    label: `${menuItem.find(i => i.id === 'matter_search').label} Ref`, fxFlex: '100px',
                    filterAnchor: 'end', filterHidden: true
                })],
            [5]: [createDefultColumnDef('Quote', { label: 'Quoted', fxFlex: '100px', filterAnchor: 'end', filterHidden: true }),
            createDefultColumnDef('ClosedDate', { label: 'Close Date', fxFlex: '100px', filterAnchor: 'end', filterHidden: true }),
            createDefultColumnDef('CloseNote', { label: 'Close Notes', fxFlex: '100px', filterAnchor: 'end', filterHidden: true }),
            createDefultColumnDef('MatterRef',
                {
                    label: menuItem.find(i => i.id === 'matter_search').label + ' Ref', fxFlex: '100px',
                    filterAnchor: 'end', filterHidden: true
                })],
        };
        this.columnDef = [
            createDefultColumnDef('Action', { label: '', fxFlex: '30px', filterAnchor: 'start', filterHidden: true }),
            createDefultColumnDef('enquiryDateOn', { label: 'Date', fxFlex: '100px', filterAnchor: 'end' }, FieldType.Date),
            createDefultColumnDef('OpportunityNumber',
                { label: 'Opportunity Ref', fxFlex: '100px', filterAnchor: 'end', filterHidden: true }),
            createDefultColumnDef('ConflictRunDate',
                { label: 'Conflict Check', fxFlex: '100px', filterAnchor: 'start', filterHidden: true }),
            createDefultColumnDef('ClientRef',
                {
                    label: menuItem.find(i => i.id === 'client_search').label + ' Ref', fxFlex: '100px',
                    filterAnchor: 'end', filterHidden: true
                }),
            createDefultColumnDef('clientName',
                {
                    label: menuItem.find(i => i.id === 'client_search').label + ' Name', fxFlex: '100px',
                    filterAnchor: 'start'
                }),
            createDefultColumnDef('mobileNo', { label: 'Mobile No', fxFlex: '100px', filterAnchor: 'start' }),
            createDefultColumnDef('department', { label: 'Department', fxFlex: '100px', filterAnchor: 'end' }),
            createDefultColumnDef('workType', { label: 'Work Type', fxFlex: '100px', filterAnchor: 'start', filterHidden: true }),
            createDefultColumnDef('feeEarner', { label: 'Fee Earner', fxFlex: '100px', filterAnchor: 'end' }),
            createDefultColumnDef('Notes', { label: 'Notes', fxFlex: '', filterAnchor: 'start', filterHidden: true }),
        ];
        if (!isPopup) {
            this.init(opportunityToken,
                { columnDef: this.columnDef, paginatorDef: this.paginatorDef, extraColumnDef: this.extraColumnDef });
        } else {
            this.store.dispatch(new InitOpertunityEdit(opportunityToken, oppertunityId));
        }
        this.isLoading$ = this.store.select(getDataLoadindByToken(opportunityToken));
        // this.workTypeList$ = this.store.select(getWorkTypeListByDepartmentId(opportunityToken));
        this.feeEarnerList$ = this.store.select(getFeeEarnerListByToken(opportunityToken));
        this.departmentList$ = this.store.select(getDepartmentList);
        this.introducerList$ = this.store.select(getIntroducerListByToken(opportunityToken));
        this.statusList$ = this.store.select(getStatusListByToken(opportunityToken));
        this.gridColoum$ = this.store.select(getOpportunityColumnDefByToken(opportunityToken));
        this.loadOpportunityGridData$ = this.store.select(getSaveOpportunityGridDataByToken(opportunityToken));
        this.clientDataModel$ = this.store.select(getClientDataModelByToken(opportunityToken));
        this.selectedTabIndex$ = this.store.select(getOpportunitySelectedTabIndexByToken(opportunityToken));
        this.closePopup$ = this.store.select(closePopup(opportunityToken));
        this.historyData$ = this.store.select(opportunityViewHistory(opportunityToken));
        this.paginetorDef$ = this.store.select(getOpportunityPaginatorDefByToken(opportunityToken));
        this.stats$ = this.store.select(getOpportunityStats(opportunityToken));
        this.emailTemplete$ = this.store.select(getEmailTemplete);
        this.previousEmailTemplete$ = this.store.select(getPreviesEmailTemplete);
        this.settingIsLoading$ = this.store.select(getOpportuniySettingIsLoading);
        this.editItem$ = this.store.select(editOppertunityData(opportunityToken));
        this.defuiltNote$ = this.store.select(defuiltNote(opportunityToken));
        this.salTitle$ = this.store.select(getLookupListByType('SALTITLE'));
    }
    init(token, payload) {
        this.user$.pipe(take(1)).subscribe(user => {
            this.store.dispatch(new InitOpportunityPage(token, { ...payload, dateTimeOffset: user.general.dateTimeOffset }));
        }).unsubscribe();
    }
    onDepartmetChange(token, id: number) {
        this.store.dispatch(new OpportunityDepartmentChange(token, id));
    }
    onIntroducerChange(token, item: Introducer) {
        this.store.dispatch(new IntroductionSelectionChange(token, item));
    }
    onFeeEarnerChange(token, item: FeeEarnerList) {
        this.store.dispatch(new OpportunityFeeEarnerChange(token, item));
    }
    onWorkTypeChange(token, item: MatterCategoryWithhAppInfo) {
        this.store.dispatch(new OpportunityWorkTypeChange(token, item));
    }
    onStatusChange(token, item: StatusList) {
        this.store.dispatch(new OpportunityStatusChange(token, item));
    }
    onRefreshGridData(token) {
        this.store.dispatch(new OpportunityRefreshGridData(token));
    }
    onInputDataChange(token, event) {
        this.store.dispatch(new OpportunityInputValueChange(token, { kind: event.kind, value: event.value }));
    }
    onClientSearchData(token, clientDataModel) {
        this.store.dispatch(new OpportunitySetSelectedClientData(token, clientDataModel));
    }
    onChangeSelectedTabIndex(token, tabIndex) {
        this.store.dispatch(new ChangeTab(token, { tabIndex: tabIndex }));
    }
    onClearInputOpportunity(token) {
        this.store.dispatch(new OpportunityModelClear(token));
    }
    onSendAndSaveOpportunity(token) {
        this.store.dispatch(new SendAndSaveOpportunities(token));
    }
    sendAndQuoteOpportunity(token) {
        this.store.dispatch(new SaveAndQuoteOpportunities(token));
    }
    conflictRun(token: string, item: OpportunitySaveViewModel) {
        this.store.dispatch(new ConflictRunOpportunities(token, { selectedItem: item }));
    }
    qouteRun(token: string, info: { data: OpportunitySaveViewModel, isEdit: boolean }) {
        this.store.dispatch(new QuoteRun(token, { item: info.data, isEdit: info.isEdit }));
    }
    closeOpportunity(token, item: OpportunitySaveViewModel) {
        if (!!item && item.enquiryId > 0) {
            this.store.dispatch(new ValidateMatterInfo(token, item, 'closeOppertunity'));
        } else {
            this.store.dispatch(new CloseOpportunity(token, { item: item }));
        }
    }
    createCaseFile(token: string, item: OpportunitySaveViewModel) {
        this.store.dispatch(new OpportunityCaseFileCreate(token, { item: item }));
    }
    initQuoteRunPopup(token: string, item: OpportunitySaveViewModel) {
        this.store.dispatch(new GenarateQuoteRequest(token, { item: item }));
        this.isQuoteRunLoading$ = this.store.select(getQuoteRunLoading(token));
        this.templete$ = this.store.select(getTempleteList(token));
        this.feeEarnerList$ = this.store.select(getFeeEarnerListByToken(token));
        // this.workTypeList$ = this.store.select(getWorkTypeListByDepartmentId(token));
        this.departmentList$ = this.store.select(getDepartmentList);
        this.homeCurrency$ = this.store.select(getHomeCurrency());
        this.closePopup$ = this.store.select(closePopup(token));
        this.isLoading$ = this.store.select(getDataLoadindByToken(token));
    }
    initOpportunityClosePopup(token: string, item: OpportunitySaveViewModel) {
        this.user$ = this.store.select(getUser);
        this.feeEarnerList$ = this.store.select(getFeeEarnerListByToken(token));
        // this.workTypeList$ = this.store.select(getWorkTypeListByDepartmentId(token));
        this.departmentList$ = this.store.select(getDepartmentList);
        this.isLoading$ = this.store.select(getDataLoadindByToken(token));
        this.closeOpportunityPopupClose$ = this.store.select(closeOpportunityPopupClose(token));
        this.closePopup$ = this.store.select(closePopup(token));
    }
    onGenerateProcess(token: string, item: OpportunitySaveViewModel) {
        this.store.dispatch(new GenarateQuote(token, { item: item }));
    }
    onAcceptedProcess(token: string, data: { closeModel: OpportunityClosedViewModel, item: OpportunitySaveViewModel }) {
        this.store.dispatch(new CloseOpportunitiesAccepted(token, data.closeModel, data.item));
    }
    onRejectedProcess(token: string, item: OpportunityClosedViewModel) {
        this.store.dispatch(new CloseOpportunitiesRejected(token, item));
    }
    openLogFile(token: string, historyItem: OppertunityHistory) {
        this.store.dispatch(new GetLogFile(token, historyItem.opportunityTransId));
    }
    changePage(token, pageDef: PaginatorDef) {
        this.store.dispatch(new ChangePaginator(token, pageDef));
    }
    ToggleSorting(token: string, columDef: ColumnDef) {
        this.store.dispatch(new ApplyColumSort(token, columDef));
    }
    onRowSelectedItem(token: string, selectedRow: OpportunityGridDataViewModel) {
        this.store.dispatch(new UpdateSelectedRow(token, selectedRow));
    }
    initPropertyQuote(token: string, isEditQuote: boolean) {
        this.propertyQuoteType$ = this.store.select(propertyQuoteTypeList(token));
        this.propertyQuRequest$ = this.store.select(propertyQuoteRequest(token));
        this.webQuoteData$ = this.store.select(getwebQuoteData(token));
        this.propertyQuStep$ = this.store.select(getPropertyQuCurrentStep(token));
        this.propertyQuReport$ = this.store.select(getPropertyQuReportData(token));
        this.isLoading$ = this.store.select(getDataLoadindByToken(token));
        this.closePopup$ = this.store.select(closePopup(token));
        this.homeCurrency$ = this.store.select(getHomeCurrency());
        this.store.dispatch(new InitPropertyQuote(token, isEditQuote));
        this.webQuoteCompany$ = this.store.select(getWequoteCompanyDetails);
    }
    onChangeProQuoteRequest(token: string, item: { key: PropertyQuoteRequestKey, value: any }, isEditQuote: boolean) {
        this.store.dispatch(new ChangePropertyQuoteRequest(token, item, isEditQuote));
    }
    requestReport(token: string, isEdit: boolean) {
        this.store.dispatch(new RequestPropertyQuoteReport(token, isEdit));
    }
    changeProfertQuSelectedStep(token: string, index: number) {
        this.store.dispatch(new ChangePropertQuStep(token, index));
    }
    sendPropertyQuote(token: string, reportContent: string, editedOpportunity: OpportunitySaveViewModel) {
        this.store.dispatch(new RequestToSendPropertyQuote(token, reportContent, editedOpportunity));
    }
    openMatter(token: string, item: OpportunitySaveViewModel) {
        this.store.dispatch(new RequestToOpenMatter(token, item));
    }

    onSaveScreenList(noAddingItemAppId: number) {
        this.store.dispatch(new SaveScreenList({ hasNonAddingItem: !!noAddingItemAppId }));
    }
    initOppertunitySetting(isOpportunitySeting: boolean) {
        if (!!isOpportunitySeting) {
            this.onOpenSettingPanel();
            this.emailTemplete$ = this.store.select(getEmailTemplete);
            this.previousEmailTemplete$ = this.store.select(getPreviesEmailTemplete);
            this.settingIsLoading$ = this.store.select(getOpportuniySettingIsLoading);
        } else {
            this.store.dispatch(new InitOppertunitySetting());
            this.appCodeList$ = this.store.select(getAppCodes);
            this.settingIsLoading$ = this.store.select(getOpportuniySettingIsLoading);
            this.screen$ = this.store.select(getScreenList);
            this.addedScreenList$ = this.store.select(getAddedScreenList);
        }

    }
    onChangeSettingAppId(appId: number) {
        this.store.dispatch(new ChangeSettingAppID(appId));
    }
    onAddScreenItem(event: SaveScreenItem) {
        this.store.dispatch(new AddScreenItem(event));
    }
    onEditScreenItem(event: { index: number, key: string, value: any }) {
        this.store.dispatch(new EditScreenItem(event.index, event.key, event.value));
    }
    onRemoveScreenItem(index: number) {
        this.store.dispatch(new RemoveScreenItem(index));
    }
    saveEditOpertunity(token: string, item: OpportunitySaveViewModel) {
        this.store.dispatch(new SaveEditOpportunities(token, item));
    }
    // getWorkTypeList(token: string, departmentId: number) {
    //     this.store.dispatch(new GetWorkTypeList(token, { departmentId: departmentId }));
    // }
    onUploadEmailTemplete(file: File) {
        this.store.dispatch(new UploadEmailTemplete(file));
    }
    onOpenSettingPanel() {
        this.store.dispatch(new OpenSettingPanel());
    }
    sendNotification(token: string, event: { email: string, feeEarnerCode: string, message: string, enquiryId: number }) {
        this.store.dispatch(new SendNotification(token, { data: event }));
    }
    changeReportData(token: string, data: { newReport: PropertyQuReportview, type: string }) {
        this.store.dispatch(new ChangeReportData(token, data));
    }
    changeColumFilteration(token: string, data: { kind: string, columnDef: ColumnDef }) {
        this.store.dispatch(new ChangeColumFilteration(token, data));
    }


}

