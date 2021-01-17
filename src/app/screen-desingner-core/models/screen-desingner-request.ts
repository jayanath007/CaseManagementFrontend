import { request } from 'https';
import { ScreenDefinitionDto } from '../../screen-view-core/models/screen-definition';
import { ScreenComponentDto } from '../../screen-view-core/models/screen-contaner-component';
import { FormViewRequestViewModel } from '../../screen-view-core/models/request';
import { DPSResponse } from '../../core/lib/data-response';
import { FormView } from '../reducers/screen-desingner';


export interface ScreenDesignerResponse {

}

export class SaveScreenDesignerRequest {

    constructor(public importXMLPath: string, public rearrange: boolean , public withRefresh: boolean ) {

    }
}

export type SaveScreenDesignerResponse = DPSResponse<ScreenDesignerResponse>;






export interface ExportScreenDesignerResponseData {

}

export class ExportScreenDesignerRequest {

    constructor(public appID: number, public screenNumber: number,
        public selectedVar: number, public filter: string, public orderBySquence: boolean) {

    }
}

export type ExportScreenDesignerResponse = DPSResponse<ExportScreenDesignerResponseData>;




export class FormViewRequest {
    constructor(public filterOptions: FormViewRequestViewModel) { }
    public toPost() {
        return { caseFileIdentityWithAppIdViewModel: this.filterOptions };
    }
}


export class ScreenDesingnerRequest {
    constructor(public filterOptions: ScreenDesingnerRequestViewModel) { }
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

export interface MainStateRequestViewModel {
    appId: Number;
}


export class ScreenDesignRequest {
    constructor(public optionList: ScreenDesingnerRequestViewModel) { }

}

export interface ScreenDesingnerRequestViewModel {
    appId: Number;
    screenId: string;
    currentIndex?: number;
    screenIds?: Array<string>;
    createScreen?: boolean;
    // ov?: IVarValue[];
    // fileId?: number;
    // branchId?: number;
    // screenTitle?: string;
    // screenCount?: number;
    // interactionId?: string;
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

export interface ScreenDesingnerResponse {
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


export enum ChangeAxisKind {
    XAxis = 'XAxis',
    YAxis = 'YAxis',
    XAxisAndYAxis = 'XAxisAndYAxis',
}


export interface RectanglePositionAndSize {
    left: number;
    top: number;
    height: number;
    width: number;
}


export enum SD_DataSource {
    Vars = 0,
    Matters = 1,
    Clients = 2,
    Contacts = 3,
    Screen = 4
}

export interface ScreenLogicDocuments {
    checkedOutHashKey: string;
    id: ScreenLogic;
    checkedOutByUser: string;
    editingBusy: boolean;
    name: string;
    fileName: string;
}

export enum ScreenLogic {
    EntryLogic = 'EntryLogic',
    TabLogic = 'TabLogic',
    ExitLogic= 'ExitLogic',
}

