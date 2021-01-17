// import { IMainState } from './request';
// import {
//     ScreenContanerComponent, ControlInfo, UiComponentType,
//     UiViewType, ScreenComponentDto, UiComponentFontSize
// } from './screen-contaner-component';
// import { Utilities } from '../models/utilities';

// export class ScreenComponent implements ScreenContanerComponent {

//     id: number;
//     varNo: number;
//     containerName: string;
//     containerXAxis: number;
//     containerYAxis: number;
//     containerHeight: number;
//     containerWidth: number;
//     isEditMode: boolean;
//     searchField: boolean;
//     mappedContactField: string;
//     contanerLable: ControlInfo;
//     control: ControlInfo;
//     uiComponentType: UiComponentType;
//     uiViewType: UiViewType;
//     isSelected: boolean;
//     onContact?: boolean;
//     sequence: number;
//     isNewItem?: boolean;
//     screenComponentDto?: ScreenComponentDto;

//     isCustomMaskText: boolean;
//     customMaskText: string;

//     avdVarNo: number;




//     constructor(screenComponentDto: ScreenComponentDto, public mainState: IMainState) {

//         try {
//             screenComponentDto.label_Width = this.calculateLabelWidth(screenComponentDto);

//             this.id = screenComponentDto.sC_ID;
//             this.varNo = screenComponentDto.sC_VarNo;
//             this.searchField = this.setSearchField(screenComponentDto);
//             this.containerXAxis = this.setContainerXAxis(screenComponentDto);
//             this.uiComponentType = this.setUiComponentType(screenComponentDto);
//             this.uiViewType = this.setUiViewType(screenComponentDto);
//             this.containerYAxis = screenComponentDto.sC_Top;
//             this.sequence = screenComponentDto.sC_Sequence;
//             this.isSelected = false;
//             this.mappedContactField = this.setMappedContactField(screenComponentDto);
//             this.screenComponentDto = screenComponentDto;

//             this.contanerLable = this.setContainerLabel(screenComponentDto, mainState);
//             this.control = this.setControler(screenComponentDto, mainState);
//         } catch (ex) {
//             console.error(ex);
//         }
//     }


//     private calculateLabelWidth(screenComponentDto: ScreenComponentDto) {
//         const lableText = this.setlabelDescription(screenComponentDto);
//         return this.calculateControlLabelWidth(lableText);
//     }

//     private setControler(screenComponentDto: ScreenComponentDto, mainState: IMainState): ControlInfo {

//         const controlMarginTop = 2;
//         const controlMarginLeft = 10;
//         const controlTabindex = 0;
//         const controlIsDirty = false;
//         const controlHelpText = this.setHelpText(screenComponentDto);
//         const controlMaskText = this.setMaskText(screenComponentDto);
//         const controlOptions = screenComponentDto.lookup_Text;
//         const controlMaxLength = this.setControllerMaxLength(screenComponentDto);
//         const controlEnabale = this.setControllerEnabale(screenComponentDto);
//         const controlReadonly = this.setControllerReadOnly(screenComponentDto);
//         const controlAction = screenComponentDto.sC_Action;
//         const controlWidth = this.setControllerWidth(screenComponentDto);
//         const controlHeight = (screenComponentDto.sC_Height) ? screenComponentDto.sC_Height : null;
//         const controlValue = this.setControllerValue(screenComponentDto);
//         const controlMultiLine = screenComponentDto.sC_Multiline;

//         let controlBackgroundColor = this.setControllerBackColor(screenComponentDto, mainState);
//         let controlColor;
//         let controlFontWeight;
//         let controlFontFamily;
//         let controlFontSize;

//         if (mainState.disabilityColors) {
//             controlBackgroundColor = '#3399FF';
//             controlColor = 'white';
//             controlFontWeight = ' bold';
//             controlFontFamily = 'Arial';
//             // 12px to-do with dilantha;
//             controlFontSize = '16px';
//         }

//         const control = {
//             name: 'control' + screenComponentDto.sC_ID.toString(),
//             marginLeft: controlMarginLeft,
//             marginTop: controlMarginTop,
//             value: controlValue,
//             width: controlWidth,
//             backgroundColor: controlBackgroundColor,
//             height: controlHeight,
//             color: controlColor,
//             fontWeight: controlFontWeight,
//             fontSize: controlFontSize,
//             fontFamily: controlFontFamily,
//             readonly: controlReadonly,
//             maxLength: controlMaxLength,
//             enabale: controlEnabale,
//             action: controlAction,
//             tabindex: controlTabindex,
//             maskText: controlMaskText,
//             helpText: controlHelpText,
//             options: controlOptions,
//         };

//         return control;

//     }

