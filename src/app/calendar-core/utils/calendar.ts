import { DatePipe } from '@angular/common';
const datePipe = new DatePipe('en-US');
import * as moment from 'moment';

export function GenerateHash(dateStart: string, dateEnd: string, calendarId: string): string {
    return dateStart.split('T')[0] + dateEnd.split('T')[0] + calendarId;
}

export function GetWeeksOfRange(start: string, end: string): { start: string, end: string }[] {
    const lastDay = new Date(start);
    lastDay.setDate(lastDay.getDate() + 7);
    const firstDay = new Date(start);
    const endDate = new Date(end);
    endDate.setDate(endDate.getDate() + 1);

    const weekRanges = [];
    while (lastDay < endDate) {
        weekRanges.push({ start: datePipe.transform(firstDay, 'yyyy-MM-dd'), end: datePipe.transform(lastDay, 'yyyy-MM-dd') });
        firstDay.setDate(firstDay.getDate() + 7);
        lastDay.setDate(lastDay.getDate() + 7);
    }
    return weekRanges;
}

// startDate : Sunday 0
export function GetWeeksOfMonth(year: number, month: number, startDay: number): { start: string, end: string }[] {
    const date = new Date(year, month - 1, 1);
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    const weeks = [];
    const weekRanges = [];
    while (firstDay <= lastDay) {
        const week = firstDay.getWeek();
        if (weeks && !weeks.find(val => val === week)) {
            weeks.push(week);
            weekRanges.push(getDateRangeOfWeek(week, year, startDay));
        }
        firstDay.setDate(firstDay.getDate() + 1);
    }
    return weekRanges;
}

// startDate : Sunday 0
export function getWeeksOfMonthByDate(dateString: string, startDay: number): { start: string, end: string }[] {
    const msecend = Date.parse(dateString);
    const date = new Date(msecend);
    return GetWeeksOfMonth(date.getFullYear(), (date.getMonth() + 1), startDay);
}

export function getWeekOfDate(dateString: string, startDay: number): { start: string, end: string } {
    const msecend = Date.parse(dateString);
    const date = new Date(msecend);
    return getDateRangeOfWeek(date.getWeek(), date.getFullYear(), startDay);
}

export function getSelectesRangeMonthHash(range: { startDate: string, enddate: string, type: string, startDay: number },
    calendarId: string): { hash: string, range: { start: string, end: string } } {
    let newRange;
    let ranges;
    let hash;
    switch (range.type) {
        case 'dayGridMonth':
            newRange = { start: range.startDate, end: range.enddate };
            hash = GenerateHash(newRange.start, newRange.end, calendarId);
            break;
        case 'timeGridWeek':
        case 'timeGridFourDay':
            ranges = getWeeksOfMonthByDate(range.enddate, range.startDay);
            newRange = { start: ranges[0].start, end: ranges[ranges.length - 1].end };
            hash = GenerateHash(newRange.start, newRange.end, calendarId);
            break;
        case 'timeGridDay':
            ranges = getWeeksOfMonthByDate(range.enddate, range.startDay);
            newRange = { start: ranges[0].start, end: ranges[ranges.length - 1].end };
            hash = GenerateHash(newRange.start, newRange.end, calendarId);
            break;
    }
    return { hash: hash, range: newRange };
}

export function getSelectedRangeHash(current: { startDate: string, enddate: string, type: string, startDay: number }, calendarId: string)
    : { hash: string, range: { start: string, end: string } } {
    let hash;
    let newRange;
    switch (current.type) {
        case 'dayGridMonth':
            newRange = { start: current.startDate, end: current.enddate };
            hash = GenerateHash(current.startDate, current.enddate, calendarId);
            break;
        case 'timeGridWeek':
        case 'timeGridFourDay':
            newRange = getWeekOfDate(current.enddate, current.startDay);
            hash = GenerateHash(newRange.start, newRange.end, calendarId);
            break;
        case 'timeGridDay':
            newRange = getWeekOfDate(current.enddate, current.startDay);
            hash = GenerateHash(newRange.start, newRange.end, calendarId);
    }
    return { hash: hash, range: newRange };
}

