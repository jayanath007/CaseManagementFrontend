import { MatSelect } from '@angular/material';
import { Subject, ReplaySubject } from 'rxjs';
import { Component, OnInit, Input, EventEmitter, Output, OnDestroy, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { ScreenEditComponentTreeData } from '../../../core';

@Component({
  selector: 'dps-edit-screen-single-column-select',
  templateUrl: './edit-screen-single-column-select.component.html',
  styleUrls: ['./edit-screen-single-column-select.component.scss']
})
export class EditScreenSingleColumnSelectComponent implements OnInit, OnDestroy, OnChanges {

  @Input() noEntriesFoundLabel: string;
  @Input() placeholderLabel: string;
  @Input() meta?: ScreenEditComponentTreeData;
  @Input() modelData: any;
  @Input() comboModelData: any;
  @Input() columnName: string;
  @Input() lableName?: string;
  @Input() showType: string;
  @Input() hidden: boolean;
  @Input() disabled: boolean;
  @Input() forceSelectDataItem: any;
  @Input() filterFromPerent?: boolean;
  @Input() hiddenEmptyValue?: boolean;

  @Output() filterChangedItem = new EventEmitter<string>();
  @Output() selectionchangedData = new EventEmitter<any>();
  @Output() selectionChangedItem = new EventEmitter<any>();
  @Output() changeSearchKey = new EventEmitter<string>();



  @ViewChild(MatSelect) matSelect: MatSelect;

  enabaeForceDataItem = false;


  public cmbDataListList: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  private _onDestroy = new Subject<void>();

  constructor() {
    if (this.comboModelData) {
      this.cmbDataListList.next(this.comboModelData.slice());
    }
  }

  ngOnInit() {

  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.comboModelData && changes.comboModelData.currentValue) {
      this.cmbDataListList.next(this.comboModelData.slice());
    }

    if (this.forceSelectDataItem && changes.modelData && changes.modelData.currentValue) {
      if (this.comboModelData.filter(item => item.key === this.modelData).length === 0) {
        this.enabaeForceDataItem = true;
      }
    }


  }
  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  private cmbFilterChanged(value) {
    if (typeof value !== 'string') {
      return;
    }
    if (!this.comboModelData) {
      return;
    }
    // get the search keyword
    let search = value;
    if (!search) {
      this.cmbDataListList.next(this.comboModelData.slice());
      return;
    } else {
      search = search.toString().toLowerCase();
    }

    if (this.filterFromPerent) {
      this.changeSearchKey.emit(search);
      return;
    }

    // let filterType = 'value';
    if (this.showType === 'key') {
      this.cmbDataListList.next(
        this.comboModelData.filter(item => item.key.toString().toLowerCase().indexOf(search) > -1)
      );
    } else if (this.showType === 'value') {
      this.cmbDataListList.next(
        this.comboModelData.filter(item => item.value.toLowerCase().indexOf(search) > -1)
      );
    } else if (this.showType === 'valueANDdescription1') {
      this.cmbDataListList.next(
        this.comboModelData.filter(item => item.description1.toString().toLowerCase().indexOf(search) >
          -1 || item.value.toLowerCase().indexOf(search) > -1)
      );
    } else {
      this.cmbDataListList.next(
        this.comboModelData.filter(item => item.key.toString().toLowerCase().indexOf(search) >
          -1 || item.value.toLowerCase().indexOf(search) > -1)
      );
    }
    // filter the banks

  }

  // private filterChangedItemData(value) {
  //   this.filterChangedItem.emit(value);
  // }
  selectionChange(event) {
    this.selectionChangedItem.emit(event);
    this.selectionchangedData.emit(event.value);
  }
  closeSelector() {
    this.changeSearchKey.emit(null);
  }
}
