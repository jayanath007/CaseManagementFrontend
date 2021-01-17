
import { Subject, ReplaySubject } from 'rxjs';
import { Component, OnInit, Input, EventEmitter, Output, OnDestroy, ViewChild, SimpleChanges, OnChanges } from '@angular/core';
import { ScreenEditComponentTreeData, LookupList } from '../../../core';
import { MatSelect } from '@angular/material';

@Component({
  selector: 'dps-edit-screen-lookup-select',
  templateUrl: './edit-screen-lookup-select.component.html',
  styleUrls: ['./edit-screen-lookup-select.component.scss']
})
export class EditScreenLookupSelectComponent implements OnInit, OnDestroy, OnChanges {

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
  @Input() lookupType: any;
  @Input() isLookupLinkDisable: boolean;

  @Output() filterChangedItem = new EventEmitter<string>();
  @Output() selectionchangedData = new EventEmitter<any>();
  @Output() lookupClickData = new EventEmitter<any>();

  @ViewChild(MatSelect) matSelect: MatSelect;

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
  }
  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }
  lookupClick(itemModel: ScreenEditComponentTreeData, e) {
    e.preventDefault();
    e.stopPropagation();
    this.lookupClickData.emit({ lookupType: this.lookupType, lookupData: itemModel });
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
    } else {
      this.cmbDataListList.next(
        this.comboModelData.filter(item => item.luP_ID.toLowerCase().indexOf(search) > -1
          || item.luP_Code.toLowerCase().indexOf(search) > -1)
      );
    }
  }

  selectionChange(value) {
    this.selectionchangedData.emit(value);
  }
}
