import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MainMenuItem } from './../../../layout-desktop/models/interfaces';
import { MatterSearchGridData } from '../../../core/lib/matter';
import { MainMenuItemResolverService } from '../../../layout-desktop';

@Component({
  selector: 'dps-matter-widget-layout',
  templateUrl: './matter-widget-layout.component.html',
  styleUrls: ['./matter-widget-layout.component.scss']
})
export class MatterWidgetLayoutComponent implements OnInit {

  @Input() isLoading: boolean;
  @Input() data: MatterSearchGridData[];
  @Input() layout: number;
  @Input() menuItem: MainMenuItem<any>[];
  @Output() myMatterView = new EventEmitter();
  @Output() openCase = new EventEmitter<MatterSearchGridData>();
  @Output() removeWidget = new EventEmitter();
  @Output() refreshData = new EventEmitter();

  constructor(private menu: MainMenuItemResolverService) { }

  get emptyList() {
    if (this.data && this.data.length < 4) {
      return Array(4 - this.data.length).fill('').map((x, i) => i);
    }
    return [];
  }

  get headerTitle(): string {
    return this.menuItem.find(i => i.id === 'matter_creation').label.replace('CREATION', '');
  }

  ngOnInit() {
  }

  onOpenCase(item: MatterSearchGridData) {
    this.openCase.emit(item);
  }

  goToMatterView() {
    this.myMatterView.emit();
  }

  onRemove() {
    this.removeWidget.emit();
  }
  resoleModuleName(menuId) {
    return this.menu.getModuleDisplayName(menuId);
  }
  onRefreshData() {
    this.refreshData.emit();
  }
}
