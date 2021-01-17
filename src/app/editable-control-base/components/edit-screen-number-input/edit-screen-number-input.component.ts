
import {debounceTime} from 'rxjs/operators';
import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy, SimpleChanges, OnChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ScreenEditComponentTreeData } from '../../../core';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'dps-edit-screen-number-input',
  templateUrl: './edit-screen-number-input.component.html',
  styleUrls: ['./edit-screen-number-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditScreenNumberInputComponent implements OnInit, OnChanges {

  @Input() meta: ScreenEditComponentTreeData;
  @Input() modelData: number;
  @Input() lableName?: string;
  @Input() hidden: boolean;
  @Input() disabled: boolean;
  @Input() customCaption?: string;
  @Input() currencySymbols?: string;

  @Output() inputValueChange = new EventEmitter<any>();
  @Output() blur = new EventEmitter<any>();

  inputCtrl = new FormControl();
  // get _modelData() {
  //   if (this.modelData) {
  //     return parseFloat(this.modelData.toString()).toFixed(2);
  //   }
  //   return null;
  // }
  constructor(private decimalPipe: DecimalPipe) {
  }

  ngOnInit() {
    this.inputCtrl.valueChanges.pipe(
      debounceTime(500))
      .subscribe((value: number) => {
        // this.inputValueChange.emit({ value: value, id: this.meta.scL_Name });
        // debugger;
        // const textBoxVal = this.decimalPipe.transform(value, '.2-2');
        // this.inputValueChange.emit(value ? value.toFixed(2) : (value === 0) ? 0.00 : 0.00);
        // this.inputValueChange.emit(value);
      });
  }
  ngOnChanges(changes: SimpleChanges) {
    if ((this.disabled === true || this.disabled === false) ? this.disabled : this.meta ? this.meta.scL_ReadOnly : false) {
      this.inputCtrl.disable();
    } else {
      this.inputCtrl.enable();
    }
    if (changes.modelData && changes.modelData.currentValue) {
      this.inputCtrl.setValue(parseFloat(changes.modelData.currentValue.toString()).toFixed(2));
    } else {
      if (this.modelData) {
        this.inputCtrl.setValue(parseFloat(this.modelData.toString()).toFixed(2));
      } else {
        this.inputCtrl.setValue(null);
      }

    }
  }
  onblurInputData() {
    this.inputValueChange.emit(parseFloat(parseFloat(this.inputCtrl.value).toFixed(2)));
  }
}
