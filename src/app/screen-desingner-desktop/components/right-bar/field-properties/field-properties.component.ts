

import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';

import { ScreenDefinition, ScreenContactFieldTypeDto, } from '../../../../screen-view-core/models/screen-definition';
import { UiComponentType, UiViewType, SCREEN_FIELD_TYPE_LIST } from '../../../../screen-view-core/models/screen-contaner-component';
import { ScreenComponent } from '../../../../screen-view-core/models/screen-component';
import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, ElementRef, ViewChild } from '@angular/core';
import { ScreenContanerComponent } from '../../../../screen-view-core/models/screen-contaner-component';
import { MatDialog } from '@angular/material';
import { ScreenListItemsChangeKind } from '../../../../screen-desingner-core/actions/core';
import {
  InforDialogComponent, InforDialogData, InforDialogResult, ConfirmDialogData,
  ConfirmDialogResultKind
} from '../../../../shared';
import { EditLookupComponent } from './edit-lookup/edit-lookup.component';
import { SD_DataSource } from '../../../../screen-desingner-core/models/screen-desingner-request';


@Component({
  selector: 'dps-field-properties',
  templateUrl: './field-properties.component.html',
  styleUrls: ['./field-properties.component.scss']
})
export class FieldPropertiesComponent implements OnInit, OnChanges {

  @Input()
  lookupFiles: any[];

  @Input()
  selectedContanerComponent: ScreenContanerComponent;

  @Input()
  screenDefinition: ScreenDefinition;

  @Input()
  screenComponentList: ScreenContanerComponent[];

  @Output()
  onComponentChange = new EventEmitter<{ kind: ScreenListItemsChangeKind, row: ScreenContanerComponent, value: any }>();

  @Output()
  onLookupChange = new EventEmitter<{ kind: ScreenListItemsChangeKind, row: any, value: any }>();

  @Output()
  onGetlookUpData = new EventEmitter<{ payload: { appId: number } }>();

  @Output()
  onCreateLookup = new EventEmitter<{ row: ScreenContanerComponent, value: any }>();


  @ViewChild('sequence') sequenceTextbox: ElementRef;

  @ViewChild('fieldTypeName') fieldTypeNameSelectBox: ElementRef;


  maskTextDropdownValue = '';
  customMaskText = '';
  isLookUpDirty = false;
  screenContactFieldTypes: ScreenContactFieldTypeDto[] = [];
  action;
  isChangeAction = false;

  fieldTypeList = SCREEN_FIELD_TYPE_LIST;

  uiComponentType = UiComponentType;

  ViewTypeList = [
    { viewTypeId: UiViewType.VC_NORMAL, viewTypeName: 'Normal Field' },
    { viewTypeId: UiViewType.VC_VIEWONLY, viewTypeName: 'View Only' },
    { viewTypeId: UiViewType.VC_FORCED, viewTypeName: 'Forced data entry' },
    { viewTypeId: UiViewType.VC_PROTECTED, viewTypeName: 'Protected' },
  ];

  MaskList = [
    { maskName: 'TEXT (all lower case)' },
    { maskName: 'TEXT (all upper case)' },
    { maskName: 'TEXT (Title case)' },
    { maskName: 'TEXT (all)' },
    { maskName: 'CUSTOM' }
  ];


  constructor(public dialog: MatDialog) { }


  changePostCodeVar(data) {

  }

  changeAction(value) {
    if (!(this.selectedContanerComponent.control.action === null || this.selectedContanerComponent.control.action === value)) {
      this.isChangeAction = true;
    } else if (value && this.selectedContanerComponent.control.action === null) {
      this.isChangeAction = true;
    } else {
      this.isChangeAction = false;
    }
  }

