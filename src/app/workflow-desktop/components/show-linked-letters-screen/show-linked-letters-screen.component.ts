import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatCheckboxChange } from '@angular/material';
import { LinkedLettersMediator, DialogResult, LinkedLettersScreenResult } from '../../../workflow-core';
import { LLCommandRequest } from '../../../workflow-core/models/remote-messages';
import { WorkflowDiaryService } from '../../services/workflow-diary-service';

@Component({
  selector: 'dps-show-linked-letters-screen',
  templateUrl: './show-linked-letters-screen.component.html',
  styleUrls: ['./show-linked-letters-screen.component.scss']
})
export class ShowLinkedLettersScreenComponent implements OnInit, OnDestroy {

  constructor(@Inject(MAT_DIALOG_DATA) public data: { mediator: LinkedLettersMediator },
    public dialogRef: MatDialogRef<ShowLinkedLettersScreenComponent>, public workflowDiaryService: WorkflowDiaryService) { }

  tableFields: LLCommandRequest[];
  selectedItem: LLCommandRequest;
  branchId: number;
  appId: number;
  fileId: number;
  okButtonLabel = 'Go';
  private lcSubscription;

  ngOnInit() {
    this.lcSubscription = this.data.mediator.lifecycle.subscribe(() => { }, () => {
      this.dialogRef.close();
    });
    this.data.mediator.ready().then(item => {
      const dataViewModel = {
        CaseFileIdentityWithAppIdViewModel: {
          BranchId: item.caseFileIdentityWithAppIdRequest.branchId,
          AppId: item.caseFileIdentityWithAppIdRequest.appId,
          FileId: item.caseFileIdentityWithAppIdRequest.fileId
        },
        ListLetterViewModels: item.llCommandRequests,
        FirstCall: item.firstCall
      };

      this.workflowDiaryService.getFileLetterHistories(dataViewModel).subscribe((dataItem) => {
        // this.tableFields = item.llCommandRequests;
        this.tableFields = dataItem;
        this.branchId = item.caseFileIdentityWithAppIdRequest.branchId;
        this.appId = item.caseFileIdentityWithAppIdRequest.appId;
        this.fileId = item.caseFileIdentityWithAppIdRequest.fileId;
        this.activeFirstTemplateToDo(item.llCommandRequests);
      });

      // .((result) => {

      //   this.tableFields = item.llCommandRequests;
      //   this.branchId = item.caseFileIdentityWithAppIdRequest.branchId;
      //   this.appId = item.caseFileIdentityWithAppIdRequest.appId;
      //   this.fileId = item.caseFileIdentityWithAppIdRequest.fileId;
      //   this.activeFirstTemplateToDo(item.llCommandRequests);
      // });

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

  private buildResponse(action: DialogResult): LinkedLettersScreenResult {
    const result: LinkedLettersScreenResult = {
      dialogResult: action,
      llCommandDto: this.tableFields
    };
    return result;
  }

  public onAction() {
    this.dialogRef.close(this.buildResponse(DialogResult.Ok));
  }

  public onClose(): void {
    this.dialogRef.close(this.buildResponse(DialogResult.Cancel));
  }

  ngOnDestroy(): void {
    this.data.mediator.destroy();
    this.lcSubscription.unsubscribe();
  }

}
