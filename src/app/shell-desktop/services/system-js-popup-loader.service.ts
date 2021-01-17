import { Any } from './../../time-recording-core/actions/core';
import { Item } from './../../azure-storage/models/interfaces';
import { MatterInfo, DiaryRecType, LegalAid } from './../../add-note-core';
import { FormViewRequestViewModel } from '../../screen-view-core/models/request';

import { Injectable, SystemJsNgModuleLoader, Injector, NgModuleFactory, Input } from '@angular/core';
import { MatDialog } from '@angular/material';
import { DesktopPopups } from '../models/enums';
import { PopupLoaderComponent } from '../components/popup-loader/popup-loader.component';
import { LoaderConfig } from './loader-config';
import { InputData } from '../../matter-creation-core';
import {
  TimeInformationInputData, CrimeManagementInput,
  CCInvestigationInfoInput, CrimeProceedingClassInfoInput
} from '../../core/lib/crime-managment';
import { ConflictSearchPopupInput } from '../../conflict-search-core';
import { MatterLinkedType } from '../../matter-linked-core';
import { PriceCapLimitInput } from '../../../app/core/lib/priceCapLimit';
import { MatterDataInput } from '../../matter-linked-core/models/interfaces';
import { OpportunitySaveViewModel } from '../../opportunity-core/models/interfaces';
import { AddNoteInPutData, AddNoteItemsType, AddNoteItem, MailItem, InboxItem, DiaryItem } from '../../core/lib/addNote';
import { Observable, from } from 'rxjs';
import { DriveItem } from '../../core/lib/microsoft-graph';
import { ConfirmDialogData, ConfirmDialogComponentWithCancel, ConfirmDialogWithCancelResultKind } from '../../shared';
import { mergeAll } from 'rxjs/operators';
import { MsgViewerInput } from '../../msg-viewer';
import { ContactCreateInputData } from '../../contacts-create-core';
import { MatterKeyInfor, MatterSearchGridData } from '../../core/lib/matter';
import { BillingRequestInputData } from '../../billing-request-core/models/interfaces';
import { CivilManagementModuleInput } from '../../civil-class-management';
import { CivilTimeRecordingModuleInput } from '../../civil-time-recording-desktop';
@Injectable()
export class SystemJsPopupLoaderService {

  constructor(private loader: SystemJsNgModuleLoader, private injector: Injector, private dialog: MatDialog) { }


  openAddNotePopupWithAttachments(token: string, items: AddNoteItem[], addNoteItemsType: AddNoteItemsType,
    matterData: MatterInfo, diaryRecType: DiaryRecType, legalAid: LegalAid, callback?: () => void) {
    if (items.length > 0) {
      if (items.length > 1) {
        const dialogData: ConfirmDialogData = {
          content: {
            title: 'Confirm . . .',
            message: `<p>You have selected multiple items. Do you want to profile them one at a time?
             Choosing No will apply the same profile to all items.</p>`,
            acceptLabel: 'Yes',
            rejectLabel: 'No',
            cancelLabel: 'Cancel'
          },
          contentParams: {},
          data: null
        };
        const dialogRef = this.dialog.open(ConfirmDialogComponentWithCancel, {
          data: dialogData,
          width: '600px',
          disableClose: true,
          panelClass: 'dps-notification'
        });
        dialogRef.afterClosed().subscribe(dialogResult => {
          if (dialogResult.kind === ConfirmDialogWithCancelResultKind.Yes) {
            from(items.map((item, i) => this.observeAddNotePopup(token, [item], addNoteItemsType, matterData, diaryRecType, legalAid, i)))
              .pipe(
                mergeAll(1)
              ).subscribe((data) => {
                if (callback) {
                  callback();
                }
              });
          } else if (dialogResult.kind === ConfirmDialogWithCancelResultKind.No) {
            this.observeAddNotePopup(token, items, addNoteItemsType, matterData, diaryRecType, legalAid)
              .subscribe((data) => {
                if (callback) {
                  callback();
                }
              });
          } else if (dialogResult.kind === ConfirmDialogWithCancelResultKind.Cancel) {
          }
        });
      } else if (items.length === 1) {
        this.observeAddNotePopup(token, items, addNoteItemsType, matterData, diaryRecType, legalAid)
          .subscribe((data) => {
            if (callback) {
              callback();
            }
          });
      }
    }
  }

