import { Observable } from 'rxjs';
import { AccessControlService } from './../../../auth/services/access-control.service';
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { SettingKey } from '../../../core/lib/app-settings';
import { TreeDataWrapper } from '../../models/interfce';
import { TreeItemType } from '../../models/enums';

@Component({
  selector: 'dps-forms-library-tree-details',
  templateUrl: './forms-library-tree-details.component.html',
  styleUrls: ['./forms-library-tree-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormsLibraryTreeDetailsComponent implements OnInit {

  @Input() selectedMenuChildList: TreeDataWrapper[];

  @Output() treeItemClick = new EventEmitter<any>();
  @Output() runWorkFlow = new EventEmitter<any>();
  @Output() detailViewItemClick = new EventEmitter<any>();
  @Output() selectedDetailItem = new EventEmitter<any>();

  TreeItemType = TreeItemType;

  selectedItem;
  focusedIdx = 0;
  amendScreensWorkflow$ = new Observable<any>();

  constructor(private dialog: MatDialog, private contolleSetting: AccessControlService) { }

  ngOnInit() {
    this.amendScreensWorkflow$ = this.contolleSetting.getSettingValue(SettingKey.AmendScreensWorkflow);
  }
  onDetailViewItemClick(event, item: TreeDataWrapper) {
    if (item.nodeType === TreeItemType.Folder) {
      this.selectedItem = item;
      this.detailViewItemClick.emit(item);
      this.selectedDetailItem.emit(item);
    } else {
      this.selectedItem = item;
      this.runWorkFlow.emit(item);
      this.selectedDetailItem.emit(item);
    }
  }
  itemSelect(item: TreeDataWrapper) {
    this.selectedItem = item;
    this.selectedDetailItem.emit(item);
  }
  upDownClick(event, item: TreeDataWrapper, index: number) {
    // if (event.keyCode === 38 && this.selectedMenuChildList.find((val, i) => i === index - 1)) {
    //   this.selectedItem = this.selectedMenuChildList.find((val, i) => i === index - 1);
    //   const element = <HTMLInputElement>document.getElementById((index - 1).toString());
    //   if (element) {
    //     element.focus();
    //   }
    // }
    // if (event.keyCode === 40 && this.selectedMenuChildList.find((val, i) => i === index + 1)) {
    //   this.selectedItem = this.selectedMenuChildList.find((val, i) => i === index + 1);
    //   const element = <HTMLInputElement>document.getElementById((index + 1).toString());
    //   if (element) {
    //     element.focus();
    //   }
    // }
  }
}

