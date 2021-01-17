import { Observable } from 'rxjs';
import { AccessControlService } from './../../../auth/services/access-control.service';
import { WorkflowMenuMetaDataWrapper } from '../../../workflow-menu-core/models/interfaces';
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { InforDialogData, InforDialogComponent } from '../../../shared';
import { MatDialog } from '@angular/material';
import { MatDialogMessage } from '../../../workflow-menu-core/models/enums';
import { SettingKey } from '../../../core/lib/app-settings';

@Component({
  selector: 'dps-workflow-menu-view-details',
  templateUrl: './workflow-menu-view-details.component.html',
  styleUrls: ['./workflow-menu-view-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkflowMenuViewDetailsComponent implements OnInit {

  @Input() selectedMenuChildList: WorkflowMenuMetaDataWrapper[];
  @Input() isCommandColumnShow: boolean;
  @Input() gridFontSize: any;
  @Input() searchText: string;

  @Output() menuViewItem = new EventEmitter<any>();
  @Output() runWorkFlow = new EventEmitter<any>();
  @Output() editTemplate = new EventEmitter<any>();
  @Output() downloadTemplate = new EventEmitter<any>();
  @Output() onCheckin = new EventEmitter<WorkflowMenuMetaDataWrapper>();
  @Output() onDiscardCheckin = new EventEmitter<WorkflowMenuMetaDataWrapper>();
  @Output() detailSelectedItem = new EventEmitter<WorkflowMenuMetaDataWrapper>();

  selectedItem;
  focusedIdx = 0;
  amendScreensWorkflow$ = new Observable<any>();

  constructor(private dialog: MatDialog, private contolleSetting: AccessControlService) { }

  ngOnInit() {
    this.amendScreensWorkflow$ = this.contolleSetting.getSettingValue(SettingKey.AmendScreensWorkflow);
  }
  menuViewItemClick(event, item: WorkflowMenuMetaDataWrapper) {
    if (item.data.nodeStatus === 2) {
      const dialogData: InforDialogData = {
        content: {
          title: MatDialogMessage.title,
          message: MatDialogMessage.message
        },
        data: { messageType: 'general' }
      };
      this.dialog.open(InforDialogComponent, {
        data: dialogData,
        width: '400px',
        disableClose: true,
        hasBackdrop: true,
        panelClass: 'dps-notification'
      });
    } else {
      if (item.data.atN_Type === 1) {
        event.preventDefault();
        event.stopPropagation();
        this.menuViewItem.emit(item);
      } else {
        this.runWorkFlow.emit(item);
      }
      this.selectedItem = item;
      this.detailSelectedItem.emit(item);
    }
  }
  itemSelect(item: WorkflowMenuMetaDataWrapper) {
    this.selectedItem = item;
    this.detailSelectedItem.emit(item);
  }

  isCheckoutFile(item: WorkflowMenuMetaDataWrapper) {
    return this.isCheckoutByMe(item) || item.data.checkedOutByUser && item.data.checkedOutByUser !== '';
  }

  isCheckoutByMe(item: WorkflowMenuMetaDataWrapper) {
    return item.data.checkedOutHashKey && item.data.checkedOutHashKey !== '';
  }

  doCheckin(item) {
    this.onCheckin.emit(item);
  }

  doDiscardCheckin(item) {
    this.onDiscardCheckin.emit(item);
  }

  onEditTemplate(event, item: WorkflowMenuMetaDataWrapper) {
    event.preventDefault();
    event.stopPropagation();
    this.selectedItem = item;
    this.editTemplate.emit(item);
  }

  onDownloadTemplate(event, item: WorkflowMenuMetaDataWrapper) {
    event.preventDefault();
    event.stopPropagation();
    this.selectedItem = item;
    this.downloadTemplate.emit(item);
  }
  upDownClick(event, item: WorkflowMenuMetaDataWrapper, index: number) {
    if (event.keyCode === 38 && this.selectedMenuChildList.find((val, i) => i === index - 1)) {
      this.selectedItem = this.selectedMenuChildList.find((val, i) => i === index - 1);
      const element = <HTMLInputElement>document.getElementById((index - 1).toString());
      if (element) {
        element.focus();
      }
    }
    if (event.keyCode === 40 && this.selectedMenuChildList.find((val, i) => i === index + 1)) {
      this.selectedItem = this.selectedMenuChildList.find((val, i) => i === index + 1);
      const element = <HTMLInputElement>document.getElementById((index + 1).toString());
      if (element) {
        element.focus();
      }
    }
  }

  isPDF(menuItem: WorkflowMenuMetaDataWrapper): boolean {
    if (menuItem && menuItem.data && !!menuItem.data.atN_Command) {
      return !!menuItem.data.atN_Command.toLocaleLowerCase().endsWith('.pdf') ? true : false;
    }
    return false;
  }
}

