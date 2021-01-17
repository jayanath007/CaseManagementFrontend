import { IMainState } from './request';
import {
    ScreenContanerComponent, ControlInfo, UiComponentType,
    UiViewType, ScreenComponentDto, UiComponentFontSize
} from './screen-contaner-component';
import { Utilities } from './utilities';

export class ScreenComponent implements ScreenContanerComponent {

    varNo: number;
    containerName: string;
    containerXAxis: number;
    containerYAxis: number;
    containerHeight: number;
    containerWidth: number;
    isEditMode: boolean;
    searchField: boolean;
    mappedContactField: string;
    contanerLable: ControlInfo;
    control: ControlInfo;
    uiComponentType: UiComponentType;
    uiViewType: UiViewType;
    isSelected: boolean;
    onContact?: boolean;
    sequence: number;
    isNewItem?: boolean;
    screenComponentDto?: ScreenComponentDto;


    // duplicate
    // id: number;
    // avdVarNo: number;
    // labelWidth: number;
    // labelDescription: string;
    // fieldType: string;
    // helpText: string;
    // visible: boolean;
    // MaskText: string;
    // isCustomMaskText: boolean;
    // customMaskText: string;
    // lookupText: Array<string>;
    // selectedOrderNumber: number;
    // containerLabelColor: string;
    // containerBackColor: string;
    // containerLabelFontWeight: string;
    // containerLabelFontFamily: string;
    // labelFontSize: string;
    // containerLabelMarginLeft: number;
    // containerLabelMarginTop: number;
    // controllerWidth: number;
    // controllerHeight: number;
    // controllerVisible: boolean;
    // controllerMaxLength: number;
    // controllerMarginLeft: number;
    // controllerMarginTop: number;
    // controllerEnabale: boolean;
    // controllerReadOnly: boolean;
    // controllerBackColor: string;
    // controllerColor: string;
    // controllerFontWeight: string;
    // controllerFontFamily: string;
    // controllerFontSize: string;
    // controllerAction: string;
    // controllerTabindex: number;
    // controllerValue: any;
    // controllerMultiLine: boolean;
    // maxLength: number;


    constructor(screenComponentDto: ScreenComponentDto, public mainState: IMainState) {

        // to-do-BE need to discused    fc.ScreenControlsID = (UserScreens.CurrentScreen.FileScreenDefinition ? 0 : (int)row["SC_ID"]);

        // this.id = screenComponentDto.sC_ID;
        // this.avdVarNo = screenComponentDto.avD_VarNo;
        // this.fieldType = screenComponentDto.avD_TypeText;
        // this.visible = screenComponentDto.sC_Visible;
        // this.isCustomMaskText = this.setIsCustomMaskText(screenComponentDto);
        // this.customMaskText = this.setCustomMaskText(screenComponentDto);

        // this.controllerMarginTop = 2;
        // this.controllerMarginLeft = 10;
        // this.controllerTabindex = 0;
        // this.controllerVisible = this.setControllerVisible(screenComponentDto);
        // this.controllerMaxLength = this.setControllerMaxLength(screenComponentDto);
        // this.controllerEnabale = this.setControllerEnabale(screenComponentDto);
        // this.controllerReadOnly = this.setControllerReadOnly(screenComponentDto);
        // this.controllerBackColor = this.setControllerBackColor(screenComponentDto, mainState);
        // this.controllerAction = screenComponentDto.sC_Action;
        // this.controllerWidth = this.setControllerWidth(screenComponentDto, mainState);
        // this.controllerHeight = this.setControllerHeight(screenComponentDto);
        // this.controllerMultiLine = screenComponentDto.sC_Multiline;
        // this.controllerValue = this.setControllerValue(screenComponentDto);
        // this.helpText = this.setHelpText(screenComponentDto);
        // this.MaskText = this.setMaskText(screenComponentDto);
        // this.lookupText = screenComponentDto.lookup_Text;
        // this.maxLength = screenComponentDto.avD_Length;

        // this.containerLabelMarginLeft = 10;
        // this.containerLabelMarginTop = 2;
        // this.containerLabelColor = this.setContainerLabelColor(screenComponentDto, mainState);
        // this.containerLabelFontWeight = this.setContainerLabelFontWeight(screenComponentDto, mainState);
        // this.labelDescription = this.setlabelDescription(screenComponentDto);
        // this.labelWidth = this.setCalculateLabelWidth(screenComponentDto);



        this.varNo = screenComponentDto.sC_VarNo;
        this.sequence = screenComponentDto.sC_Sequence;
        this.uiComponentType = this.setUiComponentType(screenComponentDto);
        this.uiViewType = this.setUiViewType(screenComponentDto);
        this.mappedContactField = this.setMappedContactField(screenComponentDto);
        this.containerName = screenComponentDto.sC_ID.toString();
        this.containerYAxis = screenComponentDto.sC_Top;
        this.containerWidth = this.calculateComponentContainerWidth(screenComponentDto, mainState);
        this.containerHeight = this.setContainerHeight(screenComponentDto);
        this.searchField = this.setSearchField(screenComponentDto);
        this.containerXAxis = this.setContainerXAxis(screenComponentDto);
        this.screenComponentDto = screenComponentDto;
        this.isSelected = false;


        this.control = this.setControler(screenComponentDto, mainState);
        this.contanerLable = this.setContainerLabel(screenComponentDto, mainState);


    }




