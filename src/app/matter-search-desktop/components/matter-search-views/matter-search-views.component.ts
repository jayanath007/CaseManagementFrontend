import { MatRadioGroup, MatRadioChange } from '@angular/material';
import { Component, OnInit, Input, Output, EventEmitter, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { MatterViews } from '../../../matter-search-core';
import { MatterMenu } from '../../../matter-search-core/models/enums';
import { SystemJsPopupLoaderService } from '../../../shell-desktop';
import { Module } from '../../../core/lib/app-settings';
import { AccessControlService } from './../../../auth/services/access-control.service';

@Component({
  selector: 'dps-matter-search-views',
  templateUrl: './matter-search-views.component.html',
  styleUrls: ['./matter-search-views.component.scss']
})
export class MatterSearchViewsComponent implements OnInit, OnChanges {

  @Input() searchText: string;
  @Input() isInactiveFeeEarner: boolean;
  @Input() totalItems: Number;
  @Input() isClosedMatters: boolean;
  @Input() isCompletedMatters: boolean;
  @Input() selectedDepartment;
  @Input() activeView;
  @Input() isMLSEnableMatter: boolean;
  @Input() isDepartmentLoading: boolean;
  @Input() isGridLoading: boolean;
  @Input() matterCreationTitle: string;
  @Input() matterDisplyName: string;

  @Output() updateSelectedSearchText = new EventEmitter<string>();
  @Output() onClosedMattersChangeValue = new EventEmitter<any>();
  @Output() onCompletedMattersChangeValue = new EventEmitter<any>();
  @Output() mlsEnableChange = new EventEmitter<boolean>();
  @Output() onInactiveFeeEarners = new EventEmitter<any>();
  @Output() changeMatterViewOut = new EventEmitter<any>();
  @Output() fontSizeClassChangeValue = new EventEmitter<string>();
  @Output() refresh = new EventEmitter();
  @Output() print = new EventEmitter();
  @Output() clickMatterMenu = new EventEmitter<MatterMenu>();

  module = Module;

  @ViewChild(MatRadioGroup) matRadioGroup: MatRadioGroup;

  MatterViews = MatterViews;
  fontSize: number;
  fontSizeClassTag: string;
  buttonActiveClass: string;
  matterMenu = MatterMenu;

  constructor(private popupService: SystemJsPopupLoaderService, private access: AccessControlService) { }

  ngOnInit() {
    this.matRadioGroup.value = this.activeView;
    this.fontSize = 0;
    this.fontSizeClassTag = 'font-increment-';
    this.buttonActiveClass = '';
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.activeView && changes.activeView.currentValue) {
      this.matRadioGroup.value = this.activeView;
    }
  }
  openEChitAuthorisationsPopup() {
    this.popupService.eChitAuthorisationsPopup('EChitAuthorisationsPopup', { id: null }).subscribe((result) => {
    });
  }
  onSearchTextChanged(event) {
    this.updateSelectedSearchText.emit(event);
  }

  onClosedMattersChange(value) {
    this.onClosedMattersChangeValue.emit(value);
  }

  onCompletedMattersChange(value) {
    this.onCompletedMattersChangeValue.emit(value);
  }

  onMLSEnableChange(value) {
    this.mlsEnableChange.emit(value);
  }

  onInactiveFeeEarnersChange(value) {
    this.onInactiveFeeEarners.emit(value);
  }

  changeMatterView(event: MatRadioChange) {
    this.changeMatterViewOut.emit(event);
  }
  onFontSizeMinusClick() {
    if (this.fontSize > -4) {
      this.buttonActiveClass = 'active';
      this.fontSize -= 1;
      this.fontSizeClassChangeValue.emit(this.fontSizeClassTag + this.fontSize);
    }
  }
  onFontSizeResetClick() {
    this.buttonActiveClass = '';
    this.fontSizeClassChangeValue.emit(this.fontSizeClassTag + 0);
    this.fontSize = 0;
  }
  onFontSizePlusClick() {
    if (this.fontSize < 4) {
      this.buttonActiveClass = 'active';
      this.fontSize += 1;
      this.fontSizeClassChangeValue.emit(this.fontSizeClassTag + this.fontSize);
    }
  }
  onRefresh() {
    this.refresh.emit();
  }
  onPrint() {
    this.print.emit();
  }
  onClickMatterMenu(kind: MatterMenu) {
    this.clickMatterMenu.emit(kind);
  }
  moduleIsActive(module: Module) {
    return this.access.checkModuleIsActive(module);
  }

}
