
import { Component, Output, ChangeDetectionStrategy, EventEmitter, Input } from '@angular/core';
import { MatterGridRowRapper } from '../../../client-search-core/models/interfaces';
import { Module, SettingKey } from '../../../core/lib/app-settings';
import { AccessControlService } from './../../../auth/services/access-control.service';
import { MainMenuItem } from './../../../layout-desktop';



@Component({
  selector: 'dps-grid-button-details',
  templateUrl: './grid-button-details.component.html',
  styleUrls: ['./grid-button-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GridButtonDetailsComponent {

  @Input() selectedMatterData: MatterGridRowRapper;
  @Input() menuItem: MainMenuItem<any>[];

  @Output() updateOpenCaseClick = new EventEmitter<MatterGridRowRapper>();
  @Output() updateTimeRecordingClick = new EventEmitter<MatterGridRowRapper>();
  @Output() updateNewMailClick = new EventEmitter<MatterGridRowRapper>();
  @Output() updateLedgerCardClick = new EventEmitter<MatterGridRowRapper>();
  @Output() eChitClick = new EventEmitter<MatterGridRowRapper>();
  @Output() matterCreationClick = new EventEmitter();


  module = Module;
  settingKey = SettingKey;

  constructor(private access: AccessControlService) { }

  get addMatterLable() {
    return this.menuItem.find(i => i.id === 'matter_creation').label;
  }

  public OnOpenCaseClick() {
    console.log('SelectedMatterData', this.selectedMatterData);
    this.updateOpenCaseClick.emit(this.selectedMatterData);
  }
  public OnTimeRecordingClick() {
    console.log('SelectedMatterData', this.selectedMatterData);
    this.updateTimeRecordingClick.emit(this.selectedMatterData);
  }

  public OnNewMailClick() {
    console.log('OnNewMailClick', this.selectedMatterData);
    this.updateNewMailClick.emit(this.selectedMatterData);
  }

  public OnLedgerCardClick() {
    this.updateLedgerCardClick.emit(this.selectedMatterData);
  }

  onEChitClick() {
    this.eChitClick.emit(this.selectedMatterData);
  }
  onMatterCreationClick() {
    this.matterCreationClick.emit(this.selectedMatterData);
  }
  moduleIsActive(module: Module) {
    return this.access.checkModuleIsActive(module);
  }
  getSettingValue(key: SettingKey) {
    return this.access.getSettingValue(key);
  }

}
