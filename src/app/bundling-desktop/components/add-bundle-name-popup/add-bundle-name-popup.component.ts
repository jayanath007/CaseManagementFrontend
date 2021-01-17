
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material';
import { InforDialogData, InforDialogComponent } from '../../../shared';
import { BundleTreeItem } from '../../../bundling-core/models/interface';

@Component({
  selector: 'dps-add-bundle-name-popup',
  templateUrl: './add-bundle-name-popup.component.html',
  styleUrls: ['./add-bundle-name-popup.component.scss']
})
export class AddBundleNamePopupComponent implements OnInit {

  constructor(private dialog: MatDialog) { }

  @Input() bundlingItemList: BundleTreeItem[];
  @Input() bundlingAllItemList: BundleTreeItem[];

  @Output() bundleNameEmit = new EventEmitter();
  @Output() nameTextSave = new EventEmitter<any>();
  @Output() okPopupData = new EventEmitter<any>();
  @Output() close = new EventEmitter();

  infoText = 'Please enter a name for the bundle. Change existing name to save as new profile';
  bundleNameInput = '';
  bundleObjectId;
  ngOnInit() {
    this.bundleNameInput = this.bundlingItemList.filter(item => item.isRoot)[0] ?
      this.bundlingItemList.filter(item => item.isRoot)[0].lable : '';
    this.bundleObjectId = this.bundlingItemList.filter(item => item.isRoot)[0] ?
      this.bundlingItemList.filter(item => item.isRoot)[0].id : null;
  }
  onNameChanged(nameText) {
    this.bundleNameInput = nameText;
  }
  onNameTextSave(event) {
    if (!this.bundleNameInput) {
      this.showMessageDialog('Send to Bundle', 'You must enter a bundle name.');
    } else {
      if (this.bundlingAllItemList && this.bundlingAllItemList.filter(i => !i.isRoot && !i.isFolder && !i.isCoverPage).length > 1) {
        this.okPopupData.emit({ bundleNameInput: this.bundleNameInput, bundleObjectId: this.bundleObjectId });
      } else {
        this.showMessageDialog('Bundle to PDF', 'You must select at least 2 documents to merge.');
      }
    }
  }
  onClose() {
    this.close.emit();
  }
  showMessageDialog(title, messageF) {
    const dialogData: InforDialogData = {
      content: {
        title: title,
        message: messageF
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
  }
}
