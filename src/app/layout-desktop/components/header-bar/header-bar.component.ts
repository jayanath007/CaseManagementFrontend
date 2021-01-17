import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { OnChanges } from '@angular/core/src/metadata/lifecycle_hooks';
import { MatDialog } from '@angular/material';
import { Store } from '@ngrx/store';
import { DiaryRecType, LegalAid } from '../../../add-note-core';
import { AddNoteItemsType, DiaryItem } from '../../../core/lib/addNote';
import { MatterSearchGridData } from '../../../core/lib/matter';
import { showConfirmDialog, showInforDialog } from '../../../core/utility/DpsUtility';
import { FileItemWrapper } from '../../../file-history-core/models/interface';
import { MessageItemWrapper } from '../../../mail-item-core';
import { OpenCaseRefresh } from '../../../open-case-core/actions/core';
import { ConfirmDialogResultKind } from '../../../shared';
import { IsDpsMailPipe } from '../../../shared';
import { SystemJsPopupLoaderService } from '../../../shell-desktop/services/system-js-popup-loader.service';
import { FileLogicStatus } from '../../../workflow-core';
import { MenuGroups } from '../../models/enums';
import { MainMenuItem } from '../../models/interfaces';
import { InfoDialogType } from './../../../core/utility/DpsUtility';

