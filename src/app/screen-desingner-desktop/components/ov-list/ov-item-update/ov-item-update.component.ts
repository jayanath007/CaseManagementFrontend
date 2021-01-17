import { OvItem } from '../../../../screen-desingner-core/models/application-component';
import { Component, OnInit, Inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { RowOvItemChangeKind } from '../../../../screen-desingner-core/actions/core';
import { UiComponentType, SCREEN_FIELD_TYPE_LIST } from '../../../../screen-view-core/models/screen-contaner-component';
import { ScreenContactFieldTypeDto } from '../../../../screen-view-core/models/screen-definition';
import { ConfirmDialogData, ConfirmDialogComponent, ConfirmDialogResultKind } from '../../../../shared';
import { InforDialogComponent } from '../../../../shared/components/infor-dialog/infor-dialog.component';


@Component({
  selector: 'dps-ov-item-update',
  templateUrl: './ov-item-update.component.html',
  styleUrls: ['./ov-item-update.component.scss']
})
export class OvItemUpdateComponent implements OnInit {


  screenContactFieldTypes: ScreenContactFieldTypeDto[] = [];
  fieldTypeList = SCREEN_FIELD_TYPE_LIST;


  ovItem: OvItem;
  fieldModel: { fieldTypeId: UiComponentType, fieldTypeName: string };
  ovItemList;
  constructor(private store: Store<any>, @Inject(MAT_DIALOG_DATA) public data: { ovItem: OvItem, ovItemList: Array<OvItem> },
    public dialogRef: MatDialogRef<OvItemUpdateComponent>, public dialog: MatDialog) {
    this.ovItem = data.ovItem;
    this.ovItemList = data.ovItemList;
  }

  ngOnInit() {

  }



  get disableDescription() {
    return this.autoDescriptionType(this.ovItem.fieldType);
  }

  autoDescriptionType(uiComponentType) {
    if (uiComponentType === UiComponentType.PostCode
      // || uiComponentType === UiComponentType.CliAttachment
    ) {
      return true;
    }
    return false;
  }

  onFieldTypeChange(event) {

    if (this.autoDescriptionType(event.value)) {
      const description = this.getDiscriptionText(event.value);
      const message = 'Label description will change to ' + description + '. Need to proceed?';
      const dialogData: ConfirmDialogData = {
        content: {
          title: 'Screen Designer',
          message: message,
          acceptLabel: 'OK',
          rejectLabel: 'Cancel'
        },
        data: null
      };
      const confirmDialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: dialogData,
        disableClose: true,
        width: '350px',

        panelClass: 'dps-notification'
      });
      confirmDialogRef.afterClosed().subscribe(dialogResult => {
        if (dialogResult.kind !== ConfirmDialogResultKind.Confirmed) {
          this.ovItem.fieldType = this.ovItem.screenComponentDto.avD_Type;
        } else {
          this.ovItem.description = description;
        }
      });
    }
    if (event.value === UiComponentType.MatAttachment) {
      this.ovItem.help = 'Upload Mat Attachment';
    } else if (event.value === UiComponentType.CliAttachment) {
      this.ovItem.help = 'Upload Cli Attachment';
    }
  }

  getDiscriptionText(ciComponentType) {
    let text = '';
    // if (ciComponentType === UiComponentType.AddressSearch) {
    //   text = 'Address Search';
    // }
    if (ciComponentType === UiComponentType.PostCode) {
      text = 'Post Code';
    }
    // else if (ciComponentType === UiComponentType.MatAttachment) {
    //   text = 'Mat Attachment';
    // } else if (ciComponentType === UiComponentType.CliAttachment) {
    //   text = 'Cli Attachment';
    // }
    return text;
  }


















  onSave(data) {
    if (this.validation()) {

      this.updateVarDto();
      let message = '';
      if (!this.ovItem.isNewItem) {
        this.dialogRef.close({ kind: RowOvItemChangeKind.UpdateValue, value: data });
      } else if (!this.checkVarNumberExistence(this.ovItem.varNo)) {
        if (data.varNo >= 5004) {
          message = 'Var No should be less than 5004';
          this.informationMsages(message);
        } else {
          message = 'Add new variable (' + this.ovItem.varNo + ') to screen?';
          const dialogData: ConfirmDialogData = {
            content: {
              title: 'Screen Designer',
              message: message,
              acceptLabel: 'OK',
              rejectLabel: 'No'
            },
            data: null
          };
          const confirmDialogRef = this.dialog.open(ConfirmDialogComponent, {
            data: dialogData,
            disableClose: true,
            width: '350px',
            panelClass: 'dps-notification'
          });
          confirmDialogRef.afterClosed().subscribe(dialogResult => {
            if (dialogResult.kind === ConfirmDialogResultKind.Confirmed) {
              this.dialogRef.close({ kind: RowOvItemChangeKind.InsertItemAddToView, value: data });

            } else if (dialogResult.kind === ConfirmDialogResultKind.Rejected) {

              this.dialogRef.close({ kind: RowOvItemChangeKind.InsertItem, value: data });

            } else {
              this.dialogRef.close({ kind: RowOvItemChangeKind.CloseItem, value: data });
            }

          });
        }
      }
    }
  }

  updateVarDto() {
    this.ovItem.setUiComponentTypeToDto(this.ovItem.fieldType);
    this.ovItem.setFieldTypeTextToDto(this.getFieldTipeNameById(this.ovItem.fieldType));
    this.ovItem.setAvdVarNoToDto(this.ovItem.varNo);
    this.ovItem.setHelpTextToDto(this.ovItem.help);
    this.ovItem.setLabelDescriptionToDto(this.ovItem.description);
    this.ovItem.setMaxLengthToDto(this.ovItem.inputLength);
  }


  getFieldTipeNameById(id: number): string {
    let type;
    switch (id) {
      case 0: {
        type = 'Text';
        break;
      }
      case 1: {
        type = 'Date';
        break;
      }
      case 2: {
        type = 'YesNo';
        break;
      }
      case 3: {
        type = 'Label';
        break;
      }
      case 4: {
        type = 'Combo';
        break;
      }
      case 5: {
        type = 'Currency';
        break;
      }
      case 6: {
        type = 'Integer';
        break;
      }
      case 7: {
        type = 'Line';
        break;
      }
      case 8: {
        type = 'Time';
        break;
      }
    }
    return type;

  }

  //


  informationMsages(message) {
    const dialogData: ConfirmDialogData = {
      content: {
        title: 'Screen Designer',
        message: message,
        acceptLabel: 'OK',
      },
      data: { messageType: 'warning' }
    };
    const confirmDialogRef = this.dialog.open(InforDialogComponent, {
      data: dialogData,
      disableClose: true,
      width: '350px',
      panelClass: 'dps-notification'
    });
  }

  checkVarNumberExistence(varNo): boolean {
    const varNumInstances = this.ovItemList.filter(x => x.varNo === varNo).length;
    if ((varNumInstances > 0) && (varNo !== 0)) {
      const message = 'Variable ' + varNo + ' already defined in this application';
      this.informationMsages(message);
      this.ovItem.varNo = 0;
      return true;
    }
    return false;
  }

  validation(): boolean {
    let isValid = true;
    if (!(this.ovItem.varNo > 0) && this.ovItem.isNewItem) {

      const message = 'No variable number selected!';

      const dialogData: ConfirmDialogData = {
        content: {
          title: 'Screen Designer',
          message: message,
          acceptLabel: 'OK',
        },
        data: { messageType: 'general' }
      };
      const confirmDialogRef = this.dialog.open(InforDialogComponent, {
        data: dialogData,
        disableClose: true,
        width: '350px',
        panelClass: 'dps-notification'
      });
      isValid = false;
    }
    return isValid;
  }


  onClose(data) {
    this.dialogRef.close({ kind: RowOvItemChangeKind.CloseItem, value: data });
  }


}




