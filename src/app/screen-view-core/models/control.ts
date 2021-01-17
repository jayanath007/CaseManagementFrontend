import { ControllerFields } from './field';
import { ConfirmDialogResultKind, InforDialogData } from '../../shared/models/dialog';
import { ScreenDesignFormActions } from './screen-definition';
import { DatepickerDialogComponent } from '../../screen-view-desktop/components/datepicker-dialog/datepicker-dialog.component';
import { ControlInfo, UiViewType, UiComponentType, MaskValidateTextModel, ScreenContanerComponent } from './screen-contaner-component';
import { Utilities } from './utilities';
import { MatDialog } from '@angular/material';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { InforDialogComponent } from '../../shared/components/infor-dialog/infor-dialog.component';
import { ConfirmDialogData } from '../../shared';


export abstract class Control {
    controlStyle(container: ScreenContanerComponent) {
        const styles = {
            'width': container.control.width ? container.control.width + 'px' : '',
            'height': container.control.height ? container.control.height + 'px' : '',
            'margin-left': container.control.marginLeft ? container.control.marginLeft - 5 + 'px' : '',
            'font-weight': container.control.fontWeight ? container.control.fontWeight : '',
            'font-size': container.control.fontSize ? container.control.fontSize : '',
            'font-family': container.control.fontFamily ? container.control.fontFamily : '',
            'background-color': container.control.backgroundColor ? container.control.backgroundColor : '',
            'color': container.control.color ? container.control.color : '',
        };
        return styles;
    }
    containerStyle(container: ScreenContanerComponent) {
        const constyles = {
            // 'left': container.containerXAxis ? container.containerXAxis + 'px' : '',
            // 'top': container.containerYAxis ? container.containerYAxis + 'px' : '',
            // 'width': container.containerWidth ? container.containerWidth + 'px' : '',
        };
        return constyles;
    }
}

export abstract class DisplayControl extends Control {
    constructor(
        public id: string,
        protected style: ControlInfo,
        protected controlerClass: string,
        protected dialog: MatDialog) {
        super();
    }
}

export abstract class EditorControl extends Control {

    protected controlerEvents = '';
    protected controlLeave: (e: any, ctlrField: ControllerFields) => void;
    protected controlDoubleClick: (e: any, ctlrField: ControllerFields) => void;
    protected controlKeyPress: (e: any, ctlrField: ControllerFields) => void;
    protected controlKeyDown: (e: any, ctlrField: ControllerFields) => void;
    protected controlTextChange: (e: any, ctlrField: ControllerFields) => void;
    // protected controlFileUpload: (e: any, ctlrField: ControllerFields) => void;
    protected forceFlag = true;
    protected LockedContact = false;
    protected protectFlag = true;
    protected headingText = 'DPS Data Entry';
    protected textChanged = false;
    protected mMessageBoxShown = false;
    protected previousText = '';
    protected tooltipShowDelay = 1000;


    constructor(protected dialog: MatDialog) {
        super();
        this.controlLeave = this.ctlLeave;
        this.controlDoubleClick = this.doubleClick;
        this.controlKeyPress = this.keyPress;
        this.controlTextChange = this.textChange;
        this.controlKeyDown = this.keyDown;
        // this.controlFileUpload = this.fileUpload;
    }



