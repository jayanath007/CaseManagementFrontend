import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { GridData } from '../../models/interfce';
import { BtnOption } from '../../models/enumeration';
import { SettingKey } from '../../../core/lib/app-settings';
import { AccessControlService } from '../../../auth/services/access-control.service';

@Component({
  selector: 'dps-my-task-widget-item',
  templateUrl: './my-task-widget-item.component.html',
  styleUrls: ['./my-task-widget-item.component.scss']
})
export class MyTaskWidgetItemComponent implements OnInit {

  @Input() item: GridData;
  @Output() clickOptionBtn = new EventEmitter<any>();
  btnOption = BtnOption;
  settingKey = SettingKey;

  constructor(private access: AccessControlService) { }

  ngOnInit() {
  }

  onOptionBtnClick(kind: BtnOption, data: GridData) {
    this.clickOptionBtn.emit({ option: kind, item: data });
  }

  getSettingValue(key: SettingKey) {
    return this.access.getSettingValue(key);
  }

}
