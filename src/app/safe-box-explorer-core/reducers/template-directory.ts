
import { createSelector } from '@ngrx/store';
import {
    AppView, CheckedOutData, TemplateListResponse,
    TemplateListResponseView, Template, TemplateClipboard, AppInfo
} from '../models/interfaces';
import * as Actions from '../actions/template-directory';
import * as DocAction from '../../document-view';
import { TemplateFilterByCheckoutType } from '../models/enum';
import { AttachmentIconPipe } from '../../shared';

export type AppViews = Readonly<{ [id: number]: Readonly<AppView>; }>;

export interface State {
    readonly isLoading: boolean;
    readonly appList: AppInfo[];
    readonly selectedApp: AppInfo;
    readonly appViews: AppViews;
    readonly isAppListExpand: boolean;
    readonly sort: string;
    readonly filter: TemplateFilterByCheckoutType;
    readonly searchText: string;
    readonly showCommonTemplates: boolean;
    readonly clipboard: TemplateClipboard;
}

const initialState: State = {
    isLoading: false,
    appList: [],
    selectedApp: null,
    appViews: {},
    isAppListExpand: false,
    sort: 'asc',
    filter: TemplateFilterByCheckoutType.All,
    searchText: '',
    showCommonTemplates: false,
    clipboard: null
};

const canEditTypes = ['doc', 'dot', 'wbk', 'docx', 'docm', 'dotx', 'dotm', 'docb', 'xml', 'rtf', 'ttf'];
const canVewTypes = [
    'docx', 'doc', 'xlsx', 'xls', 'rtf', 'xml', 'pptx', 'ppt', 'csv', 'ods', 'xlsb',
    'xlsm', 'one', 'onetoc2', 'odp', 'pot', 'potm', 'potx', 'pps', 'ppsm', 'pptm', 'wbx',
    'docm', 'dot', 'dotm', 'odt', 'msg', 'eml', 'pdf', 'fdf'
];

