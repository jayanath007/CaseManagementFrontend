
import { debounceTime } from 'rxjs/operators';
import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ScreenEditComponentTreeData } from '../../../core';

@Component({
  selector: 'dps-edit-screen-text-input',
  templateUrl: './edit-screen-text-input.component.html',
  styleUrls: ['./edit-screen-text-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditScreenTextInputComponent implements OnInit, OnChanges {

  @Input() meta: ScreenEditComponentTreeData;
  @Input() modelData: any;
  @Input() lableName?: string;
  @Input() hidden: boolean;
  @Input() disabled: boolean;
  @Input() customCaption?: string;
  @Input() maxlength: any;

  @Output() inputValueChange = new EventEmitter<any>();
  @Output() blur = new EventEmitter<any>();

  inputCtrl = new FormControl();

  constructor() {
  }
  ngOnInit() {
    this.inputCtrl.valueChanges.pipe(
      debounceTime(200))
      .subscribe((value: string | number) => {
        // this.inputValueChange.emit({ value: value, id: this.meta.scL_Name });
        // if (this.maxlength && value.length > this.maxlength) {
        //   value = value.substring(0, 12);
        // }
        if (typeof value === 'number') {
          this.inputValueChange.emit(value);
        } else if (typeof value === 'string') {
          this.inputValueChange.emit(value.trim());
        } else {
          this.inputValueChange.emit('');
        }
      });
  }
  ngOnChanges(changes: SimpleChanges) {
    if ((this.disabled === true || this.disabled === false) ? this.disabled : this.meta ? this.meta.scL_ReadOnly : false) {
      this.inputCtrl.disable();
    } else {
      this.inputCtrl.enable();
    }
    if (changes.modelData) {
      this.inputCtrl.setValue(changes.modelData.currentValue);
    } else {
      this.inputCtrl.setValue(this.modelData);
    }
  }
  onblurInputData(value) {
    this.blur.emit(value);
  }
}
