import { FileLocation } from './../../../screen-view-core/models/screen-definition';
import { SystemJsPopupLoaderService } from './../../../shell-desktop/services/system-js-popup-loader.service';
import { ScreenContanerComponent } from '../../../screen-view-core/models/screen-contaner-component';
import { ScreenDefinition, ScreenDesignFormActions } from '../../../screen-view-core/models/screen-definition';
import { MatDialog } from '@angular/material';
import { Field, ControllerFields } from '../../../screen-view-core/models/field';
import { Component, ViewChild, ElementRef, EventEmitter, ChangeDetectionStrategy, AfterViewInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { EditorControl } from '../../../screen-view-core/models/control';
import { of } from 'rxjs';
import { checkUploadFileIsBlacklisted, showInforDialog, InfoDialogType } from '../../../core/utility/DpsUtility';


@Component({
  selector: 'dps-form-cli-attachment',
  styleUrls: ['./form-cli-attachment.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './form-cli-attachment.component.html',
})
export class FormCliAttachmentComponent extends EditorControl implements Field, AfterViewInit {
  screenContanerComponent: ScreenContanerComponent;
  screenDefinition: ScreenDefinition;
  @ViewChild('dynamicController') dynamicController: ElementRef;
  group: FormGroup;
  matDialog: MatDialog;
  eventOutput: EventEmitter<{ value: any, type: any, controler: ScreenContanerComponent }>;

  constructor(dialog: MatDialog, public popupService: SystemJsPopupLoaderService, ) {
    super(dialog);
  }

  onUploadBTNClick() {
    const fileUploadInput = <HTMLInputElement>document.getElementById(this.screenContanerComponent.control.name);
    fileUploadInput.value = null;
    fileUploadInput.click();
  }
  onCloud() {
    this.popupService.openDrivePopup(null, null).subscribe((val: any[]) => {

      const attachement = val ? val.filter(item => item && item.selected && item.data.file)
        .map(item => item.data) : null;
      if (attachement && attachement.length > 0) {
        // this.onAddFiles(attachement);
        const value = {
          file: null,
          fileLocation: FileLocation.Cloud,
          attachement: attachement
        };
        return this.eventOutput.emit({
          value: value,
          type: ScreenDesignFormActions.CliAttachmentUpload,
          controler: this.screenContanerComponent,
        });

      }
    });
  }


  controlStyle(container: ScreenContanerComponent) {
    const styles = {
      'width': container.control.width ? container.control.width + 'px' : '',
      'height': container.control.height ? container.control.height + 'px' : '',
      'margin-left': container.control.marginLeft ? container.control.marginLeft - 4 + 'px' : '',
      'font-weight': container.control.fontWeight ? container.control.fontWeight : '',
      'font-size': container.control.fontSize ? container.control.fontSize : '',
      'font-family': container.control.fontFamily ? container.control.fontFamily : '',
      'background-color': container.control.backgroundColor ? container.control.backgroundColor : '',
      'color': container.control.color ? container.control.color : '',
    };
    return styles;
  }

  onFileChange(files) {

    if (files[0]) {

      if (checkUploadFileIsBlacklisted(files[0].name)) {
        showInforDialog('Harmful file detection',
          'You are try to upload harmful file type, please contact admin', InfoDialogType.warning, this.dialog);
      } else {
        const value = { file: files[0], fileLocation: FileLocation.Client };
        this.eventOutput.emit({
          value: value,
          type: ScreenDesignFormActions.CliAttachmentUpload,
          controler: this.screenContanerComponent
        });
      }

    }
  }

  onKeyup(e) {
    // this.screenContanerComponent.control.backgroundColor = 'red';
    // this.screenContanerComponent.contanerLable.value = 'test';
    // console.log(e);
  }

  onChange(e) {
    const ctlrFields: ControllerFields = {
      screenContanerComponent: this.screenContanerComponent,
      dynamicController: this.dynamicController,
      screenDefinition: this.screenDefinition,
      eventOutput: this.eventOutput,
      group: this.group
    };
    this.textChange(e, ctlrFields);
  }

  onBlur(e) {
    const ctlrFields: ControllerFields = {
      screenContanerComponent: this.screenContanerComponent,
      dynamicController: this.dynamicController,
      screenDefinition: this.screenDefinition,
      eventOutput: this.eventOutput,
      group: this.group
    };
    this.ctlLeave(e, ctlrFields);
  }

  onDoubleClick(e) {
    const ctlrFields: ControllerFields = {
      screenContanerComponent: this.screenContanerComponent,
      dynamicController: this.dynamicController,
      screenDefinition: this.screenDefinition,
      eventOutput: this.eventOutput,
      group: this.group
    };
    this.doubleClick(e, ctlrFields);
  }

  onKeyPress(e) {
    const ctlrFields: ControllerFields = {
      screenContanerComponent: this.screenContanerComponent,
      dynamicController: this.dynamicController,
      screenDefinition: this.screenDefinition,
      eventOutput: this.eventOutput,
      group: this.group
    };
    this.keyPress(e, ctlrFields);
  }

  onKeyDown(e) {
    const ctlrFields: ControllerFields = {
      screenContanerComponent: this.screenContanerComponent,
      dynamicController: this.dynamicController,
      screenDefinition: this.screenDefinition,
      eventOutput: this.eventOutput,
      group: this.group
    };
    this.keyDown(e, ctlrFields);
  }

  onFocus(e) {

  }


  ngAfterViewInit(): void {
    console.log(this.dynamicController);
    console.log(this.screenContanerComponent);
    if (this.screenContanerComponent.control.autofocus) {
      setTimeout(() => {
        this.dynamicController.nativeElement.focus();
      });
    }
  }
}
