import { OvItem } from '../models/application-component';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { ConfirmDialogData } from '../../shared/models/dialog';
import { MatDialog } from '@angular/material';
import { IMainState } from '../../screen-view-core/models/request';
import { LOAD_LOOKUP_FILES_SUCCESS } from '../actions/field-properties';

import { ScreenComponent } from '../../screen-view-core/models/screen-component';
import { ScreenLogicDocuments, ScreenLogic } from '../../screen-desingner-core/models/screen-desingner-request';
import { Component } from '@angular/core';
import {
    ViewChangeKind,
    ScreenListItemsChangeKind,
    RowScreenDefinitionChangeKind,
    RowOvItemChangeKind,
} from '../actions/core';
import * as Actions from '../actions/core';
import * as FieldPropertiesActions from '../actions/field-properties';
import * as OvItemActions from '../actions/ov-items';
import { createSelector } from '@ngrx/store';
import { ScreenDefinitionDto, ScreenDefinition } from '../../screen-view-core/models/screen-definition';
import { ScreenComponentDto, ScreenContanerComponent, UiComponentType } from '../../screen-view-core/models/screen-contaner-component';
import { RectanglePositionAndSize } from '../models/screen-desingner-request';
import * as DocAction from '../../document-view';
import { FileManagerType } from '../../document-view';




export interface FormView {
    screenContanerComponentList: ScreenContanerComponent[];
    screenDefinition?: ScreenDefinition;
    selectedScreenContanerComponent?: ScreenContanerComponent;
    formContainerWidth?: number;
    formContainerHeight?: number;
    isFormViewChanged?: boolean;
    index: number;
}

export interface FormViewRespons {
    screenControlList: ScreenComponentDto[];
    screenDefinition: ScreenDefinitionDto;
    initialInfor?: { errorMasages: Array<string> };
    index: number;
}


export interface ScreenDesingnerState {
    curentIndex: number;
    screenIds?: Array<string>;
    appId: number;
    formView: FormView;
    formViewResponsList: FormViewRespons[];
    isLoading: boolean;
    mainState: IMainState;
    lookupFiles: Array<string>;
    workingLookupFileContent: string;
    isFormDataLoading: boolean;
    activeTab: Number;
    initialInfor: { errorMasages: Array<string> };
    displayMasages: string;
    masageCount: number;
    screenLogicDocuments: Array<ScreenLogicDocuments>;
    closePopup: boolean;
}

export interface State {
    views: {
        [token: string]: ScreenDesingnerState;
    };
}




