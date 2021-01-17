import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ScreenEditComponentTreeData } from '../../../core';

@Component({
  selector: 'dps-edit-screen-editable-dropdown',
  templateUrl: './edit-screen-editable-dropdown.component.html',
  styleUrls: ['./edit-screen-editable-dropdown.component.scss']
})
export class EditScreenEditableDropdownComponent implements OnInit {

  constructor() { }

  @Input() meta: ScreenEditComponentTreeData;
  @Input() modelData: any;
  @Input() lableName?: string;
  @Input() hidden: boolean;
  @Input() disabled: boolean;
  @Input() customCaption?: string;
  @Input() maxlength: any;
  @Input() detailList: string[];
  @Output() inputValueChange = new EventEmitter<string>();

  ngOnInit() {
  }

  onChangeDetails(value) {
    this.inputValueChange.emit(value);
  }

}
