import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ColumnDef } from '../../../core/lib/grid-model';
import { Folder, FileItemWrapper } from '../../../file-history-core/models/interface';
import { GridDocumentData } from '../../../core/lib/matter';

@Component({
  selector: 'dps-global-document-fix-row',
  templateUrl: './global-document-fix-row.component.html',
  styleUrls: ['./global-document-fix-row.component.scss']
})
export class GlobalDocumentFixRowComponent implements OnInit {

  @Output() clickGridRow = new EventEmitter<any>();
  @Output() openCaseClick = new EventEmitter<any>();
  @Output() moveSelectedFolder = new EventEmitter<{ folder: Folder, row: FileItemWrapper }>();
  @Output() share = new EventEmitter<FileItemWrapper>();

  @Input() gridData: GridDocumentData[];
  @Input() columnDef: ColumnDef[];
  @Input() rowData;
  @Input() folderList;


  constructor() { }

  ngOnInit() {
  }



  getHighlightKeys(key: string[]) {
    if (key && key.length > 0) {

      let searchstring = '';

      const x = key.filter((v, i) => key.indexOf(v) === i);
      x.forEach(m => { searchstring += m.replace('+', '') + ','; });


      return searchstring;

    }


  }


  getFxFlexProperty(index) {
    if (!this.columnDef) { return ''; }
    return this.columnDef[index] && this.columnDef[index].extras ? this.columnDef[index].extras.fxFlex : '';
  }


  // onClickGridRow(event, item) {

  //   this.clickGridRow.emit(item);

  // }
  OnOpenCaseClick(event, item) {
    event.stopPropagation();
    event.preventDefault();
    this.openCaseClick.emit(item);
  }

  clickShare(row, event) {
    this.share.emit(row);
  }

  clickMoveSelectedFolder(folder: Folder, row: FileItemWrapper) {
    this.moveSelectedFolder.emit({ folder: folder, row: row });

  }

  clickMenuTrigge(event, row) {
    // if (!!row.isChecked) {
    event.preventDefault();
    event.stopPropagation();
    // }

  }

}
