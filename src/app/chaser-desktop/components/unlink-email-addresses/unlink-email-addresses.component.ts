import { Component, OnInit, Inject, EventEmitter, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { createDefultColumnDef } from '../../../core/lib/grid-helpers';
import { ColumnDef } from '../../../core/lib/grid-model';
import { OptionDialogOptionList } from '../../../shared';

@Component({
  selector: 'dps-unlink-email-addresses',
  templateUrl: './unlink-email-addresses.component.html',
  styleUrls: ['./unlink-email-addresses.component.scss']
})
export class UnlinkEmailAddressesComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public inputData: any, public dialogRef: MatDialogRef<UnlinkEmailAddressesComponent>) { }

  oneToOneTypeList: any[] = [];
  otherTypeList: any[] = [];

  @Output() onLink = new EventEmitter<any>();

  ngOnInit() {
    this.oneToOneTypeList = [];
    this.otherTypeList = [];
    if (this.inputData && this.inputData.haveOneToOneTypes) {
      this.inputData.isMultipleSelect = false;
      this.inputData.contactEmailsViewModel.forEach(emailItem => {
        this.inputData.oneToOneTypeListViewModel.forEach(oneToOneItem => {
          if (emailItem.type === oneToOneItem.type) {
            emailItem.isSingle = true;
            emailItem.isOneToOneItem = true;
            emailItem.isSelect = false;
            emailItem.isReplase = false;
            emailItem.unableToLinkContact = false;
            this.oneToOneTypeList.push(emailItem);
          } else {
            this.otherTypeList.push(emailItem);
            emailItem.isSelect = false;
          }
        });
      });
    } else {
      this.inputData.isMultipleSelect = true;
      this.inputData.contactEmailsViewModel.forEach(dataItem => {
        dataItem.isSelect = true;
      });
    }
  }
  // tslint:disable-next-line:member-ordering
  gridColumns: ColumnDef[] = [
    createDefultColumnDef('EmailAddress',
      { label: 'Email Address', fxFlex: '', filterAnchor: 'start', filterHidden: true, disableShort: true }),
    createDefultColumnDef('RoleOnFile ',
      //   { label: 'Role on file', fxFlex: '100px', filterAnchor: 'start', filterHidden: true, disableShort: true }),
      // createDefultColumnDef('Action',
      { label: 'Action', fxFlex: '100px', filterAnchor: 'start', filterHidden: true, disableShort: true })
  ];

  getFxFlexProperty(index) {
    return this.gridColumns[index].extras.fxFlex;
  }
  onLinkContact() {
    const selectedEmailList: any[] = [];
    this.inputData.contactEmailsViewModel.forEach(item => {
      if (item.isSelect) {
        selectedEmailList.push(item);
      }
    });
    if (selectedEmailList && selectedEmailList.length > 0) {
      this.onLink.emit(selectedEmailList);
    }
    setTimeout(() => {
      this.dialogRef.close();
    }, 500);
  }
  selectItem(outItem: any) {
    if (this.inputData && !this.inputData.isMultipleSelect && this.inputData.haveOneToOneTypes) {
      if (outItem && outItem.isOneToOneItem) {
        this.inputData.contactEmailsViewModel.forEach(emailitem => {
          if (emailitem.type === outItem.type) {
            const selectedTypeItem = this.inputData.oneToOneTypeListViewModel.filter(TypeItem => TypeItem.type === outItem.type);
            if (emailitem.email === outItem.email && selectedTypeItem && selectedTypeItem.length > 0) {
              emailitem.isSelect = !emailitem.isSelect;
              emailitem.isReplase = selectedTypeItem[0].haveContact;
              emailitem.unableToLinkContact = selectedTypeItem[0].unableToLinkContact;
            } else {
              emailitem.isSelect = false;
            }
          } else {
            emailitem.isSelect = emailitem.isSelect;
          }
        });

        // this.inputData.oneToOneTypeListViewModel.forEach(oneToOneitem => {
        //   this.inputData.contactEmailsViewModel.map(oneToOneSingleItem => {
        //     if (oneToOneSingleItem && oneToOneSingleItem.isSingle && oneToOneSingleItem.type === oneToOneitem.type) {
        //       if (item.email === oneToOneSingleItem.email) {
        //         oneToOneSingleItem.isSelect = !oneToOneSingleItem.isSelect;
        //         oneToOneSingleItem.isReplase = oneToOneitem.haveContact;
        //         oneToOneSingleItem.unableToLinkContact = oneToOneitem.unableToLinkContact;
        //       } else {
        //         oneToOneSingleItem.isSelect = false;
        //       }
        //     } else if (oneToOneSingleItem && !oneToOneSingleItem.isSingle && item.email === oneToOneSingleItem.email) {
        //       if (!oneToOneSingleItem.isSelect) { oneToOneSingleItem.isSelect = false; }
        //       oneToOneSingleItem.isSelect = !oneToOneSingleItem.isSelect;
        //     } else {
        //       oneToOneSingleItem.isSelect = oneToOneSingleItem.isSelect;
        //     }
        //   });
        // });
      } else {
        this.inputData.contactEmailsViewModel.forEach(dataItem => {
          if (dataItem.email === outItem.email) {
            dataItem.isSelect = !dataItem.isSelect;
          } else {
            dataItem.isSelect = dataItem.isSelect;
          }
        });
      }
    } else if (this.inputData && this.inputData.isMultipleSelect && !this.inputData.haveOneToOneTypes) {
      this.inputData.contactEmailsViewModel.forEach(dataItem => {
        if (dataItem.email === outItem.email) {
          dataItem.isSelect = !dataItem.isSelect;
        } else {
          dataItem.isSelect = dataItem.isSelect;
        }
      });
    }
  }

  onClose() {
    this.dialogRef.close();
  }

}
