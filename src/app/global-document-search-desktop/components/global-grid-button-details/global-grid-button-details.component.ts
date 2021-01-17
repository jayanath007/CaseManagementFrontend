import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BasePopupType } from '../../../shared/models/consol-error';
import { SystemJsPopupLoaderService } from '../../../shell-desktop';
import { AddNoteInPutData, AddNoteItemsType } from '../../../core/lib/addNote';
import { LegalAid, DiaryRecType } from '../../../add-note-core';
import { Module, SettingKey } from '../../../core/lib/app-settings';
import { AccessControlService } from './../../../auth/services/access-control.service';
import { MatterInputData, GridDocumentData } from './../../../core/lib/matter';

@Component({
  selector: 'dps-global-grid-button-details',
  templateUrl: './global-grid-button-details.component.html',
  styleUrls: ['./global-grid-button-details.component.scss']
})
export class GlobalGridButtonDetailsComponent implements OnInit {

  @Input() rowData: GridDocumentData;
  @Output() clickGridRow = new EventEmitter<any>();
  @Output() openCase = new EventEmitter<any>();
  @Output() share = new EventEmitter<any>();
  @Output() copyFile = new EventEmitter<any>();
  module = Module;
  settingKey = SettingKey;


  constructor(private popupService: SystemJsPopupLoaderService, private access: AccessControlService) { }

  ngOnInit() {
  }

  OnClickGridRow() {

    this.clickGridRow.emit(this.rowData);

  }


  OnOpenCaseClick() {
    this.openCase.emit(this.rowData);
  }

  OnShareClick() {
    this.share.emit(this.rowData);
  }

  OnAttachToMatterClick() {
    const matterInputData: MatterInputData = {
      isMatterSearch: false,
      basePopupType: BasePopupType.GlobalDocumentAttachDPSfile,
      emailList: null
    };
    this.popupService.openMatterSearchPopup('matterSearchPopup', matterInputData).subscribe((result: any) => {
      if (result) {
        const matterData = {
          MatterReferenceNo: result.MatterReferenceNo,
          BranchID: result.BranchID,
          AppID: result.AppID,
          FeeEarner: result.FeeEarner,
          ClientName: result.ClientName ? result.ClientName : '',
          RateCategory: null,
          FileID: result.FileID,
          AppCode: result.AppCode,
          eBilling: result.eBilling,
          isPlotMasterMatter: result.isPlotMasterMatter,
          isProspectMatter: result.isProspectMatter,
          isLegalAid: result.isLegalAid
        };
        const input: AddNoteInPutData = {
          isEdit: false,
          matterData: matterData,
          diaryType: DiaryRecType.FILE_NOTE,
          legalAid: LegalAid.NotLegalAid,
          addNoteItemsType: AddNoteItemsType.DiaryItems,
          diaryItemList: [{
            appId: this.rowData.appId,
            appCode: this.rowData.matterCode,
            branchId: this.rowData.branchId,
            diaryId: this.rowData.diaryId,
            fileId: this.rowData.fileId,
            letterName: this.rowData.letterName
          }]
        };
        this.popupService.openAddNotePopup('mainAddNotePopup', input);
      }
    });
  }

  moduleIsActive(module: Module) {
    return this.access.checkModuleIsActive(module);
  }

  getSettingValue(key: SettingKey) {
    return this.access.getSettingValue(key);
  }


}
