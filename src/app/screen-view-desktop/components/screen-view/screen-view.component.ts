
import { catchError } from 'rxjs/operators';
import { ScreenStateUpdate, SearchParameters } from '../../../workflow-core/models/remote-messages';
import { UserScreenCommand, MessageTypes } from '../../../workflow-core/models/enums';
import { Matter } from '../../../core/lib/matter';
import { SystemJsPopupLoaderService } from '../../../shell-desktop/services/system-js-popup-loader.service';
import {
  ContactSearchType, ContactSearchResult, ContactToolBarAction,
  ContactSearchAction
} from '../../../screen-contact-core/models/interface';
import { ScreenContanerComponent } from '../../../screen-view-core/models/screen-contaner-component';
import {
  Component, OnInit, Input, ViewChild, EventEmitter, Output,
  OnChanges, SimpleChanges, ChangeDetectionStrategy, Renderer2
} from '@angular/core';
import { DynamicFormComponent } from '../dynamic-form/dynamic-form.component';
import { MatDialog, MatDialogRef } from '@angular/material';
import { ConfirmDialogData } from '../../../shared';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { InforDialogComponent } from '../../../shared/components/infor-dialog/infor-dialog.component';
import { ScreenDesignFormActions } from '../../../screen-view-core/models/screen-definition';
import { ScreenDesignService } from '../../../screen-view-core/services/screen-view.service';
import { empty } from 'rxjs';
import { ViewChangeKind } from '../../../screen-view-core/actions/core';
import { IVarValue, UserScreenMediator } from '../../../workflow-core';
import { UiComponentType } from '../../../screen-view-core/models/screen-contaner-component';
import { Utilities } from '../../../screen-view-core/models/utilities';
import { ICallbackData } from '../../../screen-view-core/models/contact-search-params';
import { ScreenViewState, FormView } from '../../../screen-view-core';


