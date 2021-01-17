import { OvItem } from '../../../../screen-desingner-core/models/application-component';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Store } from '@ngrx/store';
import { RowOvItemChangeKind } from '../../../../screen-desingner-core/actions/core';

@Component({
  selector: 'dps-label-update',
  templateUrl: './label-update.component.html',
  styleUrls: ['./label-update.component.scss']
})
export class LabelUpdateComponent implements OnInit {

  constructor(private store: Store<any>, @Inject(MAT_DIALOG_DATA) public ovItem: OvItem,
    public dialogRef: MatDialogRef<LabelUpdateComponent>) { }

  ngOnInit() {
  }


  onLableAdd(ovItem) {
    this.ovItem.setLabelDescriptionToDto(this.ovItem.description);
    this.dialogRef.close({ kind: RowOvItemChangeKind.AddLableToView, value: ovItem });
  }

  updateVarDto() {

  }
  onClose() {
    this.dialogRef.close({ kind: RowOvItemChangeKind.CloseItem, value: '' });
    // this.dialogRef.close();
  }



}
