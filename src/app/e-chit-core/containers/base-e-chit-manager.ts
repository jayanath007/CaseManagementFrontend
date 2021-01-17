import { ExtraEChitPopupInput } from './../models/interfaces';
import {
    EChitTypeChange, GetMatterBalances,
    AddAttachment, InitEChitSave, GetSupplierVatCode, EChitMatterSearchPoupOpen,
    EChitToMatterSearchPoupOpen, EChitClosed, ChangeDisbTypes, ChangeDisbValue, ChangeClassType, ChangeAttType, ChangeExtraEChitPopupInput
} from './../actions/core';
import { Output, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { InitEChit } from '..';
import {
    getFormDataModelByToken, getLoadingToken,
    getModelByToken, getSapullerVatCodeByToken, getEChitTypeByToken
    , getSupplierDocEnablesByToken,
    getMatterDetailsNameByToken, getOpenEChitOpenTypeByToken,
    getCloseToken, getMatterRefDataByToken, getToMatterRefDataByToken, getOpenEChitIsSavingDataByToken,
    getDisbuTotalByToken, getFeeTotalByToken, getDisburcementValuByToken, getSelectedDisbuTypesByToken,
    getSelectedIncDisbuBreakDownByToken, getSelectedWorkTypesByToken,
    getClassTypeByToken, getAttTypeListByToken, getInputDataByToken
} from './../reducers/index';
import { EChitPopupInput } from '../models/interfaces';
import { ChequeRequestType, EChitPopupInputType } from '../models/enum';
import { getUser, User } from '../../auth';
import { take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { MainMenuItemResolverService } from '../../layout-desktop';



export class BaseEChitManager {
    @Output() closePopup = new EventEmitter<any>();

    public myToken: string;
    public inputData: any;

    public loading$: any;
    public formDataModel$: any;
    public model$: any;
    public vatCode$: any;
    public eChitType$: any;
    public supplierDocEnables$: any;
    public matterDetailsName$: any;
    public close$: any;
    public matterRefData$: any;
    public toMatterRefData$: any;
    public eChitOpenType$: any;
    public isSavingData$: any;
    public disbTotal$: any;
    public feeTotal$: any;
    public disburcementValu$: any;
    public selectedDisbuType$: any;
    public selectedWorkType$: any;
    public incDisbuBreakDown$: any;


    public classType$: any;
    public attTypeList$: any;
    public inputData$: any;

    user$: Observable<User>;

    constructor(protected store: Store<any>, private menu: MainMenuItemResolverService) {

    }

    protected initSelectors(myToken: string, inputData: EChitPopupInput) {
        this.myToken = myToken;
        this.inputData = inputData;
        this.user$ = this.store.select(getUser);

        this.user$.pipe(take(1)).subscribe(user => {
            this.store.dispatch(new InitEChit(myToken,
                {
                    inputData: inputData,
                    timeOffset: user.general.dateTimeOffset
                }));
            if (inputData && inputData.matterId) {
                this.store.dispatch(new EChitTypeChange(this.myToken,
                    { eChitType: ChequeRequestType.WidthMatterId, timeOffset: user.general.dateTimeOffset }));
            }

            if (inputData.type === EChitPopupInputType.Workflow) {

                this.store.dispatch(new EChitTypeChange(this.myToken, {
                    eChitType: inputData.data.postingTypeID,
                    workflowEchitData: inputData.data,
                    timeOffset: user.general.dateTimeOffset
                }));
            }
        }).unsubscribe();


        this.formDataModel$ = this.store.select(getFormDataModelByToken(myToken));
        this.loading$ = this.store.select(getLoadingToken(myToken));
        this.model$ = this.store.select(getModelByToken(myToken));
        this.vatCode$ = this.store.select(getSapullerVatCodeByToken(myToken));
        this.eChitType$ = this.store.select(getEChitTypeByToken(myToken));
        this.supplierDocEnables$ = this.store.select(getSupplierDocEnablesByToken(myToken));
        this.matterDetailsName$ = this.store.select(getMatterDetailsNameByToken(myToken));
        this.close$ = this.store.select(getCloseToken(myToken));
        this.matterRefData$ = this.store.select(getMatterRefDataByToken(myToken));
        this.toMatterRefData$ = this.store.select(getToMatterRefDataByToken(myToken));
        this.eChitOpenType$ = this.store.select(getOpenEChitOpenTypeByToken(myToken));
        this.isSavingData$ = this.store.select(getOpenEChitIsSavingDataByToken(myToken));
        this.disbTotal$ = this.store.select(getDisbuTotalByToken(myToken));
        this.feeTotal$ = this.store.select(getFeeTotalByToken(myToken));
        this.disburcementValu$ = this.store.select(getDisburcementValuByToken(myToken));
        this.selectedDisbuType$ = this.store.select(getSelectedDisbuTypesByToken(myToken));
        this.selectedWorkType$ = this.store.select(getSelectedWorkTypesByToken(myToken));
        this.incDisbuBreakDown$ = this.store.select(getSelectedIncDisbuBreakDownByToken(myToken));

        this.classType$ = this.store.select(getClassTypeByToken(myToken));
        this.attTypeList$ = this.store.select(getAttTypeListByToken(myToken));
        this.inputData$ = this.store.select(getInputDataByToken(myToken));
    }

    onChangeEChitType(event: ChequeRequestType) {
        this.user$.pipe(take(1)).subscribe(user => {
            this.store.dispatch(new EChitTypeChange(this.myToken, { eChitType: event, timeOffset: user.general.dateTimeOffset }));
        }).unsubscribe();
    }

    onGetSupplierVatCode(event) {
        this.store.dispatch(new GetSupplierVatCode(this.myToken, event));
    }
    onGetMatterBalances(event) {
        this.store.dispatch(new GetMatterBalances(this.myToken, event));
    }
    onAddAttachment(event) {
        this.store.dispatch(new AddAttachment(this.myToken, event));
    }
    onSearch(event) {
        //  this.store.dispatch(new EChitSearchClient(this.myToken, { searchModel: event }));
    }

    onEChitMatterSearchPopupOpen(event) {
        this.store.dispatch(new EChitMatterSearchPoupOpen(this.myToken, event));
    }

    onEChitToMatterSearchPopupOpen(event) {
        this.store.dispatch(new EChitToMatterSearchPoupOpen(this.myToken, event));
    }

    onSave(event) {
        this.store.dispatch(new InitEChitSave(this.myToken, { model: event }));
    }

    close() {
        this.store.dispatch(new EChitClosed(this.myToken));
        this.closePopup.emit();
    }

    resoleModuleName(menuId) {
        return this.menu.getModuleDisplayName(menuId);
    }

    onChangeDisbTypes(event: { value: number, kind: string, feeEarner: string }) {
        this.store.dispatch(new ChangeDisbTypes(this.myToken, event));

    }

    onChangeDisbValue(event: { value: number, kind: string, feeEarner: string }) {
        this.store.dispatch(new ChangeDisbValue(this.myToken, event));
    }
    changeClassType(classId: number) {
        this.store.dispatch(new ChangeClassType(this.myToken, { selectedClass: classId }));
    }
    changeWorkType(subClassId: number) {
        this.store.dispatch(new ChangeAttType(this.myToken, { typeID: subClassId }));
    }
    onChangeExtraEChitPopupInput(input: ExtraEChitPopupInput) {
        this.store.dispatch(new ChangeExtraEChitPopupInput(this.myToken, input));
    }
}
