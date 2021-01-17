import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ColumnDef, PaginatorDef } from '../../../core/lib/grid-model';
import { GridRowData, LoginUser, GridDataFilter } from '../../../dictations-core/models/interface';
import { PageEvent } from '@angular/material';
import { Observable } from 'rxjs';
import { AccessControlService } from '../../../auth/services/access-control.service';
import { SettingKey } from '../../../core/lib/app-settings';

@Component({
  selector: 'dps-dictations-grid',
  templateUrl: './dictations-grid.component.html',
  styleUrls: ['./dictations-grid.component.scss']
})
export class DictationsGridComponent implements OnInit {
  @Input() loading: boolean;
  @Input() coloumnDef: ColumnDef[];
  @Input() matterRef: string; // To add matter ref with raw data wiew model
  @Input() usetType: LoginUser;
  @Input() dictationGridData: GridRowData[];
  @Input() dictationGridFilters: GridDataFilter;
  @Input() fontSizeClass: string;
  @Input() paginatorDef: PaginatorDef;

  @Output() playDictations = new EventEmitter();
  @Output() openWordFileDictation = new EventEmitter();
  @Output() competedJobDictations = new EventEmitter();
  @Output() finishJobUpdate = new EventEmitter();
  @Output() openCaseDictation = new EventEmitter();
  @Output() rowExpand = new EventEmitter();
  @Output() openDictationPdf = new EventEmitter();
  @Output() changePage = new EventEmitter<PaginatorDef>();
  @Output() openDictatioProfiling = new EventEmitter<any>();
  @Output() openCaseFile = new EventEmitter<any>();

  fontSize: number;
  fontSizeClassTag: string;
  buttonActiveClass: string;
  constructor(private setting: AccessControlService) { }
  pageSizeOptions = [25, 50, 100];

  dataBase$ = new Observable<any>();

  ngOnInit() {
    this.dataBase$ = this.setting.getSettingValue(SettingKey.TeamTalkDataBase);
  }

  onPlayDictations(itemRow) {
    this.playDictations.emit(itemRow);
  }

  onCompetedJobDictations(itemRow) {
    this.competedJobDictations.emit(itemRow);
  }
  onOpenWordFileDictation(itemRow) {
    this.openWordFileDictation.emit(itemRow);



  }
  onOpenCaseDictation(gridRowData) {
    this.openCaseDictation.emit(gridRowData);

  }
  onFinishJobUpdate(event) {
    this.finishJobUpdate.emit(event);
  }

  GridrowExpand(row) {
    this.rowExpand.emit(row);

  }

  onPdfFileClick(itemRow) {
    this.openDictationPdf.emit(itemRow);
  }

  onNextPage(pageEvent: PageEvent): void {
    const pageDef: PaginatorDef = { currentPage: pageEvent.pageIndex, itemPerPage: pageEvent.pageSize };
    this.changePage.emit(pageDef);
  }

  onOpenDictatioProfiling(event) {
    this.openDictatioProfiling.emit(event);

  }
  onOpenCaseFile(value) {
    this.openCaseFile.emit(value);
  }

}
