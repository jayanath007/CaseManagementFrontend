
import { tap, mergeMap, catchError, map, take, filter, switchMap } from 'rxjs/operators';
import { CalendarItem } from '../models/interfaces';
import { SelectCalendar } from '../actions/calendar-folder';
import { getCalendarItemByIdSet, getDefaultCalendar, getCalendarItemById } from '../reducers';

import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { MSGraphCalendarClientService } from '../services/msgraph-client.service';
import * as CalendarFolders from '../actions/calendar-folder';
import * as Events from '../actions/event';
import * as Auth from '../../auth/actions/auth';
import { of, merge, from, combineLatest, empty } from 'rxjs';
import { getIsCalendarFolderInit, getSelectedCalendarIds } from '../reducers';
import { CalendarGroupEditMode, CalendarEditMode } from '../../core/organizer/enums';
import { getUser } from '../../auth';
import { Calendar } from '../../core/lib/microsoft-graph';

@Injectable()
export class CalendarFoldersEffects {
    constructor(private actions$: Actions, private store: Store<any>, private service: MSGraphCalendarClientService) { }

    @Effect()
    initFolders$ = this.actions$.pipe(ofType<CalendarFolders.InitCalendarFolderCore>(CalendarFolders.INIT_CALENDAR_FOLDER_CORE),
        switchMap(action =>
            this.store.select(getIsCalendarFolderInit).pipe(
                take(1))),
        filter(isInit => !isInit),
        take(1),
        map(() => new CalendarFolders.CalendarListLoad()));

    @Effect()
    loadcalendarGroup$ = this.actions$.pipe(ofType<CalendarFolders.CalendarListLoad>(CalendarFolders.CALENDAR_LIST_LOAD),
        switchMap((action) =>
            this.service.getAllcalendarFolders().pipe(
                map(data => new CalendarFolders.CalendarListLoadSucess(
                    { calendarList: data.calenders, groupList: data.calendarGroups, clearCurrent: action.clearCurrent })),
                catchError(error => of(new CalendarFolders.CalendarListLoadFail())))
        ));

    @Effect()
    calendarToggle$ = this.actions$.pipe(ofType<CalendarFolders.ToggleCalendarSelect>(CalendarFolders.TOGGLE_CALENDAR_SELECT),
        switchMap<any, any>((action) => action.payload.calendar.selected ?
            of(new CalendarFolders.UnselectCalendar(
                { calendarId: action.payload.calendar.data.id, groupId: action.payload.calendar.calendarGroupId })) :
            of(new CalendarFolders.SelectCalendar(
                { groupId: action.payload.calendar.calendarGroupId, calendarId: action.payload.calendar.data.id }))
        ));

    @Effect()
    selectCalendarInit$ = this.actions$.pipe(ofType<CalendarFolders.InitSelectCalendar>(CalendarFolders.INIT_SELECT_CALENDAR),
        mergeMap((action) => this.store.select(getCalendarItemByIdSet(action.payload.groupId, action.payload.calendarId)).pipe(
            filter(val => !!val.color && val.selected),
            take(1),
            mergeMap(calendar => of(new Events.LoadCalendarEvents({ calendar: calendar }))
            ))
        ));

    @Effect()
    selectCalendar$ = this.actions$.pipe(ofType<CalendarFolders.SelectCalendar>(CalendarFolders.SELECT_CALENDAR),
        mergeMap((action) => this.store.select(getCalendarItemByIdSet(action.payload.groupId, action.payload.calendarId)).pipe(
            filter(val => !!val.color && val.selected),
            take(1),
            switchMap(calendar => this.store.select(getSelectedCalendarIds).pipe(take(1),
                map(calendarIds => {
                    return { calendar: calendar, calendarIds: calendarIds };
                }))),
            tap(({ calendar, calendarIds }) => this.store.dispatch(new Auth.UpdateSelectedCalendars({ dictionaryValue: calendarIds }))),
            mergeMap(({ calendar, calendarIds }) => of(new Events.LoadCalendarEvents({ calendar: calendar }))))
        ));

    @Effect()
    unselectCalendar$ = this.actions$.pipe(ofType<CalendarFolders.UnselectCalendar>(CalendarFolders.UNSELECT_CALENDAR),
        mergeMap((action) =>
            this.store.select(getCalendarItemByIdSet(action.payload.groupId, action.payload.calendarId)).pipe(
                filter(val => !val.selected),
                take(1),
                switchMap((value) => combineLatest(
                    this.store.select(getSelectedCalendarIds),
                    this.store.select(getDefaultCalendar),
                    ((calendarIds, defaultCalendar) => (
                        { calendarIds: calendarIds, defaultCalendar: defaultCalendar }))
                ).pipe(take(1))
                ),
                switchMap<any, any>(({ calendarIds, defaultCalendar }) => {
                    if (calendarIds && calendarIds.length > 0) {
                        return from([
                            new Events.CloseCalendar({ calendarId: action.payload.calendarId, groupId: action.payload.groupId }),
                            new Auth.UpdateSelectedCalendars({ dictionaryValue: calendarIds })
                        ]);
                    }
                    // else if (action.payload.calendarId !== defaultCalendar[0].data.id) {
                    return from([
                        new Events.CloseCalendar({ calendarId: action.payload.calendarId, groupId: action.payload.groupId }),
                        new SelectCalendar({ calendarId: defaultCalendar[0].data.id, groupId: defaultCalendar[0].calendarGroupId })
                    ]);
                    // }
                    // return from(
                    //     [new SelectCalendar({ calendarId: defaultCalendar[0].data.id, groupId: defaultCalendar[0].calendarGroupId })]);
                }))
        ));