export function reducer(state = initialState, action: Actions.Any | DocAction.Any): State {
    switch (action.type) {
        case Actions.INIT_TEMPLATE_DIRECTORY:
            return { ...state, ...setInitialData() };

        case Actions.GET_APP_LIST:
            return { ...state, isLoading: true };

        case Actions.GET_APP_LIST_SUCCESS:
            return { ...state, isLoading: false, appList: action.payload };

        case Actions.GET_APP_LIST_FAIL:
            return { ...state, isLoading: false };

        case Actions.GET_APP_LIST:
            return { ...state, isLoading: false };

        case Actions.SELECT_APP:
            return {
                ...state,
                selectedApp: action.payload,
                appViews: state.appViews[action.payload.appId] ? state.appViews : setAppInit(state.appViews, action.payload)
            };

        case Actions.TOGGLE_APP_LIST_EXPAND:
            return { ...state, isAppListExpand: !state.isAppListExpand };

        case Actions.GET_TEMPLATE_LIST:
            return { ...state, appViews: getTemplateList(state.appViews, action.payload) };

        case Actions.GET_TEMPLATE_LIST_SUCCESS:
            return {
                ...state, appViews: getTemplateListSuccess(state.appViews, action.payload.app,
                    action.payload.templates, action.payload.checkedOutList)
            };

        case Actions.GET_CHECKED_OUT_FILES_SUCCESS:
            return {
                ...state, appViews: getCheckedOutFilesSuccess(state.appViews, action.payload.app, action.payload.checkedOutList)
            };

        case Actions.GET_TEMPLATE_LIST_FAIL:
            return { ...state, appViews: getTemplateListFail(state.appViews, action.payload.app) };

        case Actions.SELECT_TEMPLATE:
            return {
                ...state,
                appViews: selectTemplate(state.appViews, action.payload.appId,
                    action.payload.template.name, action.payload.isMulti, action.payload.path)
            };
        case Actions.CHANGE_SORT:
            return { ...state, sort: action.payload };
        case Actions.CHANGE_FILTER:
            return { ...state, filter: action.payload };
        case Actions.CHANGE_SEARCH_TEXT:
            return { ...state, searchText: action.payload };
        case Actions.CHANGE_SHOW_COMMON_TEMPLATES:
            return { ...state, showCommonTemplates: action.payload };
        case Actions.CUT_OR_COPY_TEMPLATES:
            return { ...state, clipboard: action.payload };
        case Actions.RENAME_ITEM_SUCCESS:
            return {
                ...state,
                appViews: renameItemSuccess(state.appViews, action.payload.appId,
                    action.payload.newName, action.payload.extension, action.payload.template, action.payload.appPath)
            };

        case DocAction.CHECKOUT_TEMPALTE_FILE: {
            return changeEditingBusy(state, action.payload.appId, true, action.payload.fileName,
                action.payload.isCommon ? DocAction.FileManagerType.CommonTemplateManager : DocAction.FileManagerType.TemplateManager);
        }

        case DocAction.DISCARD_CHECKOUT:
        case DocAction.CHECKIN_FILE: {
            if (action.docCheckin.fileManagerType === DocAction.FileManagerType.TemplateManager ||
                action.docCheckin.fileManagerType === DocAction.FileManagerType.CommonTemplateManager) {
                return changeEditingBusy(state, null, true, action.docCheckin.hashKey, action.docCheckin.fileManagerType);
            }
            return state;
        }

        case DocAction.FILE_CHECKOUT_FAIL: {
            if (action.fileMgrType === DocAction.FileManagerType.TemplateManager ||
                action.fileMgrType === DocAction.FileManagerType.CommonTemplateManager) {
                const req = action.requestPaylod as DocAction.TempaltePathInfo;
                return changeEditingBusy(state, req.appId, false, req.fileName, action.fileMgrType);
            }
            return state;

        }

        case DocAction.DISCARD_CHECKOUT_FAIL:
        case DocAction.CHECKIN_FILE_FAIL: {

            if (action.docCheckin.fileManagerType === DocAction.FileManagerType.TemplateManager ||
                action.docCheckin.fileManagerType === DocAction.FileManagerType.CommonTemplateManager) {
                return changeEditingBusy(state, null, false, action.docCheckin.hashKey, action.docCheckin.fileManagerType);
            }
            return state;
        }

        case DocAction.FILE_CHECKOUT_SUCCESS: {
            if (action.docCheckin.fileManagerType === DocAction.FileManagerType.TemplateManager ||
                action.docCheckin.fileManagerType === DocAction.FileManagerType.CommonTemplateManager) {
                const req = action.requestPaylod as DocAction.TempaltePathInfo;
                return changecheckedOutData(state, req.appId, action.docCheckin.hashKey, req.fileName, action.docCheckin.fileManagerType);
            }
            return state;
        }

        case DocAction.DISCARD_CHECKOUT_SUCCESS:
        case DocAction.CHECKIN_FILE_SUCCESS:
            {
                if (action.docCheckin.fileManagerType === DocAction.FileManagerType.TemplateManager ||
                    action.docCheckin.fileManagerType === DocAction.FileManagerType.CommonTemplateManager) {
                    return changecheckedOutData(state, null, action.docCheckin.hashKey, null, action.docCheckin.fileManagerType);
                }
                return state;
            }

        default:
            {
                return state;
            }
    }
}

function setInitialData(): Partial<State> {
    return {};
}

function setAppInit(appViews: AppViews, app: AppInfo): AppViews {
    const temp: { [id: string]: Partial<AppView>; } = {};
    temp[app.appId] = { app };
    return { ...appViews, ...temp };
}

function getTemplateList(appViews: AppViews, app: AppInfo): AppViews {
    const temp: { [id: string]: Readonly<AppView>; } = {};
    temp[app.appId] = { ...appViews[app.appId], isLoading: true };
    return { ...appViews, ...temp };
}

