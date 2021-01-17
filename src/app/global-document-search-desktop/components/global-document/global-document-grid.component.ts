import { ViewChangeKind } from './../../../case-contact-core/actions/core';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ColumnDef, PaginatorDef } from '../../../core/lib/grid-model';
import { WindowPopupsManagerService } from '../../../document-view/services/window-popups-manager.service';
import { FileItemWrapper } from '../../../file-history-core/models/interface';
import { Condition, Filter } from '../../../odata';
import { GridDocumentData } from '../../../core/lib/matter';

@Component({
  selector: 'dps-global-document-grid',
  templateUrl: './global-document-grid.component.html',
  styleUrls: ['./global-document-grid.component.scss']
})
export class GlobalDocumentGridComponent implements OnInit {
  @Input() fileHistorData;
  @Input() documentViewOpened: boolean;
  @Input() isLoading: boolean;
  @Input() pageInfo;
  @Input() companyCode;
  @Input() columnDef: ColumnDef[];
  @Input() timeZone;
  @Input() gridData: GridDocumentData[];
  @Input() totalItem: number;
  @Input() paginatorDef: any;
  @Input() item: any;



  @Output() clickGridRow = new EventEmitter<any>();
  @Output() closeViewer = new EventEmitter();
  @Output() viewChange = new EventEmitter<any>();
  @Output() openInPopup = new EventEmitter<any>();
  @Output() openCaseClick = new EventEmitter<any>();
  @Output() share = new EventEmitter<FileItemWrapper>();

  length = 50;
  pageSize = 50;
  pageSizeOptions = [25, 50, 100];
  pageIndex = 0;

  get docUrl() {
    if (this.gridData) {
      const data = this.gridData.find(val => val.selected);
      if (data) {
        return data.docUrl;
      }
    }
    return null;
  }
  constructor(private windowPopupsManagerService: WindowPopupsManagerService) { }

  ngOnInit() {
  }


  // onClickGridRow(action) {

  //   this.clickGridRow.emit(action);

  // }

  onClickGridRow(item) {

    this.clickGridRow.emit(item);


  }
  onCloseViewer(event) {
    this.closeViewer.emit();
  }







  headerFlex(header) {
    if (header.extras.hidden) {
      return 0;
    }
    return header.extras.fxFlex;
  }



  onPageChange(event) {
    const pageDef: PaginatorDef = { currentPage: event.pageIndex, itemPerPage: event.pageSize };
    this.viewChange.emit({ kind: ViewChangeKind.PageEvent, value: pageDef });

  }


  onOpenInPopup() {

    this.openInPopup.emit();

  }

  onOpenCaseClick(rowData) {

    this.openCaseClick.emit(rowData);
  }

  onShare(item) {
    this.share.emit(item);

  }

  // onShare(diaryRecord: GridData) {

  //     const inputData: InputData = {
  //       signTokens: null,
  //       safeBoxFileList: null,
  //       fileCredentials: [{ diaryId: diaryRecord.diary_UID, password: null }],
  //       submitType: SubmitType.Share,
  //       url: null,
  //       matterData: {
  //         MatterReferenceNo: diaryRecord.matterReferenceNo,
  //         FileID: diaryRecord.fileNumber,
  //         AppCode: diaryRecord.appCode,
  //         AppID: diaryRecord.appID,
  //         BranchID: diaryRecord.branchID,
  //         ClientName: diaryRecord.client,
  //         RateCategory: null,
  //         FeeEarner: null,
  //         eBilling: diaryRecord.eBilling
  //       }
  //     };
  //     this.showEmailListPopup(inputData);

  // }

  onFilterApply(data: { filter: Filter<Condition>, def: ColumnDef }) {
    if (data.filter.filters[0].value.toString().trim()) {
      const filterDef: ColumnDef = { fieldName: data.def.fieldName, filter: data.filter, filterActive: true };
      this.viewChange.emit({ kind: ViewChangeKind.ApplyColumnFilter, value: filterDef });
    }
  }

  onFilterClear(data: { filter: Filter<Condition>, def: ColumnDef }) {
    const filterDef: ColumnDef = { fieldName: data.def.fieldName, filter: data.filter, filterActive: false };
    this.viewChange.emit({ kind: ViewChangeKind.ClearColumnFilter, value: filterDef });
  }
}
