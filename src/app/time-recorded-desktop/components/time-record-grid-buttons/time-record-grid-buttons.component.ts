import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { GridButtonAction, GridData } from '../../../time-recorded-core/models/interfce';
import { GridButtonType } from '../../../time-recorded-core/models/enumeration';
import { Module, SettingKey } from '../../../core/lib/app-settings';
import { AccessControlService } from './../../../auth/services/access-control.service';

@Component({
  selector: 'dps-time-record-grid-buttons',
  templateUrl: './time-record-grid-buttons.component.html',
  styleUrls: ['./time-record-grid-buttons.component.scss']
})
export class TimeRecordGridButtonsComponent implements OnInit {

  constructor(private access: AccessControlService) { }
  @Input() row: GridData;
  @Output() clickGridButton = new EventEmitter<GridButtonAction>();
  module = Module;
  settingKey = SettingKey;

  ngOnInit() {
  }
  public onOpenCaseClick() {
    this.clickGridButton.emit({ kind: GridButtonType.openCase, value: this.row });
  }
  onAddTimeRecord() {
    this.clickGridButton.emit({ kind: GridButtonType.addTimeRecording, value: this.row });
  }
  onEditTimeRecord() {
    this.clickGridButton.emit({ kind: GridButtonType.editTimeRecording, value: this.row });
  }
  moduleIsActive(module: Module) {
    return this.access.checkModuleIsActive(module);
  }
  getSettingValue(key: SettingKey) {
    return this.access.getSettingValue(key);
  }
  onEditAttendanceNote() {
    this.clickGridButton.emit({ kind: GridButtonType.editTimeRecording, value: this.row });
  }
}
