import { Component, Input, Output, EventEmitter } from '@angular/core';
import { UserAction } from './../../../crime-management-core/models/enum';
import { Module } from '../../../core/lib/app-settings';
import { AccessControlService } from '../../../auth/services/access-control.service';
import { ClassObj } from './../../../crime-management-core/models/interfaces';

@Component({
  selector: 'dps-crime-grid-buttons',
  templateUrl: './crime-grid-buttons.component.html',
  styleUrls: ['./crime-grid-buttons.component.scss']
})
export class CrimeGridButtonsComponent {

  constructor(private access: AccessControlService) { }

  @Input() classItem: ClassObj;

  @Output() buttonClick = new EventEmitter<UserAction>();

  userAction = UserAction;
  module = Module;

  onActionClick(type: UserAction) {
    this.buttonClick.emit(type);
  }
  moduleIsActive(module: Module) {
    return this.access.checkModuleIsActive(module);
  }

}
