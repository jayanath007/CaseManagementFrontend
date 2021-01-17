import { MatDialog } from '@angular/material';
import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';
import { Cds7ReportInfo } from '../../../cds7-report-info-core';
import { LoockupItem, LookupType, LookupsDialogInput } from '../../../shared';
import { CrimeLookUpFiled, CRIME_LOOKUP_FILEDS, DropDownItem } from '../../../core/lib/crime-managment';
import { LookupsComponent } from '../../../shared/components/lookups/lookups.component';
import { showInforDialog, InfoDialogType } from '../../../core/utility/DpsUtility';


@Component({
  selector: 'dps-cds7-report-info-content',
  templateUrl: './cds7-report-info-content.component.html',
  styleUrls: ['./cds7-report-info-content.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class Cds7ReportInfoContentComponent implements OnInit {

  constructor(private dialog: MatDialog) { }

  @Input() isLoading: boolean;
  @Input() informationModel: Cds7ReportInfo;
  @Input() locationLookupList: LoockupItem[];
  @Input() caseTypes: DropDownItem[];
  @Output() close = new EventEmitter();
  @Output() changeModel = new EventEmitter<{ key: string, value: any }>();
  @Output() save = new EventEmitter();
  @Output() openLocationSearch = new EventEmitter<string>();


  ngOnInit() {
  }

  onClose() {
    this.close.emit();
  }

  onChangeModel(key: string, value: any, isNumber = false) {
    if (isNumber) {
      value = Number(value);
    }
    this.changeModel.emit({ key: key, value: value });
  }

  onSave() {
    if (this.validateNSFStatus()) {
      this.save.emit();
    } else {
      showInforDialog('CRM7 Report', 'The criteria specified does not match that required for a CRM7',
        InfoDialogType.warning, this.dialog);
    }
  }

  validateNSFStatus() {
    if (this.informationModel &&
      !this.informationModel.isEnhancedRates &&
      !this.informationModel.counselAsigned && !this.informationModel.isAboveLimit &&
      !this.informationModel.representationOrderWithdrawnDate &&
      !this.informationModel.extradition &&
      !this.informationModel.s61Committal) {
      if (this.informationModel.caseType && this.informationModel.caseType.length > 0) {
        if (this.informationModel.caseType.substring(1, 2) !== 'N') {
          return false;
        }
      } else {
        return false;
      }
    }
    return true;
  }

  onOpenlocationSearch(searchText) {
    const fileds: CrimeLookUpFiled = CRIME_LOOKUP_FILEDS[LookupType.MA_COURT_CODES];
    const loockupInput: LookupsDialogInput = {
      title: fileds.title,
      secondTitle: fileds.secondTitle,
      items: this.locationLookupList,
      keyColumsEnable: false,
      editable: false,
      showCode: true,
      enableSearch: true,
      searchText: searchText
    };
    const dialogRef = this.dialog.open(LookupsComponent, {
      width: '450px',
      height: '500px',
      data: loockupInput,
      hasBackdrop: true,
      disableClose: true,
      panelClass: 'dps-notification'
    });
    dialogRef.afterClosed().subscribe(
      ((item: LoockupItem) => {
        if (item) {
          this.onChangeModel('locationId', item.code);
          this.onChangeModel('locationName', item.name);
        }

      })
    );
  }

  get isDisableWarrantDate(): boolean {
    if (this.informationModel && this.informationModel.caseType &&
      (this.informationModel.caseType.includes('(1) Warrant of arrest'))) {
      return false;
    }
    return true;
  }

  get isDisableGpToSolDate(): boolean {
    if (this.informationModel && this.informationModel.caseType &&
      (this.informationModel.caseType.includes('(2) Cracked trial'))) {
      return false;
    }
    return true;
  }


}
