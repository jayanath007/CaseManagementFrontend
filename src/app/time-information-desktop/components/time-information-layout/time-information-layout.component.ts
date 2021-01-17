import { Component, OnInit, Input, SimpleChanges, OnChanges, EventEmitter, Output, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { FormViewModel } from '../../../time-information-core/reducers/time-information';
import { Subject } from 'rxjs';
import { TimeInformationModel, TimeInformationParentModel, TimeRecordGridInput } from '../../../time-information-core/models/interfaces';
import { ColumnDef } from './../../../core/lib/grid-model';
import { AttType } from '../../../core/lib/timeRecord';
import { MatDialog } from '@angular/material';
import { ConfirmDialogResultKind, LoockupItem } from '../../../shared';
import { takeUntil, debounceTime, pairwise } from 'rxjs/operators';
import { ButtonAction, CrimeLookupTypeMapFiled } from './../../../time-information-core/models/enum';
import { TimeRecordGridPopupComponent } from './../time-record-grid-popup/time-record-grid-popup.component';
import { FeeEarner, CrimeTimeSettings } from '../../../core/lib/crime-managment';
import { showConfirmDialog, showInforDialog, InfoDialogType } from '../../../core/utility/DpsUtility';
import { CrimeDefs } from '../../../time-information-core/class/CrimeDefs';
import { ClassObj } from '../../../crime-management-core/models/interfaces';
import { Matter } from '../../../time-information-core/class/core/Matter';

@Component({
  selector: 'dps-time-information-layout',
  templateUrl: './time-information-layout.component.html',
  styleUrls: ['./time-information-layout.component.scss']
})
export class TimeInformationLayoutComponent implements OnInit, OnChanges, OnDestroy {

  @Input() isLoading: boolean;
  @Input() isloadingTimeRecords: boolean;
  @Input() feeEarnerList: FeeEarner[];
  @Input() timeRecordsGridData: TimeInformationModel[];
  @Input() model: TimeInformationModel;
  @Input() attTypesList: AttType[];
  @Input() gradeList: string[];
  @Input() gridColumnDef: ColumnDef[];
  @Input() isUpdateRateFiles: boolean;
  @Input() formViewModel: FormViewModel;
  @Input() isEditMode: boolean;
  @Input() settings: CrimeTimeSettings;
  @Input() classList: ClassObj[];
  @Input() matter: Matter;
  @Input() policeSLookupList: LoockupItem[];

  @Output() closePopup = new EventEmitter();
  @Output() selectGridItem = new EventEmitter<TimeInformationModel>();
  @Output() clickAction = new EventEmitter<ButtonAction>();
  @Output() parentModelChange = new EventEmitter<TimeInformationParentModel>();
  @Output() modelChange = new EventEmitter<TimeInformationModel>();
  @Output() attTypeListChange = new EventEmitter<string>();
  // @Output() openPoliceStationSearch = new EventEmitter<string>();
  @Output() rateCalculation = new EventEmitter<{
    controlerName: string,
    model: TimeInformationModel,
    value: any
  }>();
  @Output() exceedLimit = new EventEmitter();
  @Output() openLookup = new EventEmitter<CrimeLookupTypeMapFiled>();
  @Output() removeAttendee = new EventEmitter<CrimeLookupTypeMapFiled>();
  @Output() classChange = new EventEmitter<number>();
  @Output() changeFeeEarner = new EventEmitter<FeeEarner>();

  formParentGroup: FormGroup;
  UserAction = ButtonAction;
  private unsubscribe: Subject<void> = new Subject();
  selectedTabIndex = 0;
  userControlText: string;
  resetCount = 0;

  constructor(private formBuilder: FormBuilder, private dialog: MatDialog) {
    this.buildForm();
  }

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges) {

    if (changes.model && changes.model.currentValue) {
      if (JSON.stringify(changes.model.currentValue) !== JSON.stringify(changes.model.previousValue)) {
        this.formParentGroup.patchValue(this.model);
        this.userControlText = this.model.userControlText;
        if (changes.model.previousValue && changes.model.currentValue &&
          changes.model.previousValue.attTypeId !== changes.model.currentValue.attTypeId) {
          this.selectedTabIndex = 0;
        }
      }
    }
  }
  onModelChange(event) {
    this.modelChange.emit(event);
  }
  onRateCalculation(event) {
    this.rateCalculation.emit(event);
  }
  // onOpenPoliceStationSearch(event) {
  //   this.openPoliceStationSearch.emit(event);
  // }
  onChangeTap(index: number) {
    this.selectedTabIndex = index;
  }

  onOpenLookup(type: CrimeLookupTypeMapFiled) {
    this.openLookup.emit(type);
  }

  private buildForm() {

    this.formParentGroup = this.formBuilder.group({
      attTypeId: [''],
      feeEarner: [''],
      date: [''],
      custTemplates: [''],
      classId: [''],
      grade: ['']
    });

    this.formParentGroup.valueChanges.pipe(takeUntil(this.unsubscribe)).pipe(debounceTime(500), pairwise())
      .subscribe((values) => {
        console.log(values);
        if (values[0] && JSON.stringify(values[0]) !== JSON.stringify(values[1])) {
          const previesValue = values[0];
          const curentValues = this.formParentGroup.getRawValue();
          if (previesValue.attTypeId !== curentValues.attTypeId) {
            // this.attTypeListChange.emit(curentValues.attTypeId);
          } else {
            this.parentModelChange.emit(curentValues);
          }
        }
      });
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  onClose() {
    this.closePopup.emit();
  }

  onSelectGridItem(item: TimeInformationModel) {
    if (item && item.timeId !== this.model.timeId) {
      this.resetCount = this.resetCount + 1;
      this.formParentGroup.markAsUntouched();
      this.selectGridItem.emit(item);
    }
  }

  onTypeListChange(value) {
    this.attTypeListChange.emit(value);
  }

  onClassChange(classId: number) {
    this.classChange.emit(classId);
  }


  onClickAction(action: ButtonAction) {
    let temDialog = null;
    switch (action) {
      case ButtonAction.Delete: {
        temDialog = showConfirmDialog('Delete', 'Are you sure you want to continue?', this.dialog);
        break;
      }
      case ButtonAction.New: {
        temDialog = showConfirmDialog('New', 'Will lose your inserted data, Are you sure you want to continue?', this.dialog);
        break;
      }
      // && !this.settings.crimeSettings.HasRepOdrDate
      case ButtonAction.Save: {
        if (this.model.classId === CrimeDefs.INVESTIGATIONCLASSID) {
          if (!!this.matter && !!this.matter.GetUFNDate() && new Date(this.matter.GetUFNDate()) <= new Date('01/04/2016')) {
            showInforDialog('Save Time', 'Cannot process! UFN date pre 01/04/2016',
              InfoDialogType.warning, this.dialog);
            return;
          } else if (this.model.attTypeId === 2 && this.model.nextAppDateCheck && (!this.model.nextAppDate || !new Date(this.model.nextAppDate))) {
            showInforDialog('Save Time', 'Pleace select valid Next Appearance Date',
              InfoDialogType.warning, this.dialog);
            return;
          } else if ((this.model.attTypeId === 3 || this.model.attTypeId === 4) && this.model.nextHearingDateCheck && (!this.model.nextHearingDate || !new Date(this.model.nextHearingDate))) {
            showInforDialog('Save Time', 'Pleace select valid Next Hearing Date',
              InfoDialogType.warning, this.dialog);
            return;
          } else {
            this.saveRecord(action);
          }
        } else if (this.model.classId === CrimeDefs.PROCLASSID) {
          if ((this.model.attTypeId === 1 || this.model.attTypeId === 2 || this.model.attTypeId === 4 ||
            this.model.attTypeId === 5) && !this.settings.repOderDate) {
            temDialog = showConfirmDialog('Save Time',
              'Representation order date has not been configured.\nDo you want to save the time entry anyway?', this.dialog);
          } else if (new Date(this.settings.repOderDate) <= new Date('01/04/2016')) {
            showInforDialog('Save Time', 'Cannot process! rep order date pre 01/04/2016',
              InfoDialogType.warning, this.dialog);
            return;
          } else if ((this.model.attTypeId === 2 || this.model.attTypeId === 3 || this.model.attTypeId === 5) && this.model.nextHearingDateCheck && (!this.model.nextHearingDate || !new Date(this.model.nextHearingDate))) {
            showInforDialog('Save Time', 'Pleace select valid Next Hearing Date',
              InfoDialogType.warning, this.dialog);
            return;
          } else {
            this.saveRecord(action);
          }

        } else {
          this.saveRecord(action);
        }
        break;
      }
      default:
        this.saveRecord(action);
    }

    if (!!temDialog) {
      temDialog.afterClosed().subscribe(dialogResult => {
        if (dialogResult.kind === ConfirmDialogResultKind.Confirmed) {
          if (action === ButtonAction.New) {
            this.resetCount = this.resetCount + 1;
          }
          this.clickAction.emit(action);
          this.resetCount = this.resetCount + 1;
        }
      });
    }

  }

  onExceedLimit() {
    this.exceedLimit.emit();
  }
  onRemoveAttendee(crimeLookupType: CrimeLookupTypeMapFiled) {
    this.removeAttendee.emit(crimeLookupType);
  }

  openGridPopup() {
    const dialogData: TimeRecordGridInput = {
      gridColumnDef: this.gridColumnDef,
      timeRecordsGridData: this.timeRecordsGridData,
      allData: true,
      selectedType: this.model.attTypeId
    };
    const dialogRef = this.dialog.open(TimeRecordGridPopupComponent, {
      data: dialogData,
      width: '873px',
      height: 'px',
      disableClose: true,
      panelClass: 'dps-notification'
    });

    dialogRef.afterClosed().subscribe((row: TimeInformationModel) => {
      if (!!row) {
        this.onSelectGridItem(row);
      }
    });
  }

  saveRecord(action) {
    this.clickAction.emit(action);
    this.resetCount = this.resetCount + 1;
  }

  get editOriginaMmodel(): TimeInformationModel {
    if (this.model.timeId > 0) {
      return this.timeRecordsGridData.find(r => r.timeId === this.model.timeId);
    }
    return null;
  }

  get filteredAttTypesList(): AttType[] {
    if (this.model && this.model.classId === 4 && this.attTypesList) {
      return this.attTypesList.filter(i => !i.attDescription.includes('RC-6')).filter(i => !i.attDescription.includes('RC-7'));
    }
    return this.attTypesList;
  }



  onChangeFeeEarner(feeEarnerId: string): void {
    let selectedFeeEarner = null;
    if (feeEarnerId && this.feeEarnerList) {
      selectedFeeEarner = this.feeEarnerList.find(i => i.userId === feeEarnerId);
    }
    this.changeFeeEarner.emit(selectedFeeEarner);
  }


}
