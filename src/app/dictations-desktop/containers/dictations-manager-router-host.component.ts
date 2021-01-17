import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'dps-dictations-manager-router-host',
  template: `<dps-dictations-manager #dectationsManager [token]="'Dictations'">
    <dps-dictations-layout  [coloumnDef]="dectationsManager.gridColoum$ | async"
    [loading]="dectationsManager.isLoading$ | async"
    [loginUser]="dectationsManager.loginUser$ | async"
    [usetType]="dectationsManager.usetType$ | async"
    [matterRef]="dectationsManager.matterRef$ | async"
    [myJobList]="dectationsManager.groupList$ | async"
    [stateCounts]="dectationsManager.stateCounts$ | async"
    [authorList]="dectationsManager.authorList$ | async"
    [userValidationMsg]="dectationsManager.userValidationMsg$ | async"
    [paginatorDef]="dectationsManager.paginatorDef$|async"

    [dictationGridFilters]="dectationsManager.dictationGridFilters$ | async"
    [dictationGridData]="dectationsManager.dictationGridData$ | async"
    (gridRowDoubleClick)="dectationsManager.onGridRowDoubleClick($event)"
    (openDocumentFile)="dectationsManager.onOpenDocumentFile($event)"
    (jobStageChange)="dectationsManager.onJobStageChange($event)"
    (jobsForChange)="dectationsManager.onJobsForChange($event)"
    (rowExpand)="dectationsManager.onGridrowExpand($event)"
    (finishJobUpdate)="dectationsManager.onFinishJobUpdate($event)"
    (competedJobDictations)="dectationsManager.onCompetedJobDictations($event)"
    (authorChange)="dectationsManager.onAuthorChange($event)"
    (openWordFileDictation)="dectationsManager.onOpenWordFileDictation($event)"
    (playDictations)="dectationsManager.onPlayDictations($event)"
    (attachedMatterForJob)="dectationsManager.onAttachedMatterForJob($event)"
    (refreshGrid)="dectationsManager.onRefreshGrid()"
    (openDictationPdf)="dectationsManager.onOpenDictationPdf($event)"
    (uploadSelectedFile)="dectationsManager.onUploadSelectedFile($event)"
    (changePage)="dectationsManager.onChangePage($event)"
    (openCaseFile)="dectationsManager.onOpenCaseFile($event)"
    (openDictatioProfiling)="dectationsManager.onOpenDictationProfiling($event)">
    </dps-dictations-layout>
  </dps-dictations-manager>`,
})
export class DictationsManagerRouterHostComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