//     private setControllerEnabale(screenComponentDto: ScreenComponentDto): boolean {
//         let enabale = true;

//         const uiComponentType: UiComponentType = this.setUiComponentType(screenComponentDto);
//         const uiViewType: UiViewType = this.setUiViewType(screenComponentDto);

//         if (uiViewType === UiViewType.VC_VIEWONLY) {
//             if (uiComponentType === UiComponentType.Text) {
//                 enabale = true;
//             } else {
//                 enabale = false;
//             }
//         }
//         if (uiViewType === UiViewType.VC_NORMAL) {
//             enabale = true;
//         }
//         if (uiViewType === UiViewType.VC_FORCED) {
//             enabale = true;
//         } else if (uiViewType === UiViewType.VC_PROTECTED) {
//             enabale = true;
//         }

//         return enabale;
//     }

//     private setContainerLabel(screenComponentDto: ScreenComponentDto, mainState: IMainState): ControlInfo {

//         let containerLabel: ControlInfo;


//         const contanerLableMarginLeft = 10;
//         const contanerLableMarginTop = 2;
//         const contanerLableTabindex = -1;
//         const contanerLableName = screenComponentDto.sC_ID.toString();
//         const contanerLableValue = this.setlabelDescription(screenComponentDto);
//         const contanerLableColor = this.setContainerLabelColor(screenComponentDto);
//         let contanerLableFontWeight = this.setContainerLabelFontWeight(screenComponentDto);
//         const contanerLableWidth = screenComponentDto.label_Width;
//         const containerWidth = this.setCalculateComponentContainerWidth(screenComponentDto);
//         const containerHeight = (screenComponentDto.sC_Multiline) ? screenComponentDto.sC_Height : 25;
//         let contanerLableFontSize;
//         let contanerLableFontFamily;


//         if (mainState.disabilityColors) {
//             contanerLableFontWeight = ' bold';
//             this.contanerLable.fontFamily = 'Arial';
//             // 12px to-do with dilantha;
//             this.contanerLable.fontSize = '16px';
//         }
//         containerLabel = {
//             name: 'lable' + contanerLableName,
//             color: contanerLableColor,
//             fontWeight: contanerLableFontWeight,
//             marginLeft: contanerLableMarginLeft,
//             marginTop: contanerLableMarginTop,
//             value: contanerLableValue,
//             width: contanerLableWidth,
//             fontSize: contanerLableFontSize,
//             fontFamily: contanerLableFontFamily,
//         };

//         return containerLabel;

//     }




//     // Get the field color which is already
//     // set considering the 'View Type', it will be modified here if it is mapped with a screen-view field
//     public setContactColour(linkedContact: boolean, backColour: string): string {

//         const contactColour: string = linkedContact ? 'lightgoldenrodyellow;' : 'White';
//         const contactRefColour: string = linkedContact ? 'PowderBlue' : 'White';

//         // Contact Ref mappings are integer values
//         // todoNLJ
//         if (Utilities.atoi(this.mappedContactField) > 0) {
//             backColour = contactRefColour;
//             // standard screen-view mappings start with CT
//         } else if (this.mappedContactField && this.mappedContactField.indexOf('CT') === 0) {
//             backColour = contactColour;

//             return backColour;
//         }
//     }

//     public setAvdVarNoToDto(avdVarNo: number): void {
//         // KR:ToDo:Think about passing this as string and
//         // getting an empty value here, then set 0 if the field is empty. DO we really need that?
//         this.avdVarNo = avdVarNo;
//         this.screenComponentDto.avD_AppID = avdVarNo;
//     }

//     public setLabelDescriptionToDto(labelDescription: string): void {
//         if (this.screenComponentDto.sC_VarNo === 0) {
//             this.screenComponentDto.sC_Action = labelDescription;
//             // this.screenComponentDto.AVD_Text = labelDescription; //KR:ToDo:Ask Lushan
//         } else {

//             if (labelDescription === '') {
//                 this.screenComponentDto.avD_Text = null;
//             } else {
//                 this.screenComponentDto.avD_Text = labelDescription;
//             }
//         }
//         this.contanerLable.value = labelDescription;
//         this.setControlLabelWidth(this.screenComponentDto.avD_VarNo,
//             this.screenComponentDto.avD_Text, this.screenComponentDto.sC_Action, false);
//     }

//     public setOnContactToDto(isOnContact: boolean): void {
//         this.onContact = isOnContact;
//         this.screenComponentDto.onContact = isOnContact;
//     }

//     public setContainerXAxisToDto(containerXAxis: number): void {
//         const xChange = (containerXAxis - this.containerXAxis);
//         this.screenComponentDto.sC_Left = this.screenComponentDto.sC_Left + xChange;
//         this.containerXAxis = this.containerXAxis + xChange;
//     }

