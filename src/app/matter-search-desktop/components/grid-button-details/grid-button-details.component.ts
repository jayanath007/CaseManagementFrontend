
import { Component, Output, ChangeDetectionStrategy, EventEmitter, Input } from '@angular/core';
import { Module, SettingKey } from '../../../core/lib/app-settings';
import { AccessControlService } from '../../../auth/services/access-control.service';
import { GridRowItemWrapper } from '../../../matter-search-core';

@Component({
  selector: 'dps-grid-button-details',
  templateUrl: './grid-button-details.component.html',
  styleUrls: ['./grid-button-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GridButtonDetailsComponent {

  @Input() selectedMatterData: GridRowItemWrapper;
  @Output() updateOpenCaseClick = new EventEmitter<GridRowItemWrapper>();
  @Output() updateTimeRecordingClick = new EventEmitter<GridRowItemWrapper>();
  @Output() updateNewMailClick = new EventEmitter<GridRowItemWrapper>();
  @Output() ledgerCardClick = new EventEmitter<GridRowItemWrapper>();
  @Output() openMLS = new EventEmitter<GridRowItemWrapper>();
  @Output() openEChitWithMatter = new EventEmitter<GridRowItemWrapper>();
  @Output() openBillingRequest = new EventEmitter<GridRowItemWrapper>();
  @Output() openReferralNoteAndDate = new EventEmitter<GridRowItemWrapper>();

  module = Module;
  settingKey = SettingKey;

  constructor(private access: AccessControlService) { }
  public OnOpenCaseClick() {
    this.updateOpenCaseClick.emit(this.selectedMatterData);
  }
  public OnTimeRecordingClick() {
    this.updateTimeRecordingClick.emit(this.selectedMatterData);
  }

  public OnNewMailClick() {
    this.updateNewMailClick.emit(this.selectedMatterData);
  }

  OnLedgerCardClick() {
    this.ledgerCardClick.emit(this.selectedMatterData);
  }

  onMLSClick() {
    this.openMLS.emit(this.selectedMatterData);
  }

  onEChitClick() {
    this.openEChitWithMatter.emit(this.selectedMatterData);
  }
  openBillingRequestPopup() {
    this.openBillingRequest.emit(this.selectedMatterData);
  }
  moduleIsActive(module: Module) {
    return this.access.checkModuleIsActive(module);
  }

  openReferralNoteDatePopup() {
    this.openReferralNoteAndDate.emit(this.selectedMatterData);
  }

  getSettingValue(key: SettingKey) {
    return this.access.getSettingValue(key);
  }



}