    @Effect()
    calendarGroupEditFinalize$ =
        this.actions$.pipe(ofType<CalendarFolders.FinalizeCalendarGroupEditMode>(CalendarFolders.FINALIZE_CALENDAR_GROUP_EDIT_MODE),
            filter((action) =>
                !(action.payload.editMode === CalendarGroupEditMode.Rename && !!action.payload.item.isDefalut) // can't rename
            ),
            filter((action) => action.payload.confirm && !!action.payload.value),
            map((action) => {
                switch (action.payload.editMode) {
                    case CalendarGroupEditMode.Create:
                        return new CalendarFolders.CreateNewCalendarGroup({ value: action.payload.value });
                    case CalendarGroupEditMode.Rename:
                        return new CalendarFolders.RenameCalendarGroup({ group: action.payload.item, value: action.payload.value });
                    case CalendarGroupEditMode.CreateCalendar:
                        return new CalendarFolders.CreateNewCalendar({ groupId: action.payload.groupId, value: action.payload.value });
                }
            }
            ));

    @Effect()
    renameCalendarGroup$ = this.actions$.pipe(ofType<CalendarFolders.RenameCalendarGroup>(CalendarFolders.RENAME_CALENDAR_GROUP),
        switchMap((action) =>
            this.service.updateCalendarGroup(action.payload.group.data.id, action.payload.value).pipe(
                map((result) => new CalendarFolders.RenameCalendarGroupSuccess({ item: result })),
                catchError(error => of(new CalendarFolders.RenameCalendarGroupFail({ error, group: action.payload.group }))))
        ));

    @Effect()
    deleteCalendarGroup$ = this.actions$.pipe(ofType<CalendarFolders.DeleteCalendarGroup>(CalendarFolders.DELETE_CALENDAR_GROUP),
        switchMap(action =>
            this.service.deleteCalendarGroup(action.payload.item.data.id).pipe(
                map((result) => new CalendarFolders.DeleteCalendarGroupSuccess(action.payload)),
                catchError(error => of(new CalendarFolders.DeleteCalendarGroupFail({ error, item: action.payload.item }))))
        ));

    @Effect()
    createNewGroup$ = this.actions$.pipe(ofType<CalendarFolders.CreateNewCalendarGroup>(CalendarFolders.CREATE_NEW_CALENDAR_GROUP),
        switchMap((action) =>
            this.service.createCalendarGroup(action.payload.value).pipe(
                map((result) => new CalendarFolders.CreateCalendarGroupSuccess({ item: result })),
                catchError(error => of(new CalendarFolders.CreateCalendarGroupFail({ error }))))
        ));

    @Effect()
    createNewCalendarItem$ = this.actions$.pipe(ofType<CalendarFolders.CreateNewCalendar>(CalendarFolders.CREATE_NEW_CALENDAR),
        switchMap((action) =>
            this.service.createCalendar(action.payload.groupId, action.payload.value).pipe(
                map((result) => new CalendarFolders.CreateCalendarSuccess({ groupId: action.payload.groupId, item: result })),
                catchError(error => of(new CalendarFolders.CreateCalendarFail({ groupId: action.payload.groupId, error: error }))))
        ));



    @Effect()
    calendarEditFinalize$ =
        this.actions$.pipe(ofType<CalendarFolders.FinalizeCalendarEditMode>(CalendarFolders.FINALIZE_CALENDAR_ITEM_EDIT_MODE),
            filter((action) =>
                !(action.payload.editMode === CalendarEditMode.Rename && !!(action.payload.calendar.data.isDefaultCalendar || (
                    action.payload.calendar.data.name === 'Calendar' &&
                    action.payload.calendar.data.canEdit === true &&
                    action.payload.calendar.data.canShare === true &&
                    action.payload.calendar.data.canViewPrivateItems === true)
                )) // can't rename
            ),
            filter((action) => action.payload.confirm && !!action.payload.value),
            map((action) => {
                switch (action.payload.editMode) {
                    case CalendarEditMode.Rename:
                        return new CalendarFolders.RenameCalendarItem(
                            { calendar: action.payload.calendar, value: action.payload.value }); // rename
                    case CalendarEditMode.Color:
                        return new CalendarFolders.ChangeColorCalendarItem(
                            { calendar: action.payload.calendar, value: action.payload.value }); // Color
                    case CalendarEditMode.NewBitrhday:
                }
            }
            ));

