import { DiaryFileDetails } from './../../../time-recording-core/models/interfaces';
import { eBillingType, MatterInputData, MatterAppCode } from './../../../core/lib/matter';
import { InforDialogComponent } from '../../../shared/components/infor-dialog/infor-dialog.component';
import { InforDialogData } from '../../../shared/models/dialog';
import { FormControl } from '@angular/forms';
import { MatSnackBar, MatDialog } from '@angular/material';
import {
  TimeRecordingMsg, EditData, WorkType, PrecedentHSModel,
  ClientMatterData, PrecedentHRates
} from '../../../time-recording-core/models/interfaces';
import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { TimeRecordingCloseInfo, StopStartInfo, TimeRecordAddingType } from '../../../time-recording-core/models/enum';
import { ConfirmDialogData, ConfirmDialogComponent, ConfirmDialogResultKind } from '../../../shared';
import { FeeEarner } from '../../../core/lib/fee-earner';
import { SystemJsPopupLoaderService } from '../../../shell-desktop';
import { interval } from 'rxjs/internal/observable/interval';
import { Subscription } from 'rxjs';
import { MainMenuItemResolverService, MainMenuItem } from '../../../layout-desktop';
import { LocalStorageKey } from '../../../core';

@Component({
  selector: 'dps-time-recording-layout',
  templateUrl: './time-recording-layout.component.html',
  styleUrls: ['./time-recording-layout.component.scss']
})
export class TimeRecordingLayoutComponent implements OnInit, OnChanges {
  @Input() isLoading: boolean;
  @Input() detailList: string[];
  @Input() matterReferenceNo: string;
  @Input() clientMatterData: ClientMatterData;
  @Input() bodyText: string;
  @Input() feeEarnerList: FeeEarner[];
  @Input() error: TimeRecordingMsg;
  @Input() date: string;
  @Input() mpu: number;
  @Input() unit: number;
  @Input() hourlyRate: number;
  @Input() amount: number;
  @Input() isUncharge: boolean;
  @Input() saved: TimeRecordingMsg;
  @Input() isDirty: boolean;
  @Input() editData: EditData;
  @Input() selectDetail: string;
  @Input() canMinimize: boolean;
  // @Input() canMinimizeViews: { token: string; view: TimeRecordingState; isActive: boolean; }[];
  @Input() isActiveToken: boolean;
  @Input() timeValue: string;
  @Input() timeRecordingView: any;
  @Input() isTimerStart: any;
  @Input() isMinimizePopup: any;
  @Input() selectedJobTitle: string;
  @Input() diaryFileDetails: DiaryFileDetails;

  // eBilling Comment
  @Input() pageLoadType: eBillingType;
  @Input() worktypeList: WorkType[];
  @Input() precedentHRateList: PrecedentHRates[];
  @Input() activitiList: PrecedentHSModel[];
  @Input() phaseList: PrecedentHSModel[];
  @Input() phaseWiseTaskList: PrecedentHSModel[];
  @Input() selectedPhRate: PrecedentHRates;

  @Output() changeUnit = new EventEmitter<number>();
  @Output() updateSelectedFeeEarner = new EventEmitter<FeeEarner>();
  @Output() changeUncharge = new EventEmitter<boolean>();
  @Output() upateSelectedDate = new EventEmitter<string>();
  @Output() upateSelectedDetails = new EventEmitter<string>();
  @Output() updateNote = new EventEmitter<string>();
  @Output() submit = new EventEmitter();
  @Output() saveData = new EventEmitter();
  @Output() close = new EventEmitter<any>();
  @Output() changeRate = new EventEmitter<any>();
  @Output() stopStartClock = new EventEmitter<any>();
  // eBilling Comment
  @Output() changeWorkType = new EventEmitter<any>();
  @Output() changePhase = new EventEmitter<any>();
  @Output() changeTask = new EventEmitter<any>();
  @Output() changeActivity = new EventEmitter<any>();
  @Output() deleteTimeRecording = new EventEmitter<any>();
  @Output() changeMatter = new EventEmitter<{ matRef: string, eBilling: eBillingType, feeEarner: string }>();
  @Output() phRateChange = new EventEmitter<any>();

  inputUnitCtrl = new FormControl();
  inputNoteCtrl = new FormControl();
  inputRateCtrl = new FormControl();
  eBillingType = eBillingType;
  feeEarneraLabel = 'Timesheet for Fee Earner';
  unchargeText = 'Uncharge';
  stopStartState = StopStartInfo.Start;
  StopStartInfo: StopStartInfo;
  formSaveType: TimeRecordAddingType;
  saveTimerecordingData: Subscription;
  init = true;
  matterLabel: string;
  bodyTextRechText = false;