  private observeAddNotePopup(token: string, items: AddNoteItem[], addNoteItemsType: AddNoteItemsType,
    matterData: MatterInfo, diaryRecType: DiaryRecType, legalAid: LegalAid, i = 0) {
    return new Observable<any>(observer => {
      this.openAddNotePopup(`${token}-${i}`,
        this.setAddNoteInput(items, addNoteItemsType, matterData, diaryRecType, legalAid))
        .subscribe((data => {
          observer.next(data);
          observer.complete();
        }));
    });
  }
  private setAddNoteInput(itemList: AddNoteItem[], addNoteItemsType: AddNoteItemsType,
    matterData: MatterInfo, diaryRecType: DiaryRecType, legalAid: LegalAid) {
    const input: AddNoteInPutData = {
      isEdit: false,
      matterData: matterData,
      diaryType: diaryRecType,
      legalAid: legalAid,
      addNoteItemsType: addNoteItemsType,
      fileItemList: addNoteItemsType === AddNoteItemsType.FileItems ? itemList as File[] : null,
      driveItemList: addNoteItemsType === AddNoteItemsType.DriveItems ? itemList as DriveItem[] : null,
      mailItemList: addNoteItemsType === AddNoteItemsType.MailItems ? itemList as MailItem[] : null,
      inboxItemList: addNoteItemsType === AddNoteItemsType.InboxItems ? itemList as InboxItem[] : null,
      diaryItemList: addNoteItemsType === AddNoteItemsType.DiaryItems ? itemList as DiaryItem[] : null,
    };

    return input;
  }
  openAddNotePopup(token, input: AddNoteInPutData) {
    return this.dialog.open(PopupLoaderComponent, {
      data: {
        input: input, token: token,
        config: new LoaderConfig(DesktopPopups.AddNote, this)
      },
      width: '700px',
      panelClass: 'dps-add-note-popup-panel',
      disableClose: true
    }).afterClosed();
  }

  openWorkflowRulePopup(token, input) {
    return this.dialog.open(PopupLoaderComponent, {
      data: {
        input: input, token: token,
        config: new LoaderConfig(DesktopPopups.WorkflowRule, this)
      },
      width: '90%',
      height: '100%',
      maxWidth: 'none',
      panelClass: 'dps-open-workflow-rule-popup-panel',
      disableClose: true
    }).afterClosed();
  }

  openInitialSettingsPopup(token, input) {
    return this.dialog.open(PopupLoaderComponent, {
      data: {
        input: input, token: token,
        config: new LoaderConfig(DesktopPopups.InitialSettings, this)
      },
      width: '700px',
      panelClass: 'transparent-popup',
      disableClose: true
    }).afterClosed();
  }

  openPostOfficeActionPopup(token, input) {
    return this.dialog.open(PopupLoaderComponent, {
      data: {
        input: input,
        token: token,
        config: new LoaderConfig(DesktopPopups.PostOfficeAction, this)
      },
      width: '750px',
      height: '60%',
      panelClass: 'dps-post-office-popup-panel',
      disableClose: true
    }).afterClosed();
  }


  openTimeRecordingPopup(token, input) {
    return this.dialog.open(PopupLoaderComponent, {
      data: {
        input: input,
        token: token,
        config: new LoaderConfig(DesktopPopups.TimeRecording, this)
      },
      width: '750px',
      // max-height: '792px',
      // height: '100%',
      panelClass: 'dps-time-recording-popup-panel',
      disableClose: true
    }).afterClosed();
  }

  openTimeInformationPopup(token: string, input: TimeInformationInputData) {
    return this.dialog.open(PopupLoaderComponent, {
      data: {
        input: input,
        token: token,
        height: '100%',
        config: new LoaderConfig(DesktopPopups.TimeInformation, this)
      },
      panelClass: 'crime-class-information-time',
      disableClose: true
    }).afterClosed();
  }

  openCrimeManagerPopup(token: string, input: CrimeManagementInput) {
    return this.dialog.open(PopupLoaderComponent, {
      data: {
        input: input,
        token: token,
        height: '100%',
        config: new LoaderConfig(DesktopPopups.CrimeManagement, this)
      },
      width: '1100px',
      panelClass: 'crime-class-information',
      disableClose: true
    }).afterClosed();
  }
  openCiviltimeRecordingPopup(token: string, input: CivilTimeRecordingModuleInput) {
    return this.dialog.open(PopupLoaderComponent, {
      data: {

        input: input,
        token: token,
        config: new LoaderConfig(DesktopPopups.CivilTimeRecordingDesktopPopup, this)
      },
      width: '900px',
      height: '830px',
      maxWidth: 'none',
      panelClass: ['dps-civil-time-recording-popup-panel', 'dps-general-popoup-reset'],
      disableClose: true
    }).afterClosed();
  }

  openConflictSearchPopup(token, input: ConflictSearchPopupInput) {
    return this.dialog.open(PopupLoaderComponent, {
      data: {
        input: input,
        token: token,
        config: new LoaderConfig(DesktopPopups.ConflictSearch, this)
      },
      panelClass: 'conflict-search-popup',
      disableClose: true
    }).afterClosed();
  }


