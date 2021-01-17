import { MatRadioGroup } from '@angular/material';
import { Department } from '../../../matter-search-core/models/interfaces';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MainMenuItemResolverService } from '../../../layout-desktop';

@Component({
  selector: 'dps-matter-search-header',
  templateUrl: './matter-search-header.component.html',
  styleUrls: ['./matter-search-header.component.scss']
})
export class MatterSearchHeaderComponent implements OnInit {
  @Input() homeCurrancy;
  @Input() totalBillsOutstanding;
  @Input() totalMatterCount;
  @Input() activeView;
  @Input() departmentList: Department[];
  @Input() selectedDepartment;
  @Input() matterDisplyName: string;


  @Output() updateSelectedDepartment = new EventEmitter<Department>();
  @Output() viewChange = new EventEmitter();


  constructor(private menu: MainMenuItemResolverService) { }

  ngOnInit() {
  }

  onDepartmentChange(value) {
    this.updateSelectedDepartment.emit(value);
  }
  resoleModuleName(menuId) {
    return this.menu.getModuleDisplayName(menuId);
  }
}