const initialState: State = { views: {} };
export function reducer(state: State = initialState, action: Actions.Any | FieldPropertiesActions.Any
    | OvItemActions.Any | DocAction.Any): State {
    const tmp = {};
    switch (action.type) {
        case Actions.INIT_SCREEN_DESIGNER_POPUP:
            tmp[action.token] = initView(state.views[action.token]);
            console.log('reducer' + Actions.INIT_SCREEN_DESIGNER, { ...state, views: { ...state.views, ...tmp } });
            return { ...state, views: { ...state.views, ...tmp } };

        case Actions.SCREEN_DESIGNER_COMPONENT_CHANGE:
            tmp[action.token] = formViewListComponentUpdate(state.views[action.token], action.payload);
            return { ...state, views: { ...state.views, ...tmp } };

        case Actions.SCREEN_DESIGNER_SCREEN_DEFINITION_CHANGE:
            tmp[action.token] = screenDefinitionUpdate(state.views[action.token], action.payload);
            return { ...state, views: { ...state.views, ...tmp } };

        case Actions.SCREEN_DESIGNER_FORM_VIEW_CHANGE:
            tmp[action.token] = viewChange(state.views[action.token], action);
            return { ...state, views: { ...state.views, ...tmp } };


        case FieldPropertiesActions.LOAD_LOOKUP_FILES_SUCCESS:
            tmp[action.token] = { ...state.views[action.token], ...{ lookupFiles: action.payload.response.data, isLoading: false } };
            return { ...state, views: { ...state.views, ...tmp } };

        case FieldPropertiesActions.LOAD_LOOKUP_FILES_UPDATE:
            tmp[action.token] = {
                ...state.views[action.token],
                ...{ lookupFiles: [...state.views[action.token].lookupFiles, action.payload.value] }
            };
            return { ...state, views: { ...state.views, ...tmp } };

        case Actions.LOAD_SCREEN_DESIGNER_FORM_VIEW_DATA:
            tmp[action.token] = { ...state.views[action.token], ...{ isFormDataLoading: true } };
            return { ...state, views: { ...state.views, ...tmp } };

        case Actions.LOAD_SCREEN_DESIGNER_FORM_VIEW_DATA_SUCCESS:
            const value = formWithHieghtCalculation(action.payload.response.screenContanerComponentList);
            const formView = { ...action.payload.response, formContainerWidth: value.width, formContainerHeight: value.height };
            tmp[action.token] = { ...state.views[action.token], ...{ isFormDataLoading: false, isLoading: false, formView: formView } };
            return { ...state, views: { ...state.views, ...tmp } };



        case Actions.LOAD_SCREEN_DESIGN_FORM_VIEW_LIST_DATA:
            tmp[action.token] = { ...state.views[action.token], ...{ isLoading: true } };
            return { ...state, views: { ...state.views, ...tmp } };


        case Actions.SAVE_SCREEN_DESIGNER:

            tmp[action.token] = saveScreenDesingnerState(state.views[action.token], action.request);
            return { ...state, views: { ...state.views, ...tmp } };

        case Actions.LOAD_SCREEN_DESIGNER_LIST_SUCCESS:
            tmp[action.token] = { ...state.views[action.token], ...{ formViewResponsList: action.payload.response, isLoading: false } };
            return { ...state, views: { ...state.views, ...tmp } };

        case Actions.LOAD_FORM_VIEW_LIST_DATA_LOAD_FAIL:
            tmp[action.token] = { ...state.views[action.token], ...{ formViewResponsList: [], isLoading: false } };
            return { ...state, views: { ...state.views, ...tmp } };

        case Actions.IS_FORM_DATA_LOADING:
            tmp[action.token] = { ...state.views[action.token], ...{ isFormDataLoading: action.payload.value } };
            return { ...state, views: { ...state.views, ...tmp } };

        case Actions.INITIAL_DATA_INFOR_UPDATE_LOADING:
            tmp[action.token] = {
                ...state.views[action.token], ...{ initialInfor: action.payload.masages, screenIds: action.payload.screenIds }
            };
            return { ...state, views: { ...state.views, ...tmp } };

        case Actions.LOAD_MAIN_STATE_SUCCESS:
            tmp[action.token] = { ...state.views[action.token], ...{ mainState: action.payload.response } };
            return { ...state, views: { ...state.views, ...tmp } };

        case Actions.SCREEN_DESIGNER_TAB_CHANGE:
            tmp[action.token] = { ...state.views[action.token], ...{ activeTab: action.payload } };
            return { ...state, views: { ...state.views, ...tmp } };

        case Actions.CLOSE_SCREEN_DESIGNER_SUCCESS:
            tmp[action.token] = { ...state.views[action.token], ...{ closePopup: true } };
            return { ...state, views: { ...state.views, ...tmp } };



        // global document checkin handleing

        case DocAction.CHECKOUT_TEMPALTE_FILE: {
            const req = action as DocAction.CheckoutTempalteFiles;
            if (!req.payload.templateType) {
                return state;
            }
            const _state = mutateLogicItemWrapper(state, (item) => {
                return item.id === req.payload.templateType;
            }, (item) => {
                return { ...item, editingBusy: true };
            });

            return _state;
        }

        case DocAction.FILE_CHECKOUT_FAIL: {
            const _act = action as DocAction.FileCheckoutFailed;
            const req = _act.requestPaylod as DocAction.TempaltePathInfo;
            if (_act.fileMgrType !== FileManagerType.TemplateManager && !req.templateType) {
                return state;
            }

            const _state = mutateLogicItemWrapper(state, (item) => {
                return item.id === req.templateType;
            }, (item) => {
                return { ...item, editingBusy: false };
            });
            return _state;
        }

        case DocAction.DISCARD_CHECKOUT:
        case DocAction.CHECKIN_FILE: {
            const _act = action as DocAction.EditingResultAction;

            if (_act.docCheckin.fileManagerType !== FileManagerType.TemplateManager) {
                return state;
            }

            const _state = mutateLogicItemWrapper(state, (item) => {
                return item.checkedOutHashKey === _act.docCheckin.hashKey;
            }, (item) => {
                return { ...item, editingBusy: true };
            });

            return _state;
        }

        case DocAction.DISCARD_CHECKOUT_FAIL:
        case DocAction.CHECKIN_FILE_FAIL: {
            const _act = action as DocAction.EditingResultAction;

            if (_act.docCheckin.fileManagerType !== FileManagerType.TemplateManager) {
                return state;
            }

            const _state = mutateLogicItemWrapper(state, (item) => {
                return item.checkedOutHashKey === _act.docCheckin.hashKey;
            }, (item) => {
                return { ...item, editingBusy: false };
            });

            return _state;
        }

        case DocAction.FILE_CHECKOUT_SUCCESS: {
            const _act = action as DocAction.FileCheckoutSuccess;
            const req = _act.requestPaylod as DocAction.TempaltePathInfo;
            if (_act.docCheckin.fileManagerType !== FileManagerType.TemplateManager && !req.templateType) {
                return state;
            }
            const _state = mutateLogicItemWrapper(state, (item) => {
                return item.id === req.templateType;
            }, (item) => {
                return { ...item, editingBusy: false, checkedOutHashKey: _act.docCheckin.hashKey };
            });

            return _state;
        }

        case DocAction.DISCARD_CHECKOUT_SUCCESS:
        case DocAction.CHECKIN_FILE_SUCCESS:
            {
                const docCheckin = action.docCheckin as DocAction.IDocumentCheckin;
                // if (docCheckin.fileManagerType !== FileManagerType.FileWithDiaryEntryManager) {
                //     return state;
                // }

                const _state = mutateLogicItemWrapper(state, (item) => {
                    return !!item.checkedOutHashKey && item.checkedOutHashKey === docCheckin.hashKey;
                }, (item) => {
                    return {
                        ...item, editingBusy: false, checkedOutByUser: null, checkedOutHashKey: null
                    }; // clear checkout object
                });

                return _state;
            }




        // OvItem.SCREEN_DESIGNER_UPDATE_OV_ITEM

        default:
            { return state; }
    }
}



function mutateLogicItemWrapper(state: State, predicate: (item: ScreenLogicDocuments) => boolean,
    mutor: (item: ScreenLogicDocuments) => ScreenLogicDocuments): State {

    const handleItems = (items: ScreenLogicDocuments[]) => {
        let isDirty = false;
        const newItems = items.map((item) => {
            if (predicate(item)) {
                isDirty = true;
                return mutor(item);
            }
            return item;
        });
        if (isDirty) {
            return newItems;
        }
        return items;
    };

    const handleScreenDesingnerState = (screenDesingnerState: ScreenDesingnerState): ScreenDesingnerState => {

        const newData = handleItems(screenDesingnerState.screenLogicDocuments);
        if (newData !== screenDesingnerState.screenLogicDocuments) {
            return { ...screenDesingnerState, screenLogicDocuments: newData };
        }
        return screenDesingnerState;

    };

    const handleTokenViews = (_state: State): State => {
        const newViews = {};
        let isDirty = false;
        Object.keys(_state.views).forEach((token) => {
            const _view = _state.views[token];
            if (_view && _view.screenLogicDocuments) {
                const newView = handleScreenDesingnerState(_view);
                if (_view !== newView) {
                    isDirty = true;
                }
                newViews[token] = newView;
            }
        });
        if (isDirty) {
            return { ..._state, views: newViews };
        }
        return _state;
    };
    return handleTokenViews(state);

}




