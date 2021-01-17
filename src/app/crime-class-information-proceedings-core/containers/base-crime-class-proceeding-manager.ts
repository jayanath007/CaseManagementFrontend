import { Store } from '@ngrx/store';
import * as classInformation from '../actions/class-information';
import * as selector from '../reducers';
import { CrimeClassIdentityViewModel } from '../../core/lib/timeRecord';
import { ModelProperty } from '../models/enum';
import { LookupType } from '../../shared';
import { getHomeCurrency } from '../../setting-core';

export class BaseCrimeClassProceedingManager {
    constructor(protected store: Store<any>) { }

    isLoading$: any;
    infomationModel$: any;
    stageReachedList$: any;
    matterTypeList$: any;
    outComeCode$: any;
    caseTypes$: any;
    controlProperty$: any;
    homeCurrency$: any;
    summeryData$: any;
    leadUfnTotalSummary$: any;

    init(token: string, crimeClassIdentityViewModel: CrimeClassIdentityViewModel) {
        this.store.dispatch(new classInformation.InitCrimeProceedingClassInfo(token, crimeClassIdentityViewModel));

        this.isLoading$ = this.store.select(selector.getIsLoadingByToken(token));
        this.infomationModel$ = this.store.select(selector.getInfomationModel(token));
        this.stageReachedList$ = this.store.select(selector.getFilterdStageReachedList(token));
        this.matterTypeList$ = this.store.select(selector.getMatterTypeList(token));
        this.outComeCode$ = this.store.select(selector.getOutComeCodeList(token));
        this.caseTypes$ = this.store.select(selector.getFilterdCaseTypeList(token));
        this.controlProperty$ = this.store.select(selector.getUIControllerProperty(token));
        this.homeCurrency$ = this.store.select(getHomeCurrency());
        this.summeryData$ = this.store.select(selector.getTotalsummery(token));
        this.leadUfnTotalSummary$ = this.store.select(selector.getLeadUfnTotalSummary(token))
    }

    changeUserInput(token: string, event: { key: ModelProperty, value: any }) {
        this.store.dispatch(new classInformation.RequestToChangeModel(token, event));
    }

    saveInfo(token: string) {
        this.store.dispatch(new classInformation.RequestToSave(token));
    }
    openLocationSearch(token, searchText) {
        this.store.dispatch(new classInformation.GetLocationLookupData(token, LookupType.MA_COURT_CODES, searchText));
    }
    closeReopenClass(token: string, closeDate: string) {
        if (!closeDate) {
            this.store.dispatch(new classInformation.CloseClass(token));
        } else {
            this.store.dispatch(new classInformation.ReOpennClass(token));
        }
    }
}
