import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ScreenEditComponentTreeData } from '../../../core';

@Component({
  selector: 'dps-edit-screen-button',
  templateUrl: './edit-screen-button.component.html',
  styleUrls: ['./edit-screen-button.component.scss']
})
export class EditScreenButtonComponent implements OnInit {

  @Input() meta: ScreenEditComponentTreeData;
  @Input() modelData: any;
  @Input() hidden: boolean;
  @Input() disabled: boolean;

  @Output() onButtonClickData = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }
  onButtonClick(event) {
    this.onButtonClickData.emit(event);
  }

}
