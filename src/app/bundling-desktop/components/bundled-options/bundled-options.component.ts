import { InfoDialogType } from './../../../core/utility/DpsUtility';
import { MatDialog } from '@angular/material';
import { Component, Input, EventEmitter, Output, OnInit } from '@angular/core';
import { BundleOption, BundleTreeItem, PreserveCheckboxProperty } from '../../../bundling-core/models/interface';
import { InforDialogData, InforDialogComponent, ConfirmDialogResult, ConfirmDialogResultKind } from '../../../shared';
import { PDFBundleHeaderViewModel } from '../../../core/lib/bundle';
import { OptionPageNoLoaction } from '../../../bundling-core/models/enum';
import { showInforDialog } from '../../../core/utility/DpsUtility';

@Component({
  selector: 'dps-bundled-options',
  templateUrl: './bundled-options.component.html',
  styleUrls: ['./bundled-options.component.scss']
})
export class BundledOptionsComponent implements OnInit {

  constructor(private dialog: MatDialog) { }

  @Input() isLoading: boolean;
  @Input() pageNoLoactions: { key: number, value: OptionPageNoLoaction }[];
  @Input() options: BundleOption;
  @Input() bundlingItemList: BundleTreeItem[];
  @Input() bundleHeaderView: PDFBundleHeaderViewModel;
  @Input() preserveExistingPage: PreserveCheckboxProperty;

  @Output() changeOption = new EventEmitter<{ key: string, value: any }>();
  @Output() submit = new EventEmitter();
  @Output() close = new EventEmitter();
  bundleObjectId = '';

  ngOnInit() {
    const bundleName = this.bundlingItemList.filter(item => item.isRoot)[0] ?
      this.bundlingItemList.filter(item => item.isRoot)[0].lable : '';
    this.onChangeOption('name', bundleName);
    this.bundleObjectId = this.bundlingItemList.filter(item => item.isRoot)[0] ?
      this.bundlingItemList.filter(item => item.isRoot)[0].id : null;
    if (this.preserveExistingPage && this.preserveExistingPage.checked) {
      this.onChangeOption('preserveExitPage', true);
      this.onChangeOption('restartPageNoAtSection', false);
    } else {
      this.onChangeOption('preserveExitPage', false);
      this.changeOption.emit({ key: 'pageNumberLocation', value: 4 });
    }
  }
  fileUpload(event) {
    if (event.srcElement.files[0]) {
      this.changeOption.emit({ key: 'coverPage', value: event.srcElement.files[0] });
    }
  }
  onUploadBTNClick() {
    const fileUploadInput = document.getElementById('bundleOptionFileUploader');
    fileUploadInput.click();
  }
  onChangeOption(key: string, value: any) {
    if (key === 'restartPageNoAtSection' && value && this.options.preserveExitPage) {
      const message = `'Restart Page Numbering at Section' will be turned off because it conflicts with 'Preserve Existing Pagination'`;
      showInforDialog('Page Pagination', message, InfoDialogType.alert, this.dialog).
        afterClosed().subscribe(dialogResult => {
          this.changeOption.emit({ key: key, value: false });
          this.changeOption.emit({ key: 'pageNumberLocation', value: 0 });
        });
    } else if (key === 'restartPageNoAtSection' && !value) {
      this.changeOption.emit({ key: 'pageNumberLocation', value: 0 });
    } else if (key === 'restartPageNoAtSection' && value) {
      this.changeOption.emit({ key: 'pageNumberLocation', value: 4 });
    } else {
      this.changeOption.emit({ key: key, value: value });
    }
  }
  onInputChangeOption(key: string, value: any) {
    this.options.name = value;
  }
  onSubmit() {
    if (!this.options.name) {
      const dialogData: InforDialogData = {
        content: {
          title: 'Send to Bundle',
          message: 'You must enter a bundle name.'
        },
        data: { messageType: 'alert' }
      };
      const dialogRef = this.dialog.open(InforDialogComponent, {
        data: dialogData,
        width: '400px',
        disableClose: true,
        hasBackdrop: true,
        panelClass: 'dps-notification'
      });
    } else {
      this.submit.emit({ bundleName: this.options.name, bundleObjectId: this.bundleObjectId });
    }
  }
  onClose() {
    this.close.emit();
  }
}
