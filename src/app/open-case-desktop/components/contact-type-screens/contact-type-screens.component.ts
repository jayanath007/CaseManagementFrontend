import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Component, OnInit, Inject } from '@angular/core';
import { Store } from '../../../../../node_modules/@ngrx/store';
import { ScreensContactType } from '../../../open-case-core/models/interface';
import { OpenWorkFlowScreen } from '../../../open-case-core/actions/core';


@Component({
  selector: 'dps-contact-type-screens',
  templateUrl: './contact-type-screens.component.html',
  styleUrls: ['./contact-type-screens.component.scss']
})
export class ContactTypeScreensComponent implements OnInit {



  constructor(
    public dialogRef: MatDialogRef<ContactTypeScreensComponent>, private store: Store<any>,
    @Inject(MAT_DIALOG_DATA) public data: { token: string, screensContactTypeList: ScreensContactType[], appId: string }) {

  }

  onClose(): void {
    this.dialogRef.close();
  }

  onOpenScreen(item: ScreensContactType) {
    this.store.dispatch(new OpenWorkFlowScreen(this.data.token, { screenId: item.screenId, appId: this.data.appId }));
    this.dialogRef.close();
  }

  // OpenWorkFlowScreen

  ngOnInit() {

  }

}