    private setControler(screenComponentDto: ScreenComponentDto, mainState: IMainState): ControlInfo {
        let control: ControlInfo;

        const containerName = screenComponentDto.sC_ID.toString();
        const controllerMarginLeft = 10;
        const controllerMarginTop = 2;
        const controllerValue = this.setControllerValue(screenComponentDto);
        const controllerWidth = this.setControllerWidth(screenComponentDto, mainState);
        let controllerBackColor = this.setControllerBackColor(screenComponentDto, mainState);
        const controllerHeight = this.setControllerHeight(screenComponentDto);
        let controllerColor;
        let controllerFontWeight;
        let controllerFontSize;
        let controllerFontFamily;
        const controllerReadOnly = this.setControllerReadOnly(screenComponentDto);
        const controllerMaxLength = this.setControllerMaxLength(screenComponentDto);
        const controllerEnabale = this.setControllerEnabale(screenComponentDto);
        const controllerAction = screenComponentDto.sC_Action;
        const controllerTabindex = 0;
        const controllerMaskText = this.setMaskText(screenComponentDto);
        const controllerHelpText = this.setHelpText(screenComponentDto);
        const controllerLookupText = screenComponentDto.lookup_Text;
        const controllerMultiLine = screenComponentDto.sC_Multiline;

        if (mainState.disabilityColors) {
            controllerBackColor = '#3399FF';
            controllerColor = 'white';
            controllerFontWeight = ' bold';
            controllerFontFamily = 'Arial';
            controllerFontSize = '16px';
        }

        control = {
            name: containerName,
            marginLeft: controllerMarginLeft,
            marginTop: controllerMarginTop,
            value: controllerValue,
            width: controllerWidth,
            backgroundColor: controllerBackColor,
            isDirty: false,
            height: controllerHeight,
            color: controllerColor,
            fontWeight: controllerFontWeight,
            fontSize: controllerFontSize,
            fontFamily: controllerFontFamily,
            readonly: controllerReadOnly,
            maxLength: controllerMaxLength,
            enabale: controllerEnabale,
            action: controllerAction,
            tabindex: controllerTabindex,
            maskText: controllerMaskText,
            helpText: controllerHelpText,
            options: controllerLookupText,
            multiLine: controllerMultiLine,
            autofocus: false,
        };
        return control;
    }


    private setContainerLabel(screenComponentDto: ScreenComponentDto, mainState: IMainState): ControlInfo {
        let containerLabel: ControlInfo;


        const containerName = screenComponentDto.sC_ID.toString();
        const containerLabelColor = this.setContainerLabelColor(screenComponentDto, mainState);
        let containerLabelFontWeight = this.setContainerLabelFontWeight(screenComponentDto, mainState);
        const containerLabelMarginLeft = 10;
        const containerLabelMarginTop = 2;
        const containerLabelDescription = this.setlabelDescription(screenComponentDto);
        const containerLabelWidth = this.setCalculateLabelWidth(screenComponentDto);
        let containerLabelFontSize;
        let containerLabelFontFamily;

        if (mainState.disabilityColors) {
            containerLabelFontWeight = ' bold';
            containerLabelFontFamily = 'Arial';
            containerLabelFontSize = '16px';
        }
        containerLabel = {
            name: 'lable' + this.containerName,
            color: containerLabelColor,
            fontWeight: containerLabelFontWeight,
            marginLeft: containerLabelMarginLeft,
            marginTop: containerLabelMarginTop,
            value: containerLabelDescription,
            width: containerLabelWidth,
            fontSize: containerLabelFontSize,
            fontFamily: containerLabelFontFamily,
            tabindex: -1
        };

        return containerLabel;
    }


