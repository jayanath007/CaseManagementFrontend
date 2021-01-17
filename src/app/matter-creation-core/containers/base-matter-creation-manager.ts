import { Store } from '@ngrx/store';
import { ComponentBase } from '../../core/lib/component-base';
import { InitScreenEdit, getScreenEditComponentTreeDataByToken } from '../../screen-edit-core';
import { InputData, Matter, ClientContackLinkDetailViewModel } from '../models/interfaces';
import {
    InitMatterCreation, GetFullMatterData, UpdateMatteer,
    CloseMaterCreation, AddMatter, ClearMatterData, DeleteMatter, AddUpdateMatter,
    RelatedDocumentsGridPageEventChange, GetLeadUFN, GetCloserProcessing, WriteOffNegativeWip, ChengeIsCompletionNegWOEnabled,
    UpdateCompletionFields,
    GetLAMatterTypesAvailable,
    GetLegalAidCombosList,
    GetFileIsLocked,
    CheckOutstandingUndertakings,
    // FeeEarnerChange,
    AddClient,
    UpdateClient2,
    UpdateClient1,
    RemoveClient,
    PromoteClient
} from '../actions/core';
import {
    getModelByToken, getIsInit, getSupervisorList, getAppCodeList,
    getRateCategoryList, getMatterInterestSchemeList, getIntroductionList,
    getTrusAccNoList, getCreditControlStageList, getSundryProfitList, getDDABankList, getIsModelDirtyByToken,
    getModeByToken, getMatterDepartmentByToken, getBranchList, getLAMatterTypesList, getCaseStageLevelList,
    getCriteriaList, getMatterType1List, getMatterType2List, getOutcomeList, getStageReachedList, getIsLoading,
    getClientDocumentRegistriesGridDataByToken,
    getRelatedDocumentsPageEventByToken,
    getShowConflictSearch, getCloseMatterCreation, getMatterCategoryListByToken, getMatterIndex, getMatterSeatchList,
    getLSCDate, getCloserProcessingByToken, getFeeEarnerIsUserByToken, getUseFileSecurity, getEBillingSchemeList,
    getOriginalModelByToken, getConfirmBeforeOpenCase
} from '../reducers';
import { Mode } from '../../core';
import { MainMenuService } from '../../layout-desktop';
import { getGeneralAllMenueItems } from './../../layout-desktop/reducers/index';
import { getUser, User } from '../../auth';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { getDepartmentList, getFeeEarnerList } from '../../shared-data';
export class BaseMatterCreationManager extends ComponentBase {

    public screenEditComponentTreeData$: any;
    public matterModel$: any;
    public isInit$;
    public isLoading$;
    public showConflictSearch$;
    public closeMatterCreation$;
    public mode$;
    public isModelDirty$;
    public closerProcessing$;
    public feeEarnerIsUser$;
    public menuItem$;

    public useFileSecurity$;
    public lscDate$;
    public branchList$;
    public feeEarnerList$;
    public supervisorList$;
    public appCodeList$;
    public matterDepartmentList$;
    public rateCategoryList$;
    public matterInterestSchemeList$;
    public introductionList$;
    public trusAccNoList$;
    public creditControlStageList$;
    public sundryProfitList$;
    public ddaBankList$;
    public matterCategoryList$;
    public eBillingSchemeList$;

    public laMatterTypesList$;
    public caseStageLevelList$;
    public criteriaList$;
    public matterType1List$;
    public matterType2List$;
    public outcomeList$;
    public stageReachedList$;
    public documentRegistriesGridData$;
    public relatedDocumentsPageEvent$;

    public matterIndex$;
    public matterSeatchList$;
    public originalModel$;
    public confirmBeforeOpenCase$;
    user$: Observable<User>;

    constructor(protected store: Store<any>, protected pageService: MainMenuService) { super(); }