  openScreenView(token, medator) {
    return this.dialog.open(PopupLoaderComponent, {
      data: {
        token: token,
        medator: medator,
        config: new LoaderConfig(DesktopPopups.ScreenView, this)
      },
      // height: '100%',
      panelClass: 'screen-view-popup',
      disableClose: true
    }).afterClosed();
  }




  openScreenDesingner(token, atN_Command: string, appId: number) {


    const extractUId = (screenIdsString: string) => {

      const self = this;
      const screenViewModel = null;
      const end = screenIdsString.length;
      let screenIdString = '';
      let pUSComEnd;
      let pComUSstart = screenIdsString.indexOf('US', 0);
      pUSComEnd = screenIdsString.indexOf(']', pComUSstart + 2);
      if (pUSComEnd !== -1) {
        screenIdString = screenIdsString.substring(pComUSstart + 2, pUSComEnd);
      } else {
        pComUSstart = screenIdsString.indexOf('\\US', 0);
        if (pComUSstart !== -1) {
          screenIdString = screenIdsString.substring(pComUSstart + 3, end - pComUSstart - 3);
        } else {
        }
      }
      screenIdString.trim();
      const spaceIndex = screenIdString.indexOf(' ');
      if (spaceIndex > 0) {
        screenIdString = screenIdString.substring(0, spaceIndex);
      }
      if (screenIdString.length < 3) {
        screenIdString = '000' + screenIdString;
        screenIdString = screenIdString.substring(screenIdString.length - 3);  // -3 gives last 3 chars
      }
      const array = [];
      for (let i = 0; i < screenIdString.length; i += 3) {
        array.push(screenIdString.substring(i, i + 3));
      }
      return array;
    };

    const screenIds = extractUId(atN_Command);
    const input: FormViewRequestViewModel = {
      appId: appId,
      screenId: screenIds[0],
      screenIds: screenIds,
      currentIndex: 0,
      ov: [],
    };
    if (screenIds.length > 0) {
      return this.dialog.open(PopupLoaderComponent, {
        data: {
          input: input,
          token: token,
          config: new LoaderConfig(DesktopPopups.ScreenDesingner, this)
        },
        width: '95%',
        height: '90%',
        panelClass: 'screen-designer-popup',
        disableClose: true
      }).afterClosed();
    }

  }
  openMatterSearchPopup(token, input) {
    return this.dialog.open(PopupLoaderComponent, {
      data: {
        input: input, token: token,
        config: new LoaderConfig(DesktopPopups.MatterSearch, this)
      },
      width: '90%',
      height: '100%',
      maxWidth: 'none',
      panelClass: 'dps-matter-search-popup-panel',
      disableClose: true
    }).afterClosed();
  }
  openClientSearchPopup(token, input) {
    return this.dialog.open(PopupLoaderComponent, {
      data: {
        input: input, token: token,
        config: new LoaderConfig(DesktopPopups.ClientSearch, this)
      },
      width: '90%',
      height: '100%',
      maxWidth: 'none',
      panelClass: 'dps-client-search-popup-panel',
      disableClose: true
    }).afterClosed();
  }

  openAdvancedSearchPopup(token) {
    return this.dialog.open(PopupLoaderComponent, {
      data: {
        input: null, token: token,
        config: new LoaderConfig(DesktopPopups.AdvancedSearch, this)
      },
      width: '90%',
      height: '90%',
      maxWidth: 'none',
      panelClass: 'dps-Advanced-search-Popup-panel',
      disableClose: true
    }).afterClosed();
  }

  openGeneralPopup(token, text) {
    return this.dialog.open(PopupLoaderComponent, {
      data: {
        searchText: text,
        token: token,
        config: new LoaderConfig(DesktopPopups.SupplierPopup, this)
      },
      width: '45%',
      height: '100%',
      panelClass: 'dps-general-popup-panel',
      disableClose: true
    }).afterClosed();
  }

  openChaserPopup(token, input) {
    return this.dialog.open(PopupLoaderComponent, {
      data: {
        input: input, token: token,
        config: new LoaderConfig(DesktopPopups.Chaser, this)
      },
      width: '700px',
      // height: '100%',
      panelClass: 'dps-chaser-popup-panel',
      disableClose: true
    }).afterClosed();
  }

  openAddEditTaskPopup(token, input) {
    return this.dialog.open(PopupLoaderComponent, {
      data: {
        input: input, token: token,
        config: new LoaderConfig(DesktopPopups.AddEditTask, this)
      },
      width: '700px',
      panelClass: 'dps-add-new-task-panel',
      disableClose: true
    }).afterClosed();
  }