function initView(state: ScreenDesingnerState): Partial<ScreenDesingnerState> {
    if (!state) {
        return {
            formView: null,
            formViewResponsList: [],
            isLoading: false,
            isFormDataLoading: false,
            curentIndex: 0,
            activeTab: 0,
            closePopup: false,
            masageCount: 0,
            screenLogicDocuments: [
                {
                    checkedOutHashKey: '', id: ScreenLogic.EntryLogic, checkedOutByUser: '',
                    editingBusy: false, name: 'Entry Logic', fileName: 'LogicEntry.xml'
                },
                {
                    checkedOutHashKey: '', id: ScreenLogic.TabLogic, checkedOutByUser: '',
                    editingBusy: false, name: 'Tab Logic', fileName: 'LogicTab.xml'
                },
                {
                    checkedOutHashKey: '', id: ScreenLogic.ExitLogic, checkedOutByUser: '',
                    editingBusy: false, name: 'Exit Logic', fileName: 'LogicExit.xml'
                }],
        };
    }

    return state;
}

function saveScreenDesingnerState(state: ScreenDesingnerState, request) {
    if (request.withRefresh) {
        const newformViewResponsList = state.formViewResponsList.filter(p => p.index !== state.curentIndex);
        return { ...state, ...{ isFormDataLoading: true }, formViewResponsList: newformViewResponsList };
    } else {
        return { ...state, ...{ isFormDataLoading: true } };
    }
}


/////////  remove Component
function removeComponent(componentDto: ScreenComponentDto): void {
    const control = this.screenControlList.filter(x => x.varNo === componentDto.avD_VarNo)[0];
    if (control) {
        const index = this.screenControlList.indexOf(control);
        this.screenControlList.splice(index, 1);
    }
}

function removeSelectionItems(): void {
    this.screenControlList.filter(x => x.isSelected === true).forEach((item) => {
        const control = this.screenControlList.filter(x => x.id === item.id)[0];
        const selectedIndex = this.screenControlList.indexOf(control);
        this.screenControlList.splice(selectedIndex, 1);
        control.sequence = 0;
        this.updateApplicationDataItem(control, false);
        // this.fieldPropertiesService.deleteFieldProperty(item.screenComponentDto.SC_AppID,
        // item.screenComponentDto.SC_ScreenNo, item.screenComponentDto.AVD_VarNo, item.labelDescription);
    });
}


// don use use prives one
// function removeSingleItem(varNo: number): void {
//     this.screenControlList.filter(x => x.varNo == varNo).forEach((item) => {
//         var control = this.screenControlList.filter(x => x.id === item.id)[0]
//         let selectedIndex = this.screenControlList.indexOf(control);
//         this.screenControlList.splice(selectedIndex, 1);
//         control.sequence = 0;
//         this.updateApplicationDataItem(control, false);
//     });
// }


function updateComponent(componentDto: ScreenComponentDto): void {

    // Obtain Contol
    const control = this.screenControlList.filter(x => x.varNo === componentDto.avD_VarNo)[0];
    if (control) {
        // set dto
        control.setHelpTextToDto(componentDto.avD_Help);
        control.setLabelDescriptionToDto(componentDto.avD_Text);
        control.setUiComponentTypeToDto(componentDto.avD_Type);
        control.setMaxLengthToDto(componentDto.avD_Length);

    }
}


function formViewListComponentUpdate(state: ScreenDesingnerState, action: {
    kind: ScreenListItemsChangeKind;
    row: ScreenContanerComponent; value: any;
}) {

    let newScreenContanerComponentList: ReadonlyArray<ScreenContanerComponent> = state.formView.screenContanerComponentList;
    let selectedScreenContanerComponent: ScreenContanerComponent = state.formView.selectedScreenContanerComponent;
    switch (action.kind) {

        case ScreenListItemsChangeKind.ClearSelection:
            newScreenContanerComponentList = clearSelectionUpdate(state, action.row, action.value);
            break;
        case ScreenListItemsChangeKind.AddItem:
            newScreenContanerComponentList = addComponent(state, action.row, action.value);
            break;
        case ScreenListItemsChangeKind.SelectItem:
            newScreenContanerComponentList = componentSelectionUpdate(state, action.row, action.value);
            break;
        case ScreenListItemsChangeKind.MoveItem:
            newScreenContanerComponentList = componentMovenUpdate(state, action.row, action.value);
            break;
        case ScreenListItemsChangeKind.MoveComplete:
            newScreenContanerComponentList = componentMoveComplete(state, action.row, action.value);
            break;
        case ScreenListItemsChangeKind.DeleteItem:
            newScreenContanerComponentList = componentDelete(state, action.value);
            break;
        case ScreenListItemsChangeKind.OvItemDeleteItem:
            newScreenContanerComponentList = ovDeleteItemUpdate(state, action.value);
            break;
        case ScreenListItemsChangeKind.UpdateItemFromOVItemDto:
            newScreenContanerComponentList = updateItemFromOVItemDto(state, action.value);
            break;
        case ScreenListItemsChangeKind.UpdateValue:
            newScreenContanerComponentList = componentUpdate(state, action.row, action.value);
            selectedScreenContanerComponent = { ...action.row, isSelected: true };
            break;
        case ScreenListItemsChangeKind.SequenceRearrangement:
            newScreenContanerComponentList = sequenceRearrangementUpdate(state, action.value);
            break;
        case ScreenListItemsChangeKind.SequenceChange:
            newScreenContanerComponentList = componentUpdate(state, action.row, action.value);
            break;
        case ScreenListItemsChangeKind.LeftAlignController:
            newScreenContanerComponentList = componentsLeftAlignControllerUpdate(state, action.value)
                .screenContanerComponentList;
            break;
        case ScreenListItemsChangeKind.LeftAlign:
            newScreenContanerComponentList = componentsLeftAlignUpdate(state, action.value);
            break;
        case ScreenListItemsChangeKind.RightAlign:
            newScreenContanerComponentList = componentsRightAlignUpdate(state, action.value);
            break;
        case ScreenListItemsChangeKind.TopAlign:
            newScreenContanerComponentList = componentsTopAlignUpdate(state, action.value);
            break;
        case ScreenListItemsChangeKind.BottomAlign:
            newScreenContanerComponentList = componentsBottomAlignUpdate(state, action.value);
            break;
        case ScreenListItemsChangeKind.CenterAlign:
            newScreenContanerComponentList = componentsCenterAlignUpdate(state, action.value);
            break;
        case ScreenListItemsChangeKind.ArrangeSpace:
            newScreenContanerComponentList = componentsArrangeSpaceUpdate(state, action.value);
            break;
        case ScreenListItemsChangeKind.GoToNext:
            newScreenContanerComponentList = selectNextItem(state, action.value);
            break;
        case ScreenListItemsChangeKind.GoToPrevious:
            newScreenContanerComponentList = selectPreviousItem(state, action.value);
            break;
        case ScreenListItemsChangeKind.DragSelectionsUpdate:
            newScreenContanerComponentList = componentDragSelectionUpdate(state, action.row, action.value);
            if (newScreenContanerComponentList.filter(p => p.isSelected).length > 1) {
                selectedScreenContanerComponent = newScreenContanerComponentList.filter(p => p.isSelected)[0];
            }
            break;
        case ScreenListItemsChangeKind.RearrangementSequencePosition:
            newScreenContanerComponentList = rearrangementSequencePosition(state, action.value);
            break;
        case ScreenListItemsChangeKind.TabChange:
            newScreenContanerComponentList = rearrangementSequencePosition(state, action.value);
            break;



    }

    if (newScreenContanerComponentList.filter(p => p.isSelected).length === 1) {
        selectedScreenContanerComponent = newScreenContanerComponentList.filter(p => p.isSelected)[0];
    }

    const newformViewResponsList = state.formViewResponsList.filter(p => p.index !== state.curentIndex);

    const formView = {
        ...state.formView, ...{
            screenContanerComponentList: newScreenContanerComponentList,
            selectedScreenContanerComponent: selectedScreenContanerComponent,
            isFormViewChanged: true,
        },
    };

    return { ...state, ...{ formView: formView }, formViewResponsList: newformViewResponsList };
}