    protected initSelectors(myToken: string, inputData: InputData) {
        this.user$ = this.store.select(getUser);
        this.store.dispatch(new InitScreenEdit('matter_creation',
            {
                type: 'Matter'
            }));
        this.menuItem$ = this.store.select(getGeneralAllMenueItems);
        this.user$.pipe(take(1)).subscribe(user => {
            if (inputData) {
                if (inputData.matterId) {
                    this.store.dispatch(new InitMatterCreation(myToken,
                        {
                            inputData: inputData, mode: Mode.EditMode, dateTimeOffset: user.general.dateTimeOffset,
                            anticipatedWIPCredit: user.general.anticipatedWIPCredit,
                            isPlotUser: user.general.settingValues.IsPlotUser, userBranchId: user.general.userBranchId,
                            confirmBeforeOpenCase: inputData.confirmBeforeOpenCase
                        }));
                    this.store.dispatch(new GetFullMatterData(myToken,
                        { matterId: inputData.matterId, matterSeatchList: null, matterIndex: null }));
                } else if (!inputData.matterId && inputData.matterModel) {
                    this.store.dispatch(new InitMatterCreation(myToken,
                        {
                            inputData: inputData, mode: Mode.AddMode, dateTimeOffset: user.general.dateTimeOffset,
                            anticipatedWIPCredit: user.general.anticipatedWIPCredit,
                            isPlotUser: user.general.settingValues.IsPlotUser, userBranchId: user.general.userBranchId,
                            confirmBeforeOpenCase: inputData.confirmBeforeOpenCase
                        }));
                } else {
                    this.store.dispatch(new InitMatterCreation(myToken,
                        {
                            inputData: inputData, mode: Mode.SearchMode, dateTimeOffset: user.general.dateTimeOffset,
                            anticipatedWIPCredit: user.general.anticipatedWIPCredit,
                            isPlotUser: user.general.settingValues.IsPlotUser, userBranchId: user.general.userBranchId,
                            confirmBeforeOpenCase: inputData.confirmBeforeOpenCase
                        }));

                    this.store.dispatch(new UpdateMatteer(myToken, { property: 'clientRef', value: inputData.clientReference }));
                    this.store.dispatch(new UpdateMatteer(myToken, { property: 'clientName', value: inputData.clientName }));
                    this.store.dispatch(new UpdateMatteer(myToken, { property: 'branchID', value: inputData.branchID }));
                    if (inputData.clientList && inputData.clientList.length > 0) {
                        this.store.dispatch(new AddClient(myToken, inputData.clientList[0]));
                    }

                }
            } else {
                this.store.dispatch(new InitMatterCreation(myToken,
                    {
                        inputData: inputData, mode: Mode.SearchMode, dateTimeOffset: user.general.dateTimeOffset,
                        anticipatedWIPCredit: user.general.anticipatedWIPCredit,
                        isPlotUser: user.general.settingValues.IsPlotUser, userBranchId: user.general.userBranchId,
                        confirmBeforeOpenCase: inputData && inputData.confirmBeforeOpenCase ? inputData.confirmBeforeOpenCase : false,
                    }));
            }
        }).unsubscribe();

        this.screenEditComponentTreeData$ = this.store.select(getScreenEditComponentTreeDataByToken('matter_creation'));
        this.matterModel$ = this.store.select(getModelByToken(myToken));
        this.isInit$ = this.store.select(getIsInit);
        this.isLoading$ = this.store.select(getIsLoading(myToken));
        this.showConflictSearch$ = this.store.select(getShowConflictSearch(myToken));
        this.isModelDirty$ = this.store.select(getIsModelDirtyByToken(myToken));
        this.mode$ = this.store.select(getModeByToken(myToken));

        this.closeMatterCreation$ = this.store.select(getCloseMatterCreation(myToken));
        this.closerProcessing$ = this.store.select(getCloserProcessingByToken(myToken));
        this.feeEarnerIsUser$ = this.store.select(getFeeEarnerIsUserByToken(myToken));
        this.relatedDocumentsPageEvent$ = this.store.select(getRelatedDocumentsPageEventByToken(myToken));
        this.documentRegistriesGridData$ = this.store.select(getClientDocumentRegistriesGridDataByToken(myToken));

        this.useFileSecurity$ = this.store.select(getUseFileSecurity);
        this.lscDate$ = this.store.select(getLSCDate);
        this.branchList$ = this.store.select(getBranchList);
        this.feeEarnerList$ = this.store.select(getFeeEarnerList(true));
        this.supervisorList$ = this.store.select(getSupervisorList);
        this.appCodeList$ = this.store.select(getAppCodeList);
        this.matterDepartmentList$ = this.store.select(getDepartmentList);
        this.rateCategoryList$ = this.store.select(getRateCategoryList);
        this.matterInterestSchemeList$ = this.store.select(getMatterInterestSchemeList);
        this.introductionList$ = this.store.select(getIntroductionList);
        this.trusAccNoList$ = this.store.select(getTrusAccNoList);
        this.creditControlStageList$ = this.store.select(getCreditControlStageList);
        this.sundryProfitList$ = this.store.select(getSundryProfitList);
        this.ddaBankList$ = this.store.select(getDDABankList);
        this.eBillingSchemeList$ = this.store.select(getEBillingSchemeList);
        // this.store.select(getMatterDepartmentByToken(myToken)).subscribe(value => {
        //     if (Number.isInteger(value)) {
        //         this.store.dispatch(new GetMatterCategoryList(myToken, { departmentId: value }));
        //         // this.store.dispatch(new GetAppIdByDepartmentChange(myToken,
        //         //     { departmentId: value ? +value : -1 }));
        //     }
        // });
        this.matterCategoryList$ = this.store.select(getMatterCategoryListByToken(myToken));

        this.laMatterTypesList$ = this.store.select(getLAMatterTypesList(myToken));
        this.caseStageLevelList$ = this.store.select(getCaseStageLevelList(myToken));
        this.criteriaList$ = this.store.select(getCriteriaList(myToken));
        this.matterType1List$ = this.store.select(getMatterType1List(myToken));
        this.matterType2List$ = this.store.select(getMatterType2List(myToken));
        this.outcomeList$ = this.store.select(getOutcomeList(myToken));
        this.stageReachedList$ = this.store.select(getStageReachedList(myToken));

        this.matterIndex$ = this.store.select(getMatterIndex(myToken));
        this.matterSeatchList$ = this.store.select(getMatterSeatchList(myToken));
        this.originalModel$ = this.store.select(getOriginalModelByToken(myToken));
        this.confirmBeforeOpenCase$ = this.store.select(getConfirmBeforeOpenCase(myToken));
    }
    onPopupClosed(token) {
        this.store.dispatch(new CloseMaterCreation(token));
    }
    onUpdateSelectedMatterData(token, event) {
        this.store.dispatch(new GetFullMatterData(token, event));
    }
    onValueChanged(token, event: { controllerType: string, model: string, value }) {
        this.store.dispatch(new UpdateMatteer(token, { property: event.model, value: event.value }));
    }
    onUpdateClient1(token, event: { controllerType: string, model: string, value }) {
        this.store.dispatch(new UpdateClient1(token, { property: event.model, value: event.value }));
    }
    onUpdateClient2(token, event: { controllerType: string, model: string, value }) {
        this.store.dispatch(new UpdateClient2(token, { property: event.model, value: event.value }));
    }
    onMattereAdd(token) {
        this.store.dispatch(new AddMatter(token));
    }
    onMattereClear(token) {
        this.store.dispatch(new ClearMatterData(token));
    }
    onMattereDelete(token, event: Matter) {
        this.store.dispatch(new DeleteMatter(token,
            { appID: event.appId, matterRef: event.matterRef, fileID: event.fileID, branchID: event.branchID }));
    }
    onPageChange(token, event) {
        this.store.dispatch(new RelatedDocumentsGridPageEventChange(token, { pageEvent: event }));
    }
    onMattereSave(token, event: { data: Matter, openCase: boolean }, closeAfterSave: boolean) {
        this.store.dispatch(new AddUpdateMatter(token, event, closeAfterSave));
    }
    onGetLeadUFN(token, event: { fileID: number, branchID: number }) {
        this.store.dispatch(new GetLeadUFN(token, event));
    }
    onCloserProcessing(token, event) {
        this.store.dispatch(new GetCloserProcessing(token, { matterRef: event }));
    }
    onWriteOffNegativeWip(token, event) {
        this.store.dispatch(new WriteOffNegativeWip(token, { matterRef: event }));
    }
    onChengeIsCompletionNegWOEnabled(token, event) {
        this.store.dispatch(new ChengeIsCompletionNegWOEnabled(token, event));
    }
    onUpdateCompletionFields(token, event) {
        this.store.dispatch(new UpdateCompletionFields(token, event));
    }
    onGetLAMatterTypesAvailable(token, event) {
        this.store.dispatch(new GetLAMatterTypesAvailable(token, event));
    }
    onGetLegalAidCombosList(token, event) {
        this.store.dispatch(new GetLegalAidCombosList(token, event));
    }
    onGetFileIsLocked(token, event) {
        this.store.dispatch(new GetFileIsLocked(token, event));
    }
    onCheckOutstandingUndertakings(token, event) {
        this.store.dispatch(new CheckOutstandingUndertakings(token, event));
    }
    // onDepartmentChange(token, departmentId) {
    //     this.store.dispatch(new GetAppIdByDepartmentChange(token, { departmentId: departmentId }));
    // }
    // onMatterFeeEarnerChange(token, event) {
    //     this.store.dispatch(new FeeEarnerChange(token, event));
    // }
    onGotoOpenCase(event) {
        this.pageService.gotoOpenCase(event);
    }
    onAddClient(token: string, client: ClientContackLinkDetailViewModel) {
        this.store.dispatch(new AddClient(token, client));
    }
    removeClient(token: string, clientRef: string) {
        this.store.dispatch(new RemoveClient(token, clientRef));
    }
    promoteClient(token: string, clientRef: string) {
        this.store.dispatch(new PromoteClient(token, clientRef));
    }
}
