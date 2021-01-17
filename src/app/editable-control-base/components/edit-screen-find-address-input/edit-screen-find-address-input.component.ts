
import {debounceTime} from 'rxjs/operators';
import { Component, OnInit, OnChanges, Input, EventEmitter, Output, SimpleChanges } from '@angular/core';
import { ScreenEditComponentTreeData } from '../../../core';
import { FormControl } from '@angular/forms';
import { Address } from '../../../shared/models/interface';

@Component({
  selector: 'dps-edit-screen-find-address-input',
  templateUrl: './edit-screen-find-address-input.component.html',
  styleUrls: ['./edit-screen-find-address-input.component.scss']
})
export class EditScreenFindAddressInputComponent implements OnInit, OnChanges {


  @Input() meta: ScreenEditComponentTreeData;
  @Input() modelData: any;
  @Input() lableName?: string;
  @Input() hidden: boolean;
  @Input() disabled: boolean;
  @Input() customCaption?: string;
  @Input() maxlength: any;

  @Output() inputValueChange = new EventEmitter<any>();
  @Output() blur = new EventEmitter<any>();
  @Output() changeAddress = new EventEmitter<Address>();

  inputCtrl = new FormControl();

  constructor() {
  }
  ngOnInit() {
    this.inputCtrl.valueChanges.pipe(
      debounceTime(200))
      .subscribe((value: string) => {
        this.inputValueChange.emit(value);
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

  autofillAddress(address: Address) {
    this.inputCtrl.setValue(this.inputCtrl.value, { emitEvent: false });
    // this.inputCtrl.setValue(address.postCode, { emitEvent: false });
    this.changeAddress.emit(address);
  }

}