  constructor(public snackBar: MatSnackBar, private dialog: MatDialog, private popupService: SystemJsPopupLoaderService) {
    // super();
  }

  ngOnInit() {
    const menuItem: MainMenuItem<any>[] = JSON.parse(sessionStorage.getItem(LocalStorageKey.MenuItems));
    this.matterLabel = menuItem.find(i => i.id === 'matter_search').label;
    this.feeEarneraLabel = 'Timesheet for Fee Earner';
    this.unchargeText = 'Uncharged';
    setTimeout(() => {
      if (this.isActiveToken && this.isTimerStart && !this.isMinimizePopup) {
        this.saveData.emit();
      }
    }, 5000);
    this.saveTimerecordingData = interval(600000).subscribe(func => {
      if (this.isActiveToken && this.isTimerStart && !this.isMinimizePopup) {
        this.saveData.emit();
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.error && !changes.error.isFirstChange() && changes.error.currentValue) {
      if (!this.error.isError && changes.error.currentValue && changes.error.currentValue.timeRecordingError &&
        changes.error.currentValue.timeRecordingError.msg) {
        this.openMSGPopup(changes.error.currentValue.timeRecordingError.msg, 'alert', false);
      }
    }
    if (changes.saved && !changes.saved.isFirstChange() && changes.saved.currentValue) {
      if (changes.saved.currentValue.isError) {
        this.openMSGPopup(changes.saved.currentValue.msg, 'success', true);
      } else if (changes.saved.currentValue.isFloatingTimeSave) {
      } else {
        this.close.emit(TimeRecordingCloseInfo.ExitWithSaveSuccess);
      }
    }

    // if (changes.selectedJobTitle && !!changes.selectedJobTitle.isFirstChange() && changes.selectedJobTitle.currentValue) {
    //   setTimeout(() => this.onPHRateChange(this.selectedRateItem), 1000);
    // }
  }

  get selectedFeeEarner() {
    if (this.feeEarnerList) {
      return this.feeEarnerList.find((feeEarner) => feeEarner.selected);
    }
    return this.feeEarnerList;
  }

  // eBilling Comment
  get selectedWorkType() {
    if (this.worktypeList) {
      return this.worktypeList.find((worktype) => worktype.selected);
    }
    return this.worktypeList;
  }
  get selectedPhase() {
    if (this.phaseList) {
      return this.phaseList.find((phase) => phase.selected);
    }
    return this.phaseList;
  }
  get selectedTask() {
    if (this.phaseWiseTaskList) {
      return this.phaseWiseTaskList.find((task) => task.selected);
    }
    return this.phaseWiseTaskList;
  }
  get selectedActivity() {
    if (this.activitiList) {
      return this.activitiList.find((activiti) => activiti.selected);
    }
    return this.activitiList;
  }
  get selectedRateItem() {
    if (this.precedentHRateList) {
      const x = this.precedentHRateList.find(a => a.type === this.selectedJobTitle);
      if (!!x && !!x.type && !!this.init) {
        this.init = false;
        this.onPHRateChange({ value: x });
      }
      return x;
    }
    return null;
  }

  onMinimize() {
    this.saveData.emit();
    this.close.emit(TimeRecordingCloseInfo.Minimize);
  }

  openInfoSnackBar(msg) {
    if (msg) {
      this.snackBar.open(msg, '', {
        duration: 2000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
    }
  }
  // eBilling Comment
  onChangeWorkType(event) {
    this.changeWorkType.emit(event.value);
    if (this.canMinimize) {
      this.saveDataAfterAction();
    }

  }
  onChangePhase(event) {
    this.changePhase.emit(event.value);
    if (this.canMinimize) {
      this.saveDataAfterAction();
    }
  }
  onChangeTask(event) {
    this.changeTask.emit(event.value);
    if (this.canMinimize) {
      this.saveDataAfterAction();
    }
  }
  onChangeActivity(event) {
    this.changeActivity.emit(event.value);
    if (this.canMinimize) {
      this.saveDataAfterAction();
    }
  }
  onChangeUnit(value, event) {
    event.target.value = value === '0' ? '1.00' : value;
    this.changeUnit.emit(event.target.value);
  }
  onChangeHourlyRate(value) {
    this.changeRate.emit(value);
  }
  onChangeFeeEarner(event) {
    this.updateSelectedFeeEarner.emit(event.value);
  }
  onPHRateChange(event) {
    this.phRateChange.emit(event.value);
  }
  onUnchargeChange(event) {
    this.changeUncharge.emit(event.checked);
  }
  onDateChange(event) {
    this.upateSelectedDate.emit(event.value);
  }
  onChangeDetails(value) {
    this.upateSelectedDetails.emit(value);
    if (this.canMinimize) {
      this.saveDataAfterAction();
    }
  }
  onChangeNote(note: string) {
    if (this.bodyTextRechText) {
      return;
    }
    this.updateNote.emit(note);
    if (this.canMinimize) {
      this.saveDataAfterAction();
    }
  }
  onSave() {
    this.stopStartState = StopStartInfo.Stop;
    this.stopStartClock.emit(true);
    this.saveData.emit();
  }
  onSubmit() {
    this.stopStartState = StopStartInfo.Stop;
    this.stopStartClock.emit(true);
    this.submit.emit();
  }
  onDelete(timeId) {
    this.deleteTimeRecording.emit(timeId);
    this.close.emit(TimeRecordingCloseInfo.DeleteTR);
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
          this.saveTimerecordingData.unsubscribe();
          this.close.emit(TimeRecordingCloseInfo.ExitByUser);
        }
      });
    } else {
      this.saveTimerecordingData.unsubscribe();
      this.close.emit(TimeRecordingCloseInfo.ExitByUser);
    }
  }