function getTemplateListSuccess(appViews: AppViews, app: AppInfo,
    templates: TemplateListResponse, checkedOutList: CheckedOutData[]): AppViews {
    const temp: { [id: string]: Readonly<AppView>; } = {};
    temp[app.appId] = {
        ...appViews[app.appId], isLoading: false,
        appPathTemplate: templates.appPathTemplate ? setTemplateList(templates.appPathTemplate, checkedOutList) : null,
        appCommonPathTemplates: templates.appCommonPathTemplates ? setTemplateList(templates.appCommonPathTemplates, checkedOutList) : null,
        isLocationMatch: templates.isLocationMatch
    };
    return { ...appViews, ...temp };
}

function setTemplateList(view: TemplateListResponseView, checkedOutList: CheckedOutData[]) {
    const attachmentIconPipe = new AttachmentIconPipe();
    return {
        templateList: view.fileName ? view.fileName.map(val => {
            let data: CheckedOutData = null;
            const canEdit = canEditTypes.includes(attachmentIconPipe.transform(val, 'type').toLowerCase());
            const canView = canVewTypes.includes(attachmentIconPipe.transform(val, 'type').toLowerCase());
            checkedOutList = checkedOutList.filter((value) => {
                if (value.templateId.toLowerCase() === val.toLowerCase() && value.path.toLowerCase() === view.filePath.toLowerCase()) {
                    data = value;
                    return false;
                }
                return true;
            });
            if (data) {
                return { name: val, checkedOutByUser: data.byUser, checkedOutHashKey: data.hashKey, canEdit, canView };
            }
            return { name: val, canEdit, canView };
        }) : [],
        path: view.path,
        filePath: view.filePath,
    };
}

function getCheckedOutFilesSuccess(appViews: AppViews, app: AppInfo, checkedOutList: CheckedOutData[]): AppViews {
    const temp: { [id: string]: Readonly<AppView>; } = {};
    temp[app.appId] = {
        ...appViews[app.appId], isLoading: false,
        appPathTemplate: appViews[app.appId].appPathTemplate ? {
            ...appViews[app.appId].appPathTemplate,
            templateList: setCheckedOutFiles(appViews[app.appId].appPathTemplate.templateList,
                checkedOutList, appViews[app.appId].appPathTemplate.filePath)
        } : null,
        appCommonPathTemplates: appViews[app.appId].appCommonPathTemplates ? {
            ...appViews[app.appId].appCommonPathTemplates,
            templateList: setCheckedOutFiles(appViews[app.appId].appCommonPathTemplates.templateList,
                checkedOutList, appViews[app.appId].appCommonPathTemplates.filePath)
        } : null
    };
    return { ...appViews, ...temp };
}

function setCheckedOutFiles(templateList: Template[], checkedOutList: CheckedOutData[], path: string) {
    return templateList.map(val => {
        let data: CheckedOutData = null;
        checkedOutList = checkedOutList.filter((value) => {
            if (value.templateId.toLowerCase() === val.name.toLowerCase() && value.path.toLowerCase() === path.toLowerCase()) {
                data = value;
                return false;
            }
            return true;
        });
        if (data) {
            return { ...val, checkedOutByUser: data.byUser, checkedOutHashKey: data.hashKey };
        }
        return { ...val, checkedOutByUser: undefined, checkedOutHashKey: undefined };
    });
}


function getTemplateListFail(appViews: AppViews, app: AppInfo): AppViews {
    const temp: { [id: string]: Readonly<AppView>; } = {};
    temp[app.appId] = {
        ...appViews[app.appId], isLoading: false,
        appPathTemplate: null,
        appCommonPathTemplates: null
    };
    return { ...appViews, ...temp };
}

