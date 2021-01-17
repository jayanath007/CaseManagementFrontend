
import { ScreenComponentDto } from './screen-contaner-component';
import { ScreenDefinitionDto } from './screen-definition';
import { ShowUserScreen, IVarValue } from '../../workflow-core';


export class FormViewRequest {
    constructor(public filterOptions: ShowUserScreen) { }
    public toPost() {
        return { caseFileIdentityWithAppIdViewModel: this.filterOptions };
    }
}

export class MainStateRequest {
    constructor() { }
    public toPost() {
        return {};
    }
}

export class ScreenAttachmentViewModel {
    constructor() { }
    public toPost() {
        return {};
    }
}






export interface MainStateRequestViewModel {
    appId: Number;
}


export class ScreenViewRequest {
    constructor(
        public appId: Number,
        public screenId: string,
        public screenList: number[],
        // public ov?:
    ) { }

}

export class ScreenDesignRequest {
    constructor(public optionList: FormViewRequestViewModel) { }

}

export interface FormViewRequestViewModel {
    appId: Number;
    screenId: string;
    currentIndex?: number;
    screenIds?: Array<string>;
    ov?: IVarValue[];
    fileId?: number;
    branchId?: number;
    screenTitle?: string;
    screenCount?: number;
    interactionId?: string;
}

export interface IVarValue {
    ControlerID: number;
    VarNo: number;
    Value: string;
}

export interface FormNavigator {
    appId: number;
    currentIndex: number;
    screenIds: Array<string>;
}

export interface FormViewResponse {
    data: {
        screenControlList: ScreenComponentDto,
        screenDefinition: ScreenDefinitionDto
    };
    status: string;
    messageBody: string;
    messageHeader: string;
    detailStatus: DetailStatusViewModel[];
}

export interface DetailStatusViewModel {
    Code: string;
    Message: string;
    Reference: string;
    MessageType: string;
    SeverityLevel: string;
    ExceptionType: string;
}


export interface MainStateResponse {
    data: IMainState;
    status: string;
    messageBody: string;
    messageHeader: string;
    detailStatus: DetailStatusViewModel[];
}


export interface IMainState {
    disabilityColors: boolean;
    screenCheckBoxYN: boolean;
    runningFileExitLogic?: boolean;
    autoLoadContact?: boolean;
}

export interface MainState {
    useDisabilityColors: boolean;
    screenCheckBoxYN: boolean;
    runningFileExitLogic?: boolean;
    autoLoadContact?: boolean;
}


