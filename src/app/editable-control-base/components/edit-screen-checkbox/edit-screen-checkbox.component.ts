import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ScreenEditComponentTreeData } from '../../../core';

@Component({
  selector: 'dps-edit-screen-checkbox',
  templateUrl: './edit-screen-checkbox.component.html',
  styleUrls: ['./edit-screen-checkbox.component.scss']
})
export class EditScreenCheckboxComponent implements OnInit {

  @Input() meta: ScreenEditComponentTreeData;
  @Input() modelData: any;
  @Input() lableName?: string;
  @Input() hidden: boolean;
  @Input() disabled: boolean;
  @Input() labelPosition: string;
  @Input() priorityToLableName: boolean;


  @Output() valueChange = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }
  onChange(event) {
    this.valueChange.emit(event.checked);
  }
}