const compareYAxis = (a: ScreenContanerComponent, b: ScreenContanerComponent): number => {
    if (a.containerYAxis < b.containerYAxis) {
        return -1;
    }
    if (a.containerYAxis > b.containerYAxis) {
        return 1;
    }
    return 0;
};



function rearrangementSequencePosition(state: ScreenDesingnerState, value: { varNo: number, sequence: number })
    : ReadonlyArray<ScreenContanerComponent> {

    const sortedSelectedList = [...state.formView.screenContanerComponentList].sort(compareYAxis);

    let count = 0;
    const tempListUpdate = sortedSelectedList.map((component, index) => {
        if (component.uiComponentType !== UiComponentType.Label) {
            count = count + 1;
            const screenComponentDto = { ...component.screenComponentDto, sC_Sequence: count };
            return { ...component, sequence: count, screenComponentDto: screenComponentDto };

        } else {
            return component;
        }
    });
    return tempListUpdate;
}



function sequenceRearrangementUpdate(state: ScreenDesingnerState, value: { varNo: number, sequence: number })
    : ReadonlyArray<ScreenContanerComponent> {
    const tempListUpdate = state.formView.screenContanerComponentList.map((component) => {
        if (component.screenComponentDto.avD_VarNo === value.varNo) {

            const screenComponentDto = { ...component.screenComponentDto, sC_Sequence: +value.sequence };
            return { ...component, sequence: +value.sequence, screenComponentDto: screenComponentDto };

        } else {
            return component;
        }
    });
    const sortList = tempListUpdate.sort((a, b) => (a.sequence - b.sequence));
    const newList = Object.freeze(sortList).map((component, index) => {

        const screenComponentDto = { ...component.screenComponentDto, sC_Sequence: index + 1 };
        return { ...component, sequence: index + 1, screenComponentDto: screenComponentDto };

    });
    return newList;
}


function addComponent(state: ScreenDesingnerState, screenContanerComponent: ScreenContanerComponent,
    screenComponentDto: ScreenComponentDto): ReadonlyArray<ScreenContanerComponent> {

    screenComponentDto.sC_ID = Math.random() * 10000000;
    screenComponentDto.isNewItem = true;
    const newList = Object.freeze(state.formView.screenContanerComponentList.map((component) => {
        return { ...component, isSelected: false };
    }));
    screenComponentDto.sC_Sequence = 0;
    if (screenComponentDto.avD_Type !== UiComponentType.Label) {
        screenComponentDto.sC_Sequence = getNextSequenceNo(screenComponentDto, state.formView.screenContanerComponentList);
    }
    const newComponent = new ScreenComponent(screenComponentDto, state.mainState);
    newComponent.isSelected = true;
    return [...newList, newComponent];
}

function getNextSequenceNo(screenComponentDto: ScreenComponentDto,
    screenContanerComponentList: ScreenContanerComponent[]): number {
    if (screenComponentDto.avD_VarNo === 0
        && screenComponentDto.avD_Type === UiComponentType.Label) {
        return 0;
    } else {
        const value = Math.max.apply(Math, screenContanerComponentList.map((o) => o.sequence));
        if (isFinite(value)) {
            return value + 1;
        } else {
            return 1;
        }
    }
}


function validateonScreen(componentDto: ScreenComponentDto): boolean {

    const varNo: number = componentDto.avD_VarNo;
    let onScreen = false;

    if (varNo === 0) {
        const scAction = componentDto.sC_Action;
        if (this.screenControlList.filter(x => x.screenComponentDto.sC_Action === scAction).length > 0) {
            onScreen = true;
        } else {
            onScreen = false;
        }
    } else {
        onScreen = this.screenApplicationData.filter(x => x.varNo === varNo)[0].onScreen;
    }
    return !onScreen;
}





function screenDefinitionUpdate(state: ScreenDesingnerState,
    action: {
        kind: RowScreenDefinitionChangeKind, row: ScreenDefinition,
        value: any
    }) {

    const formView = {
        ...state.formView, ...{
            screenDefinition: action.row,
            isFormViewChanged: true,
        }
    };

    return { ...state, ...{ formView: formView } };
}


function checkComponentIsCollide(a: RectanglePositionAndSize,
    b: RectanglePositionAndSize): Boolean {
    const aTop = a.top;
    const aLeft = a.left;
    const bTop = b.top;
    const bLeft = b.left;
    return !(
        ((aTop + a.height) < (bTop)) ||
        (aTop > (bTop + b.height)) ||
        ((aLeft + a.width) < bLeft) ||
        (aLeft > (bLeft + b.width))
    );
}

