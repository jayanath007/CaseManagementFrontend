import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { UpdateModelType, UserAction } from '../../../crime-management-core/models/enum';
import { CrimeClassRequestModel, ClassObj } from '../../../crime-management-core/models/interfaces';
import { ClassType } from '../../../core/lib/timeRecord';

@Component({
  selector: 'dps-crime-management-popup-layout',
  templateUrl: './crime-management-popup-layout.component.html',
  styleUrls: ['./crime-management-popup-layout.component.scss']
})
export class CrimeManagementPopupLayoutComponent implements OnInit {

  constructor() { }

  @Input() isLoading: boolean;
  @Input() classType: ClassType[];
  @Input() classList: ClassObj[];
  @Input() addClassModel: CrimeClassRequestModel;
  @Input() rateFileloading: boolean;


  @Output() closePopUp = new EventEmitter();
  @Output() rateFileUpdate = new EventEmitter();
  @Output() updateAddClassModel = new EventEmitter<{ kind: UpdateModelType, value: string | number }>();
  @Output() userAction = new EventEmitter<{ kind: UserAction, classInfo?: ClassObj }>();
  @Output() expandRow = new EventEmitter<ClassObj>();

  ngOnInit() {
  }

  onUpdateAddClassModel(data: { kind: UpdateModelType, value: string | number }) {
    this.updateAddClassModel.emit(data);
  }

  onUserAction(data: { kind: UserAction, classInfo?: ClassObj }) {
    this.userAction.emit(data);
  }

  onRateFileUpdate() {
    this.rateFileUpdate.emit();
  }
  onClose() {
    this.closePopUp.emit();
  }
  onExpandRow(classObj: ClassObj) {
    this.expandRow.emit(classObj);
  }

}