    ctlLeave(e: any, ctlrFields: ControllerFields): void {
        let focusContainerName;
        let forcedEntryField = false;
        if (e.relatedTarget &&
            !(e.relatedTarget.attributes['data-main-button'] && e.relatedTarget.attributes['data-main-button'].value === 'true')) {

            // && e.relatedTarget.nodeName !== 'MAT-DIALOG-CONTAINER'
            if (ctlrFields.screenContanerComponent.mainState.disabilityColors) {
                ctlrFields.screenContanerComponent.contanerLable.color =
                    ctlrFields.screenContanerComponent.searchField ? 'darkred' : 'black';
            }
            if (ctlrFields.screenContanerComponent.uiViewType === UiViewType.VC_FORCED) {
                if (!this.getControllerValue(ctlrFields)
                    || this.getControllerValue(ctlrFields).toString().length === 0) {
                    if (e.relatedTarget['type']) {

                        forcedEntryField = true;
                        //  Avoided the events fired from outside the screen components
                        const messageText = 'Field \'' + ctlrFields.screenContanerComponent.contanerLable.value
                            + '\' is a Forced Data Entry field and cannot be left blank.';
                        const dialogData: InforDialogData = {
                            content: {
                                title: this.headingText,
                                message: messageText,
                            },
                            data: { messageType: 'warning' }
                        };
                        const confirmDialogRef = this.dialog.open(InforDialogComponent, {
                            data: dialogData,
                            disableClose: true,
                            width: '350px',
                            panelClass: 'dps-notification',
                        });
                        confirmDialogRef.afterClosed().subscribe(result => {
                            if (result.kind === ConfirmDialogResultKind.Confirmed) {
                                focusContainerName = ctlrFields.screenContanerComponent.containerName;
                                ctlrFields.dynamicController.nativeElement.focus();
                            }
                        });
                    } else {
                        focusContainerName = ctlrFields.screenContanerComponent.containerName;
                        ctlrFields.dynamicController.nativeElement.focus();
                    }
                }
            }
            this.validateFieldControl(ctlrFields);
            if (ctlrFields.screenContanerComponent.control.action === '*UFN*'
                && ( this.getControllerValue(ctlrFields).toString().trim() === '')) {
                const message = 'Please select a date for the UFN\n';
                // Spitfire classic was using info dialog, now switched to
                // ConfirmDialog as need to show 'Ok' 'Cancel' buttons
                const dialogData: ConfirmDialogData = {
                    content: {
                        title: 'UFN generator',
                        message: message,
                        acceptLabel: 'OK',
                        rejectLabel: 'Cancel'
                    },
                    data: null
                };
                const confirmDialogRef = this.dialog.open(DatepickerDialogComponent, {
                    data: dialogData,
                    disableClose: true,
                    width: '350px'
                });
                confirmDialogRef.afterClosed().subscribe(result => {
                    if (result) {
                        const selectedDate = Utilities.GetFormattedDDMMYYYYDateStr(result);

                        ctlrFields.eventOutput.emit({
                            value: {
                                screenDefinition: ctlrFields.screenDefinition,
                                selectedDate: selectedDate,
                                controlName : ctlrFields.screenContanerComponent.control.name,
                            },
                            type: ScreenDesignFormActions.UfnUpdate
                        });
                    }
                });
            }
            if (ctlrFields.screenContanerComponent.uiComponentType === UiComponentType.Currency) {
                try {
                    const value: number = parseFloat(this.getControllerValue(ctlrFields).toString().replace(/,/g, ''));
                    if (!isNaN(value)) {
                        this.setControllerValue(ctlrFields, value.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,'));
                    } else {
                        this.setControllerValue(ctlrFields, '');
                    }
                } catch (e) {
                    this.setControllerValue(ctlrFields, '');
                }
            }
            if (ctlrFields.screenContanerComponent.uiComponentType === UiComponentType.Time) {
                try {
                    //  let value: number = parseInt(this. contaner.control.value.toString());
                    if (!this.getControllerValue(ctlrFields)
                        || this.getControllerValue(ctlrFields).toString().length === 0) {
                        this.setControllerValue(ctlrFields, '00:00');
                    } else {
                        const val = Utilities.GetTimeFromString(this.getControllerValue(ctlrFields).toString());
                        this.setControllerValue(ctlrFields, val);
                    }
                    //  this. contaner.control.value =
                    //   this.GetTimeFromString(value.toString());// kendo.toString(value, 'HH:mm');
                } catch (e) {
                    this.setControllerValue(ctlrFields, '');
                }
            }
            if (!focusContainerName) {
                focusContainerName = (e.relatedTarget) ? e.relatedTarget.getAttribute('control-name') : null;
            }
            if (!forcedEntryField) {
                ctlrFields.eventOutput.emit({ value: focusContainerName, type: ScreenDesignFormActions.RunTabLogic });
            }
        } else {
            if (!(e.relatedTarget && e.relatedTarget.attributes['data-main-button']
                && e.relatedTarget.attributes['data-main-button'].value === 'true')) {
                e.target.focus();
            }
        }
    }

    doubleClick(e: any, ctlrField: ControllerFields): void {
        if (ctlrField.screenContanerComponent.uiViewType !== UiViewType.VC_VIEWONLY) {
            let contactType = '';

            if (ctlrField.screenContanerComponent.screenComponentDto.sD_ContactType) {
                contactType = ctlrField.screenContanerComponent.screenComponentDto.sD_ContactType.toString();
            }

            //  KR: Warn user about non-mapped fields if the screen is a contact screen
            // todo
            if (ctlrField.screenDefinition &&
                ctlrField.screenDefinition.dataSource === 3) {
                if (ctlrField.screenContanerComponent.mappedContactField) {
                    let controllerValue = '';

                    if (this.getControllerValue(ctlrField)) {
                        controllerValue = this.getControllerValue(ctlrField).toString();
                    }

                    // this.uiComponentScope.screenDesignFormComponentController.showContactSearchWithActor
                    //     ('FIELD', container.mappedContactField, controllerValue);
                    ctlrField.eventOutput.emit({
                        value: {
                            'formType': 'FIELD',
                            'mappedField': ctlrField.screenContanerComponent.mappedContactField,
                            'fieldValue': controllerValue
                        }, type: ScreenDesignFormActions.ShowContactSearchWithActor
                    });
                } else {
                    let message = 'You cannot search on this field!\n\n';
                    message += 'No Contact type ' + contactType
                        + ' mapping found for variable ' + ctlrField.screenContanerComponent.screenComponentDto.avD_VarNo + '!';
                    const dialogData: InforDialogData = {
                        content: {
                            title: 'DPS Software',
                            message: message,
                        },
                        data: { messageType: 'warning' }
                    };
                    const confirmDialogRef = this.dialog.open(InforDialogComponent, {
                        data: dialogData,
                        disableClose: true,
                        width: '350px',
                        panelClass: 'dps-notification',
                    });
                }
            }
        }


        // let sourceField: string = '';
        // let contactType: number;
        // let _letNo: number;

        // // to-do
        // //  Need to know where the screen data is loaded from
        // //  Get value for the 'sourceField' above

        // if (sourceField == '') {
        //     let message: string = 'You cannot search on this field!\n\n';
        //     message += 'No Contact type ' + contactType + ' mapping found for letiable ' + _letNo + '!';
        //     this.uiComponentScope.confirmModalService.displayConfirmModal('DPS Software', message, 'Ok', 'Conform');
        // }

        // let searchText: string = (this. contaner.control.value)
        //  ? this. contaner.control.value.toString() : '';
        // if (searchText != '') {
        //     // to-do
        //     //  Search Contacts using fieldFilter
        // }
    }

    keyPress(e: any, ctlrFields: ControllerFields): boolean {
        const self = this;
        // if (e.keyCode == 9) {
        //     e.preventDefault();
        //     return true;
        // }


        // console.log(self.splice(e.currentTarget.selectionStart - 1,
        // e.currentTarget.selectionEnd - (e.currentTarget.selectionStart - 1), '', e.currentTarget.value));

        if (ctlrFields.screenContanerComponent.uiComponentType === UiComponentType.Integer) {
            const charCode = (e.which) ? e.which : e.keyCode;
            if (charCode > 31 && (charCode < 48 || charCode > 57)) {
                e.preventDefault();
                return true;
            }
        }

        // combo box cant edit when protected
        if (ctlrFields.screenContanerComponent.uiViewType === UiViewType.VC_PROTECTED
            && ctlrFields.screenContanerComponent.uiComponentType === UiComponentType.Combo) {
            e.preventDefault();
            return true;
        }

        if (ctlrFields.screenContanerComponent.uiViewType === UiViewType.VC_VIEWONLY) {
            // ToDo: 'LockedContact' letiable should be considered after introducing 'Contact screens'
            return true;
        }

        if (ctlrFields.screenContanerComponent.uiViewType === UiViewType.VC_PROTECTED && self.protectFlag === true) {
            if (this.getControllerValue(ctlrFields) === '') {
                self.protectFlag = false;
            } else {
                e.preventDefault();
                // KR: Managed to prevent from here since JS is asynchronous. If user select the 'Yes' button only,
                // let the key press happen via assigning the char value to controller.
                const pressedCharCode = (e.which) ? e.which : e.keyCode;
                const dialogData: ConfirmDialogData = {
                    content: {
                        title: 'Protected Data',
                        message: 'Amend protected field contents - are you sure?',
                        acceptLabel: 'Yes',
                        rejectLabel: 'No'
                    },
                    data: null
                };
                const confirmDialogRef = this.dialog.open(ConfirmDialogComponent, {
                    data: dialogData,
                    width: '350px',
                    panelClass: 'dps-notification'
                });
                confirmDialogRef.afterClosed().subscribe(result => {
                    if (result.kind === ConfirmDialogResultKind.Confirmed) {
                        const charVal = String.fromCharCode(pressedCharCode);
                        if (ctlrFields.screenContanerComponent.uiComponentType === UiComponentType.Text) {
                            const originalValue = this.getControllerValue(ctlrFields).toString();
                            if (e.keyCode === 8) {
                                if (e.target.selectionStart === e.target.selectionEnd) {
                                    // no selection
                                    if (e.target.selectionStart === 0) {

                                    } else {
                                        const value = self.splice(e.target.selectionStart - 1,
                                            e.target.selectionEnd - (e.target.selectionStart - 1),
                                            '', e.target.value);
                                        this.setControllerValue(ctlrFields, value);
                                    }
                                } else {
                                    const value = self.splice(e.target.selectionStart, e.target.selectionEnd -
                                        (e.target.selectionStart),
                                        '', e.target.value);
                                    this.setControllerValue(ctlrFields, value);
                                }
                            } else {
                                const value = self.splice(e.target.selectionStart,
                                    e.target.selectionEnd - e.target.selectionStart,
                                    charVal, originalValue);
                                this.setControllerValue(ctlrFields, value);
                                //  originalValue.slice(0, e.currentTarget.selectionStart) + charVal +
                                // originalValue.slice(e.currentTarget.selectionStart + Math.abs(e.currentTarget.selectionEnd
                                //  - e.currentTarget.selectionStart));
                            }
                            setTimeout(() => {
                                let startPosition = e.target.selectionStart;
                                if (e.keyCode === 8) {
                                    startPosition = startPosition - 1;
                                } else {
                                    startPosition = startPosition + 1;
                                }
                                if (ctlrFields.dynamicController.nativeElement && startPosition) {
                                    ctlrFields.dynamicController.nativeElement['selectionStart'] = startPosition;
                                    // angular.element(e.target)[0]['selectionEnd'] = startPosition; // debug and verify
                                    ctlrFields.dynamicController.nativeElement['selectionEnd'] = startPosition;
                                }
                            }, 100);
                        } else {
                            let value = this.getControllerValue(ctlrFields);
                            value += charVal;
                            this.setControllerValue(ctlrFields, value);
                        }
                        self.previousText = this.getControllerValue(ctlrFields).toString();
                        self.textChanged = true;
                        self.protectFlag = false;
                        // KR: clear the protect flag -
                        // this means the user won't be warned again this session on this screen
                    } else {
                        self.textChanged = false;
                    }
                });
            }
        }

        if (ctlrFields.screenContanerComponent.uiViewType === UiViewType.VC_PROTECTED && this.protectFlag === false) {
            // e.preventDefault();
            this.previousText = this.getControllerValue(ctlrFields).toString();
        }

        if (ctlrFields.screenContanerComponent.uiComponentType === UiComponentType.Text || UiComponentType.Combo) {
            let maxLength = ctlrFields.screenContanerComponent.control.maxLength;

            if (!(e.keyCode === 8)) {// Check for backspace key
                if (ctlrFields.screenContanerComponent.control.multiLine) {
                    maxLength *= 4;
                }

                if (e.target['value'] && e.target['value'].length >= maxLength) {
                    if (this.mMessageBoxShown === false) {
                        const message: string = 'Maximum length ' + maxLength + ' exceeded!';
                        const dialogData: InforDialogData = {
                            content: {
                                title: 'DPS Data Entry',
                                message: message,
                            },
                            data: { messageType: 'warning' }
                        };
                        const confirmDialogRef = this.dialog.open(InforDialogComponent, {
                            data: dialogData,
                            width: '350px',
                            panelClass: 'dps-notification',
                        });
                        this.textChanged = false;
                        this.mMessageBoxShown = true;
                    }
                    e.preventDefault();
                }

                if (!(this.getControllerValue(ctlrFields) === undefined)
                    && !(this.getControllerValue(ctlrFields) === null)) {
                    if (!this.MaskValidateChar(e, ctlrFields)) {
                        e.preventDefault();
                    }
                }
            }
        }

        if (ctlrFields.screenContanerComponent.uiComponentType === UiComponentType.Currency) {
            if (typeof this.getControllerValue(ctlrFields) !== 'undefined') {

                const text: string = this.getControllerValue(ctlrFields).toString();

                if (!(Utilities.IsNumeric(e.key) || e.key === '.' || e.keyCode === 8)) {
                    e.preventDefault();
                }

                const pointIndex: number = text.indexOf('.');
                if (pointIndex !== -1 && e.key === '.') {
                    e.preventDefault();
                }

                if (text.length === 0 && e.key === '.') {
                    e.preventDefault();
                }

                if ((pointIndex !== -1) && e.target['selectionStart'] > pointIndex
                    && text.length - pointIndex > 2 && !(e.keyCode === 8)) {
                    e.preventDefault();
                }
            }
        }
    }

    keyDown(e: any, ctlrField: ControllerFields): any {
        const self = this;
        if (e.keyCode === 8) {
            if (ctlrField.screenContanerComponent.uiViewType === UiViewType.VC_PROTECTED && self.protectFlag === true) {
                return self.controlKeyPress(e, ctlrField);
            }
        }
        if (ctlrField.screenContanerComponent.uiComponentType === UiComponentType.Date) {
            // Allow only Numbers and Forward Slashes
            const charCode = e.which || e.keyCode;
            if (charCode === 191 || charCode === 46 || (charCode < 105 && charCode > 96)) {
                // Forward Slash and Delete keys respectively
                // this is allowed
            } else if (charCode > 31 && (charCode < 48 || charCode > 57)) {
                e.preventDefault();
            }
        }
    }

    textChange(e: any, ctlrField: ControllerFields): void {

        // KR: If it's a mapped contact field - excluding contact refs, which will be integer values - dirty the contact
        if (ctlrField.screenContanerComponent.mappedContactField != null &&
            ctlrField.screenContanerComponent.mappedContactField !== '' &&
            (Utilities.atoi(ctlrField.screenContanerComponent.mappedContactField) === 0)) {
            ctlrField.eventOutput.emit({ value: true, type: ScreenDesignFormActions.EnableUpdateContact });
            // this.uiComponentScope.screenDesignFormComponentController.enableUpdateContact(true);
        } else {
            // KR: dirty flag for normal data, and also contact ref data
            ctlrField.screenContanerComponent.control.isDirty = true;
        }

        if (ctlrField.screenContanerComponent.uiComponentType === UiComponentType.Combo) {
            if (this.getControllerValue(ctlrField)
                && this.getControllerValue(ctlrField).toString().length >
                ctlrField.screenContanerComponent.control.maxLength) {

                const controlerValue: string = this.getControllerValue(ctlrField).toString();
                const value = controlerValue.substring(0, ctlrField.screenContanerComponent.control.maxLength);
                this.setControllerValue(ctlrField, value);

            }
        }
        ctlrField.eventOutput.emit({ value: true, type: ScreenDesignFormActions.SetScreenControlValueIsDirty });
        // this.uiComponentScope.screenDesignFormComponentController.screenControlValuesisDirty = true;
    }

    protected splice(start, delCount, newSubStr, originalValue): any {
        return originalValue.slice(0, start) + newSubStr + originalValue.slice(start + Math.abs(delCount));
    }

    protected validateFieldControl(ctlrFields: ControllerFields) {

        const value: any = this.getControllerValue(ctlrFields);
        if (value && value.length !== 0) {

            let text = value.toString();

            const validateModel: MaskValidateTextModel = this.maskValidateText(text, ctlrFields.screenContanerComponent);

            if (validateModel && validateModel.inputText && validateModel.isValid) {
                text = validateModel.inputText;
            }

            if (!validateModel.isValid) {
                const messageText = 'Couldn t apply mask ' + ctlrFields.screenContanerComponent.control.maskText
                    + ' to input text ' + this.getControllerValue(ctlrFields);
                const dialogData: InforDialogData = {
                    content: {
                        title: this.headingText,
                        message: messageText,
                    },
                    data: { messageType: 'warning' }
                };
                const confirmDialogRef = this.dialog.open(InforDialogComponent, {
                    data: dialogData,
                    width: '350px',
                    panelClass: 'dps-notification',
                });
            } else {
                if (text.length > 0 && (this.getControllerValue(ctlrFields).toString() !== text)) {
                    this.setControllerValue(ctlrFields, text);
                }
            }
        }
    }

    protected MaskValidateChar(e: KeyboardEvent, ctlrFields: ControllerFields): boolean {
        const index: number = this.getControllerValue(ctlrFields).toString().length;
        let validate = false;
        const c: string = e.key;

        switch (ctlrFields.screenContanerComponent.control.maskText) {
            case null:
                return true;
            case '':
                return true;

            case 'TEXT (all lower case)':
                if (Utilities.IsUpperChar(c[0])) {
                }

                validate = (Utilities.IsLowerChar(c[0]) || Utilities.IsPunctuation(c[0]));
                // KR:Above code will be useless since the 'Validate' letiable value is getting changed below
                // but I have refactored the old code as it is.
                validate = true;
                return validate;

            case 'TEXT (all upper case)':
                return true;

            case 'TEXT (Title case)':
                return true;

            case 'TEXT (all)':
                return true;

            default:
                if (ctlrFields.screenContanerComponent.control.maskText.length <= index) {
                    return validate;
                } else {
                    switch (ctlrFields.screenContanerComponent.control.maskText[index]) {
                        case 'N':
                            validate = !isNaN(Number(c[0]));
                            break;
                        case '-':
                            validate = Utilities.IsTextEquals(ctlrFields.screenContanerComponent.control.maskText[index], c[0]);
                            break;
                        case 'T':
                            validate = Utilities.IsUpperChar(c[0]);
                            break;
                        case 't':
                            validate = Utilities.IsLowerChar(c[0]);
                            break;
                        case '/':
                            validate = Utilities.IsTextEquals(ctlrFields.screenContanerComponent.control.maskText[index], c[0]);
                            break;
                        case '\\':
                            validate = Utilities.IsTextEquals(ctlrFields.screenContanerComponent.control.maskText[index], c[0]);
                            break;
                        default:
                            validate = true;
                            break;
                    }
                    return validate;
                }
        }
    }

    protected maskValidateText(value: any, container: ScreenContanerComponent): MaskValidateTextModel {
        let tx: any = null;
        if ((typeof value !== 'undefined')) {
            tx = value.toString();
        }
        let validate = false;
        const validateModel: MaskValidateTextModel = { inputText: tx, isValid: false };

        switch (container.control.maskText) {
            case null:
                validateModel.isValid = true;
                return validateModel;
            case '':
                validateModel.isValid = true;
                return validateModel;
            case 'TEXT (all lower case)':
                tx = tx.toLowerCase();
                validateModel.inputText = tx;
                validateModel.isValid = true;
                return validateModel;

            case 'TEXT (all upper case)':
                tx = tx.toUpperCase();
                validateModel.inputText = tx;
                validateModel.isValid = true;
                return validateModel;

            case 'TEXT (Title case)':

                // Character by character approch
                let spaceFound = false;
                let sentence: string = tx;

                for (let i = 0; i < sentence.length; i++) {
                    if (spaceFound || i === 0) {
                        sentence = sentence.substr(0, i) + sentence[i].toUpperCase() + sentence.substr(i + 1);
                        spaceFound = false;
                    }
                    if (sentence[i] === ' ') {
                        spaceFound = true;
                    }

                }
                tx = sentence;
                validateModel.inputText = tx;
                validateModel.isValid = true;
                return validateModel;

            case 'TEXT (all)':
                validateModel.isValid = true;
                return validateModel;

            default: // ToDo: Implement the logic correctly.
                if (container.control.maskText[0] === '(') {
                    let left = '', right = '';
                    let j: number, leftRange: number, rightRange: number, txValue: number;

                    for (j = 2; container.control.maskText[j] !== ')'; j++) {
                        left = left + container.control.maskText[j];
                    }

                    for (j = j + 3; container.control.maskText[j] !== ')'; j++) {
                        right = right + container.control.maskText[j];
                    }

                    leftRange = Number(Number(left).toFixed(1));
                    rightRange = Number(Number(right).toFixed(1));
                    txValue = Number(Number(tx).toFixed(1));

                    if (txValue > leftRange && txValue < rightRange) {
                        validateModel.isValid = true;
                        return validateModel;
                    } else {
                        validateModel.isValid = false;
                        return validateModel;
                    }
                } else {
                    let i = 0;

                    if (tx.length !== container.control.maskText.length) {
                        validateModel.isValid = false;
                        return validateModel;
                    }
                    for (i = 0; i < tx.length; i++) {
                        switch (container.control.maskText[i]) {
                            case 'N':
                                validate = !isNaN(Number(tx[i]));
                                break;
                            case '-':
                                validate = Utilities.IsTextEquals(container.control.maskText[i], tx[i]);
                                break;
                            case 'T':
                                if (Utilities.IsLowerChar(tx[i])) {
                                    tx[i] = tx[i].toUpperCase();
                                }
                                validate = Utilities.IsUpperChar(tx[i]);
                                break;
                            case 't':
                                if (Utilities.IsUpperChar(tx[i])) {
                                    tx[i] = tx[i].toLowerCase();
                                }
                                validate = Utilities.IsLowerChar(tx[i]);
                                break;
                            case '/':
                                validate = Utilities.IsTextEquals(container.control.maskText[i], tx[i]);
                                break;
                            case '\\':
                                validate = Utilities.IsTextEquals(container.control.maskText[i], tx[i]);
                                break;
                            default:
                                validate = true;
                                break;
                        }

                        if (validate === false) {
                            validateModel.isValid = false;
                            return validateModel;
                        }
                    }
                }
                validateModel.isValid = validate;
                return validateModel;
        }
    }




    private getControllerValue(ctlrField: ControllerFields): any {
        return ctlrField.group.controls[ctlrField.screenContanerComponent.control.name].value;
    }

    private setControllerValue(ctlrField: ControllerFields, value: any) {
        ctlrField.group.controls[ctlrField.screenContanerComponent.control.name].setValue(value);
    }
}