function changeEditingBusy(state: State, appId: number, editingBusy: boolean, nameOrHash: string,
    fileManagerType: DocAction.FileManagerType): State {
    const temp: { [id: string]: Readonly<AppView>; } = {};
    if (appId === null) {
        Object.keys(state.appViews).forEach(id => {
            if (fileManagerType === DocAction.FileManagerType.CommonTemplateManager) {
                temp[Number(id)] = {
                    ...state.appViews[Number(id)],
                    appCommonPathTemplates: {
                        ...state.appViews[Number(id)].appCommonPathTemplates,
                        templateList: state.appViews[Number(id)].appCommonPathTemplates.templateList.map(val => {
                            if (val.checkedOutHashKey === nameOrHash) {
                                return { ...val, editingBusy: editingBusy };
                            }
                            return val;
                        })
                    }
                };
            } else {
                temp[Number(id)] = {
                    ...state.appViews[Number(id)],
                    appPathTemplate: {
                        ...state.appViews[Number(id)].appPathTemplate,
                        templateList: state.appViews[Number(id)].appPathTemplate.templateList.map(val => {
                            if (val.checkedOutHashKey === nameOrHash) {
                                return { ...val, editingBusy: editingBusy };
                            }
                            return val;
                        })
                    }
                };
            }
        });
    } else if (state.appViews[appId]) {
        if (fileManagerType === DocAction.FileManagerType.CommonTemplateManager) {
            temp[appId] = {
                ...state.appViews[appId],
                appCommonPathTemplates: {
                    ...state.appViews[appId].appCommonPathTemplates,
                    templateList: state.appViews[appId].appCommonPathTemplates.templateList.map(val => {
                        if (val.name.toLowerCase() === nameOrHash.toLowerCase()) {
                            return { ...val, editingBusy: editingBusy };
                        }
                        return val;
                    })
                }
            };
        } else {
            temp[appId] = {
                ...state.appViews[appId],
                appPathTemplate: {
                    ...state.appViews[appId].appPathTemplate,
                    templateList: state.appViews[appId].appPathTemplate.templateList.map(val => {
                        if (val.name.toLowerCase() === nameOrHash.toLowerCase()) {
                            return { ...val, editingBusy: editingBusy };
                        }
                        return val;
                    })
                }
            };
        }
    }
    return { ...state, appViews: { ...state.appViews, ...temp } };
}

function changecheckedOutData(state: State, appId: number, checkedOutHashKey: string,
    fileName: string, fileManagerType: DocAction.FileManagerType): State {
    const temp: { [id: string]: Readonly<AppView>; } = {};
    if (appId === null) {
        Object.keys(state.appViews).forEach(id => {
            if (fileManagerType === DocAction.FileManagerType.CommonTemplateManager) {
                temp[Number(id)] = {
                    ...state.appViews[Number(id)],
                    appCommonPathTemplates: {
                        ...state.appViews[Number(id)].appCommonPathTemplates,
                        templateList: state.appViews[Number(id)].appCommonPathTemplates.templateList.map(val => {
                            if (val.checkedOutHashKey === checkedOutHashKey) {
                                return { ...val, editingBusy: false, checkedOutHashKey: null, checkedOutByUser: null };
                            }
                            return val;
                        })
                    }
                };
            } else {
                temp[Number(id)] = {
                    ...state.appViews[Number(id)],
                    appPathTemplate: {
                        ...state.appViews[Number(id)].appPathTemplate,
                        templateList: state.appViews[Number(id)].appPathTemplate.templateList.map(val => {
                            if (val.checkedOutHashKey === checkedOutHashKey) {
                                return { ...val, editingBusy: false, checkedOutHashKey: null, checkedOutByUser: null };
                            }
                            return val;
                        })
                    }
                };
            }
        });
    } else if (state.appViews[appId]) {
        if (fileManagerType === DocAction.FileManagerType.CommonTemplateManager) {
            temp[appId] = {
                ...state.appViews[appId],
                appCommonPathTemplates: {
                    ...state.appViews[appId].appCommonPathTemplates,
                    templateList: state.appViews[appId].appCommonPathTemplates.templateList.map(val => {
                        if (val.name.toLowerCase() === fileName.toLowerCase()) {
                            return { ...val, editingBusy: false, checkedOutHashKey: checkedOutHashKey };
                        }
                        return val;
                    })
                }
            };
        } else {
            temp[appId] = {
                ...state.appViews[appId],
                appPathTemplate: {
                    ...state.appViews[appId].appPathTemplate,
                    templateList: state.appViews[appId].appPathTemplate.templateList.map(val => {
                        if (val.name.toLowerCase() === fileName.toLowerCase()) {
                            return { ...val, editingBusy: false, checkedOutHashKey: checkedOutHashKey };
                        }
                        return val;
                    })
                }
            };
        }

    }

    return { ...state, appViews: { ...state.appViews, ...temp } };
}

