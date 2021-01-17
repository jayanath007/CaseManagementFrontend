import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatterInfo } from '../../../core/lib/matter';
import { ScreensContactType, TimesFinancialFigure } from '../../../open-case-core/models/interface';
import { ContactMode } from '../../../case-contact-core/models/interface';
import { MatTabChangeEvent } from '@angular/material';
import { Module } from '../../../core/lib/app-settings';
import { AccessControlService } from './../../../auth/services/access-control.service';

@Component({
  selector: 'dps-open-case-layout',
  templateUrl: './open-case-layout.component.html',
  styleUrls: ['./open-case-layout.component.scss']
})
export class OpenCaseLayoutComponent implements OnInit {

  @Input() selectedTab: any;
  @Input() hidden: any;
  @Input() fdDetails: TimesFinancialFigure;
  @Input() searchText: '';
  @Input() hedingText: string;
  @Input() fontSizeClass: string;
  @Input() matterInfo: MatterInfo;
  @Input() refreshCount: number;
  @Input() deleteEntrySecurityInfo: any;
  @Input() showFDFigures: boolean;
  @Input() homeCurrancy;
  @Input() openCaseToken: string;
  @Input() groupMode;
  @Input() screensContactTypeList: ScreensContactType[];
  @Input() contactMode: string;
  @Input() matterBannerMsg: string;
  @Input() isCloseBanner: boolean;
  @Input() isSearchFullText: boolean;

  @Output() fontSizeClassChangeValue = new EventEmitter<string>();
  @Output() ShowContent = new EventEmitter<any>();
  @Output() menuChange = new EventEmitter<any>();
  @Output() refreshClick = new EventEmitter<string>();
  @Output() searchTextChanged = new EventEmitter<string>();
  @Output() contactChange = new EventEmitter<any>();
  @Output() closeMsgBanner = new EventEmitter<any>();
  @Output() searchFullTextValue = new EventEmitter<boolean>();

  module = Module;

  constructor(private access: AccessControlService) { }

  ngOnInit() {
  }

  onChangeTap(tab: MatTabChangeEvent) {
    switch (tab.index) {
      case 0:
        this.onShowContent('file-history');
        break;
      case 1:
        this.onShowContent('case-task');
        break;
      case 2:
        this.onShowContent('case-contact');
        break;
      case 3:
        this.onShowContent('case-time');
        break;
      case 4:
        this.onShowContent('mls');
        break;
    }
  }

  get getSelectedTab() {
    switch (this.selectedTab) {
      case 'file-history':
        return 0;
      case 'case-task':
        return 1;
      case 'case-contact':
        return 2;
      case 'case-time':
        return 3;
      case 'mls':
        return 4;
      default:
        return 0;
    }
  }

  onFontSizeClassChange(value) {
    this.fontSizeClass = value;
  }
  onShowContent(type) {
    this.ShowContent.emit(type);
  }
  onRefresh() {
    this.refreshClick.emit();
  }
  onSearchTextChanged(event) {
    this.searchTextChanged.emit(event);
  }
  onAllContact(e) {
    if (this.selectedTab === 'case-contact') {
      if (this.contactMode === ContactMode.All) {
        this.contactChange.emit(ContactMode.View);
      } else {
        this.contactChange.emit(ContactMode.All);
      }
    }
  }
  onMenuChange(event) {
    this.menuChange.emit(event);
  }
  moduleIsActive(module: Module) {
    return this.access.checkModuleIsActive(module);
  }
  closeBanner() {
    this.closeMsgBanner.emit();
  }
  onIsSearchFullTextValue(value) {
    this.searchFullTextValue.emit(value);
  }
}