function componentDragSelectionUpdate(state: ScreenDesingnerState, item: ScreenContanerComponent, dragContanerPositionAndSize)
    : ReadonlyArray<ScreenContanerComponent> {

    const newList = Object.freeze(state.formView.screenContanerComponentList.map((component) => {

        const componentPositionAndSize: RectanglePositionAndSize = {
            left: component.containerXAxis,
            top: component.containerYAxis,
            height: component.containerHeight,
            width: component.containerWidth,
        };

        if (checkComponentIsCollide(dragContanerPositionAndSize, componentPositionAndSize)) {
            return { ...component, isSelected: true };
        } else {
            return component;
        }
    }));
    return newList;
}


function componentsLeftAlignControllerUpdate(state: ScreenDesingnerState, value)
    : { screenContanerComponentList: ReadonlyArray<ScreenContanerComponent>, masageCount: number, displayMasages: string } {

    let screenContanerComponentList;
    let masageCount = state.masageCount;
    let displayMasages = '';
    if (!screenContanerComponentListCheckBoundaryPositions(state)) {

        screenContanerComponentList = state.formView.screenContanerComponentList;

    } else if (validateNewPositionsForleftalignControl(state, value)) {

        screenContanerComponentList = Object.freeze(state.formView.screenContanerComponentList.map((component) => {
            if (component.isSelected) {
                const selectedComponent = state.formView.selectedScreenContanerComponent;
                const newXAxis = selectedComponent.containerXAxis + selectedComponent.contanerLable.width - component.contanerLable.width;
                const newYAxis = component.containerYAxis;
                const newComponent = updateScreenComponentPositions(component, newXAxis, newYAxis);
                return newComponent;
            } else {
                return component;
            }
        }));
    } else {
        displayMasages = '';
        masageCount = state.masageCount + 1;
        screenContanerComponentList = state.formView.screenContanerComponentList;
    }
    return { screenContanerComponentList, masageCount: masageCount, displayMasages: displayMasages };
}


function screenContanerComponentListCheckBoundaryPositions(state): boolean {
    state.formView.screenContanerComponentList.filter(x => x.isSelected === true).forEach((uiComponentData) => {

        const newX = state.formView.selectedScreenContanerComponent.containerXAxis
            + state.formView.selectedScreenContanerComponent.contanerLable.width - uiComponentData.contanerLable.width;
        const newY = uiComponentData.containerYAxis + 0;
        if (!checkBoundaryPositions(newX, newY, uiComponentData.containerXAxis,
            uiComponentData.containerYAxis, uiComponentData.containerWidth, uiComponentData.containerHeight
            , state.formView.formContainerWidth, state.formView.formContainerHeight)) {
            return false;
        }
    });


    return true;
}

function validateNewPositionsForleftalignControl(state: ScreenDesingnerState, value): boolean {
    let valid = true;
    state.formView.screenContanerComponentList.filter(x => x.isSelected === true)
        .forEach((uiComponentData) => {
            const newX = state.formView.selectedScreenContanerComponent.containerXAxis + state.formView.selectedScreenContanerComponent
                .contanerLable.width - uiComponentData.contanerLable.width;
            const newY = uiComponentData.containerYAxis + 0;
            if (!checkBoundaryPositions(newX, newY, uiComponentData.containerXAxis,
                uiComponentData.containerYAxis, uiComponentData.containerWidth, uiComponentData.containerHeight
                , state.formView.formContainerWidth, state.formView.formContainerHeight
            )) {
                valid = false;
            }
        });
    return valid;
}

function checkBoundaryPositions(newX: number, newY: number, componentXAxis: number, componentYAxis: number,
    containerWidth: number, containerHeight: number, formContainerWidth: number, formContainerHeight: number): boolean {
    const containerTop = 0;
    const containerLeft = 0;

    const designContainerRightBoundary: number = containerLeft + formContainerWidth;
    const designContainerBottomBoundary: number = containerTop + formContainerHeight;
    if (newX < containerLeft && componentXAxis >= 0) {
        return false;
    } else if (newX > designContainerRightBoundary - containerWidth && componentXAxis < newX) {
        return false;
    }
    if (newY < containerTop) {
        return false;
    } else if (newY > designContainerBottomBoundary - containerHeight && componentYAxis < newY) {
        return false;
    }
    return true;
}


function componentsLeftAlignUpdate(state: ScreenDesingnerState, value)
    : ReadonlyArray<ScreenContanerComponent> {

    const newList = Object.freeze(state.formView.screenContanerComponentList.map((component) => {
        if (component.isSelected) {
            const selectedComponent = state.formView.selectedScreenContanerComponent;
            const newXAxis = selectedComponent.containerXAxis;
            const newYAxis = component.containerYAxis;
            const newComponent = updateScreenComponentPositions(component, newXAxis, newYAxis);
            return newComponent;
        } else {
            return component;
        }
    }));
    return newList;
}

function componentsRightAlignUpdate(state: ScreenDesingnerState, value)
    : ReadonlyArray<ScreenContanerComponent> {

    const newList = Object.freeze(state.formView.screenContanerComponentList.map((component) => {
        if (component.isSelected) {
            const selectedComponent = state.formView.selectedScreenContanerComponent;
            const newXAxis = selectedComponent.containerXAxis + selectedComponent.containerWidth - component.containerWidth;
            const newYAxis = component.containerYAxis;
            const newComponent = updateScreenComponentPositions(component, newXAxis, newYAxis);
            return newComponent;

        } else {
            return component;
        }
    }));
    return newList;
}

function componentsTopAlignUpdate(state: ScreenDesingnerState, value)
    : ReadonlyArray<ScreenContanerComponent> {

    const newList = Object.freeze(state.formView.screenContanerComponentList.map((component) => {
        if (component.isSelected) {
            const selectedComponent = state.formView.selectedScreenContanerComponent;
            const newXAxis = component.containerXAxis;
            const newYAxis = selectedComponent.containerYAxis;
            const newComponent = updateScreenComponentPositions(component, newXAxis, newYAxis);
            return newComponent;

        } else {
            return component;
        }
    }));
    return newList;
}