export function getSelectedRangeHashSet(
    viewType: { type: string, startDay: number }, calendarId: string, dateStart: string, dateEnd: string) {

    const tempRanges = {};
    let monrhHash: { hash: string, range: { start: string, end: string } };
    switch (viewType.type) {
        case 'dayGridMonth':
            tempRanges[GenerateHash(dateStart, dateEnd, calendarId)] = { dateStart: dateStart, dateEnd: dateEnd };
            GetWeeksOfRange(dateStart, dateEnd).forEach(x =>
                tempRanges[GenerateHash(x.start, x.end, calendarId)] = { dateStart: x.start, dateEnd: x.end, isLoaded: false });
            break;
        case 'timeGridWeek':
        case 'timeGridFourDay':
            getWeeksOfMonthByDate(dateEnd, viewType.startDay).forEach(x =>
                tempRanges[GenerateHash(x.start, x.end, calendarId)] = { dateStart: x.start, dateEnd: x.end, isLoaded: false });
            monrhHash = getSelectesRangeMonthHash(
                { startDate: dateStart, enddate: dateEnd, type: viewType.type, startDay: viewType.startDay }, calendarId);
            tempRanges[monrhHash.hash] = { dateStart: monrhHash.range.start, dateEnd: monrhHash.range.end, isLoaded: false };
            break;
        case 'timeGridDay':
            getWeeksOfMonthByDate(dateEnd, viewType.startDay).forEach(x =>
                tempRanges[GenerateHash(x.start, x.end, calendarId)] = { dateStart: x.start, dateEnd: x.end, isLoaded: false });
            monrhHash = getSelectesRangeMonthHash(
                { startDate: dateStart, enddate: dateEnd, type: viewType.type, startDay: viewType.startDay }, calendarId);
            tempRanges[monrhHash.hash] = { dateStart: monrhHash.range.start, dateEnd: monrhHash.range.end, isLoaded: false };
            break;
    }
    return tempRanges;
}

// startDate : Sunday 0
function getDateRangeOfWeek(weekNo: number, year: number, startDate: number): { start: string, end: string } {
    const satrtDate = getFirstDateOfISOWeek(weekNo, year);
    satrtDate.setDate(satrtDate.getDate() + (startDate - 1));
    const endDate = new Date(satrtDate);
    endDate.setDate(endDate.getDate() + 7);
    return { start: datePipe.transform(satrtDate, 'yyyy-MM-dd'), end: datePipe.transform(endDate, 'yyyy-MM-dd') };
}

function getFirstDateOfISOWeek(weekNo: number, year: number): Date {
    const simple = new Date(year, 0, 1 + (weekNo - 1) * 7);
    const dow = simple.getDay();
    const ISOweekStart = simple;
    if (dow <= 4) {
        ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1);
    } else {
        ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay());
    }
    return ISOweekStart;
}

export function getDurationString(durationStart: string, durationEnd: string): string {
    const tempTime = moment.duration(new Date(durationEnd).valueOf() - new Date(durationStart).valueOf());
    let duration = '';
    if (tempTime.years() && tempTime.years() > 0) {
        duration = duration + tempTime.years() + ' year' + ((tempTime.years() > 1) ? 's ' : ' ');
    }
    if (tempTime.months() && tempTime.months() > 0) {
        duration = duration + tempTime.months() + ' month' + ((tempTime.months() > 1) ? 's ' : ' ');
    }
    if (tempTime.days() && tempTime.days() > 0) {
        duration = duration + tempTime.days() + ' day' + ((tempTime.days() > 1) ? 's ' : ' ');
    }
    if (tempTime.hours() && tempTime.hours() > 0) {
        duration = duration + tempTime.hours() + ' hour' + ((tempTime.hours() > 1) ? 's ' : ' ');
    }
    if (tempTime.minutes() && tempTime.minutes() > 0) {
        duration = duration + tempTime.minutes() + ' minute' + ((tempTime.minutes() > 1) ? 's ' : ' ');
    }
    return duration;
}
