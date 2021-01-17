import { Component, OnInit, Input } from '@angular/core';
import { ScreenEditComponentTreeData } from '../../../core';

@Component({
  selector: 'dps-edit-screen-lable',
  templateUrl: './edit-screen-lable.component.html',
  styleUrls: ['./edit-screen-lable.component.scss']
})
export class EditScreenLableComponent implements OnInit {

  @Input() meta: ScreenEditComponentTreeData;
  @Input() modelData: any;
  @Input() hidden: boolean;

  constructor() { }

  ngOnInit() {
  }

}
