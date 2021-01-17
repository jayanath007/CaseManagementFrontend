import { GridRowItemWrapper } from './matter';
import { MainMenuItem } from '../../layout-desktop';
import { LocalStorageKey } from '..';


export interface OpenCaseMenueData {
    readonly token?: string;
    readonly matterReferenceNo?: string;
    readonly mouseOverText?: string;
    readonly menuDisplayText1?: string;
    readonly menuDisplayText2?: string;
    readonly menuDisplayText3?: string;
    readonly matterData?: GridRowItemWrapper;
    readonly mailSubject?: string;
    readonly openCaseToken?: string;
    readonly entryLogicState?: number;
    readonly exitLogicState?: number;

}
export interface MailSubjectParam {
    BranchId: number;
    AppId: number;
    FileId: number;
    CompanyCode: string;
    ConversationId: number;
}

export function GetOpenCaseToken(matterRef: string): string {
    const openCases: MainMenuItem<OpenCaseMenueData>[] = JSON.parse(sessionStorage.getItem(LocalStorageKey.OpenCaseMenuItems));
    const selectOpenCase = !!openCases ? openCases.find(c => c.data.matterReferenceNo === matterRef) : null;
    if (selectOpenCase) {
        return selectOpenCase.token;
    }
    return null;
}