    // private setControler(screenComponentDto: ScreenComponentDto, mainState: IMainState): ControlInfo {
    //     let control: ControlInfo;
    //     if (mainState.disabilityColors) {
    //         this.controllerBackColor = '#3399FF';
    //         this.controllerColor = 'white';
    //         this.controllerFontWeight = ' bold';
    //         this.controllerFontFamily = 'Arial';
    //         this.controllerFontSize = '16px';
    //     }

    //     control = {
    //         name: this.containerName,
    //         marginLeft: this.controllerMarginLeft,
    //         marginTop: this.controllerMarginTop,
    //         value: this.controllerValue,
    //         width: this.controllerWidth,
    //         backgroundColor: this.controllerBackColor,
    //         isDirty: false,
    //         height: this.controllerHeight,
    //         color: this.controllerColor,
    //         fontWeight: this.controllerFontWeight,
    //         fontSize: this.controllerFontSize,
    //         fontFamily: this.controllerFontFamily,
    //         readonly: this.controllerReadOnly,
    //         maxLength: this.controllerMaxLength,
    //         enabale: this.controllerEnabale,
    //         action: this.controllerAction,
    //         tabindex: this.controllerTabindex,
    //         maskText: this.MaskText,
    //         helpText: this.helpText,
    //         options: this.lookupText,
    //         multiLine: this.controllerMultiLine,
    //     };
    //     return control;
    // }

    // private setContainerLabel(screenComponentDto: ScreenComponentDto, mainState: IMainState): ControlInfo {
    //     let containerLabel: ControlInfo;
    //     //  coment  todoNLJ
    //     if (mainState.disabilityColors) {
    //         this.containerLabelFontWeight = ' bold';
    //         this.containerLabelFontFamily = 'Arial';
    //         // 12px to-do with dilantha;
    //         this.labelFontSize = '16px';
    //     }
    //     containerLabel = {
    //         name: 'lable' + this.containerName,
    //         color: this.containerLabelColor,
    //         fontWeight: this.containerLabelFontWeight,
    //         marginLeft: this.containerLabelMarginLeft,
    //         marginTop: this.containerLabelMarginTop,
    //         value: this.labelDescription,
    //         width: this.labelWidth,
    //         fontSize: this.labelFontSize,
    //         fontFamily: this.containerLabelFontFamily,
    //         tabindex: -1
    //     };

    //     return containerLabel;
    // }

    private setContainerHeight(screenComponentDto: ScreenComponentDto) {
        return (screenComponentDto.sC_Multiline) ? screenComponentDto.sC_Height : 25;
    }

    private setControllerHeight(screenComponentDto: ScreenComponentDto) {
        return (screenComponentDto.sC_Height) ? screenComponentDto.sC_Height : null;
    }

    private setCalculateLabelWidth(screenComponentDto: ScreenComponentDto): number {
        const lableText = this.setlabelDescription(screenComponentDto);
        return this.calculateControlLabelWidth(lableText);
    }


    // Get the field color which is already
    // set considering the 'View Type', it will be modified here if it is mapped with a screen-view field
    private setContactColour(linkedContact: boolean, backColour: string, screenComponentDto: ScreenComponentDto): string {

        const contactColour: string = linkedContact ? '#f1f1a2' : 'White';
        const contactRefColour: string = linkedContact ? 'PowderBlue' : 'White';
        const mappedContactField = this.setMappedContactField(screenComponentDto);

        // Contact Ref mappings are integer values
        // todoNLJ
        if (Utilities.atoi(mappedContactField) > 0) {
            backColour = contactRefColour;
            // standard screen-view mappings start with CT
        } else if (mappedContactField && mappedContactField.indexOf('CT') === 0) {
            backColour = contactColour;
        }
        return backColour;
    }

