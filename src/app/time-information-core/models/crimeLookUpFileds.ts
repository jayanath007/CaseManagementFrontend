import { LookupType } from './../../shared/models/dialog';

export interface CrimeLookUpFiled {
    title: string;
    secondTitle: string;
}

export const CRIME_LOOKUP_FILEDS = { a: 'ww' };

// export const CRIME_LOOKUP_FILEDS: Record<LookupType, CrimeLookUpFiled> = {
//     [LookupType.COURT]: { title: 'Crime Lookups', secondTitle: 'Work Name' },
//     [LookupType.LISTED_AS]: { title: 'Crime Lookups', secondTitle: 'Work Name' },
//     [LookupType.WORK_DONE]: { title: 'Crime Lookups', secondTitle: 'Work Name' },
//     [LookupType.COURT_CODES]: { title: 'Crime Lookups', secondTitle: 'Work Name' },
//     [LookupType.POLICE_ST_CODES]: { title: 'Crime Lookups', secondTitle: 'Work Name' },
//     [LookupType.MA_COURT_CODES]: { title: 'Crime Lookups', secondTitle: 'Work Name' },
//     [LookupType.POLICE_ST_USER_CODES]: { title: 'Crime Lookups', secondTitle: 'Work Name' },
//     [LookupType.HEARING_TYPES]: { title: 'Crime Lookups', secondTitle: 'Work Name' },
//     [LookupType.ATTENDEE_CODES]: { title: 'Crime Lookups', secondTitle: 'Attendee Code' },
//     [LookupType.NOTE_FIXTURE]: { title: 'Crime Lookups', secondTitle: 'Work Name' },
//     [LookupType.REASON]: { title: 'Crime Lookups', secondTitle: 'Work Name' },
//     [LookupType.PRISON_CODES]: { title: 'Crime Lookups', secondTitle: 'Work Name' },
//     [LookupType.LEADUFN_MATTERS]: { title: 'Crime Lookups', secondTitle: 'Work Name' }
//   };


