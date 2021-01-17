import { DpsSelectModel, AuthorisationsGroup, FeeEarner } from '../../../e-chit-authorisations-core/models/interfaces';
import { EChitAuthorisationsState } from './../../../e-chit-authorisations-core/reducers/e-chit-authorisations';
import { PropertyNameList } from '../../../e-chit-authorisations-core/models/enums';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ColumnDef, PaginatorDef } from './../../../core/lib/grid-model';
import { TableColumn } from '../../../shared';
import { User } from '../../../auth';

@Component({
  selector: 'dps-e-chit-authorisations-layout',
  templateUrl: './e-chit-authorisations-layout.component.html',
  styleUrls: ['./e-chit-authorisations-layout.component.scss']
})
export class EChitAuthorisationsLayoutComponent implements OnInit {

  cmbGroupColumns: TableColumn[] = [
    { name: 'Name', propertyName: 'groupName', width: '100%' }
  ];
  cmbFeeEarnerColumns: TableColumn[] = [
    { name: 'Code', propertyName: 'code', width: '100%' },
  ];

  @Input() viewData: EChitAuthorisationsState;
  @Input() columnDef: ColumnDef;
  @Input() paginatorDef: PaginatorDef;
  @Input() groupList: DpsSelectModel<AuthorisationsGroup>[];
  @Input() feeEarnerList: DpsSelectModel<FeeEarner>[];
  @Input() user: User;
  @Input() selectedRowCount: number;

  @Output() closeAuthorisationsPopup = new EventEmitter<any>();
  @Output() controllersValueChange = new EventEmitter<any>();
  @Output() selectedRowItem = new EventEmitter<any>();
  @Output() changePage = new EventEmitter<PaginatorDef>();
  @Output() viewReportData = new EventEmitter<any>();
  @Output() columsSortApply = new EventEmitter<ColumnDef>();

  groupSelectedValue = { key: null, value: null };
  feeEarnerSelectedValue = { key: null, value: null };

  constructor() { }

  ngOnInit() {
  }
  onClose(info) {
    this.closeAuthorisationsPopup.emit(info);
  }
  onChangePage(paginatorDef) {
    this.changePage.emit(paginatorDef);
  }
  onGroupSelectChange(event) {
    if (event && event.key && event.value) {
      this.groupSelectedValue = { key: event.key, value: event.value };
      this.controllersValueChange.emit({ propertyName: PropertyNameList.UserGroup, selectedValue: this.groupSelectedValue });
    }
  }
  onFeeEarnerSelectChange(event) {
    if (event && event.key && event.value) {
      this.feeEarnerSelectedValue = { key: event.key, value: event.value };
      this.controllersValueChange.emit({ propertyName: PropertyNameList.FeeEarner, selectedValue: this.feeEarnerSelectedValue });
    }
  }
  onAuthorise() {
    this.controllersValueChange.emit({ propertyName: PropertyNameList.Authorise, selectedValue: null });
  }
  onReject() {
    this.controllersValueChange.emit({ propertyName: PropertyNameList.Reject, selectedValue: null });
  }
  onRefresh() {
    this.controllersValueChange.emit({ propertyName: PropertyNameList.Refresh, selectedValue: null });
  }
  onSelectedRow(row) {
    this.selectedRowItem.emit(row);
  }
  onCheckedChange(object) {
    this.controllersValueChange.emit({ propertyName: PropertyNameList.GridCheckBox, selectedObjectValue: object });
  }
  onViewFile(dataModel) {
    this.viewReportData.emit(dataModel);
  }
  onToggleSorting(data: ColumnDef) {
    this.columsSortApply.emit(data);
  }
}