    private setControllerValue(screenComponentDto: ScreenComponentDto): any {

        const uiComponentType = this.setUiComponentType(screenComponentDto);

        let controllerValue: any = screenComponentDto.field_Value == null ? undefined : screenComponentDto.field_Value;
        switch (uiComponentType) {
            case UiComponentType.Text:
                controllerValue = (!screenComponentDto.field_Value) ? '' : screenComponentDto.field_Value;
                break;
            case UiComponentType.Date:
                // kendo.parseDate(screenComponentDto.Field_Value, 'dd/MM/yyyy') todoNLJ  (UiComponentType.Date) replase
                if (UiComponentType.Date) {
                    controllerValue = Utilities.GetDateObjectFromDDMMYYYYStr(screenComponentDto.field_Value);
                } else {
                    controllerValue = null;
                }
                break;
            case UiComponentType.YesNo:
                if (screenComponentDto.field_Value === '1' || screenComponentDto.field_Value === 'Y') {
                    controllerValue = true;
                } else {
                    controllerValue = false;
                }
                break;
            case UiComponentType.Combo:
                // to-do-BE // to-do // to-do for done bakend sapumal
                // if (screen.Matter.AppCode == "CR" && (VarNo == defs.CRIME_CLASS_ID || VarNo == defs.CRIME_SUBCLASS_ID))
                if (screenComponentDto.sC_Action && screenComponentDto.sC_Action !== '') {
                    if (screenComponentDto.sC_Action.indexOf('*') === 0) {
                        // to-do for done bakend sapumal PopulateComboFromStarAction
                    }
                } else {
                    // remove the exsisting code // need to check by gayani
                }
                break;
            case UiComponentType.Currency:
                if (!screenComponentDto.field_Value) {
                    screenComponentDto.field_Value = '';
                } else {
                    try {
                        // let value: number = parseFloat(screenComponentDto.Field_Value)
                        // Bug Id:3068
                        const value: number = parseFloat(screenComponentDto.field_Value.replace(/,/g, ''));
                        // coment  todoNLJ controllerValue = kendo.toString(value, 'N02');
                        controllerValue = value.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
                    } catch (e) {
                        controllerValue = '';
                    }
                }
                break;
            case UiComponentType.Integer:
                if (!screenComponentDto.field_Value) {
                    controllerValue = 0;
                } else {
                    let iValue: number;
                    try {
                        // to-do kushan _N
                        iValue = Utilities.atoi(screenComponentDto.field_Value.toString());
                    } catch (e) {
                        iValue = 0;
                    }
                    controllerValue = iValue;
                }
                break;
            case UiComponentType.Time:
                if (screenComponentDto.field_Value) {
                    controllerValue = Utilities.GetTimeFromString(screenComponentDto.field_Value);
                }
                break;
        }
        return controllerValue;
    }

    private setlabelDescription(screenComponentDto: ScreenComponentDto): string {
        let labelDescription;
        if (screenComponentDto.sC_VarNo === 0) {

            if (screenComponentDto.sC_Action == null) {
                labelDescription = '<empty label>';
            } else {
                labelDescription = screenComponentDto.sC_Action;
            }

        } else {
            if (screenComponentDto.avD_Text == null) {
                labelDescription = '';
            } else {
                labelDescription = screenComponentDto.avD_Text.trim();
            }
        }

        return labelDescription;
    }

    private setSearchField(screenComponentDto: ScreenComponentDto): boolean {
        let searchField;
        if (screenComponentDto.sC_VarNo !== 0) {
            if (screenComponentDto.sC_Search == null) {
                searchField = false;
            } else {
                searchField = screenComponentDto.sC_Search;
            }
        }
        return searchField;
    }

    private setContainerXAxis(screenComponentDto: ScreenComponentDto): number {
        let xAxis: number;
        let version: number;

        if (screenComponentDto.sC_Version == null) {
            version = 0;
        } else {
            version = screenComponentDto.sC_Version;
        }
        if (version === 0 || screenComponentDto.sC_VarNo === 0) {
            xAxis = screenComponentDto.sC_Left;
        } else {
            const labelWidth = this.setCalculateLabelWidth(screenComponentDto);
            xAxis = screenComponentDto.sC_Left - labelWidth - 20;
        }

        return xAxis;
    }

