import { ClassObj } from './../../../crime-management-core/models/interfaces';
import { AccessControlService } from './../../../auth/services/access-control.service';
import { Action } from '@ngrx/store';

import {
  Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges,
  ChangeDetectionStrategy, ChangeDetectorRef
} from '@angular/core';
import { ComponentBase } from '../../../core';
import { MatSnackBar, MatDialog } from '@angular/material';
import { AddNoteCloseInfo } from '../../../core/lib/addNote';
import {
  ConfirmDialogData, ConfirmDialogComponent, ConfirmDialogResultKind, InforDialogData,
  InforDialogComponent,
  InsertPasswordDialog,
  PasswordInsertComponent
} from '../../../shared';
import {
  SubmitType, FeeEarner, Folder, DiaryType, ActionType, Attachments,
  FolderOnAttachment, Grade, NoteOnAttachment, ConditiOnAttachment,
  ExtraTimeType, AddNoteValidationInfo, AddNoteSuccessInfo, MatterInfo, AddNoteItemData, ViewingInlineAttachement, DiaryRecType
} from '../../../add-note-core';
import { AddTimeType, AttType } from '../../../core/lib/timeRecord';
import { PrecedentHSModel, WorkType } from '../../../core/lib/precedentHS';
import { eBillingType } from '../../../core/lib/matter';
import { MatterLinkedType } from '../../../matter-linked-core';
import { CivilClassObj } from '../../../civil-class-management';
import { CivilDropDownData } from '../../../civil-time-recording-desktop';

