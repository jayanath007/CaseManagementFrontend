import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { DialogResult, InputBoxMediator, InputBoxResult } from '../../../workflow-core';

@Component({
  selector: 'dps-input-box',
  templateUrl: './input-box.component.html',
  styleUrls: ['./input-box.component.scss']
})
export class InputBoxComponent implements OnInit, OnDestroy {

  DialogResult = DialogResult;
  private lcSubscription;
  title: string;

  constructor( @Inject(MAT_DIALOG_DATA) public data: { mediator: InputBoxMediator },
    public dialogRef: MatDialogRef<InputBoxComponent>) { }

  ngOnInit() {

    this.data.mediator.ready()
      .then(message => {
        this.title = message.title;
      });

    this.lcSubscription = this.data.mediator.lifecycle.subscribe(() => { }, () => {
      this.dialogRef.close();
    });
  }

  onActionClick(action: DialogResult, input: string) {
    const result: InputBoxResult = { dialogResult: action, response: input };
    this.dialogRef.close(result);
  }

  ngOnDestroy(): void {
    this.data.mediator.destroy();
    this.lcSubscription.unsubscribe();
  }

}
