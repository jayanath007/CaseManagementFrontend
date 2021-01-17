import { SeverityLevel } from 'ng2-appinsights';

export interface ConsoleError {
    exception: any;
    handledAt?: string;
    properties?: any;
    measurements?: any;
    severityLevel?: SeverityLevel;
}
export enum ExceptiontTypes {
    console = 'CONSOLE',
    network = 'NETWORK',
    graphAPI = 'GRAPH_API',
}
export enum BasePopupType {
    Chaser = 'CHASER',
    EmailAttachDPSfile = 'EMAIL-ATTACH-DPS-FILE',
    GlobalDocumentAttachDPSfile = 'GLOBAL-DOCUMENT-ATTACH-DPS-FILE',
}
