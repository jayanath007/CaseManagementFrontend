import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AppInfo } from '../../../safe-box-explorer-core';

@Component({
  selector: 'dps-template-directory-app-list',
  templateUrl: './template-directory-app-list.component.html',
  styleUrls: ['./template-directory-app-list.component.scss']
})
export class TemplateDirectoryAppListComponent implements OnInit {

  @Input() isLoading: boolean;
  @Input() appList: AppInfo[];
  @Input() selectedApp: AppInfo;
  @Input() isAppselect: boolean;
  @Input() isAppListExpand: boolean;

  @Output() selectApp = new EventEmitter<AppInfo>();
  @Output() toggleAppListExpand = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }
  expandCollapsed() {
    this.toggleAppListExpand.emit();
  }

  onSelectApp(app: AppInfo) {
    this.selectApp.emit(app);
  }
}