//     public setContainerYAxisToDto(containerYAxis: number): void {
//         this.containerYAxis = containerYAxis;
//         this.screenComponentDto.sC_Top = containerYAxis;
//     }

//     public setUiComponentTypeToDto(uiComponentType: UiComponentType): void {
//         this.uiComponentType = uiComponentType;
//         this.screenComponentDto.avD_Type = uiComponentType;
//     }

//     public setUiViewTypeToDto(uiViewType: UiViewType): void {
//         if (uiViewType === UiViewType.VC_FORCED) {
//             this.screenComponentDto.sC_Force = true;
//             this.screenComponentDto.sC_Protected = false;
//             this.screenComponentDto.sC_Enabled = true;
//         }
//         if (uiViewType === UiViewType.VC_PROTECTED) {
//             this.screenComponentDto.sC_Force = false;
//             this.screenComponentDto.sC_Protected = true;
//             this.screenComponentDto.sC_Enabled = true;
//         }
//         if (uiViewType === UiViewType.VC_VIEWONLY) {
//             this.screenComponentDto.sC_Force = false;
//             this.screenComponentDto.sC_Protected = false;
//             this.screenComponentDto.sC_Enabled = false;
//         }
//         if (uiViewType === UiViewType.VC_NORMAL) {
//             this.screenComponentDto.sC_Force = false;
//             this.screenComponentDto.sC_Protected = false;
//             this.screenComponentDto.sC_Enabled = true;
//         }
//     }

//     public setSearchFieldToDto(searchField: boolean): void {
//         this.searchField = searchField;
//         this.screenComponentDto.sC_Search = searchField;
//     }

//     public setHelpTextToDto(helpText: string): void {
//         this.control.helpText = helpText;
//         this.screenComponentDto.avD_Help = helpText;
//     }

//     public setMaskTextToDto(MaskText: string): void {
//         this.control.maskText = MaskText;
//         this.screenComponentDto.sC_Mask = MaskText;
//     }

//     public setSequenceToDto(sequence: number): void {
//         // KR:ToDo:Manage conflicts in dupicate values
//         this.sequence = sequence;
//         this.screenComponentDto.sC_Sequence = sequence;
//     }

//     public setMultiLineToDto(multiLine: boolean): void {
//         this.control.multiLine = multiLine;
//         if (this.control.multiLine) {
//             this.screenComponentDto.sC_Height = this.calculateMultilineHeight(); // KR:ToDo:Ask Lushan
//         } else {
//             this.screenComponentDto.sC_Height = 21;
//         }
//         this.screenComponentDto.sC_Multiline = multiLine;
//     }

//     // KR:ToDo:Ask Lushan
//     public calculateMultilineHeight(): number {
//         return 21 * 4;
//     }

//     public setControllerActionToDto(controllerAction: string): void {
//         // KR:ToDo:Visit One Office logics
//         this.control.action = controllerAction;
//         this.screenComponentDto.sC_Action = controllerAction;
//     }

//     public setControllerValueToDto(controllerValue: string): void {
//         // KR:ToDo:Visit One Office logics
//         this.control.action = controllerValue;
//         this.screenComponentDto.field_Value = controllerValue;
//     }

//     public setMappedContactFieldToDto(mappedContactField: string): void {
//         this.mappedContactField = mappedContactField;
//         this.screenComponentDto.dM_CField = mappedContactField;
//     }

//     public setMappedContactTypeToDto(mappedContactType: string): void {
//         this.screenComponentDto.dM_TPID = mappedContactType;
//     }

//     private setControllerValue(screenComponentDto: ScreenComponentDto): any {

//         const uiComponentType: UiComponentType = this.setUiComponentType(screenComponentDto);

