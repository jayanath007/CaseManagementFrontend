import { AccessControlService } from './../../../auth/services/access-control.service';
import { MatterLinkedType } from './../../../matter-linked-core/models/enum';
import { SystemJsPopupLoaderService } from '../../../shell-desktop';
import { Message } from '../../../core/lib/microsoft-graph';
import {
  FeeEarner, Folder, TimeType, MatterInfo, ChaserError, ContactMapResponce,
  ChaserValidationInfo,
  RequiredField
} from '../../../chaser-core/models/interfaces';
import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy, OnChanges, SimpleChanges } from '@angular/core';
import { ComponentBase } from '../../../core';
import { MatSnackBar, MatDialog } from '@angular/material';
import { InforDialogData, InforDialogComponent } from '../../../shared';
import { eBillingType } from '../../../core/lib/matter';
import { WorkType, PrecedentHSModel } from '../../../core/lib/precedentHS';
import { AddTimeType, AttType } from '../../../core/lib/timeRecord';
import { MainMenuItem } from '../../../layout-desktop';
import { MatterDataInput } from '../../../matter-linked-core/models/interfaces';
import { ClassObj } from './../../../crime-management-core/models/interfaces';
import { CivilClassObj } from '../../../civil-class-management';
import { CivilDropDownData } from '../../../civil-time-recording-desktop';