  openEmailListPopup(token, input) {
    return this.dialog.open(PopupLoaderComponent, {
      data: {
        input: input, token: token,
        config: new LoaderConfig(DesktopPopups.EmailList, this)
      },
      width: '1150px',
      height: '100%',
      panelClass: 'dps-email-list-panel',
      disableClose: true
    }).afterClosed();
  }
  openCds7ReportInfoPopup(token, input) {
    return this.dialog.open(PopupLoaderComponent, {
      data: {
        input: input, token: token,
        config: new LoaderConfig(DesktopPopups.Cds7ReportInfo, this)
      },
      width: '990px',
      panelClass: 'dps-cds7-report-info-panel',
      disableClose: true
    }).afterClosed();
  }

  // by chathu
  openLookupScreenPopup(token, input) {
    return this.dialog.open(PopupLoaderComponent, {
      data: {
        input: input, token: token,
        config: new LoaderConfig(DesktopPopups.LookupScreen, this)
      },
      width: '700px',
      panelClass: 'transparent-popup',
      disableClose: true
    }).afterClosed();
  }

  openBillingGuidePopup(token, input) {
    return this.dialog.open(PopupLoaderComponent, {
      data: {
        input: input,
        token: token,
        config: new LoaderConfig(DesktopPopups.BillingGuide, this)
      },
      width: '670px',
      height: '100%',
      maxWidth: 'none',
      panelClass: 'dps-billing-guide-popup-panel',
      disableClose: true
    }).afterClosed();
  }

  openUserMovementPopup(myToken: string, userList: any, departmentList: any) {
    return this.dialog.open(PopupLoaderComponent, {
      data: {
        userList: userList,
        departmentList: departmentList,
        token: myToken,
        config: new LoaderConfig(DesktopPopups.UserMovementPopup, this)
      },
      width: '75%',
      height: '75%',
      maxWidth: 'none',
      panelClass: 'dps-user-movement-popup-panel',
      disableClose: true
    }).afterClosed();
  }

  openMatterLinkedPopup(token: string, matterReferenceNo: string, openFrom: MatterLinkedType, title: string,
    matterData: MatterDataInput, screenId?: any, diaryIds?: any) {
    return this.dialog.open(PopupLoaderComponent, {
      data: {
        matterRef: matterReferenceNo,
        openFrom: openFrom,
        matterData: matterData,
        screenId: screenId,
        diaryIds: diaryIds,
        token: token,
        config: new LoaderConfig(DesktopPopups.MatterLinked, this),
        title
      },
      width: MatterLinkedType.MatterCreation === openFrom ? '90%' : '70%',
      height: MatterLinkedType.MatterCreation === openFrom ? '90%' : '70%',
      maxWidth: 'none',
      panelClass: 'dps-matter-link-popup-panel',
      disableClose: true
    }).afterClosed();
  }

  openProbateAccountPopup(token: string, openFrom: any, title: string, isPopup: boolean,
    matterData: any, editData: any, probateTransId?: number, legacyPercentage?: number) {
    return this.dialog.open(PopupLoaderComponent, {
      data: {
        editData: editData,
        openFrom: openFrom,
        matterData: matterData,
        isPopup: isPopup,
        token: token,
        probateTransId: probateTransId,
        legacyPercentage: legacyPercentage,
        config: new LoaderConfig(DesktopPopups.ProbateAccount, this),
        title,

      },
      width: '315px',
      // height: '300px',
      maxWidth: 'none',
      panelClass: ['dps-probate-account-popup-panel', 'dps-general-popoup-reset'],
      disableClose: true
    }).afterClosed();
  }

  openEChitPopup(token, input) {
    return this.dialog.open(PopupLoaderComponent, {
      data: {
        input: input,
        token: token,
        config: new LoaderConfig(DesktopPopups.EChitDesktopModule, this)
      },
      width: '650px',
      height: '100%',
      maxWidth: 'none',
      panelClass: 'dps-echit-popup-panel',
      disableClose: true
    }).afterClosed();
  }