function selectTemplate(appViews: AppViews, appId: number, name: string, isMulti: boolean, path: string): AppViews {
    const temp: { [id: string]: Readonly<AppView>; } = {};
    if (appViews[appId].appPathTemplate && appViews[appId].appPathTemplate.path.toLowerCase() === path.toLowerCase()) {
        temp[appId] = {
            ...appViews[appId],
            appPathTemplate: {
                ...appViews[appId].appPathTemplate,
                templateList: appViews[appId].appPathTemplate.templateList.map(val => {
                    return { ...val, selected: val.name === name ? (isMulti ? !val.selected : true) : (isMulti ? val.selected : false) };
                })
            }
        };
    } else if (appViews[appId].appCommonPathTemplates && appViews[appId].appCommonPathTemplates.path.toLowerCase() === path.toLowerCase()) {
        temp[appId] = {
            ...appViews[appId],
            appCommonPathTemplates: {
                ...appViews[appId].appCommonPathTemplates,
                templateList: appViews[appId].appCommonPathTemplates.templateList.map(val => {
                    return { ...val, selected: val.name === name ? (isMulti ? !val.selected : true) : (isMulti ? val.selected : false) };
                })
            }
        };
    }

    return { ...appViews, ...temp };
}

function renameItemSuccess(appViews: AppViews, appId: number, name: string, extension: string, template: Template, path: string): AppViews {
    const temp: { [id: string]: Readonly<AppView>; } = {};
    temp[appId] = {
        ...appViews[appId],
        [path]: {
            ...appViews[appId].appPathTemplate,
            templateList: appViews[appId].appPathTemplate.templateList.map(val => {
                return { ...val, name: val.name === template.name ? name + extension : val.name };
            })
        }
    };

    return { ...appViews, ...temp };
}

export const getState = (state: State) => state;

export const getIsLoading = createSelector(getState,
    (state) => state ? state.isLoading : true);

export const getSort = createSelector(getState,
    (state) => state ? state.sort : '');

export const getFilter = createSelector(getState,
    (state) => state ? state.filter : null);

export const getSearchText = createSelector(getState,
    (state) => state ? state.searchText : '');

export const getAppList = createSelector(getState,
    (state) => state ? state.appList : []);

export const getSelectedApp = createSelector(getState,
    (state) => state ? state.selectedApp : null);

export const getIsAppListExpand = createSelector(getState,
    (state) => state ? state.isAppListExpand : false);

export const getAppViews = createSelector(getState,
    (state) => state ? state.appViews : {});

export const getAppViewByAppId = (id) => createSelector(getAppViews,
    (views) => views[id]);

export const getSelectedAppView = createSelector(getSelectedApp, getAppViews,
    (app, views) => app ? views[app.appId] : null);

export const getShowCommonTemplates = createSelector(getState,
    (state) => state ? state.showCommonTemplates : false);

export const getTemplateClipboard = createSelector(getState,
    (state) => state ? state.clipboard : null);
