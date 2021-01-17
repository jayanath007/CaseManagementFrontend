import { CrimeClassInforInitials, CrimeClassInforType } from './../../../core/lib/crime-managment';
import { Component, OnInit, Input, Output, EventEmitter, } from '@angular/core';
import { SystemJsPopupLoaderService } from '../../../shell-desktop';
import { Matter } from '../../../core/lib/matter';
import { CrimeClassRequestModel } from '../../../crime-management-core/models/interfaces';
import { UpdateModelType, UserAction } from '../../../crime-management-core/models/enum';
import { ClassType } from '../../../core/lib/timeRecord';


@Component({
  selector: 'dps-crime-management-header-bar',
  templateUrl: './crime-management-header-bar.component.html',
  styleUrls: ['./crime-management-header-bar.component.scss']
})
export class CrimeManagementHeaderBarComponent implements OnInit {


  @Input() token: string;
  @Input() matterInfor: Matter;
  @Input() isLoading: boolean;
  @Input() classType: ClassType[];
  @Input() addClassModel: CrimeClassRequestModel;
  @Input() rateFileloading: boolean;

  @Output() updateAddClassModel = new EventEmitter<{ kind: UpdateModelType, value: string | number }>();
  @Output() userAction = new EventEmitter<UserAction>();
  @Output() rateFileUpdate = new EventEmitter();

  constructor(public popupService: SystemJsPopupLoaderService) { }

  ngOnInit() {
  }

  // only active investigation && Procedding classes and LGFS and AGFS
  get filteredType() {
    if (this.classType) {
      return this.classType.filter(cls => (cls.classId === 3 || cls.classId === 4 || (cls.classId >= 100 && cls.classId <= 119)));
    }
    return [];
  }
  ///////////////////////////////////////


  onProceeding() {
    const initials: CrimeClassInforInitials = {
      MatterInfo: this.matterInfor,
      CrimeClassInforType: CrimeClassInforType.Proceeding
    };
    // this.popupService.openCrimeClassInfoPopup(this.token, initials);
  }

  onInvestigationClass() {
    const initials: CrimeClassInforInitials = {
      MatterInfo: this.matterInfor,
      CrimeClassInforType: CrimeClassInforType.InvestigationClass
    };
    // this.popupService.openCrimeClassInfoPopup(this.token, initials);
  }

  onChangeType(classId: number) {
    this.updateAddClassModel.emit({ kind: UpdateModelType.ClassType, value: classId });
  }

  onChangeClassName(name: string) {
    this.updateAddClassModel.emit({ kind: UpdateModelType.ClassName, value: name });
  }

  onChangeOpenDate(date: string) {
    this.updateAddClassModel.emit({ kind: UpdateModelType.OpenDate, value: date });
  }

  onAddClass() {
    this.userAction.emit(UserAction.AddClass);
  }

  onRateFileUpdate() {
    this.rateFileUpdate.emit();
  }
}
