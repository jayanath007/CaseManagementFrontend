
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { getItemActiveStateById } from './../../../layout-desktop/reducers/index';
import { AuthInfoStateService } from '../../../auth';
import { AppConfig } from '../../../core';
import { Theme } from '../dashboard-layout/enum';
import { SystemJsPopupLoaderService } from '../../../shell-desktop';
// import { CivilManagementModuleInput } from '../../../civil-class-management';

@Component({
  selector: 'dps-theme-classic',
  templateUrl: './theme-classic.component.html',
  styleUrls: ['./theme-classic.component.scss']
})
export class ThemeClassicComponent implements OnInit {

  constructor(private store: Store<any>, public authHelper: AuthInfoStateService, public appConfig: AppConfig
    , private popupService: SystemJsPopupLoaderService) { }

  @Input() layout: number;
  @Input() exceptionList: any[];

  @Output() dropItem = new EventEmitter();
  @Output() removeWidget = new EventEmitter();
  @Output() showErrorListSidenav = new EventEmitter();

  theme = Theme.Classic;

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

  onDrop(event) {
    this.dropItem.emit(event.dragData);
  }

  onRemoveWidget(id) {
    this.removeWidget.emit(id);
  }

  onShowErrorListSidenav() {
    this.showErrorListSidenav.emit();
  }

  // openPopup() {
  //   const civilManagementModuleInput: CivilManagementModuleInput = {
  //     appId: 11,
  //     branchId: 1,
  //     fileId: 30610
  //   };
  //   this.popupService.civilClassManagement('token', civilManagementModuleInput);
  // }

}