  openLookupClientPopup(token, input) {
    return this.dialog.open(PopupLoaderComponent, {
      data: {
        input: input, token: token,
        config: new LoaderConfig(DesktopPopups.LookupClient, this)
      },
      width: '70%',
      height: '100%',
      maxWidth: 'none',
      panelClass: 'lookup-client-popup',
      disableClose: true
    }).afterClosed();
  }
  openScreenEditPopup(token, input) {
    return this.dialog.open(PopupLoaderComponent, {
      data: {
        input: input, token: token,
        config: new LoaderConfig(DesktopPopups.ScreenEdit, this)
      },
      width: '700px',
      height: '69%',
      panelClass: 'dps-screen-edit-popup',
      disableClose: true
    }).afterClosed();
  }
  openMsgFilePopup(token, input) {
    return this.dialog.open(PopupLoaderComponent, {
      data: {
        input: input, token: token,
        config: new LoaderConfig(DesktopPopups.MsgFile, this)
      },
      width: '90%',
      height: '100%',
      maxWidth: 'none',
      panelClass: 'dps-open-msg-modal',
      disableClose: true
    }).afterClosed();
  }
  openMsgViewer(input: MsgViewerInput) {
    return this.dialog.open(PopupLoaderComponent, {
      data: {
        input,
        config: new LoaderConfig(DesktopPopups.MsgViewer, this)
      },
      width: '90%',
      height: '100%',
      maxWidth: 'none',
      panelClass: 'dps-open-msg-modal',
      disableClose: true
    }).afterClosed();
  }
  openDocumentViewPopup(token, input) {
    return this.dialog.open(PopupLoaderComponent, {
      data: {
        input: input, token: token,
        config: new LoaderConfig(DesktopPopups.DocumentView, this)
      },
      width: '90%',
      height: '100%',
      maxWidth: 'none',
      panelClass: 'dps-open-msg-modal',
      disableClose: true
    }).afterClosed();
  }
  openClientCreationPopup(token, input) {
    return this.dialog.open(PopupLoaderComponent, {
      data: {
        input: input, token: token,
        config: new LoaderConfig(DesktopPopups.ClientCreation, this)
      },
      width: '90%',
      height: '100%',
      maxWidth: 'none',
      panelClass: 'dps-client-creation-popup-panel',
      disableClose: true
    }).afterClosed();
  }
  openMatterCreationPopup(token, input: InputData) {
    return this.dialog.open(PopupLoaderComponent, {
      data: {
        input: input,
        token: token,
        config: new LoaderConfig(DesktopPopups.MatterCreation, this)
      },
      width: '90%',
      height: '100%',
      maxWidth: 'none',
      panelClass: 'dps-matter-creation-popup-panel',
      disableClose: true
    }).afterClosed();
  }

  openCalendarEditEventPopup(token, input) {
    return this.dialog.open(PopupLoaderComponent, {
      data: {
        input: input, token: token,
        config: new LoaderConfig(DesktopPopups.CalendarEditEvent, this)
      },
      width: '90%',
      height: '100%',
      maxWidth: 'none',
      panelClass: 'dps-calendar-add-event-popup-panel',
      disableClose: true
    }).afterClosed();
  }
  openCalendarViewEventPopup(token, input) {
    return this.dialog.open(PopupLoaderComponent, {
      data: {
        input: input, token: token,
        config: new LoaderConfig(DesktopPopups.CalendarViewEvent, this)
      },
      width: '90%',
      height: '100%',
      maxWidth: 'none',
      panelClass: 'dps-calendar-add-event-popup-panel',
      disableClose: true
    }).afterClosed();
  }
  public loadModule(modulePath: string): Promise<NgModuleFactory<any>> {
    return this.loader.load(modulePath)
      .then((moduleFactory: NgModuleFactory<any>) => {
        return moduleFactory;
      });
  }
  public preloadChaser() {
    this.loadModule(DesktopPopups.Chaser);
  }

  openLedgerCardPopup(token, input) {
    return this.dialog.open(PopupLoaderComponent, {
      data: {
        input: input, token: token,
        config: new LoaderConfig(DesktopPopups.LedgerCard, this)
      },
      width: '90%',
      height: '100%',
      maxWidth: 'none',
      panelClass: 'dps-ledger-card-popup-panel',
      disableClose: true
    }).afterClosed();
  }

  openMLSPopup(token, input) {
    return this.dialog.open(PopupLoaderComponent, {
      data: {
        input: input,
        token: token,
        config: new LoaderConfig(DesktopPopups.MLSPopup, this)
      },
      width: '90%',
      height: '90%',
      maxWidth: 'none',
      panelClass: 'dps-mls-card-popup-panel',
      disableClose: true
    }).afterClosed();
  }
  openDiaryFolderPopup(token, input) {
    return this.dialog.open(PopupLoaderComponent, {
      data: {
        input: input, token: token,
        config: new LoaderConfig(DesktopPopups.DiaryFolderPopup, this)
      },
      width: '700px',
      height: '100%',
      panelClass: 'dps-diary-folder-popup-panel',
      disableClose: true
    }).afterClosed();
  }
  openMatterByClientPopup(token, data) {
    return this.dialog.open(PopupLoaderComponent, {
      data: {
        input: data,
        token: token,
        config: new LoaderConfig(DesktopPopups.MatterViewByClient, this)
      },
      width: '70%',
      height: '100%',
      maxWidth: 'none',
      panelClass: 'dps-matters-list-popup-panel',
      disableClose: true
    }).afterClosed();
  }