    private setHelpText(screenComponentDto: ScreenComponentDto): string {
        let helpText: string;
        if (screenComponentDto.avD_Help == null) {
            helpText = '';
        } else {
            helpText = screenComponentDto.avD_Help;
        }
        return helpText;
    }

    private setMaskText(screenComponentDto: ScreenComponentDto): string {
        let maskText: string;
        if (screenComponentDto.sC_Mask == null) {
            maskText = '';

        } else {
            maskText = screenComponentDto.sC_Mask;
        }
        return maskText;
    }

    private setCustomMaskText(screenComponentDto: ScreenComponentDto): string {
        let customMaskText: string;
        if (screenComponentDto.sC_Mask == null) {
            customMaskText = '';

        } else {
            if (this.setIsCustomMaskText(screenComponentDto)) {
                // coment  todoNLJ
                customMaskText = screenComponentDto.sC_Mask;
            } else {
                customMaskText = '';
            }
        }
        return customMaskText;
    }

    private setIsCustomMaskText(screenComponentDto: ScreenComponentDto): boolean {
        let isCustomMask = false;

        if (screenComponentDto.sC_Mask == null) {
            isCustomMask = false;
        } else if (screenComponentDto.sC_Mask === '') {
            isCustomMask = false;
        } else if (screenComponentDto.sC_Mask === 'TEXT (all lower case)') {
            isCustomMask = false;
        } else if (screenComponentDto.sC_Mask === 'TEXT (all upper case)') {
            isCustomMask = false;
        } else if (screenComponentDto.sC_Mask === 'TEXT (Title case)') {
            isCustomMask = false;
        } else if (screenComponentDto.sC_Mask === 'TEXT (all)') {
            isCustomMask = false;
        } else {
            isCustomMask = true;
        }
        return isCustomMask;
    }

    private setUiComponentType(screenComponentDto: ScreenComponentDto): UiComponentType {

        let uiComponentType;
        const labelDescription = this.setlabelDescription(screenComponentDto);

        if (screenComponentDto.sC_VarNo === 0) {
            if (labelDescription === 'line') {
                uiComponentType = UiComponentType.Line;
            } else {
                uiComponentType = UiComponentType.Label;
            }
        } else {

            if (screenComponentDto.avD_Type == null) {
                // to-do-BE mgs
                // alert("");
            } else {
                uiComponentType = screenComponentDto.avD_Type;
            }

        }
        return uiComponentType;
    }

    private setUiViewType(screenComponentDto: ScreenComponentDto): UiViewType {

        let uiViewType: UiViewType;
        let forced: boolean, protect: boolean, enabled: boolean;

        forced = screenComponentDto.sC_Force;
        protect = screenComponentDto.sC_Protected;
        enabled = screenComponentDto.sC_Enabled;

        if (forced === true) {
            uiViewType = UiViewType.VC_FORCED;
        }
        if (protect === true) {
            uiViewType = UiViewType.VC_PROTECTED;
        }
        if (enabled === false) {
            uiViewType = UiViewType.VC_VIEWONLY;
        }
        if (!forced && !protect && enabled) {
            uiViewType = UiViewType.VC_NORMAL;
        }

        return uiViewType;
    }

    private setMappedContactField(screenComponentDto: ScreenComponentDto): string {
        let mappedContactField: string;
        if (screenComponentDto.dM_CField) {
            mappedContactField = screenComponentDto.dM_CField;
        } else {
            mappedContactField = '';
        }
        return mappedContactField;
    }

    private setControllerWidth(screenComponentDto: ScreenComponentDto, mainState: IMainState): number {

        const mChangingInputSize = true;
        const uiComponentType = this.setUiComponentType(screenComponentDto);


        const controllerfontSize: number
            = (mainState.disabilityColors) ? UiComponentFontSize.DISABILITY : UiComponentFontSize.NORMAL;
        let controllerWidth: number;

        if (uiComponentType === UiComponentType.YesNo) {
            controllerWidth = 25;
        } else if (uiComponentType === UiComponentType.Label) {
            const defultWith = 0;
            controllerWidth = (screenComponentDto.field_Value) ? screenComponentDto.field_Value.length * controllerfontSize : defultWith;
        } else if (uiComponentType === UiComponentType.Text || uiComponentType === UiComponentType.Combo) {
            controllerWidth = (screenComponentDto.avD_Length + 3) * controllerfontSize;
        } else if (uiComponentType === UiComponentType.Date) {
            controllerWidth = 100;
        } else if (uiComponentType === UiComponentType.Time ||
            uiComponentType === UiComponentType.Currency || uiComponentType === UiComponentType.Integer) {
            controllerWidth = (screenComponentDto.avD_Length + 3) * controllerfontSize;
        } else if (uiComponentType === UiComponentType.AddressSearch) {
            controllerWidth = 150;
         } else if (uiComponentType === UiComponentType.PostCode) {
            controllerWidth = 100;
        } else if (uiComponentType === UiComponentType.CliAttachment) {
            controllerWidth = 100;
        } else if (uiComponentType === UiComponentType.MatAttachment) {
            controllerWidth = 100;
        }

        return controllerWidth;
    }

