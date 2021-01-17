import {
  Component, OnInit, Input, Output, EventEmitter, ViewChild, OnChanges,
  SimpleChanges, ChangeDetectionStrategy
} from '@angular/core';
import { MatterViews } from '../../../matter-search-core';
import { ClientMenu } from '../../../client-search-core/models/enums';
import { Module, SettingKey } from '../../../core/lib/app-settings';
import { AccessControlService } from './../../../auth/services/access-control.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'dps-client-search-views',
  templateUrl: './client-search-views.component.html',
  styleUrls: ['./client-search-views.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClientSearchViewsComponent implements OnInit, OnChanges {
  @Input() showSearchHint: boolean;
  @Input() searchText: string;
  @Input() totalItems: Number;
  @Input() clientCreationTitle: string;
  @Input() clientDisplyName: string;

  @Output() updateSelectedSearchTextClick = new EventEmitter<string>();
  @Output() updateSelectedSearchTextChange = new EventEmitter<string>();
  @Output() updateSelectedSearchTextClear = new EventEmitter<string>();

  @Output() fontSizeClassChangeValue = new EventEmitter<string>();
  @Output() refresh = new EventEmitter();
  @Output() clickClientMenu = new EventEmitter<ClientMenu>();

  MatterViews = MatterViews;
  fontSize: number;
  fontSizeClassTag: string;
  buttonActiveClass: string;
  clientMenu = ClientMenu;
  module = Module;
  isPlotUser$ = new Observable<any>();

  constructor(private access: AccessControlService) { }

  ngOnInit() {
    this.isPlotUser$ = this.access.getSettingValue(SettingKey.IsPlotUser);
    this.fontSize = 0;
    this.fontSizeClassTag = 'font-increment-';
    this.buttonActiveClass = '';
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.activeView && changes.activeView.currentValue) {
    }
  }

  onSearchTextChanged(event) {
    this.updateSelectedSearchTextChange.emit(event);
  }

  onSearchTextTextClick(event) {
    this.updateSelectedSearchTextClick.emit(event);
  }

  onSearchTextClear(event) {
    this.updateSelectedSearchTextClear.emit(event);
  }


  onFontSizeMinusClick() {
    if (this.fontSize > -4) {
      this.buttonActiveClass = 'active';
      this.fontSize -= 1;
      this.fontSizeClassChangeValue.emit(this.fontSizeClassTag + this.fontSize);
    }
  }
  onFontSizeResetClick() {
    this.buttonActiveClass = '';
    this.fontSizeClassChangeValue.emit(this.fontSizeClassTag + 0);
    this.fontSize = 0;
  }
  onFontSizePlusClick() {
    if (this.fontSize < 4) {
      this.buttonActiveClass = 'active';
      this.fontSize += 1;
      this.fontSizeClassChangeValue.emit(this.fontSizeClassTag + this.fontSize);
    }
  }
  onRefresh() {
    this.refresh.emit();
    // this.showSearchHint = true;
  }

  onClickClientMenu(kind: ClientMenu) {
    this.clickClientMenu.emit(kind);
  }

  moduleIsActive(module: Module) {
    return this.access.checkModuleIsActive(module);
  }

}
