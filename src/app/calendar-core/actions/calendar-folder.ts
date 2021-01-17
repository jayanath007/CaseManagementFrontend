import { Action } from '@ngrx/store';

import { CalendarGroup, Calendar } from '../../core/lib/microsoft-graph';
import { MgGraphBatchResponseItem, MgGraphBatchResponse } from '../../mail-item-core/models/interface';
import { CalendarItem, CalendarGroupItemWrapper } from '..';
import { CalendarGroupEditMode, CalendarEditMode } from '../../core/organizer/enums';
import { CalendarItemWrapper } from '../models/interfaces';

export const INIT_CALENDAR_FOLDER_CORE = 'DPS_INIT_CALENDAR_FOLDER_CORE';

export const CALENDAR_LIST_LOAD = 'DPS_LOAD_CALENDAR_LIST';
export const CALANDAR_LIST_LOAD_SUCESS = 'DPS_CALANDAR_LIST_LOAD_SUCESS';
export const CALANDAR_LIST_LOAD_FAIL = 'DPS_CALANDAR_LIST_LOAD_FAIL';

export const TOGGLE_CALANDAR_GROUP_EXPAND = 'DPS_CALANDAR_GROUP_TOGGLE_EXPAND';

export const TOGGLE_CALENDAR_SELECT = 'DPS_TOGGLE_CALENDAR_SELECT';
export const UNSELECT_CALENDAR = 'DPS_UNSELECT_CALENDAR';
export const SELECT_CALENDAR = 'DPS_SELECT_CALENDAR';
export const INIT_SELECT_CALENDAR = 'DPS_INIT_SELECT_CALENDAR';

export const ACTIVATE_CALENDAR_GROUP_EDIT_MODE = 'DPS_ACTIVATE_CALENDAR_GROUP_EDIT_MODE';
export const FINALIZE_CALENDAR_GROUP_EDIT_MODE = 'DPS_FINALIZE_CALENDAR_GROUP_EDIT_MODE';

export const RENAME_CALENDAR_GROUP = 'DPS_RENAME_CALENDAR_GROUP';
export const RENAME_CALENDAR_GROUP_SUCCESS = 'DPS_RENAME_CALENDAR_GROUP_SUCCESS';
export const RENAME_CALENDAR_GROUP_FAIL = 'DPS_RENAME_CALENDAR_GROUP_FAIL';

export const CREATE_NEW_CALENDAR_GROUP = 'DPS_CREATE_NEW_CALENDAR_GROUP';
export const CREATE_CALENDAR_GROUP_SUCCESS = 'DPS_CREATE_CALENDAR_GROUP_SUCCESS';
export const CREATE_CALENDAR_GROUP_FAIL = 'DPS_CREATE_CALENDAR_GROUP_FAIL';

export const DELETE_CALENDAR_GROUP = 'DPS_DELETE_CALENDAR_GROUP';
export const DELETE_CALENDAR_GROUP_SUCCESS = 'DPS_DELETE_CALENDAR_GROUP_SUCCESS';
export const DELETE_CALENDAR_GROUP_FAIL = 'DPS_DELETE_CALENDAR_GROUP_FAIL';


export const ACTIVATE_CALENDAR_ITEM_EDIT_MODE = 'DPS_ACTIVATE_CALENDAR_ITEM_EDIT_MODE';
export const FINALIZE_CALENDAR_ITEM_EDIT_MODE = 'DPS_FINALIZE_CALENDAR_ITEM_EDIT_MODE';

export const RENAME_CALENDAR_ITEM = 'DPS_RENAME_CALENDAR_ITEM';
export const RENAME_CALENDAR_ITEM_SUCCESS = 'DPS_RENAME_CALENDAR_ITEM_SUCCESS';
export const RENAME_CALENDAR_ITEM_FAIL = 'DPS_RENAME_CALENDAR_ITEM_FAIL';

export const CHANGE_COLOR_CALENDAR_ITEM = 'DPS_CHANGE_COLOR_CALENDAR_ITEM';
export const CHANGE_COLOR_CALENDAR_ITEM_SUCCESS = 'DPS_CHANGE_COLOR_CALENDAR_ITEM_SUCCESS';
export const CHANGE_COLOR_CALENDAR_ITEM_FAIL = 'DPS_CHANGE_COLOR_CALENDAR_ITEM_FAIL';