//         let controllerValue: any = screenComponentDto.field_Value == null ? undefined : screenComponentDto.field_Value;
//         switch (uiComponentType) {
//             case UiComponentType.Text:
//                 controllerValue = (!screenComponentDto.field_Value) ? '' : screenComponentDto.field_Value;
//                 break;
//             case UiComponentType.Date:
//                 // kendo.parseDate(screenComponentDto.Field_Value, 'dd/MM/yyyy') todoNLJ  (UiComponentType.Date) replase
//                 if (UiComponentType.Date) {
//                     controllerValue = Utilities.GetDateObjectFromDDMMYYYYStr(screenComponentDto.field_Value);
//                 } else {
//                     controllerValue = null;
//                 }
//                 break;
//             case UiComponentType.YesNo:
//                 if (screenComponentDto.field_Value === '1' || screenComponentDto.field_Value === 'Y') {
//                     controllerValue = true;
//                 } else {
//                     controllerValue = false;
//                 }
//                 break;
//             case UiComponentType.Combo:
//                 // to-do-BE // to-do // to-do for done bakend sapumal
//                 // if (screen.Matter.AppCode == "CR" && (VarNo == defs.CRIME_CLASS_ID || VarNo == defs.CRIME_SUBCLASS_ID))
//                 if (screenComponentDto.sC_Action && screenComponentDto.sC_Action !== '') {
//                     if (screenComponentDto.sC_Action.indexOf('*') === 0) {
//                         // to-do for done bakend sapumal PopulateComboFromStarAction
//                     }
//                 } else {
//                     // remove the exsisting code // need to check by gayani
//                 }
//                 break;
//             case UiComponentType.Currency:
//                 if (!screenComponentDto.field_Value) {
//                     screenComponentDto.field_Value = '';
//                 } else {
//                     try {
//                         // let value: number = parseFloat(screenComponentDto.Field_Value)
//                         // Bug Id:3068
//                         const value: number = parseFloat(screenComponentDto.field_Value.replace(/,/g, ''));
//                         // coment  todoNLJ controllerValue = kendo.toString(value, 'N02');
//                         controllerValue = value.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
//                     } catch (e) {
//                         controllerValue = '';
//                     }
//                 }
//                 break;
//             case UiComponentType.Integer:
//                 if (!screenComponentDto.field_Value) {
//                     controllerValue = 0;
//                 } else {
//                     let iValue: number;
//                     try {
//                         // to-do kushan _N
//                         iValue = Utilities.atoi(screenComponentDto.field_Value.toString());
//                     } catch (e) {
//                         iValue = 0;
//                     }
//                     controllerValue = iValue;
//                 }
//                 break;
//             case UiComponentType.Time:
//                 if (screenComponentDto.field_Value) {
//                     controllerValue = Utilities.GetTimeFromString(screenComponentDto.field_Value);
//                 }
//                 break;
//         }
//         return controllerValue;
//     }

//     // Pass in a text value and the integer representaion will be returned
//     // Similar to TextToInt, but this behaves like C++ atoi, so it stops parsing as soon
//     // as it hits a non-numeric

//     // Check if a variable is an integer
//     public getControllerValue(): any {
//         let controllerValue = this.control.value;
//         switch (this.uiComponentType) {
//             case UiComponentType.Date:
//                 controllerValue = !controllerValue ? '' : controllerValue;
//                 break;
//             // coment  todoNLJ
//             case UiComponentType.YesNo:
//                 if (this.mainState.screenCheckBoxYN) {
//                     if (controllerValue.toString() === 'false') {
//                         controllerValue = '0';
//                     } else if (controllerValue.toString() === 'true') {
//                         controllerValue = '1';
//                     }
//                 } else {
//                     if (controllerValue.toString() === 'false') {
//                         controllerValue = 'N';
//                     } else if (controllerValue.toString() === 'true') {
//                         controllerValue = 'Y';
//                     }
//                 }
//                 break;
//             case UiComponentType.Label:
//                 controllerValue = '';
//                 break;
//             case UiComponentType.Combo:
//                 // to-do-BE             // to-do // to-do for done bakend sapumal
//                 // if (screen.Matter.AppCode == "CR" && (VarNo == defs.CRIME_CLASS_ID || VarNo == defs.CRIME_SUBCLASS_ID))
//                 if (false) {

//                 } else {
//                     // remove the exsisting code // need to check by gayani
//                 }
//                 break;
//         }
//         return controllerValue;
//     }

//     private setlabelDescription(screenComponentDto: ScreenComponentDto): string {
//         let labelDescription;
//         if (screenComponentDto.sC_VarNo === 0) {

//             if (screenComponentDto.sC_Action == null) {
//                 labelDescription = '<empty label>';
//             } else {
//                 labelDescription = screenComponentDto.sC_Action;
//             }

//         } else {
//             if (screenComponentDto.avD_Text == null) {
//                 labelDescription = '';
//             } else {
//                 labelDescription = screenComponentDto.avD_Text.trim();
//             }
//         }

//         return labelDescription;
//     }

//     private setSearchField(screenComponentDto: ScreenComponentDto): boolean {
//         let searchField;
//         if (screenComponentDto.sC_VarNo !== 0) {
//             if (screenComponentDto.sC_Search == null) {
//                 searchField = false;
//             } else {
//                 searchField = screenComponentDto.sC_Search;
//             }
//         }
//         return searchField;
//     }

//     private setContainerXAxis(screenComponentDto: ScreenComponentDto): number {
//         let xAxis: number;
//         let version: number;

