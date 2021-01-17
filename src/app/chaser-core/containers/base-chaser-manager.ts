import { filter, takeUntil, take } from 'rxjs/operators';
import { ComponentBase, LocalStorageKey } from '../../core';
import { ChaserOutPutType } from '../models/enums';
import { ChaserInput, ContactEmailsViewModel } from '../models/interfaces';
import { Output, EventEmitter, } from '@angular/core';

import { Store } from '@ngrx/store';
import {
    getChaserFileNoByToken, getChaserFeeEarnerListNoByToken, getChaserFolderListByToken,
    getChaserTimeTypeListByToken, getChaserOpenFileByToken,
    getChaserFileNoteByToken, getChaserErrorByToken, getChaserSuccessByToken,
    getChaserMatterInfoByToken, getChaserCommonLoading, getChaserTypeDisableValueByToken, getUnLinkedEmailByToken,
    getTimeRecordingEnabledByToken, getLoadWorkTypeListByToken, getActivitiListByToken, getTaskListByToken,
    getPhaseListByToken, getEBillingTypeByToken,
    // getTimeRecordType,
    getClassTypeByToken,
    getAttTypeListByToken,
    getIsSection51ByToken,
    getIsBulkEntryByToken,
    getNoOfEntryByToken, getUnchargedStateByToken, getChaserDefaultUnitByToken,
    getCivilClassList, getCivilLevelList,
    getSentItemIdsByToken, getSubjectPrefixLoadingByToken,
    getPrecedentRate, getPrecedentUnit, getPrecedentValueTotal, getChaserEmailLoadingByToken, getLoadingMatterListByToken
} from '../reducers';
import {
    InitChaser, ChangeFeeEarnerList, ChangeFolderList, ChangeTimeTypeList, ChangeOpenFile, ChangeUnitValue,
    ChangeFileNoteValue, SendChaserEmail, ClearChaserData, LinkContactWithMatter,
    ChangeWorkType, ChangePhase, ChangeTask, ChangeActiviti, ChangeClassType, ChangeAttType, ChangeSection51,
    ChangeCivilClass, ChangeCivilLevel,
    ChangeIsBuilk, ChangeNoOfEntry, ChangeIsUncharge, ChangePrecedentRate, ChangePrecedentUnit, LoadMatterList
} from '../actions/core';
import { MatterInfo, FeeEarner, Folder, TimeType } from '../models/interfaces';
import { getHomeCurrency, getDiaryModeCurrentUser } from '../../setting-core';
import { combineLatest, Observable } from 'rxjs';
import { AttType } from '../../core/lib/timeRecord';
import { MainMenuItem } from '../../layout-desktop';
import { ClassObj } from './../../crime-management-core/models/interfaces';
import { getUser, User } from '../../auth';
import { CivilClassObj } from '../../civil-class-management';
import { CivilDropDownData } from '../../civil-time-recording-desktop';

export class BaseChaserManager extends ComponentBase {

    public fileNo$: any;
    public feeEarnerList$: any;
    public folderList$: any;
    public timeTypeList$: any;
    public fileNote$: any;
    public openFiles$: any;
    public unitvalue$: any;
    public fileNotevalue$: any;
    public chaserModel$: any;
    public error$: any;
    public SelectedMatterInfo$: any;
    public chaserModelSuccess$: any;
    public chaserOutPutData$: any;
    public chaserDataLoading$: any;
    public typeValueDisable$: any;
    public clearStore$: any;
    public user$: Observable<User>;
    public contactMapResponce$: any;
    public isTimeRecordingEnabled$: any;
    // eBilling Comment
    public workTypeListData$: any;
    public phaseListData$: any;
    public activitiListData$: any;
    public taskListData$: any;
    public eBillingType$: any;
    public homeCurrency$: any;
    public precedentUnitValue$: any;
    public precedentRate$: any;
    public precedentValueTotal$: any;

    hasMatter = false;
    isWindowUrlPopup = false;

    public timeRecordType$: any;
    public classType$: any;
    public attTypeList$: any;
    public section51$: any;
    public isBulkEntry$: any;
    public noOfEntryBy$: any;
    public uncharged$: any;

    public isMailSending$: any;
    public isLoginUser$: any;
    public sentItemIds$: Observable<{ id: string; internetMessageId: string; }>;
    public subjectPrefixLoading$: Observable<boolean>;
    public loadingMatterList$: any;

    public menuItems: MainMenuItem<any>[] = JSON.parse(sessionStorage.getItem(LocalStorageKey.MenuItems));
    public civilClassList$: Observable<CivilClassObj[]>;
    public civilLevelList$: Observable<CivilDropDownData[]>;

    @Output() closePopup = new EventEmitter();

    constructor(protected store: Store<any>) { super(); }

