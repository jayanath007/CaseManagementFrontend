import { ClassObj } from './../../crime-management-core/models/interfaces';
import { take } from 'rxjs/operators';
import { combineLatest, Observable } from 'rxjs';

import { Output, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  getIsDisableFileUploadByToken, getAddNoteFeeEarnerListByToken, getAddNoteFolderListByToke,
  getAddNoteActionTypeListByToken, getAddNoteDiaryTypeListByToken, getAddNoteUserGradeByToken,
  getAddNoteHeaderByToken,
  getNoteTextByToken, getAddNoteItemDataListByToken,
  getAddNotePasswordByToken,
  getAddNoteDateDoneByToken,
  getAddNoteUnchargedStateByToken,
  getAddNoteRateByToken,
  getFileNoteUnitByToken,
  getFileNoteValueByToken,
  getAddNoteExtraRateByToken,
  getAddNoteExtraUnitByToken,
  getAddNoteExtraValueByToken,
  getAddNoteExtraTimeTypeByToken,
  getAddNoteValidationByToken,
  getAddNoteIsInitLoadingByToken,
  getIsTimeAndCostShow,
  getAddNoteSaveSuccess,
  getAddNoteIsDiaryTypeDisable,
  getAddNoteIsDirty,
  getAddNoteIsEditMode,
  getAddNoteSendForSignature,
  getSendForSignatureToList,
  getLoadWorkTypeListByToken,
  getPhaseListByToken,
  getActivitiListByToken,
  getTaskListByToken,
  getClassTypeByToken,
  getAttTypeListByToken,
  getIsSection51ByToken,
  getIsBulkEntryByToken,
  getNoOfEntryByToken,
  getTelephoneAdviceByToken,
  getEBillingTypeByToken,
  getDiaryIsBilled,
  getRetrySignature,
  getViewingInlineAttachement,
  getItemDataListLoadingByToken,
  getCivilClassList,
  getCivilLevelList,
  getCivilCourtList
} from '../reducers';
import {
  getHomeCurrency,
  getDiaryModeCurrentUser, getTimeUseFeeEarnerGradesValueDisable
} from '../../setting-core';

import {
  InitAddNote, ChangeFolder, ChangeFileData,
  ChangefeeEarner, ChangeDeteDone, ChangeFolderOnAttachment, ChangeGrade, ChangeNote,
  ChangePassword, ChangeNoteOnAttachment, ChangeIsAttachOnAttachment, ChangeIsUnchargeOnAttachment, ChangeIsUncharge,
  ChangeExtraRate, ChangeExtraUnit, ChangeExtraTimeType, ChangeRate, ChangeUnit, ChangeActionType, AddNoteSubmit,
  ChangeDiaryType, AddNoteClose, OpenAttachment, ChangeSendForSignature, ChangeSendForSignatureTo,
  ChangeWorkType, ChangePhase, ChangeTask, ChangeActiviti, ChangeClassType, ChangeAttType,
  ChangeSection51, ChangeIsBuilk, ChangeNoOfEntry, ChangeIsTelephoneAdv, ViewMsgInlineAttachement, DownloadMsgInlineAttachement,
  ChangeCivilClass, ChangeCivilLevel, ChangeCivilCourt
} from '../actions/core';

import { AddNoteInPutData } from '../../core/lib/addNote';
import { } from '../index';
import { getUser, User } from '../../auth';
import { AttType } from '../../core/lib/timeRecord';
import { getSelectedMatterDataByToken } from './../../matter-linked-core/reducers/index';
import { SettingKey } from '../../core/lib/app-settings';
import { CivilClassObj } from '../../civil-class-management';
import { CivilDropDownData } from '../../civil-time-recording-desktop';

export class BaseAddNoteManager {
  @Output() closePopup = new EventEmitter<any>();

  public myToken: string;

