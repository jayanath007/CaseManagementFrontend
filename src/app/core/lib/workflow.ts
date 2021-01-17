import { WorkflowMenuMetaDataWrapper } from '../../workflow-menu-core';
import { MatterSearchGridData } from './matter';

export interface WorkFlowMenuPopupInput {
    appId: number;
    fileId: number;
    branchId: number;
    isProspectMatter: boolean;
    token?: string;
    input?: string;
}

export enum MenusUserAction {
    cancel = 'CLICK_CANCEL',
    save = 'CLICK_SAVE',
    fileBase = 'CLICK_FILE_BASE'
}

export function matterMenusForView(menuList: WorkflowMenuMetaDataWrapper[], matterInfo: MatterSearchGridData) {
    if (menuList && matterInfo && matterInfo.isProspectMatter) {
        return menuList.filter(i => i.data.atN_Desc.toLowerCase().replace(/' '/g, '').includes('opportunities-quotes'));
    }
    return menuList;
}