function componentsBottomAlignUpdate(state: ScreenDesingnerState, value)
    : ReadonlyArray<ScreenContanerComponent> {

    const newList = Object.freeze(state.formView.screenContanerComponentList.map((component) => {
        if (component.isSelected) {
            const selectedComponent = state.formView.selectedScreenContanerComponent;
            const newXAxis = component.containerXAxis;
            const newYAxis = selectedComponent.containerYAxis + selectedComponent.containerHeight - component.containerHeight;
            const newComponent = updateScreenComponentPositions(component, newXAxis, newYAxis);
            return newComponent;

        } else {
            return component;
        }
    }));
    return newList;
}

function componentsCenterAlignUpdate(state: ScreenDesingnerState, value)
    : ReadonlyArray<ScreenContanerComponent> {

    const newList = Object.freeze(state.formView.screenContanerComponentList.map((component) => {
        if (component.isSelected) {
            const selectedComponent = state.formView.selectedScreenContanerComponent;
            const newXAxis = selectedComponent.containerXAxis + (selectedComponent.containerWidth / 2) - component.containerWidth / 2;
            const newYAxis = component.containerXAxis;
            const newComponent = updateScreenComponentPositions(component, newXAxis, newYAxis);
            return newComponent;

        } else {
            return component;
        }
    }));
    return newList;
}


function getNextItemVarNo(screenContanerComponentList: Array<ScreenContanerComponent>,
    selectedComponent: ScreenContanerComponent): number {

    let nextItem: ScreenContanerComponent;
    const newScreenContanerComponentList = [...screenContanerComponentList];
    const sortedScreenContanerComponentList = newScreenContanerComponentList.sort(function (a, b) {
        return a.sequence - b.sequence;
    });
    const selectedItem = sortedScreenContanerComponentList.filter(item => item.sequence === selectedComponent.sequence &&
        item.varNo === selectedComponent.varNo)[0];

    const curentSelectedItemSortedIndex = sortedScreenContanerComponentList.indexOf(selectedItem);

    if (sortedScreenContanerComponentList.length - 1 === curentSelectedItemSortedIndex) {
        nextItem = sortedScreenContanerComponentList[0];
    } else {
        nextItem = sortedScreenContanerComponentList[curentSelectedItemSortedIndex + 1];
    }

    return nextItem.varNo;
}

function getPreviousItemVarNo(screenContanerComponentList: Array<ScreenContanerComponent>,
    selectedComponent: ScreenContanerComponent): number {

    let prevItem: ScreenContanerComponent;
    const newScreenContanerComponentList = [...screenContanerComponentList];
    const sortedScreenContanerComponentList = newScreenContanerComponentList.sort(function (a, b) {
        return a.sequence - b.sequence;
    });
    const selectedItem = sortedScreenContanerComponentList.filter(item => item.sequence === selectedComponent.sequence &&
        item.varNo === selectedComponent.varNo)[0];

    const curentSelectedItemSortedIndex = sortedScreenContanerComponentList.indexOf(selectedItem);

    if (curentSelectedItemSortedIndex === 0) {
        prevItem = sortedScreenContanerComponentList[sortedScreenContanerComponentList.length - 1];

    } else {
        prevItem = sortedScreenContanerComponentList[curentSelectedItemSortedIndex - 1];
    }

    return prevItem.varNo;
}


function selectNextItem(state: ScreenDesingnerState, value): ReadonlyArray<ScreenContanerComponent> {
    const NexVarNumber = getNextItemVarNo(state.formView.screenContanerComponentList,
        state.formView.selectedScreenContanerComponent);
    const newList = Object.freeze(state.formView.screenContanerComponentList.map((component) => {
        if (component.varNo === NexVarNumber) {
            return { ...component, isSelected: true };
        } else {
            return { ...component, isSelected: false };
        }
    }));

    return newList;
}

function selectPreviousItem(state: ScreenDesingnerState, value): ReadonlyArray<ScreenContanerComponent> {
    const PrvVarNumber = getPreviousItemVarNo(state.formView.screenContanerComponentList,
        state.formView.selectedScreenContanerComponent);
    const newList = Object.freeze(state.formView.screenContanerComponentList.map((component) => {
        if (component.varNo === PrvVarNumber) {
            return { ...component, isSelected: true };
        } else {
            return { ...component, isSelected: false };
        }
    }));
    return newList;
}




function componentsArrangeSpaceUpdate(state: ScreenDesingnerState, value)
    : ReadonlyArray<ScreenContanerComponent> {

    const space = 5;
    const sortedSelectedList = [...state.formView.screenContanerComponentList].filter(x => x.isSelected).sort(compareYAxis);

    let tempSelectPreviousItem = sortedSelectedList[0];
    const newList = Object.freeze(state.formView.screenContanerComponentList.map((component, index) => {
        if (component.isSelected && sortedSelectedList[0].containerName !== component.containerName) {

            const currentItemIndexInSortedSelectedList = sortedSelectedList.indexOf(component);
            // const selectPreviousItem = sortedSelectedList[currentItemIndexInSortedSelectedList - 1];
            const newYAxis = tempSelectPreviousItem.containerYAxis + tempSelectPreviousItem.containerHeight + value;
            const newComponent = updateScreenComponentY(component, newYAxis);
            tempSelectPreviousItem = { ...newComponent };
            return newComponent;
        } else {
            return component;
        }
    }));
    return newList;
}


function updateScreenComponentY(component: ScreenContanerComponent,
    newContainerYAxis: number): ScreenContanerComponent {

    const yChange = newContainerYAxis - component.containerYAxis;

    const dtosC_TopUpdate = component.screenComponentDto.sC_Top + yChange;

    const screenComponentDto = { ...component.screenComponentDto, sC_Top: dtosC_TopUpdate };

    return { ...component, containerYAxis: newContainerYAxis, screenComponentDto: screenComponentDto };
}


function updateScreenComponentPositions(component: ScreenContanerComponent,
    newContainerXAxis: number,
    newContainerYAxis: number): ScreenContanerComponent {

    const xChange = newContainerXAxis - component.containerXAxis;
    const yChange = newContainerYAxis - component.containerYAxis;

    const dtosC_LeftUpdate = component.screenComponentDto.sC_Left + xChange;
    const dtosC_TopUpdate = component.screenComponentDto.sC_Top + yChange;

    const screenComponentDto = { ...component.screenComponentDto, sC_Left: dtosC_LeftUpdate, sC_Top: dtosC_TopUpdate };

    return { ...component, containerXAxis: newContainerXAxis, containerYAxis: newContainerYAxis, screenComponentDto: screenComponentDto };
}


