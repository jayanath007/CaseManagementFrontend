import { DropdownListData, GridDataFilter, GridRowData, GroupInfo, LoginUser, TeamTalkAuthors } from '../../../dictations-core/models/interface';
import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { ColumnDef } from '../../../core/lib/grid-model';
import { UserType, JobFolderType } from '../../../dictations-core/models/enum';
import { PaginatorDef } from './../../../core/lib/grid-model';
import { InforDialogComponent, InforDialogData } from '../../../shared';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'dps-dictation-layout-content',
  templateUrl: './dictation-layout-content.component.html',
  styleUrls: ['./dictation-layout-content.component.scss']
})
export class DictationLayoutContentComponent implements OnInit, OnChanges {
  @Input() loading: boolean;
  @Input() coloumnDef: ColumnDef[];
  @Input() myJobList: GroupInfo[];   // to add interface
  @Input() jobStageList: DropdownListData[];   // to add interface
  @Input() usetType: LoginUser;
  @Input() matterRef: string; // To add matter ref with raw data wiew model
  @Input() dictationGridFilters: GridDataFilter;
  @Input() dictationGridData: GridRowData[];
  @Input() authorList: TeamTalkAuthors[];
  @Input() paginatorDef: PaginatorDef;



  // @Input() jobStageListData: any;


  @Output() playDictations = new EventEmitter();
  @Output() openWordFileDictation = new EventEmitter();
  @Output() competedJobDictations = new EventEmitter();
  @Output() finishJobUpdate = new EventEmitter();
  @Output() openCaseDictation = new EventEmitter();

  @Output() jobStageChange = new EventEmitter();
  @Output() jobsForChange = new EventEmitter();
  @Output() rowExpand = new EventEmitter();
  @Output() authorChange = new EventEmitter();
  @Output() openDictationPdf = new EventEmitter();
  @Output() refreshGrid = new EventEmitter();
  @Output() changePage = new EventEmitter<PaginatorDef>();
  @Output() uploadSelectedFile = new EventEmitter<any>();
  @Output() openDictatioProfiling = new EventEmitter<any>();
  @Output() openCaseFile = new EventEmitter<any>();

  // @Output() closePopUp = new EventEmitter();
  fontSize: number;
  fontSizeClassTag: string;
  buttonActiveClass: string;
  fontSizeClass: string;

  jobStageListData: DropdownListData[];


  UserType = UserType;


  constructor(private dialog: MatDialog) { }
  getOrderAutherList() {

    const list = this.authorList ? this.authorList.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0)) : null;
    return list;

  }

  getSelectJobStage(key) {
    if (this.jobStageListData && this.jobStageListData.length > 0 && this.dictationGridFilters) {
      return this.jobStageListData.find(a => a.key === key);
    }
  }

  getSelectJobsFor(id) {
    if (this.myJobList && this.myJobList.length > 0 && this.dictationGridFilters) {
      return this.myJobList.find(a => a.id === id);
    }
  }

  getSelectAuthor(id) {
    if (this.authorList && this.authorList.length > 0 && this.dictationGridFilters) {
      return this.authorList.find(a => a.id === id);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.usetType && changes.usetType.currentValue) {
      if (this.usetType && this.usetType.level === UserType.typist) {
        this.jobStageListData = [{ key: JobFolderType.ToDo, value: 'To do' },
        { key: JobFolderType.ToAmend, value: 'To amend' }, { key: JobFolderType.TypistDrafts, value: 'Drafts' },
        { key: JobFolderType.ToPrint, value: 'To print' },
        { key: JobFolderType.Completed, value: 'Completed' }];
      } else {
        this.jobStageListData = [{ key: JobFolderType.Sent, value: 'Sent' },
        { key: JobFolderType.ToCheck, value: 'To check' }, { key: JobFolderType.Completed, value: 'Completed' }];

      }

    }
  }

  ngOnInit() {
    this.fontSize = 0;
    this.fontSizeClassTag = 'font-increment-';
    this.buttonActiveClass = '';

  }


  onPlayDictations(itemRow) {
    this.playDictations.emit(itemRow);
  }
  onCompetedJobDictations(itemRow) {
    this.competedJobDictations.emit(itemRow);

  }
  onOpenWordFileDictation(itemRow) {
    this.openWordFileDictation.emit(itemRow);
  }
  onFinishJobUpdate(event) {
    this.finishJobUpdate.emit(event);
  }
  onOpenCaseDictation(gridRowData) {
    this.openCaseDictation.emit(gridRowData);
  }

  onJobStageChange(value) {
    const selectvales = this.getSelectJobStage(value);
    this.jobStageChange.emit(selectvales);
  }

  onJobsForChange(value) {
    const selectvales = this.getSelectJobsFor(value);
    this.jobsForChange.emit(selectvales);

  }

  onAuthorChange(value) {
    const selectvales = this.getSelectAuthor(value);
    this.authorChange.emit(selectvales);

  }

  GridrowExpand(row) {
    this.rowExpand.emit(row);
  }

  onPdfFileClick(itemRow) {
    this.openDictationPdf.emit(itemRow);
  }

  onRefresh() {
    this.refreshGrid.emit();

  }
  onFontSizeMinusClick() {
    if (this.fontSize > -3) {
      this.buttonActiveClass = 'active';
      this.fontSize -= this.fontSize !== 1 ? 1 : 2;
      this.fontSizeClass = this.fontSizeClassTag + this.fontSize;
    }
  }
  onFontSizePlusClick() {
    if (this.fontSize < 4) {
      this.buttonActiveClass = 'active';
      this.fontSize += this.fontSize !== -1 ? 1 : 2;
      this.fontSizeClass = this.fontSizeClassTag + this.fontSize;
    }
  }
  onFontSizeResetClick() {
    this.buttonActiveClass = '';
    this.fontSize = 0;
    this.fontSizeClass = this.fontSizeClassTag + this.fontSize;
  }

  onChangePage(pageDef: PaginatorDef) {
    this.changePage.emit(pageDef);
  }

  onOpenDictatioProfiling(event) {
    this.openDictatioProfiling.emit(event);

  }

  onFileChange(event: FileList) {
    if (event) {

      const types = /(\.|\/)(mp3)$/i;
      // file is the file, that the user wants to upload
      const file = event[0];

      if (types.test(file.type) || types.test(file.name)) {
        this.uploadSelectedFile.emit(event[0]);
      } else {
        const dialogData: InforDialogData = {
          content: {
            title: 'Dictation',
            message: 'Invalid File Type. Please upload valid file type(mp3).'
          },
          data: { messageType: 'alert' }
        };
        const dialogRef = this.dialog.open(InforDialogComponent, {
          data: dialogData,
          width: '400px',
          disableClose: true,
          hasBackdrop: true,
          panelClass: 'dps-notification'
        });
      }

    }
  }

  onOpenCaseFile(value) {
    this.openCaseFile.emit(value);
  }

}
