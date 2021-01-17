import { Component, Output, ChangeDetectionStrategy, EventEmitter, Input } from '@angular/core';
import { GridData, GridButtonAction } from '../../../work-done-core/models/interfce';
import { GridButtonType } from '../../../work-done-core/models/enumeration';
import { Module, SettingKey } from '../../../core/lib/app-settings';
import { AccessControlService } from './../../../auth/services/access-control.service';

@Component({
  selector: 'dps-work-done-grid-button-details',
  templateUrl: './work-done-grid-button-details.component.html',
  styleUrls: ['./work-done-grid-button-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkDoneGridButtonDetailsComponent {

  @Input() selectedMatterData: GridData;
  @Output() clickGridButton = new EventEmitter<GridButtonAction>();
  module = Module;
  settingKey = SettingKey;

  constructor(private access: AccessControlService) { }
  public onOpenCaseClick() {
    this.clickGridButton.emit({ kind: GridButtonType.openCase, value: this.selectedMatterData });
  }
  public onTimeRecordingClick() {
    this.clickGridButton.emit({ kind: GridButtonType.openTimeRecording, value: this.selectedMatterData });
  }

  public onNewMailClick() {
    this.clickGridButton.emit({ kind: GridButtonType.openNewMail, value: this.selectedMatterData });
  }

  public onLedgerCardClick() {
    this.clickGridButton.emit({ kind: GridButtonType.openLedgerCard, value: this.selectedMatterData });
  }

  public onViewDocClick() {
    this.clickGridButton.emit({ kind: GridButtonType.viewDocument, value: this.selectedMatterData });
  }

  moduleIsActive(module: Module) {
    return this.access.checkModuleIsActive(module);
  }

  getSettingValue(key: SettingKey) {
    return this.access.getSettingValue(key);
  }

}

