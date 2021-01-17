export { ServiceEndpointConfig } from './configs/service-configs';
export { SafeBoxType } from './lib/Safe-box-type.enum';
export { MatterInputData, MatterInfo } from './lib/matter';
export { AppConfig } from './configs/app-config';
export { ComponentBase } from './lib/component-base';
export {
    TokenizeAction, DPS_APP_INIT, DpsAppInit, WorkflowXmCommondExecuted,
    CreateWorkflowSession, CREATE_WORKFLOW_SESSION
} from './lib/actions';
export { MsgraphClientBase } from './lib/msgraph-client-base';
export { ApiClientWrapper } from './lib/odata-service-base';
export { OutlookClientBase } from './lib/outlook-client-base';
export { LocalStorageKey } from './lib/local-storage';
export * from './lib/screen-edit';
export * from './lib/data-response';
export { DriveMailIntegration } from './organizer/drive-mail-integration';
export { MgGraphBatchRequest } from './lib/graph-client-interfaces';
export * from './consts/extensions';
declare global {
    interface Date {
        getThisWeekFriday: () => any;
        getNextWeekMonday: () => any;
        getNextWeekFriday: () => any;
        getWeek: () => number;
        toDpsString: (onlyDate?: boolean, removeTime?: boolean) => string;
        dateWithOutTime: () => Date;
        addDays: (days: number) => Date;
    }
}

export interface Dictionary<T> { [key: string]: T; }
