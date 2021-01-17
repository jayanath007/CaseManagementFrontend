import { ReplaySubject ,  Subject } from 'rxjs';
import { Component, OnInit, EventEmitter, Output, Input, OnDestroy, SimpleChanges, OnChanges } from '@angular/core';
import { ScreenEditComponentTreeData } from '../../../core';

@Component({
  selector: 'dps-edit-screen-unbind-select',
  templateUrl: './edit-screen-unbind-select.component.html',
  styleUrls: ['./edit-screen-unbind-select.component.scss']
})
export class EditScreenUnbindSelectComponent implements OnInit, OnDestroy, OnChanges {
  @Input() noEntriesFoundLabel: string;
  @Input() placeholderLabel: string;
  @Input() meta: ScreenEditComponentTreeData;
  @Input() modelData: any;
  @Input() comboModelData: any;
  @Input() columnName: string;
  @Input() lableName?: string;
  @Input() showType: string;
  @Input() disabled: boolean;


  @Output() filterChangedItem = new EventEmitter<string>();
  @Output() selectionchangedData = new EventEmitter<any>();

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

  public cmbFilterChanged(value) {
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
    if (this.showType === 'key') {
      this.cmbDataListList.next(
        this.comboModelData.filter(item => item.key.toLowerCase().indexOf(search) > -1)
      );
    } else if (this.showType === 'value') {
      this.cmbDataListList.next(
        this.comboModelData.filter(item => item.value.toLowerCase().indexOf(search) > -1)
      );
    } else {
      this.cmbDataListList.next(
        this.comboModelData.filter(item => item.value.toLowerCase().indexOf(search) > -1)
      );
    }
    // filter the banks

  }

  // private filterChangedItemData(value) {
  //   this.filterChangedItem.emit(value);
  // }
  selectionChange(value) {
    this.selectionchangedData.emit(value);
  }

}