  openWorkFlowMenuPopup(token, data) {
    return this.dialog.open(PopupLoaderComponent, {
      data: {
        input: data,
        token: token,
        config: new LoaderConfig(DesktopPopups.WorkflowMenu, this)
      },
      width: '500px',
      panelClass: 'workFlowMenu-popup',
      disableClose: true
    }).afterClosed();
  }

  openContactSearchPoup(token, input) {
    return this.dialog.open(PopupLoaderComponent, {
      data: {
        input: input,
        token: token,
        config: new LoaderConfig(DesktopPopups.ContactSearch, this)
      },
      panelClass: 'screen-edit-popoup',
      height: '650px',
      width: '800px',
      disableClose: true
    }).afterClosed();
  }

  loadAppAppSettingsOverlay(token, input) {
    return this.dialog.open(PopupLoaderComponent, {
      data: {
        input: input, token: token,
        config: new LoaderConfig(DesktopPopups.AppSettings, this)
      },
      width: '650px',
      height: '100%',
      panelClass: 'dps-app-settings-popup-panel',
      disableClose: true
    }).afterClosed();
  }
  loadOpportunitySettingsOverlay(token, input) {
    return this.dialog.open(PopupLoaderComponent, {
      data: {
        input: input,
        token: token,
        config: new LoaderConfig(DesktopPopups.OppertunitySettings, this)
      },
      width: '650px',
      height: '60%',
      panelClass: 'dps-oppertunity-settings-popup-panel',
      disableClose: true
    }).afterClosed();
  }
  openFileSecurityRightsPoup(token, input) {
    return this.dialog.open(PopupLoaderComponent, {
      data: {
        input: input, token: token,
        config: new LoaderConfig(DesktopPopups.FileSecurityRights, this)
      },
      width: '700px',
      height: '100%',
      panelClass: 'dps-file-security-rights-popup-panel',
      disableClose: true
    }).afterClosed();
  }


  openPrecedentHPopup(token, input) {
    return this.dialog.open(PopupLoaderComponent, {
      data: {
        input: input, token: token,
        config: new LoaderConfig(DesktopPopups.PrecedentHDesktop, this)
      },
      width: '800px',
      panelClass: 'dps-PrecedentH-popup-panel',
      disableClose: true
    }).afterClosed();
  }



  openContactsCreatePopup(token, input: ContactCreateInputData) {
    return this.dialog.open(PopupLoaderComponent, {
      data: {
        input: input, token: token,
        config: new LoaderConfig(DesktopPopups.ContactsCreateDesktop, this)
      },
      width: '80%',
      height: '90%',
      panelClass: ['dps-contacts-create-popup-panel', 'dps-general-popoup-reset'],
      disableClose: true
    }).afterClosed();
  }

