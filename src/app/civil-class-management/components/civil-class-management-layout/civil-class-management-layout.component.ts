import { ColumnDef } from './../../../core/lib/grid-model';
import { Component, Input, OnInit, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { createDefultColumnDef } from '../../../core/lib/grid-helpers';
import { CivilClassObj } from '../../model/interfaces';
import { CivilTimeRecordingModuleInput } from '../../../civil-time-recording-desktop';
import { SystemJsPopupLoaderService } from '../../../shell-desktop';

@Component({
  selector: 'dps-civil-class-management-layout',
  templateUrl: './civil-class-management-layout.component.html',
  styleUrls: ['./civil-class-management-layout.component.scss'],
  encapsulation: ViewEncapsulation.None

})
export class CivilClassManagementLayoutComponent implements OnInit {


  constructor(private popupService: SystemJsPopupLoaderService) { }

  @Input() isLoading: boolean;
  @Input() classList: CivilClassObj[];
  @Input() openRowIndex: number;
  @Output() closePopup = new EventEmitter();

  // classList1 = [{ "legalAidCaseId": 462, "branchId": 1, "appId": 11, "fileId": 30610, "openDate": "2020-10-26T00:00:00", "closeDate": null, "billDate": null, "caseId": "001", "licensedOptions": 73, "caseStageLevel": null, "feeEarner": null, "className": "Certificated" }, { "legalAidCaseId": 463, "branchId": 1, "appId": 11, "fileId": 30610, "openDate": "2012-11-26T00:00:00", "closeDate": null, "billDate": null, "caseId": "001", "licensedOptions": 0, "caseStageLevel": "FPL06", "feeEarner": null, "className": "Legal Help" }];

  columnDef: ColumnDef[] =
    [
      createDefultColumnDef('toggle', { label: '', fxFlex: '32px', filterAnchor: 'start', filterHidden: true, disableShort: true }),
      createDefultColumnDef('ClassType', { label: 'Type', fxFlex: '200px', filterAnchor: 'start', filterHidden: true, disableShort: true }),
      createDefultColumnDef('FeeEarner',
        { label: 'Fee Earner', fxFlex: '80px', filterAnchor: 'start', filterHidden: true, disableShort: true }),
      createDefultColumnDef('OpenDate',
        { label: 'Open Date', fxFlex: '100px', filterAnchor: 'start', filterHidden: true, disableShort: true }),
      createDefultColumnDef('ClosedDate',
        { label: 'Closed Date', fxFlex: '100px', filterAnchor: 'end', filterHidden: true, disableShort: true }),
      createDefultColumnDef('BilledDate',
        { label: 'Billed Date', fxFlex: '100px', filterAnchor: 'end', filterHidden: true, disableShort: true })
    ];

  ngOnInit() {
  }

  getFxFlexProperty(index) {
    if (!this.columnDef) { return ''; }
    return this.columnDef[index] && this.columnDef[index].extras ? this.columnDef[index].extras.fxFlex : '';
  }

  onClose() {
    this.closePopup.emit();
  }

  OpenRow(index: number, classObj: CivilClassObj) {
    if (this.openRowIndex === index) {
      return;
    }
    this.openRowIndex = index;
  }

  onRecordTime(item: CivilClassObj) {
    const civilTimeRecordingModuleInput: CivilTimeRecordingModuleInput = {
      civilClassObj: item
    };
    this.popupService.openCiviltimeRecordingPopup('CivilTimeRecording', civilTimeRecordingModuleInput);
  }

}
