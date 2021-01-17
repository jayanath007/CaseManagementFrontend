import { Component, OnInit, Input } from '@angular/core';
import { ScreenEditComponentTreeData } from '../../../core';

@Component({
  selector: 'dps-edit-screen-tab',
  templateUrl: './edit-screen-tab.component.html',
  styleUrls: ['./edit-screen-tab.component.scss']
})
export class EditScreenTabComponent implements OnInit {

  @Input() meta: ScreenEditComponentTreeData;
  @Input() modelData: any;
  @Input() tabIcon: any;
  @Input() hidden: boolean;
  @Input() disabled: boolean;
   @Input() customCaption?: string;

  constructor() { }

  ngOnInit() {
  }

}