    protected initSelectors(chaserToken: string, inputData: ChaserInput) {
        if (window.opener && window.opener !== window) {
            this.isWindowUrlPopup = true;
        }
        this.user$ = this.store.select(getUser);
        this.isLoginUser$ = this.store.select(getDiaryModeCurrentUser());
        if (inputData) {
            combineLatest(this.user$, this.isLoginUser$, (user, isLoginuser: boolean) => ({
                logedUser: user,
                isLoginuser: isLoginuser
            })).pipe(filter((info) => !!info.logedUser),
                take(1))
                .subscribe((info) => {
                    inputData.loginUser = info.logedUser.general.user;
                    inputData.isLoginUser = info.isLoginuser;
                    this.store.dispatch(new InitChaser(chaserToken, {
                        inputData: inputData
                    }));
                }).unsubscribe();
        }

        // this.store.dispatch(new InitChaser(chaserToken, {
        //     inputData: inputData
        // }));
        this.fileNo$ = this.store.select(getChaserFileNoByToken(chaserToken));
        this.feeEarnerList$ = this.store.select(getChaserFeeEarnerListNoByToken(chaserToken));
        this.folderList$ = this.store.select(getChaserFolderListByToken(chaserToken));
        this.timeTypeList$ = this.store.select(getChaserTimeTypeListByToken(chaserToken));
        this.fileNote$ = this.store.select(getChaserFileNoteByToken(chaserToken));
        this.openFiles$ = this.store.select(getChaserOpenFileByToken(chaserToken));
        this.unitvalue$ = this.store.select(getChaserDefaultUnitByToken(chaserToken));
        this.error$ = this.store.select(getChaserErrorByToken(chaserToken));
        this.SelectedMatterInfo$ = this.store.select(getChaserMatterInfoByToken(chaserToken));
        this.chaserDataLoading$ = this.store.select(getChaserCommonLoading(chaserToken));
        this.typeValueDisable$ = this.store.select(getChaserTypeDisableValueByToken(chaserToken));
        this.contactMapResponce$ = this.store.select(getUnLinkedEmailByToken(chaserToken));
        this.isTimeRecordingEnabled$ = this.store.select(getTimeRecordingEnabledByToken(chaserToken));
        // eBilling Comment
        this.eBillingType$ = this.store.select(getEBillingTypeByToken(chaserToken));
        this.workTypeListData$ = this.store.select(getLoadWorkTypeListByToken(chaserToken));
        this.phaseListData$ = this.store.select(getPhaseListByToken(chaserToken));
        this.activitiListData$ = this.store.select(getActivitiListByToken(chaserToken));
        this.taskListData$ = this.store.select(getTaskListByToken(chaserToken));

        // this.timeRecordType$ = this.store.select(getTimeRecordType(chaserToken));
        this.classType$ = this.store.select(getClassTypeByToken(chaserToken));
        this.attTypeList$ = this.store.select(getAttTypeListByToken(chaserToken));
        this.section51$ = this.store.select(getIsSection51ByToken(chaserToken));
        this.isBulkEntry$ = this.store.select(getIsBulkEntryByToken(chaserToken));
        this.noOfEntryBy$ = this.store.select(getNoOfEntryByToken(chaserToken));
        this.uncharged$ = this.store.select(getUnchargedStateByToken(chaserToken));

        this.homeCurrency$ = this.store.select(getHomeCurrency());
        this.precedentUnitValue$ = this.store.select(getPrecedentUnit(chaserToken));
        this.precedentRate$ = this.store.select(getPrecedentRate(chaserToken));
        this.precedentValueTotal$ = this.store.select(getPrecedentValueTotal(chaserToken));

        this.sentItemIds$ = this.store.select(getSentItemIdsByToken(chaserToken));
        this.subjectPrefixLoading$ = this.store.select(getSubjectPrefixLoadingByToken(chaserToken));

        //civil 
        this.civilClassList$ = this.store.select(getCivilClassList(chaserToken));
        this.civilLevelList$ = this.store.select(getCivilLevelList(chaserToken));
        this.isMailSending$ = this.store.select(getChaserEmailLoadingByToken(chaserToken));
        this.loadingMatterList$ = this.store.select(getLoadingMatterListByToken(chaserToken));


        this.store.select(getChaserSuccessByToken(chaserToken)).pipe(
            takeUntil(this.destroy$))
            .subscribe((result) => {
                if (result === true) {
                    this.closePopup.emit(ChaserOutPutType.ChaserSucces);
                } else {
                }
            });
    }

    onSearchClear(chaserToken, value: string) {
        this.hasMatter = false;
        this.store.dispatch(new ClearChaserData(chaserToken));
    }

    onUnitValueChanged(chaserToken, unitVal: number) {
        this.store.dispatch(new ChangeUnitValue(chaserToken,
            { unitValue: unitVal }));
    }
    onFileNoteChanged(chaserToken, fileNoteVal: string) {
        this.store.dispatch(new ChangeFileNoteValue(chaserToken,
            { fileNoteValue: fileNoteVal }));
    }

