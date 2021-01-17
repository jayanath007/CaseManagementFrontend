import { Store } from '@ngrx/store';
import {
    InitCrimeInformation, ChangeModel,
    Save, CheckIsClassClosingValid, OpenClassInfoPopup, ReopenClass
} from '../actions/core';
import { CCInvestigationInfoInput } from '../../core/lib/crime-managment';
import {
    getIsLoadingByToken, getUIControllerProperty, getInformationModel,
    getStageReachedList, getMatterTypeList, getOutComeCodeList, getTotalsummery,
    getTotalForDisplayPurpose, getIsRecursiveForm, getUFNValue
} from '../reducers';
import { ModelProperty } from './../models/enum';
import { getHomeCurrency } from './../../setting-core';
import { getCrimeLookupList } from '../../shared-data';
import { LookupType } from '../../shared';

export class BaseCcInformationInvestigationManager {
    constructor(protected store: Store<any>) { }

    isLoading$: any;
    controlerProperty$: any;
    infomationModel$: any;
    stageReachedList$: any;
    matterTypeList$: any;
    outComeCode$: any;
    homeCurrency$: any;
    summeryData$: any;
    total$: any;
    isRecursive$: any;
    ufnValue$: any;
    policeSLookupList$: any;

    init(token: string, input: CCInvestigationInfoInput) {
        this.store.dispatch(new InitCrimeInformation(token, input));
        this.isLoading$ = this.store.select(getIsLoadingByToken(token));
        this.controlerProperty$ = this.store.select(getUIControllerProperty(token));
        this.infomationModel$ = this.store.select(getInformationModel(token));
        this.stageReachedList$ = this.store.select(getStageReachedList(token));
        this.matterTypeList$ = this.store.select(getMatterTypeList);
        this.outComeCode$ = this.store.select(getOutComeCodeList);
        this.homeCurrency$ = this.store.select(getHomeCurrency());
        this.summeryData$ = this.store.select(getTotalsummery(token));
        this.total$ = this.store.select(getTotalForDisplayPurpose(token));
        this.isRecursive$ = this.store.select(getIsRecursiveForm(token));
        this.ufnValue$ = this.store.select(getUFNValue(token));
        this.policeSLookupList$ = this.store.select(getCrimeLookupList(LookupType.POLICE_ST_CODES));
    }

    changeUserInput(token: string, event: { key: ModelProperty, value: any }) {
        this.store.dispatch(new ChangeModel(token, event));
    }

    // openPoliceStationSearch(token: string, searchText: string) {
    //     this.store.dispatch(new OpenPoliceStSearch(token, searchText));
    // }

    saveModel(token: string) {
        this.store.dispatch(new Save(token));
    }

    closeReopenClass(token: string, closeDate: string) {
        if (!closeDate) {
            this.store.dispatch(new CheckIsClassClosingValid(token));
        } else {
            this.store.dispatch(new ReopenClass(token));
        }
    }

    btnAdvoAssiClick(token: string) {
        this.store.dispatch(new OpenClassInfoPopup(token));
    }

}
