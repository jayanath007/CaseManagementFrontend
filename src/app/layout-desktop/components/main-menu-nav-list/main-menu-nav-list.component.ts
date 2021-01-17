import { Component, OnInit, Input, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { MenuGroups } from '../../models/enums';
import { AccessControlService } from '../../../auth/services/access-control.service';
import { Observable } from 'rxjs';
import { SettingKey } from '../../../core/lib/app-settings';

@Component({
  selector: 'dps-main-menu-nav-list',
  templateUrl: './main-menu-nav-list.component.html',
  styleUrls: ['./main-menu-nav-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainMenuNavListComponent implements OnInit {

  @Input() data;
  @Input() openCaseItems;
  @Input() activeOutlet;
  @Input() dashBoardWidgetList;
  @Output() itemClick = new EventEmitter();

  MenuGroups = MenuGroups;
  isPlotUser$ = new Observable<any>();

  constructor(private access: AccessControlService) { }

  ngOnInit() {
    this.isPlotUser$ = this.access.getSettingValue(SettingKey.IsPlotUser);
  }

  onItemClick(item, event: MouseEvent) {
    event.preventDefault();
    this.itemClick.emit(item);
  }
  onOpenInBrowser(item, event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.itemClick.emit({ ...item, group: item.group2, routerLink: item.routerLink2 });
  }


  isWidgetDeactive(data) {
    const menuItem = this.dashBoardWidgetList.find((item) => item.id === data.id);
    const dashBoardItem = this.data.find((item) => item.id === 'dashbord');
    const isSelectDashBoard = (dashBoardItem) ? dashBoardItem.isSelected : false;

    return (menuItem) ? (!menuItem.active && isSelectDashBoard) : false;
  }

  // isActive(item: MainMenuItem<any>) {
  //   if (!item || !item.routerLink) {
  //     return false;
  //   }
  //   const routeStr = item.routerLink instanceof Array ? item.routerLink.join('/') : item.routerLink.toString();
  //   return item.outlet === this.activeOutlet && this.router.url.search(routeStr);
  // }

}