    @Effect()
    renameCalendar$ = this.actions$.pipe(ofType<CalendarFolders.RenameCalendarItem>(CalendarFolders.RENAME_CALENDAR_ITEM),
        switchMap((action) =>
            this.service.updateCalendar(action.payload.calendar.data.id, { name: action.payload.value }).pipe(
                map((result) => new CalendarFolders.RenameCalendarItemSuccess({ oldCalendar: action.payload.calendar, item: result })),
                catchError(error => of(new CalendarFolders.RenameCalendarItemFail({ error, calendar: action.payload.calendar }))))
        ));

    @Effect()
    changeColorCalendar$ = this.actions$.pipe(ofType<CalendarFolders.ChangeColorCalendarItem>(CalendarFolders.CHANGE_COLOR_CALENDAR_ITEM),
        switchMap((action) =>
            this.service.updateCalendar(action.payload.calendar.data.id, { color: action.payload.value }).pipe(
                map((result) => new CalendarFolders.ChangeColorCalendarItemSuccess({ oldCalendar: action.payload.calendar, item: result })),
                catchError(error => of(new CalendarFolders.ChangeColorCalendarItemFail({ error, calendar: action.payload.calendar }))))
        ));

    @Effect()
    deleteCalendar$ = this.actions$.pipe(ofType<CalendarFolders.DeleteCalendarItem>(CalendarFolders.DELETE_CALENDAR_ITEM),
        switchMap(action =>
            this.service.deleteCalendar(action.payload.item.data.id).pipe(
                switchMap((result) => from([
                    new Events.CloseCalendar({ calendarId: action.payload.item.data.id, groupId: action.payload.item.calendarGroupId }),
                    new CalendarFolders.DeleteCalendarItemSuccess(action.payload)])),
                catchError(error => of(new CalendarFolders.DeleteCalendarItemFail({ error, item: action.payload.item }))))
        ));

    @Effect()
    changeColor$ = this.actions$
        .pipe(ofType<CalendarFolders.ChangeColorCalendarItemSuccess>(CalendarFolders.CHANGE_COLOR_CALENDAR_ITEM_SUCCESS),
            switchMap((action) => {
                return this.store.select(
                    getCalendarItemByIdSet(action.payload.oldCalendar.calendarGroupId, action.payload.item.id)).pipe(
                        filter(val => !!val.color),
                        take(1), switchMap(calendar => {
                            if (calendar.selected) {
                                return of(new Events.EditCalendar({ calendar: calendar }));
                            } else {
                                return empty();
                            }
                        }));
            }
            ));
    @Effect()
    changeName$ = this.actions$.pipe(ofType<CalendarFolders.RenameCalendarItemSuccess>(CalendarFolders.RENAME_CALENDAR_ITEM_SUCCESS),
        switchMap((action) => {
            return this.store.select(
                getCalendarItemByIdSet(action.payload.oldCalendar.calendarGroupId, action.payload.item.id)).pipe(
                    take(1), switchMap(calendar => {
                        if (calendar.selected) {
                            return of(new Events.EditCalendar({ calendar: calendar }));
                        } else {
                            return empty();
                        }
                    }
                    ));
        }
        ));



    @Effect()
    calendarListLoadSucess$ = this.actions$.pipe(ofType<CalendarFolders.CalendarListLoadSucess>(CalendarFolders.CALANDAR_LIST_LOAD_SUCESS),
        mergeMap((action) => this.store.select(getUser).pipe(
            filter(user => !!(user && user.selectedCalendars)),
            take(1),
            mergeMap(user => {
                const mergArray = [];
                if (user.selectedCalendars.length > 0) {
                    user.selectedCalendars.forEach(calendarId => {
                        mergArray.push(this.store.select(getCalendarItemById(calendarId)).pipe(take(1)));
                    });
                } else {
                    const group = action.payload.groupList.find(val => val.name === 'My Calendars');
                    if (group) {
                        const calendars = action.payload.calendarList.find(val => val.id === group.id);
                        if (calendars) {
                            const calendar = calendars.body.value.find(val => val.name === 'Calendar');
                            if (calendar) {
                                mergArray.push(this.store.select(getCalendarItemById(calendar.id)).pipe(take(1)));
                            }
                        }
                    }
                }

                return merge(mergArray).pipe(mergeMap(_map => _map));
            }),
            filter(calendar => !!calendar),
            map((calendar: Readonly<CalendarItem<Readonly<Calendar>>>) => {
                return new CalendarFolders.InitSelectCalendar({ groupId: calendar.calendarGroupId, calendarId: calendar.data.id });
            }))
        ));

}