    private setControllerVisible(screenComponentDto: ScreenComponentDto): boolean {
        let visible = true;
        if (screenComponentDto.avD_Length === 0) {
            visible = false;
        }
        return visible;
    }

    private setControllerMaxLength(screenComponentDto: ScreenComponentDto): number {
        let maxLength: number;
        maxLength = screenComponentDto.avD_Length;
        return maxLength;
    }

    private setControllerEnabale(screenComponentDto: ScreenComponentDto): boolean {
        let enabale = true;

        const uiComponentType = this.setUiComponentType(screenComponentDto);
        const uiViewType = this.setUiViewType(screenComponentDto);

        if (uiViewType === UiViewType.VC_VIEWONLY) {
            if (uiComponentType === UiComponentType.Text) {
                enabale = true;
            } else {
                enabale = false;
            }
        }
        /// back color function
        if (uiViewType === UiViewType.VC_NORMAL) {
            enabale = true;
        }
        if (uiViewType === UiViewType.VC_FORCED) {
            enabale = true;
        } else if (uiViewType === UiViewType.VC_PROTECTED) {
            enabale = true;
        }

        return enabale;
    }

    private setControllerReadOnly(screenComponentDto: ScreenComponentDto): boolean {
        let readOnly: boolean;
        const uiComponentType = this.setUiComponentType(screenComponentDto);
        const uiViewType = this.setUiViewType(screenComponentDto);

        if (uiViewType === UiViewType.VC_VIEWONLY) {
            if (uiComponentType === UiComponentType.Text) {
                readOnly = true;
            }
        }
        return readOnly;
    }

    private setControllerBackColor(screenComponentDto: ScreenComponentDto, mainState: IMainState): string {
        // coment  todoNLJ

        const uiComponentType = this.setUiComponentType(screenComponentDto);
        const uiViewType = this.setUiViewType(screenComponentDto);

        let backColor = 'LightGray';
        if (uiViewType === UiViewType.VC_NORMAL) {
            // this.controllerEnabale = true;
            if (!mainState.disabilityColors) {
                backColor = 'White';
            }
        }
        if (uiViewType === UiViewType.VC_VIEWONLY) {
            if (!mainState.disabilityColors) {
                backColor = 'LightGray';
            }
        }
        if (uiViewType === UiViewType.VC_FORCED) {
            // this.controllerEnabale = true;
            if (!mainState.disabilityColors) {
                backColor = 'LightPink';
            }
        } else if (uiViewType === UiViewType.VC_PROTECTED) {
            // this.controllerEnabale = true;
            if (!mainState.disabilityColors) {
                backColor = 'PaleGoldenrod';
            }
        }
        // coment  todoNLJ
        if (screenComponentDto.onContact) {
            backColor = this.setContactColour(screenComponentDto.onContact, backColor, screenComponentDto);
        }
        return backColor;
    }

    private calculateComponentContainerWidth(screenComponentDto: ScreenComponentDto, mainState: IMainState): number {


        const uiComponentType = this.setUiComponentType(screenComponentDto);
        const labelWidth = this.setCalculateLabelWidth(screenComponentDto);
        const controllerWidth = this.setControllerWidth(screenComponentDto, mainState);
        const containerLabelMarginLeft = 10;

        let componentContainerWidth: number;
        // exsisting location ArrangeFieldControl() lblDescription.Left + lblDescription.Width + gap + controlWidth + rightPad
        const controllerMarginLeft = 10; // gap in window aplication
        let rightPadding = 2; // witch is in windos application (for sumelate same behavior)
        let checkBoxLength = 0;
        if (uiComponentType === UiComponentType.YesNo) {
            checkBoxLength = 35;
        }
        if (uiComponentType === UiComponentType.MatAttachment || uiComponentType === UiComponentType.CliAttachment) {
            rightPadding = rightPadding  + 25;
        }

        componentContainerWidth = containerLabelMarginLeft + labelWidth + controllerMarginLeft
            + controllerWidth + rightPadding + checkBoxLength;

        return componentContainerWidth;
    }


