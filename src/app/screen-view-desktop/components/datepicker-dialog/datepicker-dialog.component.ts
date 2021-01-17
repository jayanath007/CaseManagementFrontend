import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Store } from '@ngrx/store';
import { getUser } from '../../../auth';
import { take } from 'rxjs/operators';
import { dpsNewDate } from '../../../utils/javascriptDate';

@Component({
  selector: 'dps-datepicker-dialog',
  templateUrl: './datepicker-dialog.component.html',
  styleUrls: ['./datepicker-dialog.component.scss'],
})
export class DatepickerDialogComponent implements OnInit {


  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DatepickerDialogComponent>, public store: Store<any>) { }

  selectedDate;
  ngOnInit() {
    this.store.select(getUser).pipe(take(1)).subscribe(user => {
      this.selectedDate = dpsNewDate(user.general.dateTimeOffset);
    }).unsubscribe();
  }

  onAction() {
    // const result: InforDialogResult = {kind: kind, data: this.data.data };
    this.dialogRef.close(this.selectedDate);
  }

  onChangeDateDone(e) {
  }
  onCancel() {
    this.dialogRef.close();
  }

}
