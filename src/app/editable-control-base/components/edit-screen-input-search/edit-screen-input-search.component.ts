
import {debounceTime} from 'rxjs/operators';
import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { ScreenEditComponentTreeData } from '../../../core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'dps-edit-screen-input-search',
  templateUrl: './edit-screen-input-search.component.html',
  styleUrls: ['./edit-screen-input-search.component.scss']
})
export class EditScreenInputSearchComponent implements OnInit {

  @Input() meta: ScreenEditComponentTreeData;
  @Input() modelData: any;
  @Input() lableName?: string;
  @Input() hidden: boolean;
  @Input() disabled: boolean;

  @Output() inputValueChange = new EventEmitter();
  @Output() searchClick = new EventEmitter();

  inputCtrl = new FormControl();

  constructor() {
  }

  ngOnInit() {
    this.inputCtrl.valueChanges.pipe(
      debounceTime(200))
      .subscribe((value: string) => {
        // this.inputValueChange.emit({ value: value, id: this.meta.scL_Name });
        this.inputValueChange.emit(value);
      });
  }
  onSearchClick(event) {
    this.searchClick.emit(event);
  }
}
