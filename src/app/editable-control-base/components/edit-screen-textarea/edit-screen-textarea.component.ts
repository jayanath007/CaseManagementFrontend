
import {debounceTime} from 'rxjs/operators';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ScreenEditComponentTreeData } from '../../../core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'dps-edit-screen-textarea',
  templateUrl: './edit-screen-textarea.component.html',
  styleUrls: ['./edit-screen-textarea.component.scss']
})
export class EditScreenTextareaComponent implements OnInit {


  @Input() meta: ScreenEditComponentTreeData;
  @Input() modelData: any;
  @Input() lableName?: string;
  @Input() hidden: boolean;
  @Input() disabled: boolean;

  @Output() inputValueChange = new EventEmitter<any>();

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
}
