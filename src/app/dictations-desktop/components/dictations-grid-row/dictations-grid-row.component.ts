import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ColumnDef } from '../../../core/lib/grid-model';
import { GridRowData, GridDataFilter } from '../../../dictations-core/models/interface';
import { UrgentValue } from '../../../dictations-core/models/enum';

@Component({
  selector: 'dps-dictations-grid-row',
  templateUrl: './dictations-grid-row.component.html',
  styleUrls: ['./dictations-grid-row.component.scss']
})
export class DictationsGridRowComponent implements OnInit {
  @Input() dictationsGridData: any;   // to add interface
  @Input() coloumnDef: ColumnDef[];
  @Input() matterRef: string; // To add matter ref with raw data wiew model
  @Input() usetType: any;
  @Input() dictationGridData: GridRowData[];
  @Input() dictationGridFilters: GridDataFilter;

  @Output() playDictations = new EventEmitter();
  @Output() openWordFileDictation = new EventEmitter();
  @Output() competedJobDictations = new EventEmitter();
  @Output() finishJobUpdate = new EventEmitter();
  @Output() openCaseDictation = new EventEmitter();
  @Output() rowExpand = new EventEmitter();
  @Output() openDictationPdf = new EventEmitter();
  @Output() openDictatioProfiling = new EventEmitter<any>();
  @Output() openCaseFile = new EventEmitter<any>();


  urgentValue = UrgentValue;
  constructor() { }




  ngOnInit() {
  }

  gridRowExpan(itemRow) {
    this.rowExpand.emit(itemRow);

  }

  onPlayDictations(itemRow) {
    this.playDictations.emit(itemRow);
  }

  onOpenWordFileDictation(itemRow) {
    this.openWordFileDictation.emit(itemRow);
  }
  onCompetedJobDictations(itemRow) {
    this.competedJobDictations.emit(itemRow);

  }

  onOpenCaseDictation(gridRowData) {
    this.openCaseDictation.emit(gridRowData);

  }

  onFinishJobUpdate(event) {
    this.finishJobUpdate.emit(event);
  }

  getFxFlexProperty(index) {
    if (!this.coloumnDef) { return ''; }
    return this.coloumnDef[index]
      && this.coloumnDef[index].extras ? this.coloumnDef[index].extras.fxFlex : '';
  }

  onPdfFileClick(itemRow) {
    this.openDictationPdf.emit(itemRow);
  }
  onOpenDictatioProfiling(event) {
    this.openDictatioProfiling.emit(event);

  }
  onOpenCaseFile(value) {
    this.openCaseFile.emit(value);
  }
}