@Component({
  selector: 'dps-screen-view',
  templateUrl: './screen-view.component.html',
  styleUrls: ['./screen-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})


export class ScreenViewComponent implements OnInit, OnChanges {
  extractUId: any;
  ConfirmDialogData: any;
  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  @Input() screenViewState: ScreenViewState;
  @Input() formView: FormView;
  @Input() initialInfor: any;
  @Input() medator: UserScreenMediator;
  @Input() matterDetails: Matter;
  @Input() contactDirty: boolean;
  @Input() contactsOnFile: number;
  @Input() enableSaving: boolean;
  @Input() currentContactId: number;
  @Input() token: string;
  @Input() screenControlValuesIsDirty: boolean;
  @Input() disableSearchButtons: boolean;

  @Output() onLoadingData = new EventEmitter<any>();
  @Output() onTabLogicUpdate = new EventEmitter<any>();
  @Output() onViewChange = new EventEmitter<{ kind: ViewChangeKind, value: any }>();
  @Output() onCurrentContactId = new EventEmitter<number>();
  @Output() refreshContactOnFlag = new EventEmitter();
  @Output() onNewVarValues = new EventEmitter<{ varValues: IVarValue[], focusContainerName: string }>();
  @Output() onClearFormData = new EventEmitter();
  @Output() onContactDirty = new EventEmitter<boolean>();
  @Output() onScreenControlValuesDirty = new EventEmitter<boolean>();
  @Output() onEnableSaving = new EventEmitter<boolean>();
  @Output() onIncrmentContactsOnFile = new EventEmitter();
  @Output() onDecrementContactsOnFile = new EventEmitter();
  @Output() onUnlinkContact = new EventEmitter<number>();
  @Output() onResetContactList = new EventEmitter();
  @Output() onAtachmentUpload = new EventEmitter();



  // @Output() onInitView = new EventEmitter<{ value: ShowUserScreen }>();
  @Output() onDisableSearchButtons = new EventEmitter<boolean>();
  showToolBar = false;

  constructor(private dialogRef: MatDialogRef<ScreenViewComponent>, private dialog: MatDialog
    , private service: ScreenDesignService, private popupService: SystemJsPopupLoaderService, private renderer: Renderer2) {

  }


  ngOnInit() {
    this.medator.ready().then((data) => {
      this.onViewChange.emit({ kind: ViewChangeKind.InitialLoad, value: data });
    }).catch((data) => {
      this.onLoadingData.emit(false);
      // this.openDialogBox(data, 'actor exception');
    });

    // testing
    this.medator.lifecycle.subscribe(
      (msg) => {
        console.log('screen life cycle next', msg);
        if (msg.action === MessageTypes.ScreenStateChange) {
          // reenable search buttons
          this.onDisableSearchButtons.emit(false);
          /*
           This code is from Spitfire Classic code base.
           Listen to actor life cycle events till action is ScreenStateChange and Payload is Matter
          */
          if ((msg as ScreenStateUpdate).payload === 'Matter') { // CHECK
            this.removeFromFileKeepFormData();
          }

          // bug fix on 14/03/2018 by RM
          // when contact is changed, actor will present save popup with options /Save to Contact / Save to Matter
          // executed when a user does press 'Save to Contact'
          if ((msg as ScreenStateUpdate).payload === 'Contact' && (msg as ScreenStateUpdate).kind === 'UNLINKED_CONTACT') {
            this.onContactDirty.emit(false);
          }
        }
      },
      (error) => console.log('screen life cycle error', error),
      () => console.log('screen life cycle complete')
    );


    this.medator.onClose().then(() => {
      console.warn('onClose');
      this.onLoadingData.emit(true);
      this.dialogRef.close();
    }).catch((data) => {
      this.onLoadingData.emit(false);
      // this.openDialogBox(data, 'actor exception');
    });

  }

  ngOnChanges(changers: SimpleChanges) {
    if (changers.initialInfor && changers.initialInfor.currentValue &&
      changers.initialInfor.currentValue.length > 0) {
      let message = '';
      setTimeout(() => {
        // const messages = changers.initialInfor.currentValue.map((item) => {
        changers.initialInfor.currentValue.forEach((item) => {
          message = message + '<br>' + item.message;
          // messageText_1 = 'eeeee \n eeeeeee';
        });
        //  });
        this.showInitialInfoMessage(message);
      }, 100);
    }

    if (this.screenViewState && this.screenViewState.formView &&
      this.screenViewState.formView.screenDefinition) {
      const screenDef = this.screenViewState.formView.screenDefinition;
      if (screenDef.dataSource !== 3 || screenDef.contactType === 0) {
        this.showToolBar = false;
      } else {
        this.showToolBar = true;
      }
    }
  }

  prives(event) {
    const varValues = this.getNewVarValues();
    this.onLoadingData.emit(true);
    this.onResetContactList.emit(); // reset cache
    console.warn('go to prives');
    this.medator.previous(varValues, (this.form.form.dirty || this.screenControlValuesIsDirty), this.contactDirty).then((data) => {
      // this.onLoadingData.emit(false);
      console.warn('prives success', data);
      this.onViewChange.emit({ kind: ViewChangeKind.GoToPrevious, value: data });
    }).catch((data) => {
      this.onLoadingData.emit(false);
      // this.openDialogBox(data, 'actor exception');
    });

  }

  next(event) {
    const varValues = this.getNewVarValues();
    this.onLoadingData.emit(true);
    this.onResetContactList.emit(); // reset cache
    console.warn('go to next');
    this.medator.next(varValues, (this.form.form.dirty || this.screenControlValuesIsDirty), this.contactDirty).then((data) => {
      // this.onLoadingData.emit(false);
      console.warn('go to next', data);
      this.onViewChange.emit({ kind: ViewChangeKind.GoToNext, value: data });
    }).catch((data) => {
      this.onLoadingData.emit(false);
      // this.openDialogBox(data, 'actor exception');
    });
  }

  ok(event) {

    // if (this.medator['message'] && this.medator['message'].isTabLogic &&
    //  this.screenViewState.isDisabaleTabLogic && this.form.form.dirty) {
    //   const message = 'Tab logic will automatically run. <br> Var values may change. <br> Please check before it close.';
    //   this.openDialogBox(message, 'Information').afterClosed().subscribe(() => {
    //     this.runTabLogic(null);
    //   });
    // } else {
    this.next(event);
    // }

  }

  closeDialog() {
    // if (this.medator['message'] && this.medator['message'].isTabLogic &&
    // this.screenViewState.isDisabaleTabLogic && this.form.form.dirty) {
    //   const message = 'Tab logic will automatically run. <br>  Var values may change. <br> Please check before it close.';
    //   this.openDialogBox(message, 'Information').afterClosed().subscribe(() => {
    //     this.runTabLogic(null);
    //   });
    // } else {
    if (this.screenViewState.mainState.runningFileExitLogic) {
      // ASK
      const message = 'Cannot abort File Exit logic! <br> <br> From the Data Entry Screen,'
        + ' click Screen \'OK\' button or double click screen to continue.';
      this.openDialogBox(message, 'Confirm');
    }
    if (this.formView.screenDefinition && this.formView.screenDefinition.screenDefinitionDto
      && this.formView.screenDefinition.screenDefinitionDto.sD_MustValidate) {

      const message =
        'Cannot abort this screen! <br> <br> This screen has been set as Must Validate click Screen '
        + '\'OK\' button or double click screen to continue.';
      this.openDialogBox(message, 'Confirm');
    } else {
      const varValues = this.getNewVarValues();
      this.onLoadingData.emit(true);
      this.medator.exit(varValues, (this.form.form.dirty || this.screenControlValuesIsDirty), this.contactDirty)
        .then((data) => {
        }).catch((data) => {
          this.onLoadingData.emit(false);
          this.dialogRef.close();
          // this.openDialogBox(data, 'actor exception');
        });
    }
    // }
  }

  onEventOutput(event: { value: any, type: ScreenDesignFormActions }) {
    if (event.type === ScreenDesignFormActions.UfnUpdate) {
      this.getUpdatedNextUfn(event.value);
    }
    if (event.type === ScreenDesignFormActions.RunTabLogic) {
      if (!this.screenViewState.isDisabaleTabLogic) {
        this.runTabLogic(event.value);
      }
    }
    if (event.type === ScreenDesignFormActions.SetScreenControlValueIsDirty) {
      // this.getUpdatedNextUfn(event.value);
      this.onScreenControlValuesDirty.emit(true);
    }
    if (event.type === ScreenDesignFormActions.EnableUpdateContact) {
      // this.getUpdatedNextUfn(event.value);
      this.onContactDirty.emit(true);
    }
    if (event.type === ScreenDesignFormActions.ShowContactSearchWithActor) {
      this.openContactSearchPoup(ContactSearchType.FIELD, { mappedField: event.value.mappedField, fieldValue: event.value.fieldValue });
    }
    if (event.type === ScreenDesignFormActions.CliAttachmentUpload ||
      event.type === ScreenDesignFormActions.MatAttachmentUpload) {
      this.onAtachmentUpload.emit(event);
    }
  }

  runTabLogic(value) {
    if (this.medator['message'] && this.medator['message'].isTabLogic) {
      const varValues = this.getNewVarValues();
      this.onLoadingData.emit(true);

      this.renderer.addClass(document.body, 'run-tab-logic');
      this.medator.tabLogic(varValues, this.form.form.dirty, false).then((data) => {
        this.renderer.removeClass(document.body, 'run-tab-logic');
        this.form.form.reset();
        this.setVarValues(data.ov, value);
        this.onLoadingData.emit(false);
      }).catch((data) => {
        // this.openDialogBox(data, 'actor exception');
        this.onLoadingData.emit(false);
      });
    }

  }

  runPlotSync(value) {
    if (this.medator['message'] && this.medator['message'].isMasterMatter) {
      const varValues = this.getNewVarValues();
      this.onLoadingData.emit(true);

      this.renderer.addClass(document.body, 'run-tab-logic');
      this.medator.tabLogicPlotSync(varValues, this.form.form.dirty, false).then((data) => {
        this.renderer.removeClass(document.body, 'run-tab-logic');
        this.form.form.reset();
        this.setVarValues(data.ov, value);
        this.onLoadingData.emit(false);
      }).catch((data) => {
        // this.openDialogBox(data, 'actor exception');
        this.onLoadingData.emit(false);
      });
    }
  }

  enableTabLogic(value) {
    this.onTabLogicUpdate.emit(value);
  }

  getUpdatedNextUfn(value: any) {
    this.onLoadingData.emit(true);
    this.service.getUpdatedNextUfn(1, value.screenDefinition.application, value.selectedDate).pipe(
      catchError((error) => {
        this.onLoadingData.emit(false);
        return empty();
      })).subscribe((data) => {
        const nextUFN = (data.nextUFN) ? data.nextUFN : '';
        this.form.form.controls[value.controlName].setValue(nextUFN);
        this.onLoadingData.emit(false);
      });
  }

  submit(value: { [name: string]: any }) {
    // console.log(value);
  }

  openDialogBox(message, title) {
    const dialogData: ConfirmDialogData = {
      content: {
        title: title,
        message: message,
        acceptLabel: 'Yes',
        rejectLabel: 'No'
      },
      contentParams: {},
      data: { messageType: 'warning' }
    };
    const deleteDialogRef = this.dialog.open(InforDialogComponent, {
      data: dialogData,
      width: '350px',
      panelClass: 'dps-notification'
    });
    return deleteDialogRef;
  }


  formDoubleClick(event) {
    if (event.target && event.target.id === 'dps-dynamic-form-wrapper') {
      this.next(event);
    }
  }

  getNewVarValues(): IVarValue[] {
    let varValues: IVarValue[] = [];
    if (this.formView.screenContanerComponentList
      && this.formView.screenContanerComponentList.length > 0) {
      varValues = this.formView.screenContanerComponentList.map((item) => {

        const tempValue = this.form.form.controls[item.control.name].value;
        const value = this.setUpControlerVarValues(tempValue, item);

        const newItem: IVarValue = {
          controlerID: +item.containerName,
          value: value,
          varNo: item.varNo,
        };
        return newItem;
      });
    }
    console.warn('varValues', varValues);
    return varValues;

  }

  setUpControlerVarValues(value, item: ScreenContanerComponent): string {

    if (item.uiComponentType === UiComponentType.Date && value instanceof Date && !isNaN(value.valueOf())) {
      value = Utilities.GetFormattedDDMMYYYYDateStr(value);
    }
    if (item.uiComponentType === UiComponentType.YesNo) {

      value = (value !== undefined) ? value.toString() : '';

      if (item.mainState.screenCheckBoxYN) {
        if (value === 'false') {
          value = '0';
        } else if (value === 'true') {
          value = '1';
        }
      } else {
        if (value === 'false') {
          value = 'N';
        } else if (value === 'true') {
          value = 'Y';
        }
      }

    }
    if (item.uiComponentType === UiComponentType.Label) {
      value = '';
    }
    if (value === undefined || value === null) {
      value = '';
    }
    return value;
  }







  setVarValues(varValues: IVarValue[], focusContainerName: string) {
    this.onNewVarValues.emit({ varValues: varValues, focusContainerName: focusContainerName });
  }


  showInitialInfoMessage(message) {


    const dialogData: ConfirmDialogData = {
      content: {
        title: 'Confirm . . .',
        message: message,
        acceptLabel: 'Yes',
        rejectLabel: 'No'
      },
      contentParams: {},
      data: null
    };
    const deleteDialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: dialogData,
      width: '350px',
      panelClass: 'dps-notification'
    });
    return deleteDialogRef;
  }


  // Contact Search Integration
  onToolBarAction(event) {
    switch (event) {
      case ContactToolBarAction.SearchAll:
        this.openContactSearchPoup(ContactSearchType.All, null);
        break;
      case ContactToolBarAction.SearchOnFile:
        this.openContactSearchPoup(ContactSearchType.FILE, null);
        break;
      case ContactToolBarAction.ConfigSearch:
        this.openSearchFieldConfigurePopup();
        break;
      case ContactToolBarAction.SaveNewContact:
        this.saveNewContact();
        break;
      case ContactToolBarAction.Clear:
        this.clearFormData();
        break;
      case ContactToolBarAction.RemoveFromFile:
        this.removeFromFile();
        break;
      default:
        break;
    }
  }

  getCallbackData(searchType: ContactSearchType) {
    const token = this.token;
    return <ICallbackData>{
      token: token,
      matterDetails: this.matterDetails,
      screenDefinition: this.screenViewState.formView.screenDefinition,
      searchType: searchType,
      fontSizeClass: '',
      mappedField: '',
      fieldValue: ''
    };
  }

  populateContactSearchParam(searchType: ContactSearchType, mappedField: string, mappedValue: string) {
    const screenDef = this.screenViewState.formView.screenDefinition;
    let searchStatusLabel: string;
    let searchFormType: string;
    switch (searchType) {
      case ContactSearchType.FILE:
        searchFormType = 'FILE';
        break;
      case ContactSearchType.FIELD:
        searchFormType = 'FIELD';
        break;
      case ContactSearchType.All:
        searchFormType = 'ALL';
        break;
    }

    if (searchType === ContactSearchType.FILE) {
      if (screenDef.screenDefinitionDto.contactTypeDescription) {
        searchStatusLabel = 'File Contacts: ' + screenDef.screenDefinitionDto.contactTypeDescription;
      }
    } else {
      if (screenDef.screenDefinitionDto.contactTypeDescription) {
        searchStatusLabel = 'All Contacts: ' + screenDef.screenDefinitionDto.contactTypeDescription;
      }
    }
    return <SearchParameters>{
      searchFormType: searchFormType,
      contactTypeId: screenDef.contactType,
      branchId: this.matterDetails.BranchId,
      appId: this.matterDetails.AppId,
      sdAppId: screenDef.screenDefinitionDto.sD_AppID,
      fileId: this.matterDetails.FileId,
      screenId: screenDef.screenNumber,
      resultsCount: 500, // move to a single place
      mappedContactField: mappedField,
      fieldValue: mappedValue,
      newContactPermission: false,
      statusLabel: searchStatusLabel,
      contactsOnfileCount: this.contactsOnFile.toString()
    };
  }

  openContactSearchPoup(searchType: ContactSearchType, payload: any) {
    this.onDisableSearchButtons.emit(true);
    const callbackData = this.getCallbackData(searchType);
    let searchCommand: UserScreenCommand.SearchContacts | UserScreenCommand.SearchContactsOnFile;
    switch (searchType) {
      case ContactSearchType.All:
        searchCommand = UserScreenCommand.SearchContacts;
        break;
      case ContactSearchType.FIELD:
        callbackData.mappedField = payload.mappedField;
        callbackData.fieldValue = payload.fieldValue;
        searchCommand = UserScreenCommand.SearchContacts;
        break;
      case ContactSearchType.FILE:
        searchCommand = UserScreenCommand.SearchContactsOnFile;
        break;
    }
    const searchParams = this.populateContactSearchParam(searchType, callbackData.mappedField, callbackData.fieldValue);
    const varValues = this.getNewVarValues();
    this.medator.showContactsSearch<any, ICallbackData>
      (varValues, (this.form.form.dirty || this.screenControlValuesIsDirty), this.contactDirty,
        searchParams, null, searchCommand, callbackData)
      .then((data) => {
        data.result.subscribe((contactSearchResult) => {
          this.onDisableSearchButtons.emit(false);
          this.handleContactSearchResult(contactSearchResult, varValues);
        });
      });
  }

  openSearchFieldConfigurePopup() {
    const contactSearchParams = this.getCallbackData(ContactSearchType.CONFIGURE);
    this.popupService.openContactSearchPoup(contactSearchParams.token, contactSearchParams);
  }


  handleContactSearchResult(searchReuslt: ContactSearchResult, oldVars: IVarValue[]) {
    switch (searchReuslt.action) {
      case ContactSearchAction.UserClosed:
        console.log('UserClosed');
        this.medator.abortContactScreen();
        break;
      case ContactSearchAction.NewContact:
        console.log('New Contact');
        this.enableNewContact(oldVars);
        break;
      case ContactSearchAction.ContactSelected:
        console.log(`ContactSelected: ${searchReuslt.selectedContactId}`);
        this.selectedContactFromSearch(searchReuslt.selectedContactId, searchReuslt.searchType);
        break;
      case ContactSearchAction.OnSaveSearchFields:
        console.log('On Save Search Fields');
        break;
    }
  }

  removeFromFile() {
    this.onClearFormData.emit(); // clear fields
    this.onUnlinkContact.emit(this.currentContactId);
    this.onResetContactList.emit();
  }

  removeFromFileKeepFormData() {
    this.onCurrentContactId.emit(0);
    this.onDecrementContactsOnFile.emit();
    const varValues = this.getNewVarValues();
    this.onNewVarValues.emit({ varValues: varValues, focusContainerName: null }); // stop data loss
    this.refreshContactOnFlag.emit();
  }

  selectedContactFromSearch(contactId: number, searchType: ContactSearchType) {
    this.medator.sendLinkedContact(contactId.toString(), this.getNewVarValues(), (this.form.form.dirty || this.screenControlValuesIsDirty),
      this.contactDirty).then(data => {
        if (data) {
          this.onNewVarValues.emit({ varValues: data.ov, focusContainerName: null });
          if (contactId > 0) {
            this.onCurrentContactId.emit(contactId);
            switch (searchType) {
              case ContactSearchType.All:
              case ContactSearchType.FIELD:
                this.onIncrmentContactsOnFile.emit();
                break;
            }
            this.refreshContactOnFlag.emit();
            this.onContactDirty.emit(false);
          }
        }
      });
  }

  enableNewContact(oldVars: IVarValue[]) {
    this.setVarValues(oldVars, null); // store user entered data before refreshing
    this.onCurrentContactId.emit(0);
    this.onEnableSaving.emit(true);
    this.refreshContactOnFlag.emit();
    this.medator.createNewContact();
  }

  saveNewContact() {
    const varValues = this.getNewVarValues();
    this.medator.saveContact(varValues, (this.form.form.dirty || this.screenControlValuesIsDirty), this.contactDirty).then(data => {
      console.log(`Saved New Contact: ${data}`);
      this.setVarValues(data.ov, null); // setnewvarvalues ?
      this.onCurrentContactId.emit(data.newContactId);
      this.onContactDirty.emit(false);
      // this.form.form.dirty = false; emite this
      this.refreshContactOnFlag.emit();
    });
    this.onEnableSaving.emit(false);
    this.onIncrmentContactsOnFile.emit();
    this.onResetContactList.emit();
  }

  enableUpdateContact(enable: boolean) {
    this.onContactDirty.emit(enable);
  }

  // saveContact() {
  //   // mediator saveContact
  //   // on Data
  //   this.onContactDirty.emit(false);
  // }

  clearFormData() {
    this.onClearFormData.emit();
    // this.form.form.dirty = false; emite this
    this.onContactDirty.emit(false);
    this.onCurrentContactId.emit(0);
  }

  generateSearchAllGridColumns() {

  }

  createContactSearchViewModel() {

  }
}
