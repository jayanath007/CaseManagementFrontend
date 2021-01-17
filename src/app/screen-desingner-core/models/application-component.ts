import { ScreenComponentDto, UiComponentType } from '../../screen-view-core/models/screen-contaner-component';



export interface IOvItem {
    appID: number;
    varNo: number;
    fieldType: number;
    fieldTypeText: string;
    inputLength: number;
    sequence: number;
    description: string;
    help: string;
    onScreen: boolean;
    isSelected: boolean;
    isNewItem: boolean;
    screenComponentDto?: ScreenComponentDto;
}


export class OvItem implements IOvItem {
    appID: number;
    varNo: number;
    fieldType: number;
    fieldTypeText: string;
    inputLength: number;
    description: string;
    help: string;
    onScreen: boolean;
    isSelected: boolean;
    isNewItem: boolean;
    sequence: number;
    isDisplay: boolean;


    constructor(public screenComponentDto: ScreenComponentDto) {

        this.appID = screenComponentDto.avD_AppID;
        this.varNo = screenComponentDto.avD_VarNo;
        this.fieldType = screenComponentDto.avD_Type;
        this.fieldTypeText = screenComponentDto.avD_TypeText;
        this.inputLength = screenComponentDto.avD_Length;
        this.description = screenComponentDto.avD_Text;
        this.help = screenComponentDto.avD_Help;

        screenComponentDto.sC_Visible = true;
        screenComponentDto.sC_ID = null;
        screenComponentDto.sC_VarNo = screenComponentDto.avD_VarNo;

        this.isSelected = false;
        this.isNewItem = false;
        this.onScreen = false;
        this.sequence = 0;
        this.isDisplay = true;
    }

    setAvdVarNoToDto(avdVarNo: number): void {
        this.varNo = avdVarNo;
        this.screenComponentDto.avD_VarNo = avdVarNo;
        this.screenComponentDto.sC_VarNo = avdVarNo;
    }

    setLabelDescriptionToDto(description: string): void {

        if (this.screenComponentDto.sC_VarNo === 0) {
            this.screenComponentDto.sC_Action = description;
        } else {

            if (description === '') {
                this.screenComponentDto.avD_Text = null;
            } else {
                this.screenComponentDto.avD_Text = description;
            }
        }
        this.description = description;
    }

    public setMaxLengthToDto(maxLength: number): void {
        this.inputLength = maxLength;
        this.screenComponentDto.avD_Length = maxLength;
    }

    public setHelpTextToDto(helpText: string): void {
        this.help = helpText;
        this.screenComponentDto.avD_Help = helpText;
    }

    public setUiComponentTypeToDto(uiComponentType: UiComponentType): void {
        this.fieldType = uiComponentType;
        this.screenComponentDto.avD_Type = uiComponentType;
    }
    public setFieldTypeTextToDto(typeText): void {
        this.fieldTypeText = typeText;
        this.screenComponentDto.avD_TypeText = typeText;
    }
}