//         if (screenComponentDto.sC_Version == null) {
//             version = 0;
//         } else {
//             version = screenComponentDto.sC_Version;
//         }
//         if (version === 0 || screenComponentDto.sC_VarNo === 0) {
//             xAxis = screenComponentDto.sC_Left;
//         } else {
//             xAxis = screenComponentDto.sC_Left - screenComponentDto.label_Width - 20;
//         }

//         return xAxis;
//     }

//     private setHelpText(screenComponentDto: ScreenComponentDto): string {
//         let helpText: string;
//         if (screenComponentDto.avD_Help == null) {
//             helpText = '';
//         } else {
//             helpText = screenComponentDto.avD_Help;
//         }
//         return helpText;
//     }

//     private setMaskText(screenComponentDto: ScreenComponentDto): string {
//         let maskText: string;
//         if (screenComponentDto.sC_Mask == null) {
//             maskText = '';

//         } else {
//             maskText = screenComponentDto.sC_Mask;
//         }
//         return maskText;
//     }

//     private setCustomMaskText(screenComponentDto: ScreenComponentDto): string {
//         let customMaskText: string;
//         if (screenComponentDto.sC_Mask == null) {
//             customMaskText = '';

//         } else {
//             if (this.setIsCustomMaskText) {
//                 // coment  todoNLJ
//                 customMaskText = screenComponentDto.sC_Mask;
//             } else {
//                 customMaskText = '';
//             }
//         }
//         return customMaskText;
//     }

//     private setIsCustomMaskText(screenComponentDto: ScreenComponentDto): boolean {
//         let isCustomMask = false;

//         if (screenComponentDto.sC_Mask == null) {
//             isCustomMask = false;
//         } else if (screenComponentDto.sC_Mask === '') {
//             isCustomMask = false;
//         } else if (screenComponentDto.sC_Mask === 'TEXT (all lower case)') {
//             isCustomMask = false;
//         } else if (screenComponentDto.sC_Mask === 'TEXT (all upper case)') {
//             isCustomMask = false;
//         } else if (screenComponentDto.sC_Mask === 'TEXT (Title case)') {
//             isCustomMask = false;
//         } else if (screenComponentDto.sC_Mask === 'TEXT (all)') {
//             isCustomMask = false;
//         } else {
//             isCustomMask = true;
//         }
//         return isCustomMask;
//     }

//     private setUiComponentType(screenComponentDto: ScreenComponentDto): UiComponentType {
//         const labelDescription = this.setlabelDescription(screenComponentDto);
//         let uiComponentType;
//         if (screenComponentDto.sC_VarNo === 0) {
//             if (labelDescription === 'line') {
//                 uiComponentType = UiComponentType.Line;
//             } else {
//                 uiComponentType = UiComponentType.Label;
//             }
//         } else {
//             if (screenComponentDto.avD_Type == null) {
//                 // to-do-BE mgs
//                 // alert("");
//             } else {
//                 uiComponentType = screenComponentDto.avD_Type;
//             }
//         }
//         return uiComponentType;
//     }

//     private setUiViewType(screenComponentDto: ScreenComponentDto): UiViewType {

//         let uiViewType: UiViewType;
//         let forced: boolean, protect: boolean, enabled: boolean;

//         forced = screenComponentDto.sC_Force;
//         protect = screenComponentDto.sC_Protected;
//         enabled = screenComponentDto.sC_Enabled;

//         if (forced === true) {
//             uiViewType = UiViewType.VC_FORCED;
//         }
//         if (protect === true) {
//             uiViewType = UiViewType.VC_PROTECTED;
//         }
//         if (enabled === false) {
//             uiViewType = UiViewType.VC_VIEWONLY;
//         }
//         if (!forced && !protect && enabled) {
//             uiViewType = UiViewType.VC_NORMAL;
//         }

//         return uiViewType;
//     }

//     private setMappedContactField(screenComponentDto: ScreenComponentDto): string {
//         let mappedContactField: string;
//         if (screenComponentDto.dM_CField) {
//             mappedContactField = screenComponentDto.dM_CField;
//         } else {
//             mappedContactField = '';
//         }
//         return mappedContactField;
//     }

//     private setControllerWidth(screenComponentDto: ScreenComponentDto): number {
//         const mChangingInputSize = true;
//         // coment  todoNLJ
//         // const controllerfontSize = 10;
//         // coment  todoNLJ
//         const uiComponentType: UiComponentType = this.setUiComponentType(screenComponentDto);

//         const controllerfontSize: number
//             = (this.mainState.disabilityColors) ? UiComponentFontSize.DISABILITY : UiComponentFontSize.NORMAL;
//         let controllerWidth: number;

