import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { PostCodeMatchingPopupMediator, ContactCompanyDTO, InputBoxResult, DialogResult } from '../../../workflow-core';

@Component({
  selector: 'dps-post-code-matching-box',
  templateUrl: './post-code-matching-box.component.html',
  styleUrls: ['./post-code-matching-box.component.scss']
})
export class PostCodeMatchingBoxComponent implements OnInit, OnDestroy {

  constructor( @Inject(MAT_DIALOG_DATA) public data: { mediator: PostCodeMatchingPopupMediator },
    public dialogRef: MatDialogRef<PostCodeMatchingBoxComponent>) { }

  addressList: ContactCompanyDTO[];
  selectedItem: ContactCompanyDTO;
  title: string;
  private lcSubscription;

  ngOnInit() {

    this.lcSubscription = this.data.mediator.lifecycle.subscribe(() => { }, () => {
      this.dialogRef.close();
    });


    this.data.mediator.ready().then(item => {
      this.title = item.title;
      this.addressList = item.addressList;
    });
  }

  onSelectItem(field: ContactCompanyDTO): void {
    this.selectedItem = field;
  }

  // private buildResponse(action: DialogResult): InputBoxResult {

  //   const result: InputBoxResult = {
  //     dialogResult: action,
  //     response: this.selectedItem.ctC_ID
  //   };
  //   return result;
  // }

  public onAction() {
    const result: InputBoxResult = {
      dialogResult: DialogResult.Ok,
      response: this.selectedItem.ctC_ID
    };
    this.dialogRef.close(result);
  }

  public onClose(): void {
    const result: InputBoxResult = {
      dialogResult: DialogResult.Cancel,
      response: null,
    };
    this.dialogRef.close(result);
  }

  ngOnDestroy(): void {
    this.data.mediator.destroy();
    this.lcSubscription.unsubscribe();
  }

}
