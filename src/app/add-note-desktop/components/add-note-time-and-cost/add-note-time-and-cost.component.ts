import { Grade, ExtraTimeType, DiaryType } from '../../../add-note-core/models/interfaces';
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { AddTimeType, AttType } from '../../../core/lib/timeRecord';
import { eBillingType } from '../../../core/lib/matter';
import { PrecedentHSModel, WorkType } from '../../../core/lib/precedentHS';
import { filterClassType, filterAttTypeList } from '../../../core/lib/crime-managment';
import { ClassObj } from '../../../crime-management-core/models/interfaces';
import { DiaryRecType } from '../../../add-note-core';
import { CivilClassObj } from '../../../civil-class-management';
import { CivilDropDownData } from '../../../civil-time-recording-desktop';


@Component({
  selector: 'dps-add-note-time-and-cost',
  templateUrl: './add-note-time-and-cost.component.html',
  styleUrls: ['./add-note-time-and-cost.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddNoteTimeAndCostComponent {

  @Input() loading: boolean;
  @Input() homeCurrency: string;
  @Input() userGradeList: Grade[] = [];
  @Input() uncharged: boolean;
  @Input() rate: number;
  @Input() fileNoteValue: string;
  @Input() unit: number;
  @Input() extraRate: number;
  @Input() extraUnit: number;
  @Input() extraValue: number;
  @Input() diaryType: DiaryType[];
  @Input() extraTimeType: ExtraTimeType[] = [];
  @Input() isEdit: boolean;
  @Input() timeUseFeeEarnerRatesValueDisable: boolean;
  @Input() timeRecordType: AddTimeType;
  @Input() classType: ClassObj[];
  @Input() attTypeList: AttType[];
  @Input() section51: boolean;
  @Input() isBulkEntry: boolean;
  @Input() noOfEntryBy: number;
  @Input() isTelephoneAdv: boolean;
  // eBilling Comment
  @Input() pageLoadType: eBillingType;
  @Input() worktypeList: WorkType[];
  @Input() activitiList: PrecedentHSModel[];
  @Input() phaseList: PrecedentHSModel[];
  @Input() phaseWiseTaskList: PrecedentHSModel[];
  @Input() note: string;
  @Input() isBilled: boolean;
  @Input() selectedDiaryTypeId: DiaryRecType;
  @Input() civilClassList: CivilClassObj[];
  @Input() civilLevelList: CivilDropDownData[];  
  @Input() civilCourtList: CivilDropDownData[];
  

  @Output() updateSelectedUserGrade = new EventEmitter<Grade>();
  @Output() updateRate = new EventEmitter<number>();
  @Output() updateUnit = new EventEmitter<number>();
  @Output() updateExtraRate = new EventEmitter<number>();
  @Output() updateExtraUnit = new EventEmitter<number>();
  @Output() updateSelectedExtraTime = new EventEmitter<ExtraTimeType>();
  @Output() changeClassType = new EventEmitter<ClassObj>();
  @Output() changeAttType = new EventEmitter<AttType>();
  @Output() changeSection51 = new EventEmitter<boolean>();
  @Output() changeIsBulkEntry = new EventEmitter<boolean>();
  @Output() changeNumOfEntries = new EventEmitter<number>();
  @Output() changeTelephoneAdv = new EventEmitter<boolean>();
  @Output() updateChangeUncharged = new EventEmitter<boolean>();
  // eBilling Comment

  @Output() changeWorkType = new EventEmitter<any>();
  @Output() changePhase = new EventEmitter<any>();
  @Output() changeTask = new EventEmitter<any>();
  @Output() changeActivity = new EventEmitter<any>();
  @Output() updateNote = new EventEmitter<string>();

  // Civil
  @Output() changeCivilClass = new EventEmitter<CivilClassObj>();
  @Output() changeCivilLevel = new EventEmitter<CivilDropDownData>();
  @Output() changeCivilCourt = new EventEmitter<CivilDropDownData>();
  
  eBillingType = eBillingType;

  timeRecordTypes = AddTimeType;

  constructor() { }
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
  ///////
  get selectedUserGrade() {
    if (this.userGradeList) {
      return this.userGradeList.find((userGrade) => userGrade.selected);
    }
    return this.userGradeList;
  }
  get selectedExtraTime() {
    if (this.extraTimeType) {
      return this.extraTimeType.find((type) => type.selected);
    }
    return this.extraTimeType;
  }

  get selectedDiaryType() {
    if (this.diaryType) {
      return this.diaryType.find((type) => type.selected);
    }
    return null;
  }

  get isExtraTimeCostEnable() {
    return !(this.pageLoadType === eBillingType.PrecedentH || this.pageLoadType === eBillingType.PrecedentS ||
      this.selectedDiaryTypeId === DiaryRecType.TIME1 || this.selectedDiaryTypeId === DiaryRecType.TIME2 ||
      this.selectedDiaryTypeId === DiaryRecType.TIME3 || this.selectedDiaryTypeId === DiaryRecType.TIME4 ||
      this.selectedDiaryTypeId === DiaryRecType.TIME5);
  }

  onUserGradeChange(value) {
    this.updateSelectedUserGrade.emit(value);
  }
  onChangeuncharged(event) {
    this.updateChangeUncharged.emit(event.checked);
  }
  onChangeRate(rate) {
    this.updateRate.emit(rate.value ? rate.value : 0.00);
    rate.value = '0.00';
  }
  onChangeUnit(event) {
    // const newUnit = unit.value.replace('.', '');
    event.target.value = event.target.value === '0' ? '1.00' : event.target.value;
    this.updateUnit.emit(event.target.value);
  }
  onChangeExtraRate(extraRate) {
    this.updateExtraRate.emit(extraRate.value ? extraRate.value : 0.00);
    extraRate.value = '0.00';
  }
  onChangeExtraUnit(extraUnit) {
    const newUnit = extraUnit.value.replace('.', '');
    this.updateExtraUnit.emit(newUnit);
    extraUnit.value = newUnit;
  }
  onExtraTimeChange(selectetExtraTime) {
    this.updateSelectedExtraTime.emit(selectetExtraTime);
  }
  get selectedClassType() {
    if (this.classType) {
      return this.classType.find((cl) => cl.selected);
    }
    return null;
  }
  get selectedCivilClassType() {
    if (this.civilClassList) {
      return this.civilClassList.find((cl) => cl.selected);
    }
    return null;
  }
  get selectedAttType() {
    if (this.attTypeList) {
      return this.attTypeList.find((cl) => cl.selected);
    }
    return this.attTypeList;
  }
  get selectedCivilLevel() {
    if (this.civilLevelList) {
      return this.civilLevelList.find((cl) => cl.selected);
    }
    return null;
  }
  get selectedCourt() {
    if (this.civilCourtList) {
      return this.civilCourtList.find((cl) => cl.selected);
    }
    return null;
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
  get isShowTelephoneAdv() {
    if ((this.classType && this.classType.length > 0 && this.classType.find(c => c.selected).rectype === 3)
      && (this.attTypeList && this.attTypeList.find(t => t.selected) &&
        this.attTypeList.find(t => t.selected).attId === 2)) {
      return true;
    }
    return false;
  }
  get isShowSection51() {
    if (this.classType && this.classType.find(c => c.selected).rectype === 2) {
      return true;
    }
    return false;
  }
  // eBilling Comment
  onPrecedentHChangeWorkType(event) {
    this.changeWorkType.emit(event.value);
  }
  onChangePhase(event) {
    this.changePhase.emit(event.value);
  }
  onChangeTask(event) {
    this.changeTask.emit(event.value);
  }
  onChangeActivity(event) {
    this.changeActivity.emit(event.value);
  }
  onNoteChange(event) {
    this.updateNote.emit(this.note);
  }
  onChangeTelephoneAdv(isTelephone: boolean) {
    this.changeTelephoneAdv.emit(isTelephone);
  }

  get filterClassType() {
    return filterClassType(this.classType, true);
  }

  get filterAttTypeList() {
    if (this.selectedClassType) {
      return filterAttTypeList(this.attTypeList, this.selectedClassType.rectype);
    }
    return [];
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


