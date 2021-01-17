import { Router } from '@angular/router';
import { MainMenuItem } from '../../models/interfaces';
import { Component, OnInit, Input, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { AccessControlService } from '../../../auth/services/access-control.service';
import { SettingKey } from '../../../core/lib/app-settings';

@Component({
  selector: 'dps-main-menu-mini-nav-list',
  templateUrl: './main-menu-mini-nav-list.component.html',
  styleUrls: ['./main-menu-mini-nav-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainMenuMiniNavListComponent implements OnInit {

  @Input() data;
  @Output() itemClick = new EventEmitter();
  @Input() activeOutlet;

  isPlotUser$ = new Observable<any>();

  constructor(private access: AccessControlService) { }

  ngOnInit() {
    this.isPlotUser$ = this.access.getSettingValue(SettingKey.IsPlotUser);
  }
  onItemClick(item, event: MouseEvent) {
    event.preventDefault();
    this.itemClick.emit(item);
  }
  // isActive(item: MainMenuItem<any>) {
  //   if (!item || !item.routerLink) {
  //     return false;
  //   }
  //   const routeStr = item.routerLink instanceof Array ? item.routerLink.join('/') : item.routerLink.toString();
  //   return item.outlet === this.activeOutlet && this.router.url.search(routeStr);
  // }
}