//         if (uiComponentType === UiComponentType.YesNo) {
//             controllerWidth = 25;
//         } else if (uiComponentType === UiComponentType.Label) {
//             const defultWith = 0;
//             controllerWidth = (screenComponentDto.field_Value) ? screenComponentDto.field_Value.length * controllerfontSize : defultWith;
//         } else if (uiComponentType === UiComponentType.Text || this.uiComponentType === UiComponentType.Combo) {
//             controllerWidth = (screenComponentDto.avD_Length + 3) * controllerfontSize;
//         } else if (uiComponentType === UiComponentType.Date) {
//             controllerWidth = 100;
//         } else if (uiComponentType === UiComponentType.Time ||
//             uiComponentType === UiComponentType.Currency || uiComponentType === UiComponentType.Integer) {
//             controllerWidth = (screenComponentDto.avD_Length + 3) * controllerfontSize;
//         }
//         // else if (uiComponentType == UiComponentType.Integer) {
//         //    controllerWidth = 100;
//         // }

//         return controllerWidth;
//     }

//     private setControllerVisible(screenComponentDto: ScreenComponentDto): boolean {
//         let visible = true;
//         if (screenComponentDto.avD_Length === 0) {
//             visible = false;
//         }
//         return visible;
//     }

//     private setControllerMaxLength(screenComponentDto: ScreenComponentDto): number {
//         let maxLength: number;
//         // if (uiComponentType === UiComponentType.Text || this.uiComponentType === UiComponentType.Combo) {
//         maxLength = screenComponentDto.avD_Length;
//         // }
//         return maxLength;
//     }

   

//     private setControllerReadOnly(screenComponentDto: ScreenComponentDto): boolean {
//         let readOnly: boolean;
//         const uiComponentType: UiComponentType = this.setUiComponentType(screenComponentDto);
//         const uiViewType: UiViewType = this.setUiViewType(screenComponentDto);

//         if (uiViewType === UiViewType.VC_VIEWONLY) {
//             if (uiComponentType === UiComponentType.Text) {
//                 readOnly = true;
//             }
//         }
//         return readOnly;
//     }

//     private setControllerBackColor(screenComponentDto: ScreenComponentDto, mainState: IMainState): string {
//         // coment  todoNLJ
//         const uiComponentType: UiComponentType = this.setUiComponentType(screenComponentDto);
//         const uiViewType: UiViewType = this.setUiViewType(screenComponentDto);

//         let backColor = 'LightGray';
//         if (uiViewType === UiViewType.VC_NORMAL) {
//             if (!mainState.disabilityColors) {
//                 backColor = 'White';
//             }
//         }
//         if (uiViewType === UiViewType.VC_VIEWONLY) {
//             if (!mainState.disabilityColors) {
//                 backColor = 'LightGray';
//             }
//         }
//         if (uiViewType === UiViewType.VC_FORCED) {
//             if (!mainState.disabilityColors) {
//                 backColor = 'LightPink';
//             }
//         } else if (uiViewType === UiViewType.VC_PROTECTED) {
//             if (!mainState.disabilityColors) {
//                 backColor = 'PaleGoldenrod';
//             }
//         }
//         // coment  todoNLJ
//         if (screenComponentDto.onContact) {
//             backColor = this.setContactColour(screenComponentDto.onContact, backColor);
//         }
//         return backColor;
//     }





//     private setCalculateComponentContainerWidth(screenComponentDto: ScreenComponentDto): number {

//         const labelWidth = screenComponentDto.label_Width;
//         const controllerWidth = this.setControllerWidth(screenComponentDto);
//         const uiComponentType = this.setUiComponentType(screenComponentDto);

//         let componentContainerWidth: number;
//         // exsisting location ArrangeFieldControl() lblDescription.Left + lblDescription.Width + gap + controlWidth + rightPad
//         const controllerMarginLeft = 10; // gap in window aplication
//         const labelMarginLeft = 10;
//         const rightPadding = 2; // witch is in windos application (for sumelate same behavior)
//         let checkBoxLength = 0;
//         if (uiComponentType === UiComponentType.YesNo) {
//             checkBoxLength = 35;
//         }
//         componentContainerWidth = labelMarginLeft + labelWidth + controllerMarginLeft + controllerWidth + rightPadding + checkBoxLength;

//         return componentContainerWidth;
//     }



//     private setContainerLabelColor(screenComponentDto: ScreenComponentDto): string {

//         const uiComponentType: UiComponentType = this.setUiComponentType(screenComponentDto);

