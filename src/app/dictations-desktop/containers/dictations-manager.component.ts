import { BaseDictationsManager } from './../../dictations-core/containers/base-dictations-manager';
import { Component, OnInit, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { SystemJsPopupLoaderService } from '../../shell-desktop';
import { MainMenuService } from '../../layout-desktop';
import { GridRowItemWrapper } from '../../core/lib/matter';
import { PaginatorDef } from './../../core/lib/grid-model';
import { MatDialog } from '@angular/material';
import { DictationProfilingPopupManagerComponent } from './dictation-profiling-popup-manager.component';



@Component({
  selector: 'dps-dictations-manager',
  template: '<ng-content></ng-content>',
  styleUrls: []
})
export class DictationsManagerComponent extends BaseDictationsManager implements OnInit {

  @Input() token;
  // loginguser;
  // user$;

  constructor(store: Store<any>, private pageService: MainMenuService
    , private popupService: SystemJsPopupLoaderService, private dialog: MatDialog) {
    super(store);
  }
  ngOnInit() {
    super.initSelectors(this.token, this.columnDefAuthor, this.columnDefSecretary, this.paginatorDef, this.userType);
    // this.user$ = this.store.select(getUser);
  }

  onJobStageChange(event) {


    this.changeJobStage(this.token, event);

  }
  onJobsForChange(event) {

    this.changeJobFor(this.token, event);

  }

  onGridRowDoubleClick(event) {

    this.gridRowDoubleClick(this.token, event);

  }

  onopenDocumentFile(event) {

    this.openDocumentFile(this.token, event);
  }


  onOpenDocumentFile(event) {

    this.openDocumentFile(this.token, event);

  }

  onAttachedMatterForJob(event) {
    this.attachedMatterForJob(this.token, event);

  }

  onGridrowExpand(row) {
    this.gridrowExpand(this.token, row);
  }

  onFinishJobUpdate(event) {

    this.dictationFinishJob(this.token, event);
  }

  onAuthorChange(event) {

    this.authorChange(this.token, event);
  }


  onOpenWordFileDictation(itemRow) {
    this.openWordFileDictation(this.token, itemRow);

  }
  onCompetedJobDictations(event) {

    this.competedJobDictations(this.token, event);

  }

  onPlayDictations(itemRow) {
    this.playDictations(this.token, itemRow);

  }

  onOpenDictationPdf(itemRow) {
    this.openDictationPdf(this.token, itemRow);

  }
  onRefreshGrid() {
    this.refreshGrid(this.token);

  }

  onChangePage(paginationDef: PaginatorDef) {
    this.changePage(this.token, paginationDef);
  }

  onUploadSelectedFile(event) {
    this.uploadSelectedFile(this.token, event);
  }

  onOpenCaseFile(value) {
    this.openCaseFile(this.token, value);

  }


  onOpenDictationProfiling(itemData: any) {

    const dialogRef = this.dialog.open(DictationProfilingPopupManagerComponent, {
      width: '500px',
      data: {
        itemData: itemData,
        myToken: this.token,
      },
      panelClass: ['dps-dictation-profiling', 'dps-general-popup-reset'],
      disableClose: true,
    });


    // this.popupService.referralNoteAndDatePopup('referralNoteAndDate', { matterData: matterData.data }).subscribe((result) => {
    // });


  }




}