  onOpenLookupPopup() {

    const confirmDialogRef = this.dialog.open(EditLookupComponent, {
      data: {
        screenDefinition: this.screenDefinition,
        lookupFiles: this.lookupFiles,
        selectedContanerComponent: this.selectedContanerComponent,
      },
      panelClass: 'screen-edit-popoup',
      width: '400px',
      disableClose: true,
      height: '500px'
    });
    confirmDialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult.kind === ScreenListItemsChangeKind.UpdateValue) {

        const screenComponentDto = { ... this.selectedContanerComponent.screenComponentDto };
        screenComponentDto.sC_Action = dialogResult.data;
        this.action = dialogResult.data;
        const component = new ScreenComponent(screenComponentDto, this.selectedContanerComponent.mainState);
        this.onComponentChange.emit({ kind: ScreenListItemsChangeKind.UpdateValue, row: component, value: '' });
        this.changeAction(component.control.action);
      }
    });
  }

  onLableDescriptionChange(lableDescription) {

    const screenComponentDto = { ... this.selectedContanerComponent.screenComponentDto };
    if (screenComponentDto.sC_VarNo === 0) {
      screenComponentDto.sC_Action = lableDescription;
    } else {
      screenComponentDto.avD_Text = lableDescription;
    }
    const component = new ScreenComponent(screenComponentDto, this.selectedContanerComponent.mainState);
    this.onComponentChange.emit({ kind: ScreenListItemsChangeKind.UpdateValue, row: component, value: '' });
  }



  get disableDescription() {
    return this.autoDescriptionType(this.selectedContanerComponent.uiComponentType);
  }

  get actionHidden() {
    return !(
      this.selectedContanerComponent.uiComponentType === this.uiComponentType.Combo ||
      this.selectedContanerComponent.uiComponentType === this.uiComponentType.Text ||
      this.selectedContanerComponent.uiComponentType === this.uiComponentType.AddressSearch ||
      this.selectedContanerComponent.uiComponentType === this.uiComponentType.PostCode);
  }

  get actionSelectionHidden() {
    return !(this.selectedContanerComponent.uiComponentType === this.uiComponentType.Combo ||
      this.selectedContanerComponent.uiComponentType === this.uiComponentType.AddressSearch ||
      this.selectedContanerComponent.uiComponentType === this.uiComponentType.PostCode);
  }

  autoDescriptionType(uiComponentType) {
    if (uiComponentType === UiComponentType.PostCode) {
      return true;
    }
    return false;
  }

  onFieldTypeChange(event) {

    if (this.autoDescriptionType(event.value)) {
      const description = this.getDiscriptionText(event.value);
      const message = 'Label description will change to ' + description + '. Need to proceed?';
      const dialogData: ConfirmDialogData = {
        content: {
          title: 'Screen Designer',
          message: message,
          acceptLabel: 'OK',
          rejectLabel: 'Cancel'
        },
        data: null
      };
      const confirmDialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: dialogData,
        disableClose: true,
        width: '350px',

        panelClass: 'dps-notification'
      });
      confirmDialogRef.afterClosed().subscribe(dialogResult => {
        if (dialogResult.kind === ConfirmDialogResultKind.Confirmed) {
          const screenComponentDto = { ... this.selectedContanerComponent.screenComponentDto };
          screenComponentDto.avD_Type = event.value;
          screenComponentDto.avD_Text = description;
          const component = new ScreenComponent(screenComponentDto, this.selectedContanerComponent.mainState);
          this.onComponentChange.emit({ kind: ScreenListItemsChangeKind.UpdateValue, row: component, value: '' });

        } else {
          const screenComponentDto = { ... this.selectedContanerComponent.screenComponentDto };
          const component = new ScreenComponent(screenComponentDto, this.selectedContanerComponent.mainState);
          this.onComponentChange.emit({ kind: ScreenListItemsChangeKind.UpdateValue, row: component, value: '' });
        }
      });

    } else {
      const screenComponentDto = { ... this.selectedContanerComponent.screenComponentDto };
      screenComponentDto.avD_Type = event.value;
      if (event.value === UiComponentType.MatAttachment) {
        screenComponentDto.avD_Help = 'Upload Mat Attachment';
      } else if (event.value === UiComponentType.CliAttachment) {
        screenComponentDto.avD_Help = 'Upload Cli Attachment';
      }
      const component = new ScreenComponent(screenComponentDto, this.selectedContanerComponent.mainState);
      this.onComponentChange.emit({ kind: ScreenListItemsChangeKind.UpdateValue, row: component, value: '' });
    }

  }

  getDiscriptionText(ciComponentType) {
    let text = '';
    // if (ciComponentType === UiComponentType.AddressSearch) {
    //   text = 'Address Search';
    // }
    if (ciComponentType === UiComponentType.PostCode) {
      text = 'Post Code';
    }
    return text;
  }




  getFieldTipeNameById(id: number): string {
    let type;
    switch (id) {
      case 0: {
        type = 'Text';
        break;
      }
      case 1: {
        type = 'Date';
        break;
      }
      case 2: {
        type = 'YesNo';
        break;
      }
      case 3: {
        type = 'Label';
        break;
      }
      case 4: {
        type = 'Combo';
        break;
      }
      case 5: {
        type = 'Currency';
        break;
      }
      case 6: {
        type = 'Integer';
        break;
      }
      case 7: {
        type = 'Line';
        break;
      }
      case 8: {
        type = 'Time';
        break;
      }
    }
    return type;

  }

  onHelpTextChange(helpText) {
    const screenComponentDto = { ... this.selectedContanerComponent.screenComponentDto };
    screenComponentDto.avD_Help = helpText;
    const component = new ScreenComponent(screenComponentDto, this.selectedContanerComponent.mainState);
    this.onComponentChange.emit({ kind: ScreenListItemsChangeKind.UpdateValue, row: component, value: '' });
  }


  onMappedContactTypeChange(event) {

    if (this.screenDefinition.dataSource === SD_DataSource.Contacts) {
      const screenComponentDto = { ... this.selectedContanerComponent.screenComponentDto };
      screenComponentDto.dM_CField = event.value;
      if (event.value.trim() !== '') {
        screenComponentDto.dM_TPID = this.screenDefinition.contactType.toString();

      } else {
        screenComponentDto.dM_TPID = null;
      }
      const component = new ScreenComponent(screenComponentDto, this.selectedContanerComponent.mainState);
      this.onComponentChange.emit({ kind: ScreenListItemsChangeKind.UpdateValue, row: component, value: '' });
    }
  }

  onInputSizeChange(inputSize) {
    const screenComponentDto = { ... this.selectedContanerComponent.screenComponentDto };
    screenComponentDto.avD_Length = +inputSize;
    const component = new ScreenComponent(screenComponentDto, this.selectedContanerComponent.mainState);
    this.onComponentChange.emit({ kind: ScreenListItemsChangeKind.UpdateValue, row: component, value: '' });
  }

  onSequenceChange(sequence) {
    const screenComponentDto = { ... this.selectedContanerComponent.screenComponentDto };

    if (this.sequenceInScreenControlList(sequence)) {

      const message = 'The sequence number is already in use, Do you still want to update the sequence?';

      const dialogData: ConfirmDialogData = {
        content: {
          title: 'Screen Designer',
          message: message,
          acceptLabel: 'OK',
          rejectLabel: 'Cancel'
        },
        data: null
      };
      const confirmDialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: dialogData,
        disableClose: true,
        width: '350px',
        panelClass: 'dps-notification'
      });
      confirmDialogRef.afterClosed().subscribe(dialogResult => {
        if (dialogResult.kind === ConfirmDialogResultKind.Confirmed) {
          screenComponentDto.sC_Sequence = sequence;
          const component = new ScreenComponent(screenComponentDto, this.selectedContanerComponent.mainState);
          this.onComponentChange.emit({ kind: ScreenListItemsChangeKind.SequenceChange, row: component, value: '' });
        } else {
          this.sequenceTextbox.nativeElement.value = screenComponentDto.sC_Sequence;
          // const component = new ScreenComponent(screenComponentDto, this.selectedContanerComponent.mainState);
          // this.onComponentChange.emit({ kind: ScreenListItemsChangeKind.SequenceChange, row: component, value: '' });
        }
      });

    } else {

      screenComponentDto.sC_Sequence = sequence;
      const component = new ScreenComponent(screenComponentDto, this.selectedContanerComponent.mainState);
      this.onComponentChange.emit({ kind: ScreenListItemsChangeKind.SequenceChange, row: component, value: '' });
    }

  }


  sequenceInScreenControlList(sequence: number) {
    let sequenceIsIn = false;
    this.screenComponentList.forEach((item, index) => {
      if (+sequence === item.sequence) {
        sequenceIsIn = true;
      }
    });
    return sequenceIsIn;
  }


  onContainerXAxisChange(xAxis) {

    const xChange = (xAxis - this.selectedContanerComponent.containerXAxis);

    const screenComponentDto = { ... this.selectedContanerComponent.screenComponentDto };
    screenComponentDto.sC_Left = screenComponentDto.sC_Left + xChange;
    const component = new ScreenComponent(screenComponentDto, this.selectedContanerComponent.mainState);
    this.onComponentChange.emit({ kind: ScreenListItemsChangeKind.UpdateValue, row: component, value: '' });
  }

  onContainerYAxisChange(yAxis) {
    const screenComponentDto = { ... this.selectedContanerComponent.screenComponentDto };
    screenComponentDto.sC_Top = yAxis;
    const component = new ScreenComponent(screenComponentDto, this.selectedContanerComponent.mainState);
    this.onComponentChange.emit({ kind: ScreenListItemsChangeKind.UpdateValue, row: component, value: '' });
  }



  onMaskChange(value) {
    this.maskTextDropdownValue = value;
    this.checkIsCustomMaskText();

    if (this.maskTextDropdownValue !== this.MaskList[4].maskName) {
      this.masktextUpdate(this.maskTextDropdownValue);
    } else {
      this.masktextUpdate('');
    }

  }
  onMaskCustomerTextValueChange(maskCustomerValue) {
    this.masktextUpdate(maskCustomerValue);
  }

  masktextUpdate(maskTextDropdownValue) {
    const screenComponentDto = { ... this.selectedContanerComponent.screenComponentDto };
    screenComponentDto.sC_Mask = maskTextDropdownValue;
    const component = new ScreenComponent(screenComponentDto, this.selectedContanerComponent.mainState);
    this.onComponentChange.emit({ kind: ScreenListItemsChangeKind.UpdateValue, row: component, value: '' });
  }


  public calculateMultilineHeight(): number {
    return 21 * 4;
  }

  onMultiLine(multiLine: boolean) {
    const screenComponentDto = { ... this.selectedContanerComponent.screenComponentDto };
    if (multiLine) {
      screenComponentDto.sC_Height = this.calculateMultilineHeight(); // KR:ToDo:Ask Lushan
    } else {
      screenComponentDto.sC_Height = 21;
    }
    screenComponentDto.sC_Multiline = multiLine;
    const component = new ScreenComponent(screenComponentDto, this.selectedContanerComponent.mainState);
    this.onComponentChange.emit({ kind: ScreenListItemsChangeKind.UpdateValue, row: component, value: '' });
  }


  onSearchFields(searchfield: boolean) {

    const screenComponentDto = { ... this.selectedContanerComponent.screenComponentDto };
    screenComponentDto.sC_Search = searchfield;
    const component = new ScreenComponent(screenComponentDto, this.selectedContanerComponent.mainState);
    this.onComponentChange.emit({ kind: ScreenListItemsChangeKind.UpdateValue, row: component, value: '' });



  }

  onViewType(event) {
    const uiViewType = event.value;
    const screenComponentDto = { ... this.selectedContanerComponent.screenComponentDto };

    if (uiViewType === UiViewType.VC_FORCED) {
      screenComponentDto.sC_Force = true;
      screenComponentDto.sC_Protected = false;
      screenComponentDto.sC_Enabled = true;
    }
    if (uiViewType === UiViewType.VC_PROTECTED) {
      screenComponentDto.sC_Force = false;
      screenComponentDto.sC_Protected = true;
      screenComponentDto.sC_Enabled = true;
    }
    if (uiViewType === UiViewType.VC_VIEWONLY) {
      screenComponentDto.sC_Force = false;
      screenComponentDto.sC_Protected = false;
      screenComponentDto.sC_Enabled = false;
    }
    if (uiViewType === UiViewType.VC_NORMAL) {
      screenComponentDto.sC_Force = false;
      screenComponentDto.sC_Protected = false;
      screenComponentDto.sC_Enabled = true;
    }
    const component = new ScreenComponent(screenComponentDto, this.selectedContanerComponent.mainState);
    this.onComponentChange.emit({ kind: ScreenListItemsChangeKind.UpdateValue, row: component, value: '' });
  }

  // tslint:disable-next-line:member-ordering
  isCustomMaskText = false;

  checkIsCustomMaskText() {
    this.isCustomMaskText = false;

    if (this.selectedContanerComponent && this.selectedContanerComponent.control.maskText !== '') {
      if ((this.selectedContanerComponent.control.maskText.trim() === this.MaskList[0].maskName.trim() ||
        this.selectedContanerComponent.control.maskText.trim() === this.MaskList[1].maskName.trim() ||
        this.selectedContanerComponent.control.maskText.trim() === this.MaskList[2].maskName.trim() ||
        this.selectedContanerComponent.control.maskText.trim() === this.MaskList[3].maskName.trim())) {
        this.isCustomMaskText = false;
      } else {
        this.isCustomMaskText = true;
      }
    }
    if (this.maskTextDropdownValue === this.MaskList[4].maskName) {
      this.isCustomMaskText = true;
    }
    return this.isCustomMaskText;
  }

  ngOnInit() {
    if (this.screenDefinition && this.screenDefinition.application) {
      this.onGetlookUpData.emit({ payload: { appId: +this.screenDefinition.application } });
    }
    if (this.screenDefinition && this.screenDefinition.screenContactFieldTypes) {
      this.screenContactFieldTypes = [];
      this.screenDefinition.screenContactFieldTypes.forEach((screenContactFieldType) => {
        const screenContactFieldTypeObj: ScreenContactFieldTypeDto = screenContactFieldType;
        if (!screenContactFieldTypeObj.description1) {
          screenContactFieldTypeObj.description1 = screenContactFieldTypeObj.name;
        }
        this.screenContactFieldTypes.push(screenContactFieldTypeObj);
      });
    }
  }

  onLookup(event) {
    if (this.lookupFiles && this.lookupFiles.length > 0) {
      this.onOpenLookupPopup();
    } else {
      const messageText = 'There are no lookup files found. Please enter a filename to create a new file.';
      this.messageDialog(messageText);
    }

  }



  messageDialog(messageText) {
    const headingText = 'Lookup';
    const dialogData: ConfirmDialogData = {
      content: {
        title: headingText,
        message: messageText,
        acceptLabel: 'OK',
      },
      data: { messageType: 'alert' }
    };
    this.dialog.open(InforDialogComponent, {
      data: dialogData,
      disableClose: true,
      width: '350px',
      panelClass: 'dps-notification'
    });
  }


  validateLookupFileName() {

  }



  ngOnChanges(changes: SimpleChanges) {
    if (changes.selectedContanerComponent &&
      (!changes.selectedContanerComponent.previousValue || (changes.selectedContanerComponent.previousValue.containerName
        !== changes.selectedContanerComponent.currentValue.containerName)
      )) {
      this.maskTextDropdownValue = '';
      this.customMaskText = '';
      if (this.selectedContanerComponent) {
        if (!this.checkIsCustomMaskText()) {
          this.maskTextDropdownValue = this.selectedContanerComponent.control.maskText;
        } else {
          this.maskTextDropdownValue = this.MaskList[4].maskName;
          this.customMaskText = this.selectedContanerComponent.control.maskText;
        }
        if (changes.lookupFiles && !changes.lookupFiles.isFirstChange()) {
          this.onOpenLookupPopup();
        }
      }
    }
    if (this.selectedContanerComponent) {
      this.changeAction(this.selectedContanerComponent.control.action);
    }
  }

  actionChangeByManule() {
    // if () {
    //   this.isLookUpDirty = true;
    // } else {
    //   this.isLookUpDirty = false;
    // }
  }


  onActionChange(value) {

    if (this.selectedContanerComponent.control.action !== value) {
      const screenComponentDto = { ... this.selectedContanerComponent.screenComponentDto };
      screenComponentDto.sC_Action = value;
      const component = new ScreenComponent(screenComponentDto, this.selectedContanerComponent.mainState);
      this.onCreateLookup.emit({ row: component, value: +this.screenDefinition.application });
      this.changeAction(value);
      this.isChangeAction = true;
    }

  }

  onNextField() {
    this.onComponentChange.emit({ kind: ScreenListItemsChangeKind.GoToNext, row: this.selectedContanerComponent, value: '' });
  }
  onPreviousField() {
    this.onComponentChange.emit({ kind: ScreenListItemsChangeKind.GoToPrevious, row: this.selectedContanerComponent, value: '' });
  }
  onDelete() {
    this.onComponentChange.emit({
      kind: ScreenListItemsChangeKind.DeleteItemFromDb,
      row: this.selectedContanerComponent, value: ''
    });
  }

  onItemChange() {

  }


}
