
import { Subject ,  ReplaySubject } from 'rxjs';
import { Component, OnInit, Input, EventEmitter, Output, OnDestroy, ViewChild, SimpleChanges, OnChanges } from '@angular/core';
import { ScreenEditComponentTreeData, LookupList } from '../../../core';
import { MatSelect } from '@angular/material';
import { uuid } from '../../../utils/uuid';

@Component({
  selector: 'dps-edit-screen-lookup-file-upload-select',
  templateUrl: './edit-screen-lookup-file-upload-select.component.html',
  styleUrls: ['./edit-screen-lookup-file-upload-select.component.scss']
})
export class EditScreenLookupFileUploadSelectComponent implements OnInit, OnDestroy, OnChanges {

  @Input() noEntriesFoundLabel: string;
  @Input() placeholderLabel: string;
  @Input() meta: ScreenEditComponentTreeData;
  @Input() modelData: any;
  @Input() comboModelData: any;
  @Input() columnName: string;
  @Input() lableName?: string;
  @Input() showType: string;
  @Input() hidden: boolean;
  @Input() disabled: boolean;
  @Input() lookupType: string;
  @Input() isLookupLinkDisable: boolean;
  @Input() isKeyValue: boolean;
  @Input() isUploadDisable: boolean;
  @Input() uploaded: boolean;


  @Output() filterChangedItem = new EventEmitter<string>();
  @Output() selectionchangedData = new EventEmitter<any>();
  @Output() lookupClickData = new EventEmitter<any>();
  @Output() fileUploadChangeData = new EventEmitter<any>();

  @ViewChild(MatSelect) matSelect: MatSelect;

  public cmbDataListList: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  private _onDestroy = new Subject<void>();

  fileUploaderId = uuid();

  constructor() {
    if (this.comboModelData) {
      this.cmbDataListList.next(this.comboModelData.slice());
    }
    if (!this.isKeyValue) {
      this.isKeyValue = false;
    }
  }

  ngOnInit() {

  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.comboModelData && changes.comboModelData.currentValue) {
      this.cmbDataListList.next(this.comboModelData.slice());
    }
  }
  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }
  private cmbFilterChanged(value) {
    if (!this.comboModelData) {
      return;
    }
    // get the search keyword
    let search = value;
    if (!search) {
      this.cmbDataListList.next(this.comboModelData.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // let filterType = 'value';
    if (this.showType === 'luP_ID') {
      this.cmbDataListList.next(
        this.comboModelData.filter(item => item.luP_ID.toLowerCase().indexOf(search) > -1)
      );
    } else if (this.showType === 'luP_Code') {
      this.cmbDataListList.next(
        this.comboModelData.filter(item => item.luP_Code.toLowerCase().indexOf(search) > -1)
      );
    } else if (this.showType === 'key') {
      this.cmbDataListList.next(
        this.comboModelData.filter(item => item.key.toLowerCase().indexOf(search) > -1)
      );
    } else if (this.showType === 'value') {
      this.cmbDataListList.next(
        this.comboModelData.filter(item => item.value.toLowerCase().indexOf(search) > -1)
      );
    } else {
      this.cmbDataListList.next(
        this.comboModelData.filter(item => item.luP_ID.toLowerCase().indexOf(search) > -1 ||
          item.luP_Code.toLowerCase().indexOf(search) > -1)
      );
    }
  }
  selectionChange(value) {
    this.selectionchangedData.emit(value);
  }
  lookupClick(itemModel: ScreenEditComponentTreeData) {
    this.lookupClickData.emit({ lookupType: this.lookupType, lookupData: itemModel });
  }
  onFileUploadChange(files: File[]) {
    this.fileUploadChangeData.emit(files);
  }
}