  public homeCurrency$: any;
  public fileUploadDisable$: any;
  public feeEarnerList$: any;
  public sendForSignatureToList$: any;
  public folderList$: any;
  public diaryTypeList$: any;
  public actionTypeList$: any;
  public testData: any;
  public userGradeList$: any;
  public addNodeHeaderText$: any;
  public note$: any;
  public itemDataList$: any;
  public password$: any;
  public uncharged$: any;
  public dateDone$: any;
  public rate$: any;
  public unit$: any;
  public fileNoteValue$: any;
  public extraValue$: any;
  public extraTimeType$: any;
  public extraRate$: any;
  public extraUnit$: any;
  public addNoteValidation$: any;
  public loading$: any;
  public itemsLoading$: any;
  public isShowTimeAndCost$: any;
  public addNoteSuccessInfo$: any;
  public isDiaryTypeDisable$: any;
  public isDirty$: any;
  public multipleFileList$: any;
  public isEdit$: any;
  public sendForSignature$: any;
  public timeUseFeeEarnerRatesValueDisable$: any;
  public user$: Observable<User>;
  public timeRecordType$: any;
  public classType$: any;
  public attTypeList$: any;
  public section51$: any;
  public isBulkEntry$: any;
  public noOfEntryBy$: any;
  public isTelephoneAdv$: any;
  public eBillingType$: any;
  public workTypeListData$: any;
  public phaseListData$: any;
  public activitiListData$: any;
  public taskListData$: any;
  public selectedLinkMatters$: any;
  public isBilled$: any;
  public retrySignature$: any;
  public viewingInlineAttachement$: any;
  public civilClassList$: Observable<CivilClassObj[]>;
  public civilLevelList$: Observable<CivilDropDownData[]>;
  public civilCourtList$: Observable<CivilDropDownData[]>;


  constructor(protected store: Store<any>) {
  }


  protected initSelectors(myToken: string, inPutData: AddNoteInPutData) {
    this.myToken = myToken;
    combineLatest(
      this.store.select(getDiaryModeCurrentUser()),
      this.store.select(getTimeUseFeeEarnerGradesValueDisable()),
      this.store.select(getUser),
      (isLoginUser: boolean, timeUseFeeEarnerGradesValueDisable: boolean, user) => (
        { isLoginUser, timeUseFeeEarnerGradesValueDisable, user })).pipe(
          take(1))
      .subscribe((info) => {
        let selectUser = null;
        if (inPutData.isEdit) {
          selectUser = inPutData.matterData.FeeEarner;
        } else if (info.isLoginUser || !inPutData.matterData.FeeEarner) {
          selectUser = info.user.general.user;
        } else {
          selectUser = inPutData.matterData.FeeEarner;
        }
        this.store.dispatch(new InitAddNote(myToken,
          {
            inPutData: inPutData,
            loginUser: selectUser,
            timeUseFeeEarnerGradesValueDisable: info.timeUseFeeEarnerGradesValueDisable,
            dateTimeOffset: info.user.general.dateTimeOffset,
            isAttachmentUC: info.user.general.settingValues[SettingKey.AddEmailAttachmentsUncharged]
          }));
      }).unsubscribe();

    this.homeCurrency$ = this.store.select(getHomeCurrency());
    this.fileUploadDisable$ = this.store.select(getIsDisableFileUploadByToken(myToken));
    this.feeEarnerList$ = this.store.select(getAddNoteFeeEarnerListByToken(myToken));
    this.folderList$ = this.store.select(getAddNoteFolderListByToke(myToken));
    this.actionTypeList$ = this.store.select(getAddNoteActionTypeListByToken(myToken));
    this.diaryTypeList$ = this.store.select(getAddNoteDiaryTypeListByToken(myToken));
    this.userGradeList$ = this.store.select(getAddNoteUserGradeByToken(myToken));
    this.addNodeHeaderText$ = this.store.select(getAddNoteHeaderByToken(myToken));
    this.note$ = this.store.select(getNoteTextByToken(myToken));
    this.itemDataList$ = this.store.select(getAddNoteItemDataListByToken(myToken));
    this.password$ = this.store.select(getAddNotePasswordByToken(myToken));
    this.dateDone$ = this.store.select(getAddNoteDateDoneByToken(myToken));

    this.uncharged$ = this.store.select(getAddNoteUnchargedStateByToken(myToken));
    this.rate$ = this.store.select(getAddNoteRateByToken(myToken));
    this.unit$ = this.store.select(getFileNoteUnitByToken(myToken));
    this.fileNoteValue$ = this.store.select(getFileNoteValueByToken(myToken));

    this.extraRate$ = this.store.select(getAddNoteExtraRateByToken(myToken));
    this.extraUnit$ = this.store.select(getAddNoteExtraUnitByToken(myToken));
    this.extraValue$ = this.store.select(getAddNoteExtraValueByToken(myToken));
    this.extraTimeType$ = this.store.select(getAddNoteExtraTimeTypeByToken(myToken));
    this.addNoteValidation$ = this.store.select(getAddNoteValidationByToken(myToken));
    this.loading$ = this.store.select(getAddNoteIsInitLoadingByToken(myToken));
    this.itemsLoading$ = this.store.select(getItemDataListLoadingByToken(myToken));
    this.isShowTimeAndCost$ = this.store.select(getIsTimeAndCostShow(myToken));
    this.addNoteSuccessInfo$ = this.store.select(getAddNoteSaveSuccess(myToken));
    this.isDiaryTypeDisable$ = this.store.select(getAddNoteIsDiaryTypeDisable(myToken));
    this.isDirty$ = this.store.select(getAddNoteIsDirty(myToken));
    this.isEdit$ = this.store.select(getAddNoteIsEditMode(myToken));
    this.timeUseFeeEarnerRatesValueDisable$ = this.store.select(getTimeUseFeeEarnerGradesValueDisable());
    this.sendForSignature$ = this.store.select(getAddNoteSendForSignature(myToken));
    this.sendForSignatureToList$ = this.store.select(getSendForSignatureToList(myToken));
    this.user$ = this.store.select(getUser);
    // eBilling Comment
    this.eBillingType$ = this.store.select(getEBillingTypeByToken(myToken));
    this.workTypeListData$ = this.store.select(getLoadWorkTypeListByToken(myToken));
    this.phaseListData$ = this.store.select(getPhaseListByToken(myToken));
    this.activitiListData$ = this.store.select(getActivitiListByToken(myToken));
    this.taskListData$ = this.store.select(getTaskListByToken(myToken));

    this.classType$ = this.store.select(getClassTypeByToken(myToken));
    this.attTypeList$ = this.store.select(getAttTypeListByToken(myToken));
    this.section51$ = this.store.select(getIsSection51ByToken(myToken));
    this.isBulkEntry$ = this.store.select(getIsBulkEntryByToken(myToken));
    this.noOfEntryBy$ = this.store.select(getNoOfEntryByToken(myToken));
    this.isTelephoneAdv$ = this.store.select(getTelephoneAdviceByToken(myToken));
    this.selectedLinkMatters$ = this.store.select(getSelectedMatterDataByToken(myToken));
    this.isBilled$ = this.store.select(getDiaryIsBilled(myToken));
    this.retrySignature$ = this.store.select(getRetrySignature(myToken));
    this.viewingInlineAttachement$ = this.store.select(getViewingInlineAttachement(myToken));
    this.civilClassList$ = this.store.select(getCivilClassList(myToken));
    this.civilLevelList$ = this.store.select(getCivilLevelList(myToken));
    this.civilCourtList$ = this.store.select(getCivilCourtList(myToken));

  }

