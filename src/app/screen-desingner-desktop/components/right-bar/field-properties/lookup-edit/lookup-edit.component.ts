
import { Component, OnInit, Inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material';
import { FieldPropertiesService } from '../../../../../screen-desingner-core/services/field-properties.service';
import { ConfirmDialogData, InforDialogComponent } from '../../../../../shared';

@Component({
  selector: 'dps-lookup-edit',
  templateUrl: './lookup-edit.component.html',
  styleUrls: ['./lookup-edit.component.scss']
})
export class LookupEditComponent implements OnInit {

  constructor(private store: Store<any>, @Inject(MAT_DIALOG_DATA) public data: any, public dialog: MatDialog,
    public dialogRef: MatDialogRef<LookupEditComponent>, private fieldProperties: FieldPropertiesService) { }
    fileContentArray: string[];
  ngOnInit() {
  }

  onClose() {
    this.dialogRef.close();

  }

  onSave(data) {
    this.fileContentArray = data.split('\n');
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
        data: { messageType: 'success'}
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
