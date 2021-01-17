import { MatDialog, PageEvent } from '@angular/material';
import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FeeEarnerInfo } from '../../../shared-data/model/interface';
import { DropdownListItem } from './../../../shared-data/model/interface';
import { CourtDutyTimeRecord, GridDataFilter } from '../../../crime-court-duty-core/model/interface';
import { showConfirmDialog } from '../../../core/utility/DpsUtility';
import { ConfirmDialogResultKind, LookupType, LookupsDialogInput, LoockupItem, TableColumn, TableRow } from '../../../shared';
import { CrimeLookUpFiled, CRIME_LOOKUP_FILEDS } from '../../../core/lib/crime-managment';
import { LookupsComponent } from '../../../shared/components/lookups/lookups.component';
import { PaginatorDef } from './../../../core/lib/grid-model';
import { timeTotal, disbusmentTotal } from '../../../crime-court-duty-core/function/total';

@Component({
  selector: 'dps-crime-court-duty-layout',
  templateUrl: './crime-court-duty-layout.component.html',
  styleUrls: ['./crime-court-duty-layout.component.scss']
})

export class CrimeCourtDutyLayoutComponent implements OnChanges {

  @Input() feeEarnerList: FeeEarnerInfo[];
  @Input() branchList: DropdownListItem[];
  @Input() model: CourtDutyTimeRecord;
  @Input() timeRecords: CourtDutyTimeRecord[];
  @Input() isloading: boolean;
  @Input() isLoadinghistory: boolean;
  @Input() isDirty: boolean;
  @Input() locationLookupList: LoockupItem[];
  @Input() gridDataPaginatorDef: PaginatorDef;
  @Input() gridDataFilter: GridDataFilter;
  @Output() userAction = new EventEmitter<string>();
  @Output() changeModel = new EventEmitter<({ key: string; value: any })>();
  @Output() exitModule = new EventEmitter();
  @Output() selectItemForEdit = new EventEmitter<CourtDutyTimeRecord>();
  @Output() changePage = new EventEmitter<PaginatorDef>();
  @Output() changeGridFilter = new EventEmitter<({ key: string; value: any })>();
  mpu = 1;
  gridRows: TableRow<CourtDutyTimeRecord>[] = [];
  selectedGridItemIndex = 0;
  lockBilldate = false;


  timeGridcolumns: TableColumn[] = [
    { name: 'Standby Date', propertyName: 'timDate', width: '10%', isDate: true, dateFormat: 'dd/MM/yyyy' },
    { name: 'Bill Date', propertyName: 'nextHearDate', width: '10%', isDate: true, dateFormat: 'dd/MM/yyyy' },
    { name: 'Fee Earner', propertyName: 'feeEarner', width: '100px' },
    { name: 'Social HH:MM', propertyName: 'socialTimeHrsMin', width: '128px', textAlign: 'right', defuiltValue: '00.00' },
    { name: 'Unsocial HH:MM', propertyName: 'unSocialTimeHrsMin', width: '158px', textAlign: 'right', defuiltValue: '00.00' },
    { name: 'Travel HH:MM', propertyName: 'travelHrsMin', width: '144px', textAlign: 'right', defuiltValue: '00.00' },
    { name: 'Disbursements', propertyName: 'disbursements', width: '9%', textAlign: 'right', numberFormat: '1.2-2', defuiltValue: '0' },
    // { name: 'Mileage', propertyName: 'mileage', width: '9%', textAlign: 'right', numberFormat: '1.2-2', defuiltValue: '0' },
    // { name: 'Vat Fare', propertyName: 'vatFares', width: '9%', textAlign: 'right', numberFormat: '1.2-2', defuiltValue: '0' },
    // { name: 'Non Vat Fares', propertyName: 'nonVATFares', width: '11%', textAlign: 'right', numberFormat: '1.2-2', defuiltValue: '0' },
    // { name: 'Parking', propertyName: 'parking', width: '80px', textAlign: 'right', numberFormat: '1.2-2', defuiltValue: '0' },
    { name: 'Value', propertyName: 'totalValue', width: '13%', textAlign: 'right', numberFormat: '1.2-2', defuiltValue: '0' }
  ];

  constructor(private matDialog: MatDialog) { }

  get feeEarnerListByBranchId(): FeeEarnerInfo[] {
    if (this.feeEarnerList && this.feeEarnerList.length > 0 && this.model) {
      return this.feeEarnerList.filter(i => i.userBranchId === this.model.branchId);
    }
    return [];
  }

  get timeValueTotal(): string {
    return timeTotal(this.model).toFixed(2).toString();
  }

  get disbursementValueTotal(): string {
    return disbusmentTotal(this.model).toFixed(2).toString();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes.timeRecords && !changes.timeRecords.isFirstChange())) {
      this.setTableRow();
    }
  }

  setTableRow() {
    const rows: TableRow<any>[] = [];
    if (this.timeRecords && this.timeRecords.length > 0) {
      this.timeRecords.forEach((r, i) => {
        const isSelected = this.selectedGridItemIndex === i;
        rows.push({
          data: { ...r, index: i },
          selected: isSelected,
        });
      });
    }
    this.gridRows = rows;
  }

  onChangeModel(key, value) {
    if (key === 'branchId') {
      this.changeModel.emit({ key: 'feeEarner', value: null });
    }
    this.changeModel.emit({ key: key, value: value });
  }
  onTextDataChange(value: string) {
    this.changeModel.emit({ key: 'note', value });
  }
  closePopup() {
    if (this.isDirty) {
      showConfirmDialog('Save Note', 'You have done some changes to the current time record\nDo you want to go back and save the record?',
        this.matDialog).afterClosed().subscribe(dialogResult => {
          if (dialogResult.kind === ConfirmDialogResultKind.Rejected) {
            this.exitModule.emit();
          }
        });
    } else {
      this.exitModule.emit();
    }
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
    const dialogRef = this.matDialog.open(LookupsComponent, {
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

  onNew() {
    if (this.isDirty) {
      showConfirmDialog('Save Note', 'You have done some changes to the current time record\nDo you want to go back and save the record?',
        this.matDialog).afterClosed().subscribe(dialogResult => {
          if (dialogResult.kind === ConfirmDialogResultKind.Rejected) {
            this.onAction('New');
          }
        });
    } else {
      this.onAction('New');
    }
  }

  onDelete() {
    if (this.model && this.model.timId) {
      showConfirmDialog('Delete Note', 'Are you sure you want to delete the selected row?',
        this.matDialog).afterClosed().subscribe(dialogResult => {
          if (dialogResult.kind === ConfirmDialogResultKind.Confirmed) {
            this.onAction('Delete');
          }
        });
    }
  }

  onAction(action: string) {
    this.userAction.emit(action);
    this.lockBilldate = false;
  }

  selectTimeRecord(data: { event: MouseEvent, row: TableRow<CourtDutyTimeRecord> }) {
    this.selectItemForEdit.emit(data.row.data);
  }

  onNextPage(pageEvent: PageEvent): void {
    const pageDef: PaginatorDef = { currentPage: pageEvent.pageIndex, itemPerPage: pageEvent.pageSize };
    this.changePage.emit(pageDef);
  }

  onChangeGridFilter(key: string, value: any) {
    this.changeGridFilter.emit({ key: key, value: value });
  }

  fixToTwoDecimalPoint(value): string {
    return value && !isNaN(Number(value.toString())) ? parseFloat(value).toFixed(2) : '0.00';
  }


}
