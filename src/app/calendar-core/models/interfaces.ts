import * as MsGraphBeta from '../../core/lib/microsoft-graph';
import { EventObject, Options } from '../../core/lib/full-calendar';
import { CalendarGroupEditMode, CalendarEditMode } from '../../core/organizer/enums';
import { UpdateDetailsKind } from './enums';
import { RecurrencePatternType, Attachment, FileAttachment, ItemAttachment } from '../../core/lib/microsoft-graph';
import { DPSResponse } from '../../core/lib/data-response';
import {
    ToolbarInput, CustomButtonInput, ButtonIconsInput, CellInfo,
    ButtonTextCompoundInput, ViewOptionsInput
} from '@fullcalendar/core/types/input-types';
import { BusinessHoursInput, ConstraintInput, EventApi, PluginDef } from '@fullcalendar/core';
import { DateInput } from '@fullcalendar/core/datelib/env';
import { DurationInput } from '@fullcalendar/core/datelib/duration';
import { FormatterInput } from '@fullcalendar/core/datelib/formatting';
import { DateRangeInput } from '@fullcalendar/core/datelib/date-range';
import { RawLocale, LocaleSingularArg } from '@fullcalendar/core/datelib/locale';
import { OverlapFunc, AllowFunc } from '@fullcalendar/core/validation';
import {
    EventSourceInput, EventInputTransformer,
    EventSourceErrorResponseHandler, EventSourceSuccessResponseHandler
} from '@fullcalendar/core/structs/event-source';
export interface CalendarGroupItem<GroupObject, CalendarObject> {
    readonly data: GroupObject;
    readonly expanded: boolean;
    readonly calendars: ImmutableCalendarMap; // { [id: string]: Readonly<CalendarItem<CalendarObject>>; };
    readonly isDefalut: boolean;
    readonly hasChild: boolean;
    editMode?: CalendarGroupEditMode;
    editLabel?: string;
}
export interface CalendarItem<APIObject> {
    readonly data: APIObject;
    readonly calendarGroupId: string;
    readonly selected: boolean;
    readonly color: string;
    readonly isBirthdaysCalendar: boolean;
    readonly isEditable: boolean;
    readonly isSecondary: boolean;
    editMode?: CalendarEditMode;
    editLabel?: string;
}

export interface CalendarEvent<APIObject> extends EventObject {
    readonly data?: APIObject;
    readonly calendarId?: string;
    readonly duration?: string;
    readonly isEditable: boolean;
    readonly reminderText?: string;
    readonly hasDPSLinks: boolean;
}

export interface CalendarOptions extends Options {
    events: CalendarEvent<MsGraphBeta.Event>[];
}

export interface EventEditInfo {
    kind: UpdateDetailsKind;
    info: any;
}
export interface CustomeRecurrenceDialogInput {
    recurrence: MsGraphBeta.RecurrencePattern;
    dayOfWeekList: { lable?: string, val: MsGraphBeta.DayOfWeek, selected?: boolean }[];
    weekIndexList: string[];
    monthList: { val: number, label: string, maxDay: number }[];
    repeatTypeList: RepeatType[];
    repeatList: RepeatList[];
}
export interface RepeatType {
    label: string;
    value: RecurrencePatternType;
    weekDef?: number;
}

export interface AttachmentWrapper {
    readonly uid?: string;
    readonly isUploding?: boolean;
    readonly isDeleting?: boolean;
    readonly attachment: Attachment | FileAttachment | ItemAttachment;
    readonly downloadUrl?: string;
}

export interface CreateFileAttachmentReqest {
    AttachmentType: 'FileAttachment';
    FileAttachmentTypeViewModel: {
        Name: string,
        Size: number,
        IsInline: boolean,
        IsContactPhoto: boolean,
        ContentType: string,
        Base64String: string
    };
}

export interface FileAttachmentResponse {
    attachmentId: { id: string, rootItemId: string, rootItemChangeKey: string };
    contentId: string;
}

export interface RepeatList { lable: string; val: string; recurrence?: MsGraphBeta.RecurrencePattern; selected?: boolean; }

export interface CalendarMap { [id: string]: Readonly<CalendarItemWrapper>; }
export type ImmutableCalendarMap = Readonly<CalendarMap>;
export type CreateFileAttachmentResponse = DPSResponse<FileAttachmentResponse[]>;
export type CalendarGroupItemWrapper = CalendarGroupItem<Readonly<MsGraphBeta.CalendarGroup>, Readonly<MsGraphBeta.Calendar>>;
export type CalendarItemWrapper = CalendarItem<Readonly<MsGraphBeta.Calendar>>;
export type CalendarEventWrapper = CalendarEvent<Readonly<MsGraphBeta.Event>>;