  onMatterSearch() {
    const matterInputData: MatterInputData = { isMatterSearch: true };
    this.popupService.openMatterSearchPopup('TimeRecordMatterSearchPopup', matterInputData).subscribe((result) => {
      if (result && (result.AppCode === MatterAppCode.CR || result.AppCode === MatterAppCode.MA) && result.isLegalAid) {
        const dialogData: InforDialogData = {
          content: {
            title: 'Message',
            message: `Time cannot be recorded on this ${this.matterLabel} because it is Legal Aided.\n
             You will need to record time from the File History.`
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
        dialogRef.afterClosed();
      } else if (result) {
        const gridData = {
          matRef: result.MatterReferenceNo, eBilling: result.eBilling, feeEarner: result.FeeEarner,
          clientMatterData: {
            matterDetails: result.matterDetails,
            clientName: result.ClientName
          }
        };
        this.changeMatter.emit(gridData);
        if (this.canMinimize) {
          this.saveDataAfterAction();
        }
      }
    });
  }

  openMSGPopup(msg, type, isClose) {
    const dialogData: InforDialogData = {
      content: {
        title: 'Time Recording',
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
        this.close.emit(TimeRecordingCloseInfo.ExitWithSaveSuccess);
      }
    });
  }
  getTimeRecord(time: number) {
    const datetime = time * 1000;
    if (datetime < 0) {
      return '0s';
    }
    const days = Math.floor(datetime / (1000 * 60 * 60 * 24));
    const hours = Math.floor((datetime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((datetime % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((datetime % (1000 * 60)) / 1000);
    if (days > 0) {
      return days + 'd ' + hours + 'h ' + minutes + 'm ' + seconds + 's';
    }
    if (hours > 0) {
      return hours + 'h ' + minutes + 'm ' + seconds + 's';
    }
    if (minutes > 0) {
      return minutes + 'm ' + seconds + 's';
    }
    return seconds + 's';
  }
  onStartStopClock() {
    if (this.stopStartState === StopStartInfo.Stop) {
      this.stopStartState = StopStartInfo.Start;
    } else {
      this.stopStartState = StopStartInfo.Stop;
      this.saveData.emit();
    }
    this.stopStartClock.emit();
  }
  saveDataAfterAction() {
    setTimeout(() => {
      this.saveData.emit();
    }, 200);
  }
  onAttendanceNoteChange(event) {
    if (event) {
      this.updateNote.emit(event);
      if (this.canMinimize) {
        this.saveDataAfterAction();
      }
    }
  }

  get setbodyText(): string {
    this.bodyTextRechText = false;
    if (this.bodyText) {
      if (this.bodyText.match(/<(?:.|\n)*?>/gm)) {
        this.bodyTextRechText = true;
        return this.bodyText.replace(/<(?:.|\n)*?>/gm, '').replace(/&nbsp;/g, ' ');
      }
      return this.bodyText.replace(/&nbsp;/g, ' ');
    }
    return '';
  }
}