export const CREATE_NEW_CALENDAR = 'DPS_CREATE_NEW_CALENDAR';
export const CREATE_CALENDAR_SUCCESS = 'DPS_CREATE_CALENDAR_SUCCESS';
export const CREATE_CALENDAR_FAIL = 'DPS_CREATE_CALENDAR_FAIL';

export const DELETE_CALENDAR_ITEM = 'DPS_DELETE_CALENDAR_ITEM';
export const DELETE_CALENDAR_ITEM_SUCCESS = 'DPS_DELETE_CALENDAR_SUCCESS';
export const DELETE_CALENDAR_ITEM_FAIL = 'DPS_DELETE_CALENDAR_FAIL';


export class InitCalendarFolderCore implements Action {
  readonly type = INIT_CALENDAR_FOLDER_CORE;
  constructor() { }
}

export class CalendarListLoad implements Action {
  readonly type = CALENDAR_LIST_LOAD;
  constructor(public clearCurrent: boolean = true) { }
}

export class CalendarListLoadSucess implements Action {
  readonly type = CALANDAR_LIST_LOAD_SUCESS;
  constructor(public payload: {
    calendarList: MgGraphBatchResponseItem<{ value: Calendar[] }>[],
    groupList: CalendarGroup[],
    clearCurrent: boolean
  }) { }
}

export class CalendarListLoadFail implements Action {
  readonly type = CALANDAR_LIST_LOAD_FAIL;
  constructor() { }
}

export class ToggleCalendarGroupExpand implements Action {
  readonly type = TOGGLE_CALANDAR_GROUP_EXPAND;
  constructor(public payload: { groupId: string }) { }
}

export class ToggleCalendarSelect implements Action {
  readonly type = TOGGLE_CALENDAR_SELECT;
  constructor(public payload: { calendar: CalendarItem<Calendar> }) { }
}

export class UnselectCalendar implements Action {
  readonly type = UNSELECT_CALENDAR;
  constructor(public payload: { groupId: string, calendarId: string }) { }
}

export class SelectCalendar implements Action {
  readonly type = SELECT_CALENDAR;
  constructor(public payload: { groupId: string, calendarId: string }) { }
}

export class InitSelectCalendar implements Action {
  readonly type = INIT_SELECT_CALENDAR;
  constructor(public payload: { groupId: string, calendarId: string }) { }
}

export class ActivateCalendarGroupEditMode implements Action {
  readonly type = ACTIVATE_CALENDAR_GROUP_EDIT_MODE;
  constructor(public payload: { item: CalendarGroupItemWrapper, editMode: CalendarGroupEditMode }) { }
}

export class FinalizeCalendarGroupEditMode implements Action {
  readonly type = FINALIZE_CALENDAR_GROUP_EDIT_MODE;
  constructor(public payload:
    { item: CalendarGroupItemWrapper, editMode: CalendarGroupEditMode, confirm: boolean, value?: string, groupId?: string }) { }
}

export class RenameCalendarGroup implements Action {
  readonly type = RENAME_CALENDAR_GROUP;
  constructor(public payload: { group: CalendarGroupItemWrapper, value: string }) { }
}

export class RenameCalendarGroupSuccess implements Action {
  readonly type = RENAME_CALENDAR_GROUP_SUCCESS;
  constructor(public payload: { item: CalendarGroup }) { }
}

export class RenameCalendarGroupFail implements Action {
  readonly type = RENAME_CALENDAR_GROUP_FAIL;
  constructor(public payload: { group: CalendarGroupItemWrapper, error: any }) { }
}

export class CreateNewCalendarGroup implements Action {
  readonly type = CREATE_NEW_CALENDAR_GROUP;
  constructor(public payload: { value: string }) { }
}

export class CreateCalendarGroupSuccess implements Action {
  readonly type = CREATE_CALENDAR_GROUP_SUCCESS;
  constructor(public payload: { item: CalendarGroup }) { }
}

export class CreateCalendarGroupFail implements Action {
  readonly type = CREATE_CALENDAR_GROUP_FAIL;
  constructor(public payload: { error: string }) { }
}

export class DeleteCalendarGroup implements Action {
  readonly type = DELETE_CALENDAR_GROUP;
  constructor(public payload: { item: CalendarGroupItemWrapper }) { }
}

export class DeleteCalendarGroupSuccess implements Action {
  readonly type = DELETE_CALENDAR_GROUP_SUCCESS;
  constructor(public payload: { item: CalendarGroupItemWrapper }) { }
}

