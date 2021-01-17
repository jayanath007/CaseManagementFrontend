import { Component, OnInit, Inject, ChangeDetectionStrategy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DocumentViewPopupInput } from '../../models/interfaces';

@Component({
  selector: 'dps-document-view-popup',
  templateUrl: './document-view-popup.component.html',
  styleUrls: ['./document-view-popup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DocumentViewPopupComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: { input: DocumentViewPopupInput, token: string },
    public dialogRef: MatDialogRef<DocumentViewPopupComponent>) { }

  ngOnInit() {
  }
  onClose() {
    this.dialogRef.close();
  }
  onSendSignDoc() {
    this.dialogRef.close('SendSignDoc');
  }
}