@Component({
  selector: 'dps-chaser-main',
  templateUrl: './chaser-main.component.html',
  styleUrls: ['./chaser-main.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ChaserMainComponent extends ComponentBase implements OnInit, OnChanges {
  @Input() feeEarnerList: FeeEarner[];
  @Input() folderList: Folder[];
  @Input() timeTypeList: TimeType[];
  @Input() fileNo: string;
  @Input() fileNoteData: string;
  @Input() openCasefileData: MatterInfo[];
  @Input() unitValue: number;
  @Input() error: ChaserError;
  @Input() chaserDataLoading: boolean;
  @Input() typeValueDisable: boolean;
  @Input() isTimeRecordingEnabled: boolean;
  @Input() selectedMatterInfo: MatterInfo;
  // eBilling Comment
  @Input() pageLoadType: eBillingType;
  @Input() worktypeList: WorkType[];
  @Input() activitiList: PrecedentHSModel[];
  @Input() phaseList: PrecedentHSModel[];
  @Input() phaseWiseTaskList: PrecedentHSModel[];
  @Input() homeCurrency: string;
  @Input() precedentUnitValue: number;
  @Input() precedentRate: number;
  @Input() precedentValueTotal: number;
  // Lakmal - LS
  @Input() contactMapResponce: ContactMapResponce;
  @Input() classType: ClassObj[];
  @Input() attTypeList: AttType[];
  @Input() section51: boolean;
  @Input() isBulkEntry: boolean;
  @Input() noOfEntryBy: number;
  @Input() uncharged: boolean;

  @Input() isMailSending: boolean;
  @Input() sentItemIds: any;
  @Input() subjectPrefixLoading: boolean;
  @Input() loadingMatterList: boolean;

  @Input() menueItems: MainMenuItem<any>[];

  @Input() civilClassList: CivilClassObj[];
  @Input() civilLevelList: CivilDropDownData[];

  @Output() updateSelectedMatterChange = new EventEmitter<string>();
  @Output() updateSelectedFeeEarner = new EventEmitter<FeeEarner>();
  @Output() updateSelectedFolder = new EventEmitter<Folder>();
  @Output() updateSelectedTimeType = new EventEmitter<TimeType>();

  @Output() updateSelectedOpenFile = new EventEmitter<MatterInfo>();
  @Output() updateSelectedUnitValue = new EventEmitter<number>();
  @Output() updateSelectedFileNote = new EventEmitter<string>();

  @Output() chaserSend = new EventEmitter<any>();
  @Output() chaserPopupClosed = new EventEmitter<string>();
  @Output() updateClearData = new EventEmitter<string>();
  @Output() matterLinkOutputData = new EventEmitter<any>();
  // @Output() loadContactRole = new EventEmitter();
  // eBilling Comment
  @Output() changeWorkType = new EventEmitter<any>();
  @Output() changePhase = new EventEmitter<any>();
  @Output() changeTask = new EventEmitter<any>();
  @Output() changeActivity = new EventEmitter<any>();
  @Output() updatePrecedentRateValue = new EventEmitter<any>();
  @Output() updatePrecedentUnit = new EventEmitter<any>();

  @Output() changeClassType = new EventEmitter<ClassObj>();
  @Output() changeAttType = new EventEmitter<AttType>();
  @Output() changeSection51 = new EventEmitter<boolean>();
  @Output() changeIsBulkEntry = new EventEmitter<boolean>();
  @Output() changeNumOfEntries = new EventEmitter<number>();
  @Output() updateChangeUncharged = new EventEmitter<boolean>();
  @Output() updateSelectedLinkmatter = new EventEmitter<any>();
  // Civil
  @Output() changeCivilClass = new EventEmitter<CivilClassObj>();
  @Output() changeCivilLevel = new EventEmitter<CivilDropDownData>();
  @Output() loadMatterList = new EventEmitter<any>();

  timeRecordType: AddTimeType;

  constructor(public snackBar: MatSnackBar, private dialog: MatDialog,
    private popupService: SystemJsPopupLoaderService, private access: AccessControlService) {
    super();
  }
  ngOnInit() { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.selectedMatterInfo && this.selectedMatterInfo) {
      this.access.checkTimeRecordType(this.selectedMatterInfo.AppCode, this.selectedMatterInfo.eBilling, this.selectedMatterInfo.isLegalAid)
        .subscribe(type => this.timeRecordType = type);
    }
    if (changes.error && !changes.error.isFirstChange()) {
      if (changes.error.currentValue) {
        this.showMsg(changes.error.currentValue);
      }
    }
  }
  showMsg(errorMsg) {
    if (errorMsg) {
      if (errorMsg.isError) {
        const dialogData: InforDialogData = {
          content: {
            title: 'Message',
            message: errorMsg.msg
          },
          data: { messageType: 'warning' }
        };
        const dialogRef = this.dialog.open(InforDialogComponent, {
          data: dialogData,
          width: '400px',
          disableClose: true,
          panelClass: 'dps-notification'
        });
      }
    }
  }
  // openValidationSnackBar(error: ChaserError) {
  //   if (error) {
  //     if (error.isError) {
  //       this.snackBar.open(error.msg, 'OK', {
  //         duration: 2000,
  //         horizontalPosition: 'center',
  //         verticalPosition: 'top'
  //       });
  //     }
  //   }
  // }

  onMatterDataChanged(value: string) {
    this.updateSelectedMatterChange.emit(value);
  }
  onFeeEarnerChanged(value: FeeEarner) {
    this.updateSelectedFeeEarner.emit(value);
    // this.selectedFeeEarner = value.user_ID;
  }
  onFolderChanged(value: Folder) {
    this.updateSelectedFolder.emit(value);
    // this.selectedFolder = value.value;
  }
  onTimeTypeChanged(value: TimeType) {
    this.updateSelectedTimeType.emit(value);
    // this.selectedTimeType = value.dtL_RecType;
  }
  onUnitChanged(unit: number) {
    this.updateSelectedUnitValue.emit(unit);
    // this.selectedUnitValue = unit;
  }
  onFileNoteChanged(noteValue: string) {
    this.updateSelectedFileNote.emit(noteValue);
    // this.fileNoteData = value;
  }
  onOpenFileChanged(MatterInfoData: MatterInfo) {
    this.updateSelectedOpenFile.emit(MatterInfoData);
  }
  onSearchClear(value: string) {
    this.updateClearData.emit('clear');
  }
  // eBilling Comment
  onChangeWorkType(event) {
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
  onPrecedentChangeRate(rate) {
    this.updatePrecedentRateValue.emit(+rate);
  }
  onUpdatePrecedentUnit(value) {
    this.updatePrecedentUnit.emit(+value);
  }
  onSendChaser(linkMattes) {
    const requiredField: RequiredField = {
      eBillingType: this.pageLoadType,
      workType: this.worktypeList ? this.worktypeList.find((detail) => detail.selected) : null,
      activiti: this.activitiList ? this.activitiList.find((detail) => detail.selected) : null,
      phase: this.phaseList ? this.phaseList.find((detail) => detail.selected) : null,
      phaseWiseTask: this.phaseWiseTaskList ? this.phaseWiseTaskList.find((detail) => detail.selected) : null,
    };
    const validInformation: ChaserValidationInfo = this.chaserValidation(requiredField);
    if (validInformation.status) {
      const valueData = {
        selectedMatterInfo: this.selectedMatterInfo,
        isTimeRecordingEnabled: this.isTimeRecordingEnabled, linkMattes
      };
      this.chaserSend.emit(valueData);
    } else {
      this.showValidationMsg(validInformation.msg);
    }
  }
  showValidationMsg(errorMsg) {
    if (errorMsg) {
      const dialogData: InforDialogData = {
        content: {
          title: 'Message',
          message: errorMsg
        },
        data: { messageType: 'warning' }
      };
      const dialogRef = this.dialog.open(InforDialogComponent, {
        data: dialogData,
        width: '400px',
        disableClose: true,
        panelClass: 'dps-notification'
      });
    }
  }
  chaserValidation(requiredField: RequiredField) {
    let validInformation: ChaserValidationInfo;
    validInformation = {
      msg: 'Information is valid',
      status: true
    };
    if (requiredField.eBillingType === eBillingType.PrecedentH && !requiredField.workType) {
      validInformation = {
        msg: 'The Work Type cannot be empty!',
        status: false
      };
    } else if (requiredField.eBillingType === eBillingType.PrecedentS && !requiredField.phase) {
      validInformation = {
        msg: 'The Phase cannot be empty!',
        status: false
      };
    } else if (requiredField.eBillingType === eBillingType.PrecedentS && !requiredField.phaseWiseTask) {
      validInformation = {
        msg: 'The Task cannot be empty!',
        status: false
      };
    } else if (requiredField.eBillingType === eBillingType.PrecedentS && !requiredField.activiti) {
      validInformation = {
        msg: 'The activity cannot be empty!',
        status: false
      };
    }
    return validInformation;
  }
  onMatterLinkOutputData(event) {
    this.matterLinkOutputData.emit(event);
  }
  onClose() {
    if (this.sentItemIds && window.opener && window.opener !== window) {
      window.close();
    } else {
      this.chaserPopupClosed.emit('close');
    }
    // this.routerPopup.closeExclusivePoup();
  }
  onChangeClassType(cl: ClassObj) {
    this.changeClassType.emit(cl);
  }
  onChangeCrimeWorkType(type: AttType) {
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
  onUpdateUncharged(event) {
    this.updateChangeUncharged.emit(event);
  }

  onSelectLinkedMatter() {
    let title = 'Linked Matter';
    const menue = this.menueItems.find(val => val.id === 'matter_creation');
    if (menue) {
      title = 'Linked ' + menue.label;
    }
    const matterInfo: MatterDataInput = {
      appId: this.selectedMatterInfo.AppID,
      fileID: this.selectedMatterInfo.FileID,
      branchID: this.selectedMatterInfo.BranchID,
      isPlotMasterMatter: this.selectedMatterInfo.isPlotMasterMatter,
    };
    this.popupService.openMatterLinkedPopup('ChaserLinkedMatter', this.selectedMatterInfo.MatterReferenceNo,
      MatterLinkedType.Chaser, title, matterInfo,
      null, null).subscribe((result: string[]) => {

        if (result) {
          this.onSendChaser(result);
        }
      });
  }
  onloadMatterList() {
    this.loadMatterList.emit();
  }

  onChangeCivilClass(selectClass: CivilClassObj): void {
    this.changeCivilClass.emit(selectClass);
  }
  onChangeCivilLevel(selectLevel: CivilDropDownData): void {
    this.changeCivilLevel.emit(selectLevel);
  }

}