export class DeleteCalendarGroupFail implements Action {
  readonly type = DELETE_CALENDAR_GROUP_FAIL;
  constructor(public payload: { item: CalendarGroupItemWrapper, error: any }) { }
}

export class CreateNewCalendar implements Action {
  readonly type = CREATE_NEW_CALENDAR;
  constructor(public payload: { groupId: string, value: string }) { }
}

export class CreateCalendarSuccess implements Action {
  readonly type = CREATE_CALENDAR_SUCCESS;
  constructor(public payload: { groupId: string, item: Calendar }) { }
}

export class CreateCalendarFail implements Action {
  readonly type = CREATE_CALENDAR_FAIL;
  constructor(public payload: { groupId: string, error: string }) { }
}


export class ActivateCalendarItemEditMode implements Action {
  readonly type = ACTIVATE_CALENDAR_ITEM_EDIT_MODE;
  constructor(public payload: { calendar: CalendarItemWrapper, editMode: CalendarEditMode }) { }
}

export class FinalizeCalendarEditMode implements Action {
  readonly type = FINALIZE_CALENDAR_ITEM_EDIT_MODE;
  constructor(public payload: { calendar: CalendarItemWrapper, editMode: CalendarEditMode, confirm: boolean, value?: string }) { }
}

export class RenameCalendarItem implements Action {
  readonly type = RENAME_CALENDAR_ITEM;
  constructor(public payload: { calendar: CalendarItemWrapper, value: string }) { }
}

export class RenameCalendarItemSuccess implements Action {
  readonly type = RENAME_CALENDAR_ITEM_SUCCESS;
  constructor(public payload: { oldCalendar: CalendarItemWrapper, item: Calendar }) { }
}

export class RenameCalendarItemFail implements Action {
  readonly type = RENAME_CALENDAR_ITEM_FAIL;
  constructor(public payload: { calendar: CalendarItemWrapper, error: any }) { }
}

export class ChangeColorCalendarItem implements Action {
  readonly type = CHANGE_COLOR_CALENDAR_ITEM;
  constructor(public payload: { calendar: CalendarItemWrapper, value: string }) { }
}

export class ChangeColorCalendarItemSuccess implements Action {
  readonly type = CHANGE_COLOR_CALENDAR_ITEM_SUCCESS;
  constructor(public payload: { oldCalendar: CalendarItemWrapper, item: Calendar }) { }
}

export class ChangeColorCalendarItemFail implements Action {
  readonly type = CHANGE_COLOR_CALENDAR_ITEM_FAIL;
  constructor(public payload: { calendar: CalendarItemWrapper, error: any }) { }
}

export class DeleteCalendarItem implements Action {
  readonly type = DELETE_CALENDAR_ITEM;
  constructor(public payload: { item: CalendarItemWrapper }) { }
}

export class DeleteCalendarItemSuccess implements Action {
  readonly type = DELETE_CALENDAR_ITEM_SUCCESS;
  constructor(public payload: { item: CalendarItemWrapper }) { }
}

export class DeleteCalendarItemFail implements Action {
  readonly type = DELETE_CALENDAR_ITEM_FAIL;
  constructor(public payload: { item: CalendarItemWrapper, error: any }) { }
}

export type Any = CalendarListLoad | CalendarListLoadSucess | CalendarListLoadFail | InitCalendarFolderCore
  | ToggleCalendarGroupExpand | ToggleCalendarSelect | UnselectCalendar | SelectCalendar | InitSelectCalendar
  | ActivateCalendarGroupEditMode | FinalizeCalendarGroupEditMode
  | DeleteCalendarGroup | DeleteCalendarGroupSuccess | DeleteCalendarGroupFail
  | RenameCalendarGroup | RenameCalendarGroupSuccess | RenameCalendarGroupFail
  | CreateNewCalendarGroup | CreateCalendarGroupSuccess | CreateCalendarGroupFail
  | ActivateCalendarItemEditMode | FinalizeCalendarEditMode
  | DeleteCalendarItem | DeleteCalendarItemSuccess | DeleteCalendarItemFail
  | RenameCalendarItem | RenameCalendarItemSuccess | RenameCalendarItemFail
  | ChangeColorCalendarItem | ChangeColorCalendarItemSuccess | ChangeColorCalendarItemFail
  | CreateNewCalendar | CreateCalendarSuccess | CreateCalendarFail;
