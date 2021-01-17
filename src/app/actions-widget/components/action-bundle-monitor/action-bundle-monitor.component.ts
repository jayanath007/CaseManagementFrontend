import { Component, OnInit } from '@angular/core';
import { ActionWidgetItem } from '../../models/enum';

@Component({
  selector: 'dps-action-bundle-monitor',
  templateUrl: './action-bundle-monitor.component.html',
  styleUrls: ['./action-bundle-monitor.component.scss']
})
export class ActionBundleMonitorComponent implements OnInit {

  actionWidgetItem = ActionWidgetItem;

  constructor() { }

  ngOnInit() {
  }

}