@Component({
  selector: 'dps-header-bar',
  templateUrl: './header-bar.component.html',
  styleUrls: ['./header-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderBarComponent implements OnInit, OnChanges {

  @Input() user;
  @Input() activeOutlet;
  @Input() menuOpenCaseItems: MainMenuItem<any>[];
  @Input() isGoogle;
  @Input() companyCode: string;

  @Output() menuToggle = new EventEmitter();
  @Output() showSetingsSidenav = new EventEmitter();
  @Output() itemClick = new EventEmitter();
  @Output() itemCloseClick = new EventEmitter();

  // addNoteInputList: AddNoteInPutData[] = [];
  showProfileImg = false;
  activeIndex = 0;
  menuGroups = MenuGroups;
  isDpsMailPipe: IsDpsMailPipe;
  constructor(private popupService: SystemJsPopupLoaderService, private dialog: MatDialog, private store: Store<any>) {
    this.isDpsMailPipe = new IsDpsMailPipe();
  }

  get userProfileName() {
    if (this.user && this.user.profile && this.user.profile.name) {
      return (<string>this.user.profile.name).split(' ')[0];
    }
    return '';
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.menuOpenCaseItems && !changes.menuOpenCaseItems.isFirstChange() &&
      changes.menuOpenCaseItems.currentValue.length > changes.menuOpenCaseItems.previousValue.length) {
      if (changes.menuOpenCaseItems.previousValue[0] &&
        changes.menuOpenCaseItems.previousValue[0].group === changes.menuOpenCaseItems.currentValue[0].group) {
        this.activeIndex = changes.menuOpenCaseItems.currentValue.length - 1;
      } else {
        this.activeIndex = 0;
      }

    } else if (changes.menuOpenCaseItems && !changes.menuOpenCaseItems.isFirstChange() &&
      changes.menuOpenCaseItems.currentValue.length <= changes.menuOpenCaseItems.previousValue.length) {
      const index: number = changes.menuOpenCaseItems.currentValue.findIndex(val => val.isSelected);
      this.activeIndex = index > -1 ? index : this.activeIndex;
    }

  }
  onItemClick(item: MainMenuItem<any>, i: number) {
    this.activeIndex = i;
    this.itemClick.emit(item);
  }

  onCloseClick(item: MainMenuItem<any>, e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (item.isSelected && this.activeIndex === (this.menuOpenCaseItems.length - 1)) {
      this.activeIndex = this.activeIndex - 1;
    }
    this.itemCloseClick.emit({ item: item, nextIndex: this.activeIndex });
  }

  ngOnInit() {

  }

  mainMenuToggle() {
    this.menuToggle.emit();
  }

  isEntryLogicCompleted(data) {
    return data ? !data.entryLogicState ||
      // tslint:disable-next-line: no-bitwise
      (data.entryLogicState & FileLogicStatus.Completed as number) === FileLogicStatus.Completed : false;
  }

  isExitLogicRuning(data) {
    // tslint:disable-next-line:no-bitwise
    return data ? (data.exitLogicState && FileLogicStatus.Started as number) === FileLogicStatus.Started : false;
  }


  get isOpenCaseItemsExitLogicRuning() {
    let isExitLogicRuning = false;

    this.menuOpenCaseItems.forEach((item: any) => {
      // tslint:disable-next-line:no-bitwise
      if ((item.data && MenuGroups.HeaderBarItem !== item.group &&
        item.data.exitLogicState && FileLogicStatus.Started as number) === FileLogicStatus.Started) {
        isExitLogicRuning = true;
      }
    });

    return isExitLogicRuning;
  }


  onDrop(item: MainMenuItem<any>, { event, dragData, dragDataType }: { event: DragEvent, dragData: any[], dragDataType: string }) {
    // let matterData;
    if (item && item.data && item.data.matterData && item.data.matterData.data && dragDataType && dragDataType) {
      const matterInputData: MatterSearchGridData = item.data.matterData.data;
      const matterData = {
        MatterReferenceNo: matterInputData.matterReferenceNo, BranchID: matterInputData.branchID,
        AppID: matterInputData.appID, FeeEarner: matterInputData.feeEarner,
        ClientName: matterInputData.clientName, RateCategory: null, FileID: matterInputData.fileID,
        AppCode: matterInputData.app_Code, eBilling: matterInputData.eBilling, isPlotMasterMatter: matterInputData.isPlotMasterMatter,
        isProspectMatter: matterInputData.isProspectMatter, isLegalAid: matterInputData.isLegalAid
      };
      const callback = () => {
        this.store.dispatch(new OpenCaseRefresh(item.data.token, {}));
      };
      if (dragDataType === 'mailItem') {
        const mightBeAttchedMail = dragData.filter((i: MessageItemWrapper) =>
          (this.isDpsMailPipe.transform(i.data.subject, this.companyCode) || i.diaryId !== null) && !i.data.isDraft
        );
        const nonAttchedMail = dragData.filter(i => !i.diaryId && !i.data.isDraft );
        if (!nonAttchedMail || nonAttchedMail.length <= 0) {
          showInforDialog('Attach to file', 'Selected email(s) already linked with a matter.', InfoDialogType.warning, this.dialog, );
          return;
        }
        if ((mightBeAttchedMail && mightBeAttchedMail.length > 0)) {
          // if (nonAttchedMail && nonAttchedMail.length > 0) {
          showConfirmDialog('Attach to file',
            '<strong>Do you want to attach selected email(s)? </strong> <br> (Selected email(s) might be linked with a matter.)',
            this.dialog)
            .afterClosed().subscribe(dialogResult => {
              if (dialogResult.kind === ConfirmDialogResultKind.Confirmed) {
                this.popupService.openAddNotePopupWithAttachments(
                  'mainAddNotePopup', nonAttchedMail, AddNoteItemsType.MailItems,
                  matterData, DiaryRecType.EMAIL_IN, LegalAid.NotLegalAid, callback
                );
              }
            });
          // }
          // else {
          //   showInforDialog('Attach to file', ' Selected email(s) already linked with matter(s).', InfoDialogType.warning, this.dialog);
          // }
        } else {
          this.popupService.openAddNotePopupWithAttachments(
            'mainAddNotePopup', nonAttchedMail, AddNoteItemsType.MailItems,
            matterData, DiaryRecType.EMAIL_IN, LegalAid.NotLegalAid, callback
          );
        }

      } else if (dragDataType === 'driveFile') {
        const attachement = dragData.filter(val => val && val.data.file).map(val => val.data);
        if (attachement && attachement.length > 0) {
          this.popupService.openAddNotePopupWithAttachments(
            'mainAddNotePopup', attachement, AddNoteItemsType.DriveItems,
            matterData, DiaryRecType.LETTER_IN, LegalAid.NotLegalAid, callback
          );
        }
      } else if (dragDataType === 'fileHistorData') {
        const diaryItems: DiaryItem[] = (dragData as FileItemWrapper[]).
          filter(i => !!i.data.letter_name).map(val => ({
            appCode: val.data['appCode'],
            appId: val.data['appId'],
            branchId: val.data['branchId'],
            fileId: val.data['fileId'],
            diaryId: val.data.diary_UID,
            letterName: val.data.letter_name
          }));
        if (diaryItems && diaryItems.length > 0) {

          this.popupService.openAddNotePopupWithAttachments(
            'mainAddNotePopup', diaryItems, AddNoteItemsType.DiaryItems,
            matterData, DiaryRecType.LETTER_IN, LegalAid.NotLegalAid, callback
          );
        }
      }
    }
    event.preventDefault();
  }
  onShowSetingsSidenav() {
    this.showSetingsSidenav.emit();
  }

}