    private setContainerLabelColor(screenComponentDto: ScreenComponentDto, mainState: IMainState): string {

        const uiComponentType = this.setUiComponentType(screenComponentDto);

        let lableColor = '';
        lableColor = screenComponentDto.sC_Search ? 'darkred' : 'black';
        lableColor = 'black';
        // coment  todoNLJ
        if (mainState.disabilityColors) {
            lableColor = 'white';
        }
        if (uiComponentType === UiComponentType.Label) {
            lableColor = 'darkblue';
            if (mainState.disabilityColors) {
                lableColor = 'white';
            }
        }
        return lableColor;
    }

    private setContainerLabelFontWeight(screenComponentDto: ScreenComponentDto, mainState: IMainState): string {
        let lableBold = '';

        const uiComponentType = this.setUiComponentType(screenComponentDto);

        // coment  todoNLJ
        if (uiComponentType === UiComponentType.Label && mainState.disabilityColors) {
            lableBold = ' bold';
        }
        return lableBold;
    }




    calculateControlLabelWidth(textValue: string): number {
        const myJSON = [{ 'Key': '\u0000', 'Value': 11 }, { 'Key': '\u0001', 'Value': 10 },
        { 'Key': '\u0002', 'Value': 12 }, { 'Key': '\u0003', 'Value': 10 },
        { 'Key': '\u0004', 'Value': 10 }, { 'Key': '\u0005', 'Value': 10 },
        { 'Key': '\u0006', 'Value': 10 }, { 'Key': '\u0007', 'Value': 10 },
        { 'Key': '\b', 'Value': 10 }, { 'Key': '\t', 'Value': 0 }, { 'Key': '\n', 'Value': 0 },
        { 'Key': '\u000b', 'Value': 0 }, { 'Key': '\f', 'Value': 0 },
        { 'Key': '\r', 'Value': 0 }, { 'Key': '\u000e', 'Value': 10 },
        { 'Key': '\u000f', 'Value': 10 }, { 'Key': '\u0010', 'Value': 10 },
        { 'Key': '\u0011', 'Value': 10 }, { 'Key': '\u0012', 'Value': 10 },
        { 'Key': '\u0013', 'Value': 10 }, { 'Key': '\u0014', 'Value': 10 },
        { 'Key': '\u0015', 'Value': 10 }, { 'Key': '\u0016', 'Value': 10 },
        { 'Key': '\u0017', 'Value': 10 }, { 'Key': '\u0018', 'Value': 10 },
        { 'Key': '\u0019', 'Value': 10 }, { 'Key': '\u001a', 'Value': 10 },
        { 'Key': '\u001b', 'Value': 10 }, { 'Key': '\u001c', 'Value': 7 },
        { 'Key': '\u001d', 'Value': 7 }, { 'Key': '\u001e', 'Value': 7 },
        { 'Key': '\u001f', 'Value': 7 }, { 'Key': ' ', 'Value': 10 },
        { 'Key': '!', 'Value': 10 }, { 'Key': '"', 'Value': 12 },
        { 'Key': '#', 'Value': 14 }, { 'Key': '$', 'Value': 13 }, { 'Key': '%', 'Value': 15 },
        { 'Key': '&', 'Value': 7 }, { 'Key': '\'', 'Value': 9 },
        { 'Key': '(', 'Value': 10 }, { 'Key': ')', 'Value': 10 },
        { 'Key': '*', 'Value': 11 },
        { 'Key': '+', 'Value': 13 }, { 'Key': ',', 'Value': 10 },
        { 'Key': '-', 'Value': 10 }, { 'Key': '.', 'Value': 10 },
        { 'Key': '/', 'Value': 12 },
        { 'Key': '0', 'Value': 13 }, { 'Key': '1', 'Value': 13 },
        { 'Key': '2', 'Value': 13 }, { 'Key': '3', 'Value': 13 },
        { 'Key': '4', 'Value': 13 },
        { 'Key': '5', 'Value': 13 }, { 'Key': '6', 'Value': 13 },
        { 'Key': '7', 'Value': 13 }, { 'Key': '8', 'Value': 13 }, { 'Key': '9', 'Value': 13 },
        { 'Key': ':', 'Value': 10 }, { 'Key': ';', 'Value': 10 },
        { 'Key': '<', 'Value': 13 }, { 'Key': '=', 'Value': 13 }, { 'Key': '>', 'Value': 13 },
        { 'Key': '?', 'Value': 13 }, { 'Key': '@', 'Value': 18 },
        { 'Key': 'A', 'Value': 14 }, { 'Key': 'B', 'Value': 14 }, { 'Key': 'C', 'Value': 14 },
        { 'Key': 'D', 'Value': 15 }, { 'Key': 'E', 'Value': 14 }, { 'Key': 'F', 'Value': 13 },
        { 'Key': 'G', 'Value': 15 }, { 'Key': 'H', 'Value': 15 },
        { 'Key': 'I', 'Value': 10 }, { 'Key': 'J', 'Value': 12 },
        { 'Key': 'K', 'Value': 14 }, { 'Key': 'L', 'Value': 13 }, { 'Key': 'M', 'Value': 16 },
        { 'Key': 'N', 'Value': 15 }, { 'Key': 'O', 'Value': 15 },
        { 'Key': 'P', 'Value': 14 }, { 'Key': 'Q', 'Value': 15 }, { 'Key': 'R', 'Value': 15 },
        { 'Key': 'S', 'Value': 14 }, { 'Key': 'T', 'Value': 14 },
        { 'Key': 'U', 'Value': 15 }, { 'Key': 'V', 'Value': 14 }, { 'Key': 'W', 'Value': 18 },
        { 'Key': 'X', 'Value': 14 }, { 'Key': 'Y', 'Value': 14 },
        { 'Key': 'Z', 'Value': 14 }, { 'Key': '[', 'Value': 10 }, { 'Key': '\\', 'Value': 12 },
        { 'Key': ']', 'Value': 10 }, { 'Key': '^', 'Value': 13 },
        { 'Key': '_', 'Value': 13 }, { 'Key': '`', 'Value': 10 }, { 'Key': 'a', 'Value': 13 },
        { 'Key': 'b', 'Value': 13 }, { 'Key': 'c', 'Value': 13 },
        { 'Key': 'd', 'Value': 13 }, { 'Key': 'e', 'Value': 13 }, { 'Key': 'f', 'Value': 10 },
        { 'Key': 'g', 'Value': 13 }, { 'Key': 'h', 'Value': 13 },
        { 'Key': 'i', 'Value': 9 }, { 'Key': 'j', 'Value': 9 },
        { 'Key': 'k', 'Value': 13 },
        { 'Key': 'l', 'Value': 9 }, { 'Key': 'm', 'Value': 15 },
        { 'Key': 'n', 'Value': 13 }, { 'Key': 'o', 'Value': 13 }, { 'Key': 'p', 'Value': 13 },
        { 'Key': 'q', 'Value': 13 }, { 'Key': 'r', 'Value': 10 },
        { 'Key': 's', 'Value': 12 }, { 'Key': 't', 'Value': 10 }, { 'Key': 'u', 'Value': 13 },
        { 'Key': 'v', 'Value': 13 }, { 'Key': 'w', 'Value': 15 },
        { 'Key': 'x', 'Value': 12 }, { 'Key': 'y', 'Value': 12 }, { 'Key': 'z', 'Value': 12 },
        { 'Key': '{', 'Value': 11 }, { 'Key': '|', 'Value': 9 },
        { 'Key': '}', 'Value': 11 }, { 'Key': '~', 'Value': 14 }, { 'Key': '', 'Value': 10 },
        { 'Key': '', 'Value': 7 }];

        let textLength = 0;
        let i: number;
        let j: string;

        for (i = 0; i < textValue.length; i++) {
            for (j in myJSON) {
                if (myJSON[j].Key === textValue[i]) {
                    textLength += myJSON[j].Value;
                    break;
                }
            }
        }
        textLength = textLength - (textValue.length - 1) * 7;
        return textLength;
    }





}