function validateNewPositions(screenContanerComponentList: ScreenContanerComponent[],
    xChange: number, yChange: number,
    formContainerWidth: number, formContainerHeight: number): boolean {
    let valid = true;
    screenContanerComponentList.filter(x => x.isSelected === true).forEach((component) => {
        const newX = component.containerXAxis + xChange;
        const newY = component.containerYAxis + yChange;
        if (!checkBoundaryPositions(newX, newY, component.containerXAxis,
            component.containerYAxis, component.containerWidth, component.containerHeight, formContainerWidth, formContainerHeight)) {
            valid = false;
        }
    });

    return valid;
}






function componentMovenUpdate(state: ScreenDesingnerState, item: ScreenContanerComponent, value)
    : ReadonlyArray<ScreenContanerComponent> {

    if (validateNewPositions(state.formView.screenContanerComponentList, value.xChange, value.yChange,
        state.formView.formContainerWidth,
        state.formView.formContainerHeight)) {

        const newList = Object.freeze(state.formView.screenContanerComponentList.map((component) => {
            if (component.isSelected) {
                const newX = component.containerXAxis + value.xChange;
                const newY = component.containerYAxis + value.yChange;
                const newComponent = updateScreenComponentPositions(component, newX, newY);
                return newComponent;
            } else {
                return component;
            }
        }));
        return newList;
    } else {
        return state.formView.screenContanerComponentList;
    }
}


function componentMoveComplete(state: ScreenDesingnerState, item: ScreenContanerComponent, value)
    : ReadonlyArray<ScreenContanerComponent> {
    let variationX = 0, variationY = 0;
    const gap = 5;

    const selectedList = state.formView.screenContanerComponentList.filter(x => x.isSelected === true);
    if (selectedList.length > 0) {
        variationX = (selectedList[0].containerXAxis + selectedList[0].contanerLable.width) % gap;
        variationY = selectedList[0].containerXAxis % gap;
    }
    const newList = Object.freeze(state.formView.screenContanerComponentList.map((component) => {
        if (component.isSelected) {
            const newPosition = componentAfterMoveNewLocation(component, variationX, variationY);
            const newComponent = updateScreenComponentPositions(component, newPosition.newX, newPosition.newY);
            return newComponent;
        } else {
            return component;
        }
    }));
    return newList;
}

function componentAfterMoveNewLocation(screenContanerComponent: ScreenContanerComponent,
    variationX, variationY): { newX: number, newY: number } {
    const gap = 5;
    let newX = 0;
    let newY = 0;

    if (variationX < (gap / 2)) {
        newX = screenContanerComponent.containerXAxis - variationX;
    } else {
        newX = screenContanerComponent.containerXAxis + (gap - variationX);
    }

    if (variationY < (gap / 2)) {
        newY = screenContanerComponent.containerYAxis - variationY;
    } else {
        newY = screenContanerComponent.containerYAxis + (gap - variationY);
    }

    return { newX: newX, newY: newY };
}



function componentDelete(state: ScreenDesingnerState, value)
    : ReadonlyArray<ScreenContanerComponent> {
    const newList = Object.freeze(state.formView.screenContanerComponentList.filter(
        (component) => !component.isSelected));
    return newList;
}



function updateItemFromOVItemDto(state: ScreenDesingnerState, ovItem: OvItem)
    : ReadonlyArray<ScreenContanerComponent> {

    const newList = Object.freeze(state.formView.screenContanerComponentList.map((component) => {
        if (component.screenComponentDto.avD_VarNo === ovItem.screenComponentDto.avD_VarNo) {

            component.screenComponentDto.avD_Length = ovItem.inputLength;
            component.screenComponentDto.avD_Help = ovItem.help;
            component.screenComponentDto.avD_Text = ovItem.description;
            component.screenComponentDto.avD_Type = ovItem.fieldType;
            component.screenComponentDto.avD_TypeText = ovItem.fieldTypeText;
            component.screenComponentDto.avD_Length = ovItem.inputLength;

            const newComponent = new ScreenComponent(component.screenComponentDto, component.mainState);

            return newComponent;

            // return newComponent;
        } else {
            return component;
        }
    }));
    return newList;
}



function ovDeleteItemUpdate(state: ScreenDesingnerState, ovItemList: Array<OvItem>)
    : ReadonlyArray<ScreenContanerComponent> {
    const newList = Object.freeze(state.formView.screenContanerComponentList.filter(
        (component) => {
            return !(ovItemList.filter(p => p.screenComponentDto.avD_VarNo === component.screenComponentDto.avD_VarNo).length > 0);
        }
    ));
    return newList;
}

function componentUpdate(state: ScreenDesingnerState, item: ScreenContanerComponent, value)
    : ReadonlyArray<ScreenContanerComponent> {
    const newList = Object.freeze(state.formView.screenContanerComponentList.map((component) => {
        if (component.containerName === item.containerName) {
            return { ...item, isSelected: true };
        } else {
            return component;
        }
    }));
    return newList;
}


function clearSelectionUpdate(state: ScreenDesingnerState, item: ScreenContanerComponent, value)
    : ReadonlyArray<ScreenContanerComponent> {

    if (state.formView.screenContanerComponentList.filter((contanerComponent) => contanerComponent.isSelected === true).length > 0) {
        const newList = Object.freeze(state.formView.screenContanerComponentList.map((component) => {
            return { ...component, isSelected: false };
        }));
        return newList;
    } else {
        return state.formView.screenContanerComponentList;
    }

}


function componentSelectionUpdate(state: ScreenDesingnerState, item: ScreenContanerComponent, value)
    : ReadonlyArray<ScreenContanerComponent> {

    const newList = Object.freeze(state.formView.screenContanerComponentList.map((component) => {

        let newComponent;
        // clear all items if not selected with out cotrl key and item is not all redy selected
        if (!value.ctrlKey && !item.isSelected) {
            newComponent = { ...component, isSelected: false };
        }
        //  cotrl key press and select selected item
        if (item.isSelected && value.ctrlKey && component.containerName === item.containerName) {
            newComponent = { ...component, isSelected: false };
        }
        // not slected item slect
        if (!item.isSelected && component.containerName === item.containerName) {
            newComponent = { ...component, isSelected: true };
        }
        if (!newComponent) {
            newComponent = { ...component };
        }
        return newComponent;
    }));
    return newList;
}