export interface FullCalendar {
    deepChangeDetection?: boolean;
    header?: boolean | ToolbarInput;
    footer?: boolean | ToolbarInput;
    customButtons?: {
        [name: string]: CustomButtonInput;
    };
    buttonIcons?: boolean | ButtonIconsInput;
    themeSystem?: 'standard' | string;
    bootstrapFontAwesome?: boolean | ButtonIconsInput;
    firstDay?: number;
    dir?: 'ltr' | 'rtl' | 'auto';
    weekends?: boolean;
    hiddenDays?: number[];
    fixedWeekCount?: boolean;
    weekNumbers?: boolean;
    weekNumbersWithinDays?: boolean;
    weekNumberCalculation?: 'local' | 'ISO' | ((m: Date) => number);
    businessHours?: BusinessHoursInput;
    showNonCurrentDates?: boolean;
    height?: number | 'auto' | 'parent' | (() => number);
    contentHeight?: number | 'auto' | (() => number);
    aspectRatio?: number;
    handleWindowResize?: boolean;
    windowResizeDelay?: number;
    eventLimit?: boolean | number;
    eventLimitClick?: 'popover' | 'week' | 'day' | string | ((cellinfo: CellInfo, jsevent: Event) => void);
    timeZone?: string | boolean;
    now?: DateInput | (() => DateInput);
    defaultView?: string;
    allDaySlot?: boolean;
    allDayText?: string;
    slotDuration?: DurationInput;
    slotLabelFormat?: FormatterInput;
    slotLabelInterval?: DurationInput;
    snapDuration?: DurationInput;
    scrollTime?: DurationInput;
    minTime?: DurationInput;
    maxTime?: DurationInput;
    slotEventOverlap?: boolean;
    listDayFormat?: FormatterInput | boolean;
    listDayAltFormat?: FormatterInput | boolean;
    noEventsMessage?: string;
    defaultDate?: DateInput;
    nowIndicator?: boolean;
    visibleRange?: ((currentDate: Date) => DateRangeInput) | DateRangeInput;
    validRange?: DateRangeInput;
    dateIncrement?: DurationInput;
    dateAlignment?: string;
    duration?: DurationInput;
    dayCount?: number;
    locales?: RawLocale[];
    locale?: LocaleSingularArg;
    eventTimeFormat?: FormatterInput;
    columnHeader?: boolean;
    columnHeaderFormat?: FormatterInput;
    columnHeaderText?: string | ((date: DateInput) => string);
    columnHeaderHtml?: string | ((date: DateInput) => string);
    titleFormat?: FormatterInput;
    weekLabel?: string;
    displayEventTime?: boolean;
    displayEventEnd?: boolean;
    eventLimitText?: string | ((eventCnt: number) => string);
    dayPopoverFormat?: FormatterInput;
    navLinks?: boolean;
    navLinkDayClick?: string | ((date: Date, jsEvent: Event) => void);
    navLinkWeekClick?: string | ((weekStart: any, jsEvent: Event) => void);
    selectable?: boolean;
    selectMirror?: boolean;
    unselectAuto?: boolean;
    unselectCancel?: string;
    defaultAllDayEventDuration?: DurationInput;
    defaultTimedEventDuration?: DurationInput;
    cmdFormatter?: string;
    defaultRangeSeparator?: string;
    selectConstraint?: ConstraintInput;
    selectOverlap?: boolean | OverlapFunc;
    selectAllow?: AllowFunc;
    selectMinDistance?: number;
    editable?: boolean;
    eventStartEditable?: boolean;
    eventDurationEditable?: boolean;
    eventConstraint?: ConstraintInput;
    eventOverlap?: boolean | OverlapFunc;
    eventAllow?: AllowFunc;
    eventClassName?: string[] | string;
    eventClassNames?: string[] | string;
    eventBackgroundColor?: string;
    eventBorderColor?: string;
    eventTextColor?: string;
    eventColor?: string;
    events?: EventSourceInput;
    eventSources?: EventSourceInput[];
    allDayDefault?: boolean;
    startParam?: string;
    endParam?: string;
    lazyFetching?: boolean;
    nextDayThreshold?: DurationInput;
    eventOrder?: string | Array<((a: EventApi, b: EventApi) => number) | (string | ((a: EventApi, b: EventApi) => number))>;
    rerenderDelay?: number | null;
    dragRevertDuration?: number;
    dragScroll?: boolean;
    longPressDelay?: number;
    eventLongPressDelay?: number;
    droppable?: boolean;
    dropAccept?: string | ((draggable: any) => boolean);
    eventDataTransform?: EventInputTransformer;
    allDayMaintainDuration?: Boolean;
    eventResizableFromStart?: Boolean;
    timeGridEventMinHeight?: number;
    allDayHtml?: string;
    eventDragMinDistance?: number;
    eventSourceFailure?: EventSourceErrorResponseHandler;
    eventSourceSuccess?: EventSourceSuccessResponseHandler;
    forceEventDuration?: boolean;
    progressiveEventRendering?: boolean;
    selectLongPressDelay?: number;
    timeZoneParam?: string;
    titleRangeSeparator?: string;
    buttonText?: ButtonTextCompoundInput;
    views?: {
        [viewId: string]: ViewOptionsInput;
    };
    plugins?: (PluginDef | string)[];
    schedulerLicenseKey?: string;
    resources?: any;
    resourceLabelText?: string;
    resourceOrder?: any;
    filterResourcesWithEvents?: any;
    resourceText?: any;
    resourceGroupField?: any;
    resourceGroupText?: any;
    resourceAreaWidth?: any;
    resourceColumns?: any;
    resourcesInitiallyExpanded?: any;
    slotWidth?: any;
    datesAboveResources?: any;
    googleCalendarApiKey?: string;
    refetchResourcesOnNavigate?: boolean;
    eventResourceEditable?: boolean;
}