  openPoliceStationPopup(token, SearchText) {
    return this.dialog.open(PopupLoaderComponent, {
      data: {
        searchText: SearchText,
        token: token,
        config: new LoaderConfig(DesktopPopups.PoliceStationSearch, this)
      },
      width: '45%',
      height: '100%',
      panelClass: 'dps-general-popup-panel',
      disableClose: true
    }).afterClosed();
  }
  openDrivePopup(token, input) {
    return this.dialog.open(PopupLoaderComponent, {
      data: {
        input: input, token: token,
        config: new LoaderConfig(DesktopPopups.DriveDesktop, this)
      },
      width: '90%',
      height: '100%',
      maxWidth: 'none',
      panelClass: 'dps-drive-popup-panel',
      disableClose: true
    }).afterClosed();
  }
  bundleOptionPopup(token, input) {
    return this.dialog.open(PopupLoaderComponent, {
      data: {
        input: input, token: token,
        config: new LoaderConfig(DesktopPopups.BundleOption, this)
      },
      width: '750px',
      height: '520px',
      maxWidth: 'none',
      panelClass: 'dps-bundle-name-popup-panel',
      disableClose: true
    }).afterClosed();
  }
  existingListOpenPopup(token, input) {
    return this.dialog.open(PopupLoaderComponent, {
      data: {
        input: input, token: token,
        config: new LoaderConfig(DesktopPopups.BundleExistingList, this)
      },
      width: '750px',
      height: '70%',
      maxWidth: 'none',
      panelClass: 'dps-bundle-existing-popup-panel',
      disableClose: true
    }).afterClosed();
  }
  coreBundlePopup(token, input) {
    return this.dialog.open(PopupLoaderComponent, {
      data: {
        input: input, token: token,
        config: new LoaderConfig(DesktopPopups.CoreBundle, this)
      },
      width: '750px',
      height: '70%',
      maxWidth: 'none',
      panelClass: 'dps-core-bundle-popup-panel',
      disableClose: true
    }).afterClosed();
  }
  bundleNameAddPopup(token, input) {
    return this.dialog.open(PopupLoaderComponent, {
      data: {
        input: input, token: token,
        config: new LoaderConfig(DesktopPopups.BundleNameAddPopup, this)
      },
      width: '510px',
      height: '240px',
      maxWidth: 'none',
      panelClass: 'dps-bundle-save-popup-panel',
      disableClose: true
    }).afterClosed();
  }
  opportunityViewPopup(token, input) {
    return this.dialog.open(PopupLoaderComponent, {
      data: {
        input: input,
        token: token,
        config: new LoaderConfig(DesktopPopups.ViewOpportunityPopup, this)
      },
      width: '750px',
      height: '70%',
      maxWidth: 'none',
      panelClass: 'dps-opportunity-view-popup-panel',
      disableClose: true
    }).afterClosed();
  }
  propertyQuote(token, data: OpportunitySaveViewModel = null, isEditQuote = false) {
    return this.dialog.open(PopupLoaderComponent, {
      data: {
        opportunity: data,
        isEditQuote: isEditQuote,
        token: token,
        config: new LoaderConfig(DesktopPopups.ProfertyQuote, this)
      },
      width: '700px',
      maxWidth: 'none',
      panelClass: 'dps-property-quote-popup-panel',
      disableClose: true
    }).afterClosed();
  }
  opportunityQuoteRun(token, item, isNewOpertunity = false, isEditQuote = false) {
    return this.dialog.open(PopupLoaderComponent, {
      data: {
        item: item,
        token: token,
        isNewOpertunity: isNewOpertunity,
        isEditQuote: isEditQuote,
        config: new LoaderConfig(DesktopPopups.OpportunityQuoteRunPopup, this)
      },
      width: '360px',
      height: '',
      maxWidth: 'none',
      panelClass: 'dps-opportunity-quote-run-popup-panel',
      disableClose: true
    }).afterClosed();
  }
  opportunityClosePopup(token, item) {
    return this.dialog.open(PopupLoaderComponent, {
      data: {
        item: item,
        token: token,
        config: new LoaderConfig(DesktopPopups.OpportunityClosePopup, this)
      },
      width: '500px',
      height: '500px',
      maxWidth: 'none',
      panelClass: 'dps-opportunity-close-popup-panel',
      disableClose: true
    }).afterClosed();
  }
  priceCapLimitPopup(token, input: PriceCapLimitInput) {
    return this.dialog.open(PopupLoaderComponent, {
      data: {
        token: token,
        input: input,
        config: new LoaderConfig(DesktopPopups.PriceCapLimits, this)
      },
      width: '600px',
      height: '500px',
      maxWidth: 'none',
      panelClass: 'dps-notification',
      disableClose: true
    }).afterClosed();
  }
  billingRequestPopup(token, input: BillingRequestInputData) {
    return this.dialog.open(PopupLoaderComponent, {
      data: {
        input: input,
        token: token,
        config: new LoaderConfig(DesktopPopups.BillingRequestPopup, this)
      },
      width: '70%',
      height: '95%',
      maxWidth: 'none',
      panelClass: 'dps-billing-request-popup-panel',
      disableClose: true
    }).afterClosed();
  }
  billingNarrativePopup(token, item) {
    return this.dialog.open(PopupLoaderComponent, {
      data: {
        input: item,
        token: token,
        config: new LoaderConfig(DesktopPopups.BillingNarrativePopup, this)
      },
      width: '50%',
      height: '60%',
      maxWidth: 'none',
      panelClass: 'dps-billing-narrative-popup-panel',
      disableClose: true
    }).afterClosed();
  }
  postingPeriodPopup(token) {
    return this.dialog.open(PopupLoaderComponent, {
      data: {
        token: token,
        config: new LoaderConfig(DesktopPopups.PostingPeriodPopup, this)
      },
      width: '600px',
      height: '600px',
      maxWidth: 'none',
      panelClass: 'dps-billing-posting-popup-panel',
      disableClose: true
    }).afterClosed();
  }
  pageSetupPopup(token, item) {
    return this.dialog.open(PopupLoaderComponent, {
      data: {
        item: item,
        token: token,
        config: new LoaderConfig(DesktopPopups.PageSetupPopup, this)
      },
      width: '371px',
      height: '535px',
      maxWidth: 'none',
      panelClass: 'dps-page-setup-popup-panel',
      disableClose: true
    }).afterClosed();
  }

  eChitAuthorisationsPopup(token, input) {
    return this.dialog.open(PopupLoaderComponent, {
      data: {
        input: input,
        token: token,
        config: new LoaderConfig(DesktopPopups.EChitAuthorisationsPopup, this)
      },
      width: '80%',
      height: '90%',
      maxWidth: 'none',
      panelClass: 'dps-authorisations-popup-panel',
      disableClose: true
    }).afterClosed();
  }