// import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'dps-add-note-layout',
  templateUrl: './add-note-layout.component.html',
  styleUrls: ['./add-note-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddNoteLayoutComponent extends ComponentBase implements OnInit, OnChanges {

  inputData;


  @Input() homeCurrency: string;
  @Input() fileUploadDisable: boolean;
  @Input() feeEarnerList: FeeEarner[];
  @Input() sendForSignatureToList: FeeEarner[];
  @Input() folderList: Folder[];
  @Input() diaryTypeList: DiaryType[];
  @Input() actionTypeList: Action[];
  @Input() userGradeList: Grade[];
  @Input() addNodeHeaderText: string;
  @Input() note: string;
  @Input() itemDataList: AddNoteItemData[];
  @Input() password: string;
  @Input() uncharged: boolean;
  @Input() dateDone: string;
  @Input() rate: number;
  @Input() fileNoteValue: string;
  @Input() unit: number;
  @Input() extraRate: number;
  @Input() extraUnit: number;
  @Input() extraValue: number;
  @Input() extraTimeType: ExtraTimeType[] = [];
  @Input() addNoteValidation: AddNoteValidationInfo;
  @Input() loading: boolean;
  @Input() itemsLoading: boolean;
  @Input() isShowTimeAndCost: boolean;
  @Input() AddNoteSuccessInfo: AddNoteSuccessInfo;
  @Input() isDiaryTypeDisable: boolean;
  @Input() isDirty: boolean;
  @Input() multipleFileList: Attachments[];
  @Input() isEdit: boolean;
  @Input() sendForSignature: boolean;
  @Input() showMainTimePart: boolean;
  @Input() showExtraTimePart: boolean;
  @Input() timeUseFeeEarnerRatesValueDisable: boolean;
  @Input() dpsSignDetails;
  @Input() classType: ClassObj[];
  @Input() attTypeList: AttType[];
  @Input() section51: boolean;
  @Input() isBulkEntry: boolean;
  @Input() noOfEntryBy: number;
  @Input() isTelephoneAdv: boolean;
  @Input() timeZone: string;
  @Input() companyCode: any;
  @Input() token: string;
  @Input() selectedLinkMatters: string[];
  // eBilling Comment
  @Input() pageLoadType: eBillingType;
  @Input() worktypeList: WorkType[];
  @Input() activitiList: PrecedentHSModel[];
  @Input() phaseList: PrecedentHSModel[];
  @Input() phaseWiseTaskList: PrecedentHSModel[];
  @Input() matterData: MatterInfo;
  @Input() isBilled: boolean;
  @Input() retrySignature: number;
  @Input() viewingInlineAttachement: ViewingInlineAttachement;
  @Input() civilClassList: CivilClassObj[];
  @Input() civilLevelList: CivilDropDownData[];
  @Input() civilCourtList: CivilDropDownData[];  

  @Output() updateSelectedFolder = new EventEmitter<Folder>();
  @Output() updateSelectedFeeErner = new EventEmitter<FeeEarner>();
  @Output() changeFileData = new EventEmitter<any>();
  @Output() addNoteSubmit = new EventEmitter();
  @Output() close = new EventEmitter<AddNoteCloseInfo>();
  @Output() updateSelectedType = new EventEmitter<DiaryType>();
  @Output() upateSelectedDate = new EventEmitter<string>();
  @Output() updateSelectedUserGrade = new EventEmitter<Grade>();
  @Output() updateNote = new EventEmitter<string>();
  @Output() updatePassword = new EventEmitter<string>();
  @Output() updateFolderOnAttachment = new EventEmitter<FolderOnAttachment>();
  @Output() updateNoteOnAttachment = new EventEmitter<NoteOnAttachment>();
  @Output() updateIsAttcheOnAttachment = new EventEmitter<ConditiOnAttachment>();
  @Output() updateIsUnchargeOnAttachment = new EventEmitter<ConditiOnAttachment>();
  @Output() updateChangeUncharged = new EventEmitter<boolean>();
  @Output() updateRate = new EventEmitter<number>();
  @Output() updateUnit = new EventEmitter<number>();
  @Output() updateExtraRate = new EventEmitter<number>();
  @Output() updateExtraUnit = new EventEmitter<number>();
  @Output() updateSelectedExtraTime = new EventEmitter<ExtraTimeType>();
  @Output() updateSelectedAction = new EventEmitter<ActionType>();
  @Output() openAttachment = new EventEmitter<number>();
  @Output() sendForSignatureChange = new EventEmitter();
  @Output() sendForSignatureToChange = new EventEmitter();
  @Output() changeClassType = new EventEmitter<ClassObj>();
  @Output() changeAttType = new EventEmitter<AttType>();
  @Output() changeSection51 = new EventEmitter<boolean>();
  @Output() changeIsBulkEntry = new EventEmitter<boolean>();
  @Output() changeNumOfEntries = new EventEmitter<number>();
  @Output() changeTelephoneAdv = new EventEmitter<boolean>();
  // eBilling Comment
  @Output() changeWorkType = new EventEmitter<any>();
  @Output() changePhase = new EventEmitter<any>();
  @Output() changeTask = new EventEmitter<any>();
  @Output() changeActivity = new EventEmitter<any>();
  @Output() openEmailAttachment = new EventEmitter();
  @Output() downlodeEmailAttachment = new EventEmitter<{ parentItemIndex: number, attachment: Attachments }>();
  @Output() changeCivilClass = new EventEmitter<CivilClassObj>();
  @Output() changeCivilLevel = new EventEmitter<CivilDropDownData>();  
  @Output() changeCivilCourt = new EventEmitter<CivilDropDownData>();

  secondTabName = 'Time and Cost';
  MatterLinkOpenFrom = MatterLinkedType.AddNote;
  timeRecordType: AddTimeType;
  DiaryRecType = DiaryRecType;

  get attachments() {
    if (this.itemDataList && this.itemDataList.length > 0 &&
      this.itemDataList[0].attachments && this.itemDataList[0].attachments.length > 0) {
      return this.itemDataList[0].attachments;
    }
    return null;
  }

  get selectedDiaryTypeId() {
    return (this.diaryTypeList && this.diaryTypeList.find(val => val.selected)) ? this.diaryTypeList.find(val => val.selected).value : null;
  }
  constructor(public snackBar: MatSnackBar, private cdr: ChangeDetectorRef,
    private dialog: MatDialog, private access: AccessControlService) {
    super();
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.matterData && this.matterData) {
      this.access.checkTimeRecordType(this.matterData.AppCode, this.matterData.eBilling, this.matterData.isLegalAid)
        .subscribe(type => this.timeRecordType = type);
    }
    if (changes.addNoteValidation && !changes.addNoteValidation.isFirstChange()) {
      setTimeout(() => {
        if (this.addNoteValidation && !this.addNoteValidation.status) {
          this.openMSGPopup(this.addNoteValidation.msg, 'alert', false);
        }
      }, 100);
    }
    if (changes.AddNoteSuccessInfo && !changes.AddNoteSuccessInfo.isFirstChange() && changes.AddNoteSuccessInfo.currentValue) {
      setTimeout(() => {
        if (changes.AddNoteSuccessInfo.currentValue.isSuccess) {
          this.close.emit(AddNoteCloseInfo.ExitWithSaveSuccess);
        } else if (!!changes.AddNoteSuccessInfo.currentValue.msg) {
          this.openMSGPopup(changes.AddNoteSuccessInfo.currentValue.msg, 'success', changes.AddNoteSuccessInfo.currentValue.isSuccess);
        }
      }, 100);
    }
    if (changes.retrySignature && !changes.retrySignature.isFirstChange()) {
      setTimeout(() => {
        if (this.retrySignature > 0) {
          this.onSignAndShare();
        }
      }, 100);
    }
  }
  ngOnInit() {
    if (this.timeRecordType === AddTimeType.CrimeTime || this.timeRecordType === AddTimeType.CivilTime) {
      this.secondTabName = 'LegalAid Details';
    } else if (this.pageLoadType === eBillingType.PrecedentH) {
      this.secondTabName = 'Precedent H';
    } else if (this.pageLoadType === eBillingType.PrecedentS) {
      this.secondTabName = 'Precedent S';
    } else {
      this.secondTabName = 'Time and Cost';
    }

  }
  onFolderChanged(selectedFolder) {
    this.updateSelectedFolder.emit(selectedFolder);
  }
  onActionChanged(selectedAction) {
    this.updateSelectedAction.emit(selectedAction);
  }
  onFeeEarnerChanged(selectedFeeEarnerId) {
    this.updateSelectedFeeErner.emit(selectedFeeEarnerId);
  }
  onFileUpladed(uploadedFile) {
    this.changeFileData.emit(uploadedFile);
  }
  onDiaryTypeChange(selectedDiaryType: DiaryType) {
    this.updateSelectedType.emit(selectedDiaryType);
  }
  onDateDoneChange(date: string) {
    this.upateSelectedDate.emit(date);
  }
  onUpdateSelectedUserGrade(updateUserGrade) {
    this.updateSelectedUserGrade.emit(updateUserGrade);
  }
  onChangeNote(newNote) {
    this.updateNote.emit(newNote);
  }
  onUpdatePassword(updatedPassword) {
    this.updatePassword.emit(updatedPassword);
  }
  onUpdateFolderOnAttachment(info) {
    this.updateFolderOnAttachment.emit(info);
  }
  onUpdateNoteOnAttachment(info) {
    this.updateNoteOnAttachment.emit(info);
  }
  onUpdateIsAttcheOnAttachment(info) {
    this.updateIsAttcheOnAttachment.emit(info);
  }
  onUpdateIsUnchargeOnAttachment(info) {
    this.updateIsUnchargeOnAttachment.emit(info);
  }
  onUpdateUncharged(value) {
    this.updateChangeUncharged.emit(value);
  }
  onUpdateRate(rate) {
    this.updateRate.emit(rate);
  }
  onUpdateUnit(unit) {
    this.updateUnit.emit(unit);
  }
  onUpdateExtraRate(extraRate) {
    this.updateExtraRate.emit(extraRate);
  }
  onUpdateExtraUnit(extraUnit) {
    this.updateExtraUnit.emit(extraUnit);
  }
  onUpdateSelectedExtraTime(selectetExtraTime) {
    this.updateSelectedExtraTime.emit(selectetExtraTime);
  }
  onClose() {
    if (this.isDirty) {
      const dialogData: ConfirmDialogData = {
        content: {
          title: 'Confirm . . .',
          message: 'Changes have been made! Do you want to go back and save them?',
          acceptLabel: 'Yes',
          rejectLabel: 'No'
        },
        contentParams: {},
        data: null
      };
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: dialogData,
        width: '350px',
        disableClose: true,
        panelClass: 'dps-notification',
        hasBackdrop: true,
      });

      dialogRef.afterClosed().subscribe(dialogResult => {
        if (dialogResult.kind === ConfirmDialogResultKind.Rejected) {
          this.close.emit(AddNoteCloseInfo.ExitByUser);
        }
      });
    } else {
      this.close.emit(AddNoteCloseInfo.ExitByUser);
    }
  }
  onSubmit() {
    // if (this.multipleFileList && this.multipleFileList.length > 0) {

    //   /// mulitipalsave in ones
    //   for (let i = 0; i < this.multipleFileList.length; i++) {
    //     this.addNoteSubmit.emit({ fileIndex: i, submitType: SubmitType.Submit });
    //   }
    // } else {
    this.addNoteSubmit.emit({ fileIndex: 0, submitType: SubmitType.Submit });
    // }
  }
  onShare() {
    if (this.multipleFileList && this.multipleFileList.length > 0) {
      for (let i = 0; i < this.multipleFileList.length; i++) {
        this.addNoteSubmit.emit({ fileIndex: i, submitType: SubmitType.Share });
      }
    } else {
      this.addNoteSubmit.emit({ fileIndex: 0, submitType: SubmitType.Share });
    }
  }
  onSignAndShare() {
    if (this.dpsSignDetails && !this.dpsSignDetails.isUserHasSignature && this.dpsSignDetails.message) {
      const dialogData: InforDialogData = {
        content: {
          title: 'File History',
          message: this.dpsSignDetails.message
        },
        data: { messageType: 'alert' }
      };
      const dialogRef = this.dialog.open(InforDialogComponent, {
        data: dialogData,
        width: '400px',
        disableClose: true,
        hasBackdrop: true,
        panelClass: 'dps-notification'
      });

    } else {
      let details = 'Enter signature password';
      if (this.retrySignature > 0) {
        details = 'Please enter correct password.';
      }
      const dialogData: InsertPasswordDialog = {
        content: { title: 'Sign and Share', details: details, message: '' },
        data: { password: '' }
      };

      const dialogRef = this.dialog.open(PasswordInsertComponent, {
        width: '250px',
        data: dialogData,
        panelClass: 'dps-notification',
        disableClose: true,
      });
      dialogRef.afterClosed().subscribe(result => {
        {
          if (result) {
            if (this.multipleFileList && this.multipleFileList.length > 0) {
              for (let i = 0; i < this.multipleFileList.length; i++) {
                this.addNoteSubmit.emit({ fileIndex: i, submitType: SubmitType.SignAndShare, password: result.data.password });
              }
            } else {
              this.addNoteSubmit.emit({ fileIndex: 0, submitType: SubmitType.SignAndShare, password: result.data.password });
            }
          } else {
            this.close.emit(AddNoteCloseInfo.ExitByUser);
          }
        }
      });
    }
  }

  // eBilling Comment
  onPrecedentHChangeWorkType(event) {
    this.changeWorkType.emit(event);
  }
  onChangePhase(event) {
    this.changePhase.emit(event);
  }
  onChangeTask(event) {
    this.changeTask.emit(event);
  }
  onChangeActivity(event) {
    this.changeActivity.emit(event);
  }

  openMSGPopup(msg, type, isClose) {
    const dialogData: InforDialogData = {
      content: {
        title: 'Add Note',
        message: msg
      },
      data: { messageType: type }
    };
    const dialogRef = this.dialog.open(InforDialogComponent, {
      data: dialogData,
      width: '400px',
      disableClose: true,
      hasBackdrop: true,
      panelClass: 'dps-notification'
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (isClose) {
        this.close.emit(AddNoteCloseInfo.ExitWithSaveSuccess);
      }
    });
  }
  onOpenAttacment(event) {
    this.openAttachment.emit(event);
  }
  onSendForSignatureChange(event) {
    this.sendForSignatureChange.emit(event);
  }
  onSendForSignatureToChange(event) {
    this.sendForSignatureToChange.emit(event);
  }
  onChangeClassType(cl: ClassObj) {
    this.changeClassType.emit(cl);
  }
  onChangeWorkType(type: AttType) {
    this.changeAttType.emit(type);
  }
  onChangeSection51(value: boolean) {
    this.changeSection51.emit(value);
  }
  onChangeIsBulkEntry(isBulk: boolean) {
    this.changeIsBulkEntry.emit(isBulk);
  }
  onChangeNumOfEntries(numOfEntri: number) {
    this.changeNumOfEntries.emit(numOfEntri);
  }
  onChangeTelephoneAdv(isTelephone: boolean) {
    this.changeTelephoneAdv.emit(isTelephone);
  }
  onOpenEmailAttachment(event) {
    this.openEmailAttachment.emit(event);
  }
  onDownlodeEmailAttachment(event) {
    this.downlodeEmailAttachment.emit(event);
  }
  onChangeCivilClass(selectClass: CivilClassObj): void {
    this.changeCivilClass.emit(selectClass);
  }
  onChangeCivilLevel(selectLevel: CivilDropDownData): void {
    this.changeCivilLevel.emit(selectLevel);
  }
  onChangeCivilCourt(selectCourt: CivilDropDownData): void {
    this.changeCivilCourt.emit(selectCourt);
  }
}