//         let lableColor = '';
//         lableColor = screenComponentDto.sC_Search ? 'darkred' : 'black';
//         lableColor = 'black';
//         // coment  todoNLJ
//         if (this.mainState.disabilityColors) {
//             lableColor = 'white';
//         }
//         if (uiComponentType === UiComponentType.Label) {
//             lableColor = 'darkblue';
//             if (this.mainState.disabilityColors) {
//                 lableColor = 'white';
//             }
//         }
//         return lableColor;
//     }

//     private setContainerLabelFontWeight(screenComponentDto: ScreenComponentDto): string {

//         const uiComponentType: UiComponentType = this.setUiComponentType(screenComponentDto);
//         let lableBold = '';
//         // coment  todoNLJ
//         if (uiComponentType === UiComponentType.Label && this.mainState.disabilityColors) {
//             lableBold = ' bold';
//         }
//         return lableBold;
//     }



//     calculateControlLabelWidth(textValue: string): number {
//         const myJSON = [{ 'Key': '\u0000', 'Value': 11 }, { 'Key': '\u0001', 'Value': 10 },
//         { 'Key': '\u0002', 'Value': 12 }, { 'Key': '\u0003', 'Value': 10 },
//         { 'Key': '\u0004', 'Value': 10 }, { 'Key': '\u0005', 'Value': 10 },
//         { 'Key': '\u0006', 'Value': 10 }, { 'Key': '\u0007', 'Value': 10 },
//         { 'Key': '\b', 'Value': 10 }, { 'Key': '\t', 'Value': 0 }, { 'Key': '\n', 'Value': 0 },
//         { 'Key': '\u000b', 'Value': 0 }, { 'Key': '\f', 'Value': 0 },
//         { 'Key': '\r', 'Value': 0 }, { 'Key': '\u000e', 'Value': 10 },
//         { 'Key': '\u000f', 'Value': 10 }, { 'Key': '\u0010', 'Value': 10 },
//         { 'Key': '\u0011', 'Value': 10 }, { 'Key': '\u0012', 'Value': 10 },
//         { 'Key': '\u0013', 'Value': 10 }, { 'Key': '\u0014', 'Value': 10 },
//         { 'Key': '\u0015', 'Value': 10 }, { 'Key': '\u0016', 'Value': 10 },
//         { 'Key': '\u0017', 'Value': 10 }, { 'Key': '\u0018', 'Value': 10 },
//         { 'Key': '\u0019', 'Value': 10 }, { 'Key': '\u001a', 'Value': 10 },
//         { 'Key': '\u001b', 'Value': 10 }, { 'Key': '\u001c', 'Value': 7 },
//         { 'Key': '\u001d', 'Value': 7 }, { 'Key': '\u001e', 'Value': 7 },
//         { 'Key': '\u001f', 'Value': 7 }, { 'Key': ' ', 'Value': 10 },
//         { 'Key': '!', 'Value': 10 }, { 'Key': '"', 'Value': 12 },
//         { 'Key': '#', 'Value': 14 }, { 'Key': '$', 'Value': 13 }, { 'Key': '%', 'Value': 15 },
//         { 'Key': '&', 'Value': 7 }, { 'Key': '\'', 'Value': 9 },
//         { 'Key': '(', 'Value': 10 }, { 'Key': ')', 'Value': 10 },
//         { 'Key': '*', 'Value': 11 },
//         { 'Key': '+', 'Value': 13 }, { 'Key': ',', 'Value': 10 },
//         { 'Key': '-', 'Value': 10 }, { 'Key': '.', 'Value': 10 },
//         { 'Key': '/', 'Value': 12 },
//         { 'Key': '0', 'Value': 13 }, { 'Key': '1', 'Value': 13 },
//         { 'Key': '2', 'Value': 13 }, { 'Key': '3', 'Value': 13 },
//         { 'Key': '4', 'Value': 13 },
//         { 'Key': '5', 'Value': 13 }, { 'Key': '6', 'Value': 13 },
//         { 'Key': '7', 'Value': 13 }, { 'Key': '8', 'Value': 13 }, { 'Key': '9', 'Value': 13 },
//         { 'Key': ':', 'Value': 10 }, { 'Key': ';', 'Value': 10 },
//         { 'Key': '<', 'Value': 13 }, { 'Key': '=', 'Value': 13 }, { 'Key': '>', 'Value': 13 },
//         { 'Key': '?', 'Value': 13 }, { 'Key': '@', 'Value': 18 },
//         { 'Key': 'A', 'Value': 14 }, { 'Key': 'B', 'Value': 14 }, { 'Key': 'C', 'Value': 14 },
//         { 'Key': 'D', 'Value': 15 }, { 'Key': 'E', 'Value': 14 }, { 'Key': 'F', 'Value': 13 },
//         { 'Key': 'G', 'Value': 15 }, { 'Key': 'H', 'Value': 15 },
//         { 'Key': 'I', 'Value': 10 }, { 'Key': 'J', 'Value': 12 },
//         { 'Key': 'K', 'Value': 14 }, { 'Key': 'L', 'Value': 13 }, { 'Key': 'M', 'Value': 16 },
//         { 'Key': 'N', 'Value': 15 }, { 'Key': 'O', 'Value': 15 },
//         { 'Key': 'P', 'Value': 14 }, { 'Key': 'Q', 'Value': 15 }, { 'Key': 'R', 'Value': 15 },
//         { 'Key': 'S', 'Value': 14 }, { 'Key': 'T', 'Value': 14 },
//         { 'Key': 'U', 'Value': 15 }, { 'Key': 'V', 'Value': 14 }, { 'Key': 'W', 'Value': 18 },
//         { 'Key': 'X', 'Value': 14 }, { 'Key': 'Y', 'Value': 14 },
//         { 'Key': 'Z', 'Value': 14 }, { 'Key': '[', 'Value': 10 }, { 'Key': '\\', 'Value': 12 },
//         { 'Key': ']', 'Value': 10 }, { 'Key': '^', 'Value': 13 },
//         { 'Key': '_', 'Value': 13 }, { 'Key': '`', 'Value': 10 }, { 'Key': 'a', 'Value': 13 },
//         { 'Key': 'b', 'Value': 13 }, { 'Key': 'c', 'Value': 13 },
//         { 'Key': 'd', 'Value': 13 }, { 'Key': 'e', 'Value': 13 }, { 'Key': 'f', 'Value': 10 },
//         { 'Key': 'g', 'Value': 13 }, { 'Key': 'h', 'Value': 13 },
//         { 'Key': 'i', 'Value': 9 }, { 'Key': 'j', 'Value': 9 },
//         { 'Key': 'k', 'Value': 13 },
//         { 'Key': 'l', 'Value': 9 }, { 'Key': 'm', 'Value': 15 },
//         { 'Key': 'n', 'Value': 13 }, { 'Key': 'o', 'Value': 13 }, { 'Key': 'p', 'Value': 13 },
//         { 'Key': 'q', 'Value': 13 }, { 'Key': 'r', 'Value': 10 },
//         { 'Key': 's', 'Value': 12 }, { 'Key': 't', 'Value': 10 }, { 'Key': 'u', 'Value': 13 },
//         { 'Key': 'v', 'Value': 13 }, { 'Key': 'w', 'Value': 15 },
//         { 'Key': 'x', 'Value': 12 }, { 'Key': 'y', 'Value': 12 }, { 'Key': 'z', 'Value': 12 },
//         { 'Key': '{', 'Value': 11 }, { 'Key': '|', 'Value': 9 },
//         { 'Key': '}', 'Value': 11 }, { 'Key': '~', 'Value': 14 }, { 'Key': '', 'Value': 10 },
//         { 'Key': '', 'Value': 7 }];

