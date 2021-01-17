
import { PageEvent } from '@angular/material';
import { Component, OnInit, Input, Output, ChangeDetectionStrategy, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { ColumnDef, PaginatorDef } from '../../../core/lib/grid-model';
import { MatterGridRowRapper, ClientGridRowRapper, MatterExpandData } from '../../../client-search-core/models/interfaces';
import { MainMenuItem } from './../../../layout-desktop';

@Component({
  selector: 'dps-matter-grid',
  templateUrl: './matter-grid.component.html',
  styleUrls: ['./matter-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MatterGridComponent implements OnInit, OnChanges {
  pageSize = 50;
  pageSizeOptions = [25, 50, 100];
  pageIndex = 0;

  @Input() homeCurrancy;
  @Input() clientRowData: ClientGridRowRapper;
  @Input() columnDef: ColumnDef;
  @Input() totalItems: Number;
  @Input() searchText: string;
  @Input() menuItem: MainMenuItem<any>[];
  @Input() isPlotUser: boolean;

  @Output() toggleMatterGridExpand = new EventEmitter();
  @Output() updateOpenCaseClick = new EventEmitter<MatterGridRowRapper>();
  @Output() updateTimeRecordingClick = new EventEmitter<MatterGridRowRapper>();
  @Output() updateNewMailClick = new EventEmitter<MatterGridRowRapper>();
  @Output() updateLedgerCardClick = new EventEmitter<MatterGridRowRapper>();
  @Output() openEchitPopup = new EventEmitter<MatterGridRowRapper>();
  @Output() updateMatterCreationClick = new EventEmitter<MatterGridRowRapper>();
  @Output() matterGridPageChange = new EventEmitter<{ clientRef: string, pageDef: PaginatorDef }>();

  constructor() {
  }

  ngOnInit() {
    // console.log('component init', this.matterData);
  }
  ngOnChanges(changes: SimpleChanges) {

  }

  public MatterGridRowExpan(client: ClientGridRowRapper, matter: MatterGridRowRapper, event: MouseEvent): void {
    const row: MatterExpandData = {
      client: client,
      matter: matter
    };
    this.toggleMatterGridExpand.emit(row);

  }

  public openCaseClick(selectedMatterData: MatterGridRowRapper) {
    this.updateOpenCaseClick.emit(selectedMatterData);
  }

  public timeRecordingClick(selectedMatterData: MatterGridRowRapper) {
    this.updateTimeRecordingClick.emit(selectedMatterData);
  }

  public newMailClick(selectedMatterData: MatterGridRowRapper) {
    this.updateNewMailClick.emit(selectedMatterData);
  }

  public ledgerCardClick(selectedMatterData: MatterGridRowRapper) {
    this.updateLedgerCardClick.emit(selectedMatterData);
  }

  onEChitClick(matterData: MatterGridRowRapper) {
    this.openEchitPopup.emit(matterData);
  }
  onMatterCreationClick(matterData: MatterGridRowRapper) {
    this.updateMatterCreationClick.emit(matterData);
  }
  public onNextPage(pageEvent: PageEvent): void {
    const pageDef: PaginatorDef = { currentPage: pageEvent.pageIndex, itemPerPage: pageEvent.pageSize };
    this.matterGridPageChange.emit({ clientRef: this.clientRowData.data.clientRef, pageDef: pageDef });
  }


}


