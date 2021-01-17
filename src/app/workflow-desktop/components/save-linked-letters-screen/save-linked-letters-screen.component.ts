import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatCheckboxChange } from '@angular/material';
import { LinkedLettersMediator, DialogResult, LinkedLettersScreenResult,
   LinkedLettersSaveConfirmMediator } from '../../../workflow-core';
import { LLCommandRequest } from '../../../workflow-core/models/remote-messages';

@Component({
  selector: 'dps-save-linked-letters-screen',
  templateUrl: './save-linked-letters-screen.component.html',
  styleUrls: ['./save-linked-letters-screen.component.scss']
})
export class SaveLinkedLettersScreenComponent implements OnInit, OnDestroy {

  constructor(@Inject(MAT_DIALOG_DATA) public data: { mediator: LinkedLettersSaveConfirmMediator },
    public dialogRef: MatDialogRef<SaveLinkedLettersScreenComponent>) { }

  tableFields: LLCommandRequest[];
  selectedItem: LLCommandRequest;
  branchId: number;
  appId: number;
  fileId: number;
  okButtonLabel = 'Go';
  private lcSubscription;
  rowIndex: number;

  ngOnInit() {
    this.lcSubscription = this.data.mediator.lifecycle.subscribe(() => { }, () => {
      this.dialogRef.close();
    });

    this.data.mediator.ready().then(item => {
      this.tableFields = item.llCommandRequests;
      this.rowIndex = item.index;
      this.branchId = item.caseFileIdentityWithAppIdRequest.branchId;
      this.appId = item.caseFileIdentityWithAppIdRequest.appId;
      this.fileId = item.caseFileIdentityWithAppIdRequest.fileId;
      this.activeFirstTemplateToDo(item.llCommandRequests);
    });
  }

  // Select the first template which has set the 'Do' as true
  private activeFirstTemplateToDo(list: LLCommandRequest[]): void {
    const tem: LLCommandRequest = this.tableFields.find(val => val.do);
    if (tem) {
      this.selectedItem = tem;
      this.okButtonLabel = 'Go';
    } else {
      this.selectedItem = null;
      this.okButtonLabel = 'Finish';
    }
  }

  public onChangeDo(item: LLCommandRequest, event: MatCheckboxChange) {
    this.tableFields.forEach(val => {
      if (val === item) {
        val.do = event.checked;
      }
    });
    this.activeFirstTemplateToDo(this.tableFields);
  }

  public onSelectItem(item: LLCommandRequest) {
    this.selectedItem = item;
  }

  public onSave() {
    this.dialogRef.close(DialogResult.Yes);
  }
  public onDontSave(): void {
    this.dialogRef.close(DialogResult.No);
  }
  // public onAction() {
  //   this.dialogRef.close(this.buildResponse(DialogResult.Ok));
  // }

  // public onClose(): void {
  //   this.dialogRef.close(this.buildResponse(DialogResult.Cancel));
  // }

  ngOnDestroy(): void {
    this.data.mediator.destroy();
    this.lcSubscription.unsubscribe();
  }

}