function componentListClearSelections(state: ScreenDesingnerState, row: ScreenContanerComponent) {
    const newList = Object.freeze(state.formView.screenContanerComponentList.map((component) => {
        return row.isSelected === false;
    }));
}



function ovItemsChange(state: ScreenDesingnerState, action: {
    kind: RowOvItemChangeKind, row: OvItem, value: any
}): Partial<ScreenDesingnerState> {



    switch (action.kind) {
        case RowOvItemChangeKind.DeleteItem:
            return {
                ...state,
                curentIndex: state.curentIndex + 1,
            };
        case RowOvItemChangeKind.UpdateValue:
            return {
                ...state,
                curentIndex: state.curentIndex - 1,

            };
        default: {
            return state;
        }
    }

}

function viewChange(state: ScreenDesingnerState, action: Actions.ScreenDesingnerFormViewChange): Partial<ScreenDesingnerState> {
    switch (action.payload.kind) {
        case ViewChangeKind.GoToNext:
            return {
                ...state,
                curentIndex: state.curentIndex + 1,
            };
        case ViewChangeKind.GoToPrevious:
            return {
                ...state,
                curentIndex: state.curentIndex - 1,

            };
        case ViewChangeKind.AxisChange:
            return {
                ...state,
                formView: {
                    ...state.formView,
                    formContainerWidth: state.formView.formContainerWidth + action.payload.value.xChange,
                    formContainerHeight: state.formView.formContainerHeight + action.payload.value.yChange,
                }
            };
        default: {
            return state;
        }
    }

}

function formWithHieghtCalculation(screenComponentList): { width: number, height: number } {
    let width = 0;
    let height = 0;
    if (screenComponentList && screenComponentList.length > 0) {
        const maxWidth = window.innerWidth;
        const maxHeight = window.innerHeight;

        screenComponentList.forEach((component) => {
            if (width < component.containerXAxis + component.containerWidth) {
                width = component.containerXAxis + component.containerWidth + 10;
            }
            if (height < component.containerYAxis + component.containerHeight) {
                height = component.containerYAxis + component.containerHeight + 10;
            }
        });
        width = width + 30;
        height = height + 20;
    } else {
        width = 536;
        height = 193;
    }

    return { width: width, height: height };
}


export const getViews = (state: State) => {
    return state.views;
};
export const getViewByToken = (token) => createSelector(getViews, (views) => {
    console.log(views[token]);
    return views[token];
});

export const getCurentFormViewDataByToken = (token) => createSelector(getViewByToken(token),
    (state) => {
        return state.formView;
    }
);


export const getUpdatedCurentFormViewDataByToken = (token) => createSelector(getViewByToken(token),
    (state) => {
        if (state.formView !== null && state.formView !== undefined) {
            return state.formView;
        }
    }
);


export const getScreenDesingnerStatus = (token) => createSelector(getViewByToken(token),
    (state) => {
        return state.isLoading;
    }
);
export const getMainState = (token) => createSelector(getViewByToken(token),
    (state) => {
        return state.mainState;
    }
);

export const getLookupFiles = (token) => createSelector(getViewByToken(token),
    (state) => {
        return state.lookupFiles;
    }
);

export const getinitialInfor = (token) => createSelector(getViewByToken(token),
    (state) => {
        return state.initialInfor;
    }
);

export const getFormViewData = (token) => createSelector(getViewByToken(token),
    (state) => {
        return state.formView;
    }
);

export const getFormViewResponsListDataByToken = (token) => createSelector(getViewByToken(token),
    (state) => {
        console.log(state);
        return state.formViewResponsList;
    }
);


export const getSelectedContanerComponentByToken = (token) => createSelector(getViewByToken(token),
    (state) => {
        if (state.formView) {
            return state.formView.screenContanerComponentList.filter(item => item.isSelected);
        }
    }
);


export const getFormViewResponsDataByIndex = (token, index) => createSelector(getViewByToken(token),
    (state) => {
        if (state.formViewResponsList) {
            return state.formViewResponsList.filter((data) => {
                return data.index === index;
            })[0];
        } else {
            return null;
        }
    }
);

export const getCurentFormScreenContanerComponentList = (token) => createSelector(getCurentFormViewDataByToken(token),
    (state) => {
        if (state) {
            return state.screenContanerComponentList;
        }
    }
);
export const getCurentFormScreenDefinition = (token) => createSelector(getCurentFormViewDataByToken(token),
    (state) => {
        return state.screenDefinition;
    }
);
// export const getActiveTabByToken = (token) => createSelector(getViewByToken(token),
//     (state) => {
//         return state.righttBarDisplayTab;
//     }
// );
export const getComponentsLeftAlignController = (token) => createSelector(getViewByToken(token),
    (state) => {
        return state.masageCount;
    }
);


export const getScreenLogicDocuments = (token) => createSelector(getViewByToken(token),
    (state) => {
        return state.screenLogicDocuments;
    }
);

export const getCheckedOutScreenLogicDocuments = (token) => createSelector(getViewByToken(token),
    (state) => {
        return state.screenLogicDocuments.filter(item => item.checkedOutHashKey && item.checkedOutHashKey !== ''
            || item.editingBusy);
    }
);

export const getScreenClosePopup = (token) => createSelector(getViewByToken(token),
    (state) => {
        return state.closePopup;
    }
);



// function formViewListComponentUpdate(state: ScreenDesingnerState, newValue: number, row: ContactItemWrapper, token: string)
//     : FormView[] {
//     const tmp = {};
//     const newtaskData = Object.freeze(state.formViewList[state.curentIndex].screenContanerComponentList.map((component) => {
//         if (component.control.name === row.data) {
//             return Object.freeze({ ...file, isExpand: true });
//         } else {
//             return Object.freeze({ ...file, isExpand: false });
//         }
//     }));
//     tmp[hash] = { data: newtaskData, total: state.caseContactData[hash].total, loading: false };
//     return tmp;
// }