//         let textLength = 0;
//         let i: number;
//         let j: string;

//         for (i = 0; i < textValue.length; i++) {
//             for (j in myJSON) {
//                 if (myJSON[j].Key === textValue[i]) {
//                     textLength += myJSON[j].Value;
//                     break;
//                 }
//             }
//         }
//         textLength = textLength - (textValue.length - 1) * 7;
//         return textLength;
//     }


//     setControlLabelWidth(varNo: number, AVD_Text: string, SC_Action: string, highVisibility: boolean) {
//         let item: string;
//         let labelText: string;
//         const labelwidth = 0;
//         if (varNo === 0) {
//             // label field - not stored in AppVarDefs, so description is in ScreenControls Action field MPP 23.1.08
//             // MPP 3.6.08 shouldn't have null values in Action for label fields, but check anyway
//             item = SC_Action;
//             if (!item) {
//                 labelText = '<empty label>';
//             } else {
//                 labelText = item;
//             }

//         } else {
//             item = AVD_Text;
//             if (!item) {
//                 labelText = '';
//             } else {
//                 labelText = item.trim();
//             }

//         }
//         const width = this.calculateControlLabelWidth(labelText);
//         this.screenComponentDto.label_Width = width;
//         this.contanerLable.width = width;
//         this.contanerLable.width = width;
//     }



//     public ResetComponent() {
//         this.setUiComponentType(this.screenComponentDto);
//         this.setControlLabelWidth(this.screenComponentDto.avD_VarNo,
//  this.screenComponentDto.avD_Text, this.screenComponentDto.sC_Action, false);
//         this.control.width = this.setControllerWidth(this.screenComponentDto);
//         this.containerWidth = this.setCalculateComponentContainerWidth(this.screenComponentDto);
//     }
// }