  onFolderChanged(myToken, selectedFolder) {
    this.store.dispatch(new ChangeFolder(myToken, selectedFolder));
  }
  onActionChanged(myToken, selectedAction) {
    this.store.dispatch(new ChangeActionType(myToken, selectedAction));
  }
  onFileUpladed(myToken, uploadedFiles) {
    this.store.dispatch(new ChangeFileData(myToken, { fileDataList: uploadedFiles }));
  }
  onFeeEarnerChanged(myToken, selectedFeeEarner) {
    this.store.dispatch(new ChangefeeEarner(myToken, selectedFeeEarner));
  }
  onDiaryTypeChange(myToken, selectedDiaryType) {
    this.store.dispatch(new ChangeDiaryType(myToken, { diaryType: selectedDiaryType }));
  }
  onDateDoneChange(myToken, selectedDate) {
    this.store.dispatch(new ChangeDeteDone(myToken, selectedDate));
  }
  onUpdateSelectedUserGrade(myToken, updateUserGrade) {
    this.store.dispatch(new ChangeGrade(myToken, updateUserGrade));
  }
  onChangeNote(myToken, newNote) {
    this.store.dispatch(new ChangeNote(myToken, newNote));
  }
  onUpdatePassword(myToken, updatedPassword) {
    this.store.dispatch(new ChangePassword(myToken, updatedPassword));
  }
  onUpdateFolderOnAttachment(myToken, info) {
    this.store.dispatch(new ChangeFolderOnAttachment(myToken, info));
  }
  onUpdateNoteOnAttachment(myToken, info) {
    this.store.dispatch(new ChangeNoteOnAttachment(myToken, info));
  }
  onUpdateIsAttcheOnAttachment(myToken, info) {
    this.store.dispatch(new ChangeIsAttachOnAttachment(myToken, info));
  }
  onUpdateIsUnchargeOnAttachment(myToken, info) {
    this.store.dispatch(new ChangeIsUnchargeOnAttachment(myToken, info));
  }
  onUpdateUncharged(myToken, value) {
    this.store.dispatch(new ChangeIsUncharge(myToken, value));
  }

