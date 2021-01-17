import { Component, OnInit, Inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material';
import { FieldPropertiesService } from '../../../../../screen-desingner-core/services/field-properties.service';
import { ConfirmDialogData, InforDialogComponent } from '../../../../../shared';
import { LookupEditComponent } from '../lookup-edit/lookup-edit.component';
import { Address } from '../../../../../shared/models/interface';
import { UiComponentType } from '../../../../../screen-view-core/models/screen-contaner-component';


@Component({
  selector: 'dps-edit-lookup-postcode',
  templateUrl: './edit-lookup-postcode.component.html',
  styleUrls: ['./edit-lookup-postcode.component.scss']
})
export class EditLookupPostcodeComponent implements OnInit {

  constructor(private store: Store<any>, @Inject(MAT_DIALOG_DATA) public data: any, public dialog: MatDialog,
    public dialogRef: MatDialogRef<LookupEditComponent>, private fieldProperties: FieldPropertiesService) { }

  public fileContentArray: string[] = [];
  address1 = '';
  address2 = '';
  town = '';
  country = '';
  postcode = '';
  UiComponentType = UiComponentType;

  ngOnInit() {
    if (this.data.content[0]) {
      this.address1 = this.data.content[0];
    }
    if (this.data.content[0]) {
      this.address2 = this.data.content[1];
    }
    if (this.data.content[2]) {
      this.town = this.data.content[2];
    }
    if (this.data.content[3]) {
      this.country = this.data.content[3];
    }
    if (this.data.content[4]) {
      this.postcode = this.data.content[4];
    }
  }

  onClose() {
    this.dialogRef.close();
  }

  onSave(data) {

    this.fileContentArray.push(this.address1);
    this.fileContentArray.push(this.address2);
    this.fileContentArray.push(this.town);
    this.fileContentArray.push(this.country);
    if (this.data.selectedContanerComponent.uiComponentType !== UiComponentType.PostCode) {
      this.fileContentArray.push(this.postcode);
    }

    // this.fileContentArray = data.split('\n');
    const response = this.fieldProperties.updateLookupFileContent(this.data.fileName,
      +this.data.screenDefinition.application, this.fileContentArray).subscribe();

    if (response) {

      const message = 'File saved successfully.';

      const dialogData: ConfirmDialogData = {
        content: {
          title: 'Lookup',
          message: message,
          acceptLabel: 'OK'

        },
        data: { messageType: 'success' }
      };
      const confirmDialogRef = this.dialog.open(InforDialogComponent, {
        data: dialogData,
        disableClose: true,
        width: '350px',
        panelClass: 'dps-notification'
      });

    }
    this.dialogRef.close();

  }

}
