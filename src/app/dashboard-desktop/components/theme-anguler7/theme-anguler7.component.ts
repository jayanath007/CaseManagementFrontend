import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { getItemActiveStateById, getTheme } from './../../../layout-desktop/reducers/index';
import { Theme } from '../dashboard-layout/enum';
import { AuthInfoStateService } from '../../../auth';
import { AppConfig } from '../../../core';

@Component({
  selector: 'dps-theme-anguler7',
  templateUrl: './theme-anguler7.component.html',
  styleUrls: ['./theme-anguler7.component.scss']
})
export class ThemeAnguler7Component implements OnInit {

  constructor(private store: Store<any>, public authHelper: AuthInfoStateService, public appConfig: AppConfig) { }

  @Input() layout: number;
  @Input() exceptionList: any[];

  @Output() dropItem = new EventEmitter();
  @Output() removeWidget = new EventEmitter();
  @Output() showErrorListSidenav = new EventEmitter();

  theme = Theme.Angular7;

  pressTimer: any;
  max = 100;
  min = 0;
  step = 1;
  value = 65;

  ngOnInit() {
  }

  isWidgetActive(id) {
    return this.store.select(getItemActiveStateById(id));
  }

  onDrop(meinMenuItem) {
    this.dropItem.emit(meinMenuItem);
  }

  onRemoveWidget(id) {
    this.removeWidget.emit(id);
  }

  onShowErrorListSidenav() {
    this.showErrorListSidenav.emit();
  }

}