  openPreviousTransactionsPopup(token, input) {
    return this.dialog.open(PopupLoaderComponent, {
      data: {
        input: input,
        token: token,
        config: new LoaderConfig(DesktopPopups.PreviousTransactionsPopup, this)
      },
      width: '1000px',
      height: '675px',
      maxWidth: 'none',
      panelClass: ['dps-previous-transactions-Popup-panel', 'dps-general-popoup-reset'],
      disableClose: true
    }).afterClosed();
  }

  openInvestigationClassInfoPopup(token, input: CCInvestigationInfoInput) {
    return this.dialog.open(PopupLoaderComponent, {
      data: {
        input: input,
        token: token,
        config: new LoaderConfig(DesktopPopups.ClassInfoInvestigation, this)
      },
      width: '1000px',
      height: '675px',
      maxWidth: 'none',
      panelClass: 'dps-crime-investigation-class-info',
      disableClose: true
    }).afterClosed();
  }



  openProceedingClassInfoPopup(token, input: CrimeProceedingClassInfoInput) {
    return this.dialog.open(PopupLoaderComponent, {
      data: {
        input: input,
        token: token,
        config: new LoaderConfig(DesktopPopups.ClassInfoProceeding, this)
      },
      width: '1150px',
      height: '800px',
      maxWidth: 'none',
      panelClass: 'dps-crime-investigation-class-info',
      disableClose: true
    }).afterClosed();
  }

  openCrimeDutyPopup(token, input: MatterKeyInfor) {
    return this.dialog.open(PopupLoaderComponent, {
      data: {
        input: input,
        token: token,
        config: new LoaderConfig(DesktopPopups.CrimeCourtDutyDesktopModule, this)
      },
      width: '860px',
      height: '84%',
      maxWidth: 'none',
      panelClass: 'dps-crime-duty-popup-panel',
      disableClose: true
    }).afterClosed();
  }

  openProbatePopup(token, input) {
    return this.dialog.open(PopupLoaderComponent, {
      data: {
        inputs: input,
        token: token,
        config: new LoaderConfig(DesktopPopups.ProbateDesktopModule, this)
      },
      width: '75%',
      height: '90%',
      maxWidth: 'none',
      panelClass: 'dps-probate-popup-panel',
      disableClose: true
    }).afterClosed();
  }
  probateEstatePopup(token, input) {
    return this.dialog.open(PopupLoaderComponent, {
      data: {
        input: input,
        token: token,
        config: new LoaderConfig(DesktopPopups.ProbateEstateOverviewPopup, this)
      },
      width: '900px',
      maxWidth: 'none',
      panelClass: ['dps-Probet-add-asset', 'dps-general-popup-reset'],
      disableClose: true
    }).afterClosed();
  }
  formsLibraryPopup(token, input) {
    return this.dialog.open(PopupLoaderComponent, {
      data: {
        input: input,
        token: token,
        config: new LoaderConfig(DesktopPopups.FormsLibraryPopup, this)
      },
      width: '800px',
      height: '600px',
      maxWidth: 'none',
      panelClass: ['dps-forms-library-popup-panel', 'dps-general-popup-reset'],
      disableClose: true
    }).afterClosed();
  }
  // contactSearchPopup(token, input) {
  //   return this.dialog.open(PopupLoaderComponent, {
  //     data: {
  //       input: input,
  //       token: token,
  //       config: new LoaderConfig(DesktopPopups.contactSearchPopup, this)
  //     },
  //     width: '800px',
  //     height: '600px',
  //     maxWidth: 'none',
  //     panelClass: ['dps-forms-library-popup-panel', 'dps-general-popup-reset'],
  //     disableClose: true
  //   }).afterClosed();
  // }

  banckDetailsSearchPoup(token, input) {
    return this.dialog.open(PopupLoaderComponent, {
      data: {
        input: input,
        token: token,
        config: new LoaderConfig(DesktopPopups.BankDetailsSearch, this)
      },
      panelClass: 'screen-edit-popoup',
      height: '650px',
      width: '800px',
      disableClose: true
    }).afterClosed();

  }


  civilClassManagement(token, input: CivilManagementModuleInput) {
    return this.dialog.open(PopupLoaderComponent, {
      data: {
        input: input,
        token: token,
        config: new LoaderConfig(DesktopPopups.CivilClassManagement, this),
        height: '100%'
      },
      width: '700px',
      maxWidth: 'none',
      height: '600px',
      panelClass: ['dps-civil-class-management-popup-panel', 'dps-general-popup-reset'],
      disableClose: true
    }).afterClosed();
  }
}

