
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { GridRowData, LoginUser, GridDataFilter } from '../../../dictations-core';
import { JobFolderType, UserType } from '../../../dictations-core/models/enum';
import { SwitchView } from '@angular/common/src/directives/ng_switch';

@Component({
  selector: 'dps-dictations-grid-button-details',
  templateUrl: './dictations-grid-button-details.component.html',
  styleUrls: ['./dictations-grid-button-details.component.scss']
})
export class DictationsGridButtonDetailsComponent implements OnInit {
  @Input() authorList: any; // to add interface
  @Input() dictFileName: string; // To add matter ref with raw data wiew model
  @Input() usetType: LoginUser;
  @Input() itemRow: GridRowData; // To add matter ref with raw data wiew model
  @Input() dictationGridFilters: GridDataFilter;



  @Output() playDictations = new EventEmitter();
  @Output() openWordFileDictation = new EventEmitter();
  @Output() competedJobDictations = new EventEmitter<{ itemRow: GridRowData, statusValue: JobFolderType }>();
  @Output() finishJobUpdate = new EventEmitter<{ itemRow: GridRowData, statusValue: JobFolderType }>();
  @Output() openCaseDictation = new EventEmitter();
  @Output() openDictationPdf = new EventEmitter();
  @Output() openDictatioProfiling = new EventEmitter<any>();
  @Output() openCaseFile = new EventEmitter<any>();





  iswebPlayer = true;
  jobFolderType = JobFolderType;
  UserType = UserType;
  ngOnInit() {
  }

  validateWordBtn() {
    if (this.usetType && (this.usetType.level === UserType.author || this.usetType.level === UserType.manager)) {
      if (this.dictationGridFilters) {
        switch (this.dictationGridFilters.jobStage.key) {
          case JobFolderType.Sent:
            return false; break;
          case JobFolderType.ToCheck:
            return true; break;
          case JobFolderType.Completed:
            return false; break;
          default:
            return false; break;
        }
      }

    } else {
      if (this.dictationGridFilters) {
        switch (this.dictationGridFilters.jobStage.key) {
          case JobFolderType.ToPrint:
            return false; break;
          case JobFolderType.Completed:
            return false; break;
          default:
            return true; break;
        }
      }
    }
  }
  validateSaveBtn() {
    if (this.usetType && (this.usetType.level === UserType.author || this.usetType.level === UserType.manager)) {
      if (this.dictationGridFilters) {
        switch (this.dictationGridFilters.jobStage.key) {
          case JobFolderType.Sent:
            return false; break;
          case JobFolderType.ToCheck:
            return false; break;
          case JobFolderType.Completed:
            return false; break;
          default:
            return false; break;
        }
      }

    } else {
      if (this.dictationGridFilters) {
        switch (this.dictationGridFilters.jobStage.key) {
          case JobFolderType.ToPrint:
            return false; break;
          case JobFolderType.Completed:
            return false; break;
          default:
            return true; break;
        }
      }
    }
  }
  validateCheckingBtn() {
    if (this.usetType && (this.usetType.level === UserType.author || this.usetType.level === UserType.manager)) {
      if (this.dictationGridFilters) {
        switch (this.dictationGridFilters.jobStage.key) {
          case JobFolderType.Sent:
            return false; break;
          case JobFolderType.ToCheck:
            return false; break;
          case JobFolderType.Completed:
            return false; break;
          default:
            return false; break;
        }
      }

    } else {
      if (this.dictationGridFilters) {
        switch (this.dictationGridFilters.jobStage.key) {
          case JobFolderType.ToPrint:
            return false; break;
          case JobFolderType.Completed:
            return false; break;
          default:
            return true; break;
        }
      }
    }
  }
  validateMatterBtn() {
    if (this.usetType && (this.usetType.level === UserType.author || this.usetType.level === UserType.manager)) {
      if (this.dictationGridFilters) {
        switch (this.dictationGridFilters.jobStage.key) {
          case JobFolderType.Sent:
            return false; break;
          case JobFolderType.ToCheck:
            return true; break;
          case JobFolderType.Completed:
            return false; break;
          default:
            return false; break;
        }
      }

    } else {
      if (this.dictationGridFilters) {
        switch (this.dictationGridFilters.jobStage.key) {
          case JobFolderType.ToPrint:
            return true; break;
          case JobFolderType.Completed:
            return false; break;
          default:
            return true; break;
        }
      }
    }
  }

  validateCompleteBtn() {
    if (this.usetType && (this.usetType.level === UserType.author || this.usetType.level === UserType.manager)) {
      if (this.dictationGridFilters) {
        switch (this.dictationGridFilters.jobStage.key) {
          case JobFolderType.Sent:
            return false; break;
          case JobFolderType.ToCheck:
            return true; break;
          case JobFolderType.Completed:
            return false; break;
          default:
            return false; break;
        }
      }

    } else {
      if (this.dictationGridFilters) {
        switch (this.dictationGridFilters.jobStage.key) {
          case JobFolderType.ToPrint:
            return true; break;
          case JobFolderType.Completed:
            return false; break;
          default:
            return true; break;
        }
      }
    }
  }

  validateApprovePrintBtn() {
    if (this.usetType && (this.usetType.level === UserType.author || this.usetType.level === UserType.manager)) {
      if (this.dictationGridFilters) {
        switch (this.dictationGridFilters.jobStage.key) {
          case JobFolderType.Sent:
            return false; break;
          case JobFolderType.ToCheck:
            return true; break;
          case JobFolderType.Completed:
            return false; break;
          default:
            return true; break;
        }
      }

    } else {

      return false;
    }
  }






  onPlayDictationsClick(itemRow) {
    // if(this.iswebPlayer){
    /// 
    // } else {
    // location.href = "mms://www.americanrhetoric.com/mp3clipsXE/barackobama/barackobamafirstweeklyaddressARXE.mp3";
    // window.open("mms:/barackobamafirstweeklyaddressARXE.mp3");
    //}

    this.playDictations.emit(itemRow);


  }

  onPdfFileClick(itemRow) {
    this.openDictationPdf.emit(itemRow);
  }

  onWordFileClick(itemRow) {
    this.openWordFileDictation.emit(itemRow);
  }



  onCompetedDictationsClick(itemRow, statusValue) {
    this.competedJobDictations.emit({ itemRow, statusValue });
  }

  onFinishJobUpdate(itemRow, statusValue) {
    this.finishJobUpdate.emit({ itemRow, statusValue });

  }
  onOpenCaseClick(itemRowData) {
    this.openCaseDictation.emit(itemRowData);
  }

  onAproveAndPrint(itemRow, statusValue) {

    this.finishJobUpdate.emit({ itemRow, statusValue });
  }

  onOpenDictatioProfiling(event) {
    this.openDictatioProfiling.emit(event);

  }

  onOpenCaseFile(value) {
    this.openCaseFile.emit(value);
  }

}
