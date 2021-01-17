import { emit } from 'cluster';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ScreenEditComponentTreeData } from '../../../core';

@Component({
  selector: 'dps-edit-screen-radio-button',
  templateUrl: './edit-screen-radio-button.component.html',
  styleUrls: ['./edit-screen-radio-button.component.scss']
})
export class EditScreenRadioButtonComponent implements OnInit {

  @Input() meta: ScreenEditComponentTreeData;
  @Input() modelData: any;
  @Input() lableName?: string;
  @Input() hidden: boolean;
  @Input() disabled: boolean;

  @Output() inputValueChange = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }
  onChange(event) {
    this.inputValueChange.emit(event.value);
  }

}
