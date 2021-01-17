import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DropdownListData } from '../../../core';
import { TemplateFilterByCheckoutType, AppInfo } from '../../../safe-box-explorer-core';
import { MatSlideToggleChange } from '@angular/material';

@Component({
  selector: 'dps-template-directory-header',
  templateUrl: './template-directory-header.component.html',
  styleUrls: ['./template-directory-header.component.scss']
})
export class TemplateDirectoryHeaderComponent implements OnInit {

  @Input() selectedApp: AppInfo;
  @Input() sort: string;
  @Input() filter: TemplateFilterByCheckoutType;
  @Input() searchText: string;
  @Input() showCommonTemplates: boolean;
  @Input() isLocationMatch: boolean;

  @Output() changeSort = new EventEmitter<string>();
  @Output() changeFilter = new EventEmitter<TemplateFilterByCheckoutType>();
  @Output() changeSearchText = new EventEmitter<string>();
  @Output() refresh = new EventEmitter<AppInfo>();
  @Output() changeShowCommonTemplates = new EventEmitter<boolean>();


  TemplateFilterByCheckoutType = TemplateFilterByCheckoutType;

  constructor() { }

  ngOnInit() {
  }

  onRefresh() {
    this.refresh.emit(this.selectedApp);
  }

  onChangeSort() {
    this.changeSort.emit(this.sort === 'asc' ? 'desc' : 'asc');
  }

  onChangeFilter(value: TemplateFilterByCheckoutType) {
    this.changeFilter.emit(value);
  }

  onChangeSearchText(value: string) {
    this.changeSearchText.emit(value);
  }

  onChangeShowCommonTemplates(event: MatSlideToggleChange) {
    this.changeShowCommonTemplates.emit(event.checked);
  }
}