  onUpdateRate(myToken, rate) {
    this.store.dispatch(new ChangeRate(myToken, rate));
  }
  onUpdateUnit(myToken, unit) {
    this.store.dispatch(new ChangeUnit(myToken, unit));
  }

  onUpdateExtraRate(myToken, extraRate) {
    this.store.dispatch(new ChangeExtraRate(myToken, extraRate));
  }
  onUpdateExtraUnit(myToken, extraUnit) {
    this.store.dispatch(new ChangeExtraUnit(myToken, extraUnit));
  }
  onUpdateSelectedExtraTime(myToken, extraTimetype) {
    this.store.dispatch(new ChangeExtraTimeType(myToken, extraTimetype));
  }
  onAddNoteSubmit(event) {
    this.store.dispatch(new AddNoteSubmit(this.myToken, {
      submitSuccess: false, fileIndex: event.fileIndex, submitType: event.submitType, password: event.password
    }));
  }
  onOpenAttachment(myToken, event) {
    this.store.dispatch(new OpenAttachment(myToken, event));
  }
  onClose(myToken, info) {
    this.closePopup.emit(info);
    this.store.dispatch(new AddNoteClose(myToken));
  }
  onSendForSignatureChange(event) {
    this.store.dispatch(new ChangeSendForSignature(this.myToken, event));
  }
  onSendForSignatureToChange(event) {
    this.store.dispatch(new ChangeSendForSignatureTo(this.myToken, event));
  }
  onChangeClassType(cl: ClassObj) {
    this.store.dispatch(new ChangeClassType(this.myToken, { selectedClass: cl }));
  }
  onChangeWorkType(type: AttType) {
    this.store.dispatch(new ChangeAttType(this.myToken, { type: type }));
  }
  onChangeSection51(value: boolean) {
    this.store.dispatch(new ChangeSection51(this.myToken, { isSection51: value }));
  }
  onChangeIsBulkEntry(isBulk: boolean) {
    this.store.dispatch(new ChangeIsBuilk(this.myToken, { isBuilk: isBulk }));
  }
  onChangeNumOfEntries(numOfEntri: number) {
    this.store.dispatch(new ChangeNoOfEntry(this.myToken, { noOfEntry: numOfEntri }));
  }
  onChangeTelephoneAdv(isTelephoneAdv: boolean) {
    this.store.dispatch(new ChangeIsTelephoneAdv(this.myToken, { isTelephoneAdv: isTelephoneAdv }));
  }
  // eBilling Comment
  updateWorkType(value) {
    this.store.dispatch(new ChangeWorkType(this.myToken, value));
  }
  updatePhase(value) {
    this.store.dispatch(new ChangePhase(this.myToken, { selectedPhase: value }));
  }
  updateTask(value) {
    this.store.dispatch(new ChangeTask(this.myToken, { selectedTask: value }));
  }
  updateActivity(value) {
    this.store.dispatch(new ChangeActiviti(this.myToken, { selectedActiviti: value }));
  }
  onOpenEmailAttachment(event) {
    this.store.dispatch(new ViewMsgInlineAttachement(this.myToken, event));
  }
  onDownlodeEmailAttachment(event) {
    this.store.dispatch(new DownloadMsgInlineAttachement(this.myToken, event));
  }
  onChangeCivilClass(selectClass: CivilClassObj): void {
    this.store.dispatch(new ChangeCivilClass(this.myToken, { selectClasss: selectClass }));
  }
  onChangeCivilLevel(selectLevel: CivilDropDownData): void {
    this.store.dispatch(new ChangeCivilLevel(this.myToken, { selectLevel: selectLevel }));
  }
  onChangeCivilCourt(selectLevel: CivilDropDownData): void {
    this.store.dispatch(new ChangeCivilCourt(this.myToken, { selectCourt: selectLevel }));
  }
}
