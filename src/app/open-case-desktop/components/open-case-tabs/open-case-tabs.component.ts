import { DriveItem } from './../../../core/lib/microsoft-graph';

import { Component, OnInit, Input, EventEmitter, Output, OnChanges, SimpleChanges } from '@angular/core';

import { MatterInfo } from '../../../core';
import { ScreensContactType, TimesFinancialFigure } from '../../../open-case-core/models/interface';
import { ContactMode } from '../../../case-contact-core/models/interface';
import { GroupMode } from '../../../file-history-core/models/interface';
import { DiaryRecType, LegalAid } from '../../../add-note-core';
import { ConfirmDialogData, ConfirmDialogComponentWithCancel, ConfirmDialogWithCancelResultKind } from '../../../shared';
import { SystemJsPopupLoaderService } from '../../../shell-desktop';
import { MatDialog } from '@angular/material';
import { AddNoteInPutData, AddNoteItemsType, AddNoteItem } from '../../../core/lib/addNote';
import { Observable, from } from 'rxjs';
import { mergeAll } from 'rxjs/operators';


@Component({
  selector: 'dps-open-case-tabs',
  templateUrl: './open-case-tabs.component.html',
  styleUrls: ['./open-case-tabs.component.scss']
})
export class OpenCaseTabsComponent implements OnInit, OnChanges {
  @Input() selectedTab: any;
  @Input() hidden: any;
  @Input() fdDetails: TimesFinancialFigure;
  @Input() searchText: '';
  @Input() homeCurrancy;
  @Input() groupMode;
  @Input() matterInfo: MatterInfo;
  @Input() screensContactTypeList: ScreensContactType[];
  @Input() token;
  @Input() contactMode;
  @Input() isSearchFullText: boolean;

  @Output() searchTextChanged = new EventEmitter<string>();
  @Output() ShowContent = new EventEmitter<any>();
  @Output() refresh = new EventEmitter<string>();
  @Output() fontSizeClassChangeValue = new EventEmitter<string>();
  @Output() menuChange = new EventEmitter<any>();
  @Output() contactChange = new EventEmitter<any>();
  @Output() searchFullTextValue = new EventEmitter<boolean>();

  fontSize: number;
  fontSizeClassTag: string;
  buttonActiveClass: string;
  contactTypeList$: any;
  addNoteInputList: AddNoteInPutData[] = [];
  // gridFontSize: string;

  fileHistoryGroupMode = GroupMode;

  constructor(private popupService: SystemJsPopupLoaderService, private dialog: MatDialog) {
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.matterInfo) {
      //  this.token = 'InitCaseContact' + changes.matterInfo.currentValue.MatterReferenceNo;
    }
  }
  ngOnInit() {
    this.fontSize = 0;
    this.fontSizeClassTag = 'font-increment-';
    this.buttonActiveClass = '';
  }
  onShowContent(type) {
    this.ShowContent.emit(type);
  }

  onMenuChange(event) {
    this.menuChange.emit(event);
  }


  onAllContact() {
    if (this.selectedTab === 'case-contact') {
      if (this.contactMode === ContactMode.All) {
        this.contactChange.emit(ContactMode.View);
      } else {
        this.contactChange.emit(ContactMode.All);
      }
    }
  }
  onRefresh() {
    // this.refreshClick.emit();
    this.refresh.emit();
  }
  onSearchTextChanged(event) {
    this.searchTextChanged.emit(event);
  }
  // Font size
  onFontSizeMinusClick() {
    if (this.fontSize > -3) {
      this.buttonActiveClass = 'active';
      this.fontSize -= this.fontSize !== 1 ? 1 : 2;
      // this.gridFontSize = (this.fontSizeClassTag + this.fontSize);
      this.fontSizeClassChangeValue.emit(this.fontSizeClassTag + this.fontSize);
    }
  }
  onFontSizeResetClick() {
    this.buttonActiveClass = '';
    this.fontSize = 0;
    // this.gridFontSize = (this.fontSizeClassTag + this.fontSize);
    this.fontSizeClassChangeValue.emit(this.fontSizeClassTag + this.fontSize);
  }
  onFontSizePlusClick() {
    if (this.fontSize < 4) {
      this.buttonActiveClass = 'active';
      this.fontSize += this.fontSize !== -1 ? 1 : 2;
      // this.gridFontSize = (this.fontSizeClassTag + this.fontSize);
      this.fontSizeClassChangeValue.emit(this.fontSizeClassTag + this.fontSize);
    }
  }
  // Font size end

  onUploadBTNClick() {
    const fileUploadInput = <HTMLInputElement>document.getElementById('hisoryfileInput');
    fileUploadInput.value = null;
    fileUploadInput.click();
  }
  onCloud() {

    this.popupService.openDrivePopup(null, null).subscribe((val: any[]) => {

      const attachement = val ? val.filter(item => item && item.selected && item.data.file).map(item => item.data) : null;
      if (attachement && attachement.length > 0) {
        const matterData = {
          MatterReferenceNo: this.matterInfo.MatterReferenceNo, BranchID: this.matterInfo.BranchId,
          AppID: this.matterInfo.AppId, FeeEarner: this.matterInfo.FeeEarner,
          ClientName: this.matterInfo.ClientName, RateCategory: null, FileID: this.matterInfo.FileId,
          AppCode: this.matterInfo.AppCode, eBilling: this.matterInfo.eBilling, isPlotMasterMatter: this.matterInfo.isPlotMasterMatter,
          isProspectMatter: this.matterInfo.isProspectMatter, isLegalAid: this.matterInfo.isLegalAid
        };
        this.popupService.openAddNotePopupWithAttachments(
          'mainAddNotePopup', attachement, AddNoteItemsType.DriveItems,
          matterData, DiaryRecType.LETTER_IN, LegalAid.NotLegalAid
        );
      }
    });
  }
  onIsSearchFullTextValue(value) {
    this.searchFullTextValue.emit(value);
  }
}