    onFeeEarnerChanged(chaserToken, feeEarner: FeeEarner) {
        this.store.dispatch(new ChangeFeeEarnerList(chaserToken,
            { selectedFeeEarner: feeEarner }));
    }
    onFolderChanged(chaserToken, folder: Folder) {
        this.store.dispatch(new ChangeFolderList(chaserToken,
            { selectedFolder: folder }));
    }
    onTimeTypeChanged(chaserToken, timeType: TimeType) {
        this.store.dispatch(new ChangeTimeTypeList(chaserToken,
            { selectedTimeType: timeType }));
    }
    onOpenFileChanged(chaserToken, MatterInfoData: MatterInfo) {
        if (MatterInfoData.MatterReferenceNo) {
            this.hasMatter = true;
        } else { this.hasMatter = false; }
        this.store.dispatch(new ChangeOpenFile(chaserToken,
            { selectedMatterInfo: MatterInfoData }));
    }
    onMatterDataChange(chaserToken, matterData: MatterInfo) {
        if (matterData.MatterReferenceNo) {
            this.hasMatter = true;
        } else { this.hasMatter = false; }
        this.store.dispatch(new ChangeOpenFile(chaserToken,
            { selectedMatterInfo: matterData }));
    }
    onchaserPopupClosed() {
        this.closePopup.emit();
    }
    onchaserSend(chaserToken, valuData: any, inputData: ChaserInput) {
        if (valuData && !valuData.isTimeRecordingEnabled && valuData.selectedMatterInfo && valuData.selectedMatterInfo.FileID) {
            this.store.dispatch(new SendChaserEmail(chaserToken,
                {
                    linkMattes: valuData.linkMattes,
                    composeToken: inputData ? inputData.token : null

                }));
            if (!this.isWindowUrlPopup) {
                this.closePopup.emit(ChaserOutPutType.ChaserSucces);
            }
        } else {
            this.closePopup.emit(ChaserOutPutType.ChaserIgnored);
        }
    }
    onMatterLinkOutputData(chaserToken, contactEmailsViewModel: ContactEmailsViewModel[]) {
        this.store.dispatch(new LinkContactWithMatter(chaserToken,
            { contactEmailsViewModel: contactEmailsViewModel }));
    }
    // eBilling Comment
    updateWorkType(chaserToken, value) {
        this.store.dispatch(new ChangeWorkType(chaserToken, value));
    }
    updatePhase(chaserToken, value) {
        this.store.dispatch(new ChangePhase(chaserToken, { selectedPhase: value }));
    }
    updateTask(chaserToken, value) {
        this.store.dispatch(new ChangeTask(chaserToken, { selectedTask: value }));
    }
    updateActivity(chaserToken, value) {
        this.store.dispatch(new ChangeActiviti(chaserToken, { selectedActiviti: value }));
    }

    onChangeClassType(chaserToken, cl: ClassObj) {
        this.store.dispatch(new ChangeClassType(chaserToken, { selectedClass: cl }));
    }
    onChangeCrimeWorkType(chaserToken, type: AttType) {
        this.store.dispatch(new ChangeAttType(chaserToken, { type: type }));
    }
    onChangeSection51(chaserToken, value: boolean) {
        this.store.dispatch(new ChangeSection51(chaserToken, { isSection51: value }));
    }
    onChangeIsBulkEntry(chaserToken, isBulk: boolean) {
        this.store.dispatch(new ChangeIsBuilk(chaserToken, { isBuilk: isBulk }));
    }
    onChangeNumOfEntries(chaserToken, numOfEntri: number) {
        this.store.dispatch(new ChangeNoOfEntry(chaserToken, { noOfEntry: numOfEntri }));
    }

    onUpdateUncharged(chaserToken, value: boolean) {
        this.store.dispatch(new ChangeIsUncharge(chaserToken, { uncharged: value }));
    }
    onPrecedentChangeRate(chaserToken, value) {
        this.store.dispatch(new ChangePrecedentRate(chaserToken, { rateValue: value }));
    }
    onUpdatePrecedentUnit(chaserToken, value) {
        this.store.dispatch(new ChangePrecedentUnit(chaserToken, { unitValue: value }));
    }
    onChangeCivilClass(chaserToken, selectClass: CivilClassObj): void {
        this.store.dispatch(new ChangeCivilClass(chaserToken, { selectClasss: selectClass }));
    }
    onChangeCivilLevel(chaserToken, selectLevel: CivilDropDownData): void {
        this.store.dispatch(new ChangeCivilLevel(chaserToken, { selectLevel: selectLevel }));
    }
    onloadMatterList(chaserToken, value) {
        this.store.dispatch(new LoadMatterList(chaserToken, { recipientList: value }));
    }

}
