import { AttendanceRates } from './AttendanceRates';
// import { RatesDataSource } from './RatesDataSource';
import { CrimeDefs } from './CrimeDefs';
import { RateTypesDef } from './RateTypesDef';
import { CommonDefs } from './CommonDefs';
import { Matter } from './core/Matter';
import { DoubleUtil } from './util/DoubleUtil';
import { RateChangeModel, RateResponce, Rates } from '../models/interfaces';
import { SolTypeDef } from './SolTypeDef';
import { dpsNewDate } from '../../utils/javascriptDate';
import { RatesKey } from '../models/enum';
import { getRateForDate } from '../../core/lib/crime-managment';
export abstract class CaseClass {

    public static RATES_FOLDER_NAME = 'RatesNew';

    public static getAttendanceRates(matter: Matter,
        rateType: number,
        rateSubType: number,
        grade: string,
        isSection51: boolean,
        isLondon: boolean,
        isExtraRate: boolean,
        solicitorType: string,
        ratesDataSource: RateResponce, timeOffset,
        repOrderDate: string): AttendanceRates {

        let retVal = 0;

        const applyIsLondon = this.getIsLondonApply(rateType, rateSubType, isLondon);

        /*User can time record without a matter, always check for null */
        let branchID = 0;
        if (matter != null) {
            branchID = matter.getBranchID();
        }

        const attendanceRates = new AttendanceRates();

        let dateToCheck;
        if (matter == null) {
            /* users can record time without a matter */
            dateToCheck = dpsNewDate(timeOffset);
        } else if (matter.getFileID() === CommonDefs.COURTDUTY_FIELD) {
            dateToCheck = dpsNewDate(timeOffset);
        } else {
            if (rateType === CrimeDefs.PROCLASSID && !!repOrderDate) {
                dateToCheck = repOrderDate;
            } else {
                dateToCheck = matter.GetUFNDate();
            }
        }

        // done with one todo Back End Call
        retVal = this.getCaseClassAttendanceRates(rateType, rateSubType, grade, isSection51,
            applyIsLondon, isExtraRate, solicitorType, attendanceRates, ratesDataSource, timeOffset, dateToCheck);

        attendanceRates.setErrorCode(retVal);
        return attendanceRates;
    }


    private static getIsLondonApply(classType, rateSubType, isLondon): boolean {

        switch (classType) {
            case CrimeDefs.PROCLASSID:
                if (rateSubType !== 5) {
                    isLondon = false;
                }
                // case CrimeDefs.DEFSENTCLASSID:
                // todo
                // if (isLondon)
                // {
                //     int appID = mDAL.GetAppIDFromPrefix("CR", true);
                //     string repOdrDate = mDAL.GetVarValue(branchID, appID, fileID, CrimeDefs.REP_ORDER_DATE, 0);
                //     bool isOctober2011Change = ApplyOctober2011RateChange(repOdrDate);
                //     if (rateType == CrimeDefs.PROCLASSID)
                //     {
                //         ProceedingClass procCls;
                //         ProceedingClass.GetClass(fileID, branchID, rateType, out procCls);
                //         CrimeDefs.crimeClassInfST clsConfigST;
                //         procCls.GetClassInformation(out clsConfigST);
                //         if (clsConfigST.IsRONotGranted)
                //             isOctober2011Change = false;
                //     }
                //     if (isOctober2011Change)
                //         isLondon = false;
                // }
                break;
            case CrimeDefs.PRISONCLASSID:
            case CrimeDefs.PRISONOTHRECLASSID:
                if (rateSubType === 1) {
                    isLondon = false;
                }
                break;
        }

        return isLondon;
    }

    private static getRateChangePercentage(dataSource: RateResponce, dateToCheck: Date, rateType: number,
        rateChanges: RateChangeModel[]) {

        let rateChangePercentage = 1;
        if (rateChanges.length === 0) {
            return rateChangePercentage;
        }

        if (rateType !== CrimeDefs.ASSCLSWORKCLASSID) {
            rateChanges.forEach(r => {
                const date1 = new Date(r.crimeRateDate.split('/').reverse().join());
                const date2 = new Date(dateToCheck);
                // const timeDiff = Math.abs(date1.getTime() - date2.getTime());
                // const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
                if (date1 < date2) {
                    rateChangePercentage = parseFloat(r.crimeRatePercentage);
                }
            });
            return rateChangePercentage;
        }
    }


    private static applyRateChangePercentage(attendanceRates: AttendanceRates, rateChangePercentage: number): AttendanceRates {
        const rateChangedRates = new AttendanceRates();

        rateChangedRates.setErrorCode(attendanceRates.getErrorCode());
        rateChangedRates.setAttCLSRate(DoubleUtil.roundUpToTwoDPos(attendanceRates.getAttCLSRate() * rateChangePercentage));
        rateChangedRates.setConfRate(DoubleUtil.roundUpToTwoDPos(attendanceRates.getConfRate() * rateChangePercentage));
        rateChangedRates.setPrepRate(DoubleUtil.roundUpToTwoDPos(attendanceRates.getPrepRate() * rateChangePercentage));
        rateChangedRates.setAdvRate(DoubleUtil.roundUpToTwoDPos(attendanceRates.getAdvRate() * rateChangePercentage));
        rateChangedRates.setWaitRate(DoubleUtil.roundUpToTwoDPos(attendanceRates.getWaitRate() * rateChangePercentage));
        rateChangedRates.setTravelRate(DoubleUtil.roundUpToTwoDPos(attendanceRates.getTravelRate() * rateChangePercentage));
        rateChangedRates.setAttRate(DoubleUtil.roundUpToTwoDPos(attendanceRates.getAttRate() * rateChangePercentage));
        rateChangedRates.setPerMileRate(attendanceRates.getPerMileRate());
        rateChangedRates.setUsWaitRate(DoubleUtil.roundUpToTwoDPos(attendanceRates.getUsWaitRate() * rateChangePercentage));
        rateChangedRates.setTravelToRate(DoubleUtil.roundUpToTwoDPos(attendanceRates.getTravelToRate() * rateChangePercentage));
        rateChangedRates.setTravelFromRate(DoubleUtil.roundUpToTwoDPos(attendanceRates.getTravelFromRate() * rateChangePercentage));
        rateChangedRates.setAdviAssi(DoubleUtil.roundUpToTwoDPos(attendanceRates.getAdviAssi() * rateChangePercentage));
        rateChangedRates.setUsAdviAssi(DoubleUtil.roundUpToTwoDPos(attendanceRates.getUsAdviAssi() * rateChangePercentage));
        rateChangedRates.setUsTravelToRate(DoubleUtil.roundUpToTwoDPos(attendanceRates.getUsTravelToRate() * rateChangePercentage));
        rateChangedRates.setUsTravelFromRate(DoubleUtil.roundUpToTwoDPos(attendanceRates.getUsTravelFromRate() * rateChangePercentage));
        rateChangedRates.setCallsInRate(DoubleUtil.roundUpToTwoDPos(attendanceRates.getCallsInRate() * rateChangePercentage));
        rateChangedRates.setCallsOutRate(DoubleUtil.roundUpToTwoDPos(attendanceRates.getCallsOutRate() * rateChangePercentage));
        rateChangedRates.setLetterInRate(DoubleUtil.roundUpToTwoDPos(attendanceRates.getLetterInRate() * rateChangePercentage));
        rateChangedRates.setLetterOutRate(DoubleUtil.roundUpToTwoDPos(attendanceRates.getLetterOutRate() * rateChangePercentage));
        rateChangedRates.setCdAttRate(DoubleUtil.roundUpToTwoDPos(attendanceRates.getCdAttRate() * rateChangePercentage));
        rateChangedRates.setCdusAttRate(DoubleUtil.roundUpToTwoDPos(attendanceRates.getCdusAttRate() * rateChangePercentage));
        rateChangedRates.setEmailInRate(DoubleUtil.roundUpToTwoDPos(attendanceRates.getEmailInRate() * rateChangePercentage));
        rateChangedRates.setEmailOutRate(DoubleUtil.roundUpToTwoDPos(attendanceRates.getEmailOutRate() * rateChangePercentage));



        rateChangedRates.setUsPrepRate(DoubleUtil.roundUpToTwoDPos(attendanceRates.getUsPrepRate() * rateChangePercentage));
        rateChangedRates.setUsAdvRate(DoubleUtil.roundUpToTwoDPos(attendanceRates.getUsAdvRate() * rateChangePercentage));
        rateChangedRates.setUsCallsInRate(DoubleUtil.roundUpToTwoDPos(attendanceRates.getUsCallsInRate() * rateChangePercentage));
        rateChangedRates.setUsCallsOutRate(DoubleUtil.roundUpToTwoDPos(attendanceRates.getUsCallsOutRate() * rateChangePercentage));
        rateChangedRates.setUsLetterOutRate(DoubleUtil.roundUpToTwoDPos(attendanceRates.getUsLetterOutRate() * rateChangePercentage));
        rateChangedRates.setUsEmailOutRate(DoubleUtil.roundUpToTwoDPos(attendanceRates.getUsEmailOutRate() * rateChangePercentage));



        rateChangedRates.setExcessTravel1(attendanceRates.getExcessTravel1());

        return rateChangedRates;
    }



    private static getIndexLinesFromRatesDataSource(ratesDataSource, folderName, fileName) {
        let indexLines = [];
        if (ratesDataSource && ratesDataSource['classRates']
            && ratesDataSource['classRates'][folderName] &&
            ratesDataSource['classRates'][folderName][fileName]) {
            indexLines = ratesDataSource['classRates'][folderName][fileName];
        }
        return indexLines;
    }

    private static getCaseClassAttendanceRates(rateType, rateSubType: number,
        grade: string,
        isSection51: boolean, isLondon: boolean, isExtraRate: boolean,
        solicitorType: string, attendanceRates: AttendanceRates,
        ratesDataSource: RateResponce, timeOffset, dateToCheck: string): number {

        let londonOrNot = '';
        let attTypePrfix = '';
        let solicitorPrefix = '';
        let gradeForRate = '';

        // SF 16.04.10 Committal hearing time sub types in LGFS should get rates from proceedings class.
        // if (rateType === CrimeDefs.LGFSCLASSID && rateSubType === 3) {
        //     rateType = CrimeDefs.PROCLASSID;
        //     rateSubType = 1;
        // } else if (rateType === CrimeDefs.LGFSCLASSID && rateSubType === 4) {
        //     rateType = CrimeDefs.PROCLASSID;
        //     rateSubType = 2;
        // }

        if (rateType >= CrimeDefs.LGFSCLASSID && rateType < CrimeDefs.AGFSCLASSID) {
            rateType = 100;
        } else if (rateType >= CrimeDefs.AGFSCLASSID && rateType < 120) {
            rateType = 110;
        }


        switch (rateType) {

            case CrimeDefs.LGFSCLASSID: {
                londonOrNot = isLondon ? 'Lon' : 'Non-Lon';
                attTypePrfix = 'CC';
                gradeForRate = grade;
                break;
            }

            case CrimeDefs.AGFSCLASSID: {
                attTypePrfix = 'Hearing';
                break;
            }


            case CrimeDefs.INVESTIGATIONCLASSID:
            case CrimeDefs.INVPOSTCLASSID: {
                londonOrNot = isLondon ? 'Lon' : 'Non-Lon';
                attTypePrfix = 'IC';
                if (rateSubType === 2) {
                    if (solicitorType === SolTypeDef.Duty) {
                        solicitorPrefix = !!isExtraRate ? 'DS-IDPS' : 'DS';
                    } else {
                        solicitorPrefix = 'OS';
                    }
                }
                break;
            }
            case CrimeDefs.PROCLASSID:
            case CrimeDefs.DEFSENTCLASSID: {
                attTypePrfix = 'RC';
                if (rateSubType === 5) {
                    londonOrNot = isLondon ? 'Lon' : 'Non-Lon';
                }
                break;
            }
            case CrimeDefs.APPEALSCLASSID: {
                attTypePrfix = '';
                break;
            }
            case CrimeDefs.PRISONCLASSID:
            case CrimeDefs.PRISONOTHRECLASSID: {
                attTypePrfix = '';
                break;
            }
            case CrimeDefs.INVPRECLASSID: {
                attTypePrfix = '';
                if (rateSubType === 1) {
                    solicitorType = SolTypeDef.Duty;
                }
                solicitorPrefix = (solicitorType === SolTypeDef.Duty) ? 'DS' : 'OS';
                break;
            }

            default: {
                break;
            }

        }

        let attendanceTypekey = CrimeDefs.AGFSCLASSID !== rateType ? `${attTypePrfix}${rateSubType}` : attTypePrfix;
        if (!!londonOrNot) {
            attendanceTypekey = `${attendanceTypekey}-${londonOrNot}`;
        }
        if (!!solicitorPrefix) {
            attendanceTypekey = `${attendanceTypekey}-${solicitorPrefix}`;
        }
        if (!!gradeForRate) {
            attendanceTypekey = `${attendanceTypekey}-${gradeForRate}`;
        }


        const rates = getRateForDate(ratesDataSource, dateToCheck, attendanceTypekey);
        if (!rates) {
            return -1;
        }

        // MapRate
        if (CrimeDefs.INVESTIGATIONCLASSID === rateType) {
            if (!!rates[RatesKey.ADVICE]) {
                attendanceRates.setAdviAssi(parseFloat(rates[RatesKey.ADVICE].toString().trim()));
            }
            if (!!rates[RatesKey.ADVICEUS]) {
                attendanceRates.setUsAdviAssi(parseFloat(rates[RatesKey.ADVICEUS].toString().trim()));
            }
            if (!!rates[RatesKey.ADVOCACY]) {
                attendanceRates.setAdvRate(parseFloat(rates[RatesKey.ADVOCACY].toString().trim()));
            }
            if (!!rates[RatesKey.LETIN]) {
                attendanceRates.setLetterInRate(parseFloat(rates[RatesKey.LETIN].toString().trim()));
            }
            if (!!rates[RatesKey.LETOUT]) {
                attendanceRates.setLetterOutRate(parseFloat(rates[RatesKey.LETOUT].toString().trim()));
            }
            if (!!rates[RatesKey.MILEAGERATE1]) {
                attendanceRates.setPerMileRate(parseFloat(rates[RatesKey.MILEAGERATE1].toString().trim()));
            }
            if (!!rates[RatesKey.PREPATT]) {
                attendanceRates.setPrepRate(parseFloat(rates[RatesKey.PREPATT].toString().trim()));
            }
            if (rateSubType === 2) {
                if (!!rates[RatesKey.TELADVICE]) {
                    attendanceRates.setCallsInRate(parseFloat(rates[RatesKey.TELADVICE].toString().trim()));
                    attendanceRates.setCallsOutRate(parseFloat(rates[RatesKey.TELADVICE].toString().trim()));
                }
            } else {
                if (!!rates[RatesKey.CALLSIN]) {
                    attendanceRates.setCallsInRate(parseFloat(rates[RatesKey.CALLSIN].toString().trim()));
                }
                if (!!rates[RatesKey.CALLSOUT]) {
                    attendanceRates.setCallsOutRate(parseFloat(rates[RatesKey.CALLSOUT].toString().trim()));
                }
            }
            if (!!rates[RatesKey.TRAVELLING]) {
                attendanceRates.setTravelRate(parseFloat(rates[RatesKey.TRAVELLING].toString().trim()));
            }
            if (!!rates[RatesKey.TRAVELLINGFROM]) {
                attendanceRates.setTravelFromRate(parseFloat(rates[RatesKey.TRAVELLINGFROM].toString().trim()));
            }
            if (!!rates[RatesKey.TRAVELLINGFROMUS]) {
                attendanceRates.setUsTravelFromRate(parseFloat(rates[RatesKey.TRAVELLINGFROMUS].toString().trim()));
            }
            if (!!rates[RatesKey.TRAVELLINGTO]) {
                attendanceRates.setTravelToRate(parseFloat(rates[RatesKey.TRAVELLINGTO].toString().trim()));
            }
            if (!!rates[RatesKey.TRAVELLINGTOUS]) {
                attendanceRates.setUsTravelToRate(parseFloat(rates[RatesKey.TRAVELLINGTOUS].toString().trim()));
            }
            if (!!rates[RatesKey.WAITING]) {
                attendanceRates.setWaitRate(parseFloat(rates[RatesKey.WAITING].toString().trim()));
            }
            if (!!rates[RatesKey.WAITINGUS]) {
                attendanceRates.setUsWaitRate(parseFloat(rates[RatesKey.WAITINGUS].toString().trim()));
            }

        } else if (CrimeDefs.PROCLASSID === rateType) {
            if (!!rates[RatesKey.ADVOCACY]) {
                attendanceRates.setAdvRate(parseFloat(rates[RatesKey.ADVOCACY].toString().toString().trim()));
            }
            if (!!rates[RatesKey.ATTWITHCOUNSEL]) {
                attendanceRates.setAttCLSRate(parseFloat(rates[RatesKey.ATTWITHCOUNSEL].toString().toString().trim()));
            }
            if (!!rates[RatesKey.ATTENDANCE]) {
                attendanceRates.setAttRate(parseFloat(rates[RatesKey.ATTENDANCE].toString().toString().trim()));
            }
            if (!!rates[RatesKey.CALLSIN]) {
                attendanceRates.setCallsInRate(parseFloat(rates[RatesKey.CALLSIN].toString().trim()));
            }
            if (!!rates[RatesKey.CALLSOUT]) {
                attendanceRates.setCallsOutRate(parseFloat(rates[RatesKey.CALLSOUT].toString().trim()));
            }
            if (!!rates[RatesKey.LETIN]) {
                attendanceRates.setLetterInRate(parseFloat(rates[RatesKey.LETIN].toString().trim()));
            }
            if (!!rates[RatesKey.LETOUT]) {
                attendanceRates.setLetterOutRate(parseFloat(rates[RatesKey.LETOUT].toString().trim()));
            }
            if (!!rates[RatesKey.MILEAGERATE1]) {
                attendanceRates.setPerMileRate(parseFloat(rates[RatesKey.MILEAGERATE1].toString().trim()));
            }
            if (!!rates[RatesKey.MILEAGERATE2]) {
                // attendanceRates.setPerMileRate(parseFloat(rates[RatesKey.MILEAGERATE2].toString().trim()));
            }
            if (!!rates[RatesKey.PREPATT]) {
                // attendanceRates.setPrepRate(parseFloat(rates[RatesKey.PREPATT].toString().trim()));
            }
            if (!!rates[RatesKey.PREPARATION]) {
                attendanceRates.setPrepRate(parseFloat(rates[RatesKey.PREPARATION].toString().trim()));
            }
            if (!!rates[RatesKey.TRAVELLING]) {
                attendanceRates.setTravelRate(parseFloat(rates[RatesKey.TRAVELLING].toString().trim()));
            }
            if (!!rates[RatesKey.WAITING]) {
                attendanceRates.setWaitRate(parseFloat(rates[RatesKey.WAITING].toString().trim()));
            }
        } else if (CrimeDefs.LGFSCLASSID === rateType || CrimeDefs.AGFSCLASSID) {
            if (!!rates[RatesKey.ADVOCACY]) {
                attendanceRates.setAdvRate(parseFloat(rates[RatesKey.ADVOCACY].toString().toString().trim()));
            }
            if (!!rates[RatesKey.MILEAGERATE1]) {
                attendanceRates.setPerMileRate(parseFloat(rates[RatesKey.MILEAGERATE1].toString().trim()));
            }
            if (!!rates[RatesKey.PREPARATION]) {
                attendanceRates.setPrepRate(parseFloat(rates[RatesKey.PREPARATION].toString().trim()));
            }
            if (!!rates[RatesKey.TRAVELLING]) {
                attendanceRates.setTravelRate(parseFloat(rates[RatesKey.TRAVELLING].toString().trim()));
            }
            if (!!rates[RatesKey.WAITING]) {
                attendanceRates.setWaitRate(parseFloat(rates[RatesKey.WAITING].toString().trim()));
            }
        }

        // End map rates






        // for (let i = 0; i < indexLines.length; i++) {
        //     let startDateStr, endDateStr;
        //     let startDate, endDate;


        //     const splitArr: string[] = indexLines[i].split('|');

        //     if (splitArr.length >= 3) {
        //         if (splitArr[0].toString().trim().length === 8 && splitArr[1].toString().trim().length === 8) {
        //             try {
        //                 startDateStr = splitArr[0].substring(0, 4) + '/' + splitArr[0].substring(4, 6) + '/' + splitArr[0].substring(6, 8);
        //                 startDate = new Date(startDateStr);

        //                 endDateStr = splitArr[1].substring(0, 4) + '/' + splitArr[1].substring(4, 6) + '/' + splitArr[1].substring(6, 8);
        //                 endDate = new Date(endDateStr);
        //                 const today = dpsNewDate(timeOffset);
        //                 // need to check NTC
        //                 if (startDate <= today && today < endDate) {
        //                     fileNum = splitArr[2].toString().trim();
        //                     break;
        //                 }

        //             } catch (e) {
        //                 return -3;
        //             }
        //         } else {
        //             return -3;
        //         }
        //     } else {
        //         return -2;
        //     }
        // }

        // if (fileNum === '') {
        //     return -4;
        // }

        // let solicitorTypeFile = '';


        // if (rateType === CrimeDefs.CCOURTCLASSID || rateType === CrimeDefs.LGFSCLASSID) {
        //     if (isSection51) {
        //         solicitorTypeFile += 'S';
        //     } else {
        //         if (grade.toUpperCase() !== 'A' && grade.toUpperCase() !== 'B' && grade.toUpperCase() !== 'C') {
        //             grade = 'C';
        //         }
        //         solicitorTypeFile += grade;
        //     }
        // } else if ((rateType === CrimeDefs.INVESTIGATIONCLASSID || rateType === CrimeDefs.INVPOSTCLASSID) && rateSubType === 2) {
        //     if (solicitorType === SolTypeDef.Duty) {
        //         solicitorTypeFile = SolTypeDef.Duty;
        //     } else {
        //         solicitorTypeFile = SolTypeDef.Own;
        //     }
        // }


        // let ratesLineArr = [];
        // for test
        // fileNum = '001'; // for testing
        // const fileProperty = rateSubType + solicitorTypeFile + fileNum + fileExt;

        // if (ratesDataSource && ratesDataSource['classRates']
        //     && ratesDataSource['classRates'][folderName] &&
        //     ratesDataSource['classRates'][folderName][fileProperty]) {

        //     ratesLineArr = ratesDataSource['classRates'][folderName][fileProperty];

        // }

        // const ratesData: string = ratesDataSource.getContentOfFile(rateFile);

        // if (ratesLineArr.length === 0) {
        //     return -5;
        // }

        // Start reading rate values
        // for (let j = 0; j < ratesLineArr.length; j++) {

        //     if (ratesLineArr[j].substring(0, 3) === '\\@@') {
        //         continue;
        //     }

        //     const rateSplitArr: string[] = ratesLineArr[j].split('|');
        //     if (rateSplitArr.length >= 2) {

        //         switch (rateSplitArr[0].toString().trim().toUpperCase()) {
        //             case RateTypesDef.ATTENDANCE:
        //                 attendanceRates.setAttCLSRate(parseFloat(rateSplitArr[1].toString().trim()));
        //                 break;
        //             case RateTypesDef.CONFERENCE:
        //             case RateTypesDef.TIMESPENT:
        //                 attendanceRates.setConfRate(parseFloat(rateSplitArr[1].toString().trim()));
        //                 break;
        //             case RateTypesDef.PREPERATION:
        //                 attendanceRates.setPrepRate(parseFloat(rateSplitArr[1].toString().trim()));
        //                 if ((rateType === CrimeDefs.INVPRECLASSID) && (rateSplitArr.length >= 3 && solicitorType === 'D')) {
        //                     attendanceRates.setUsPrepRate(parseFloat(rateSplitArr[2].toString().trim()));
        //                 }
        //                 if (rateType !== CrimeDefs.INVPRECLASSID) {
        //                     attendanceRates.setAttRate(parseFloat(rateSplitArr[1].toString().trim()));
        //                 }
        //                 break;
        //             case RateTypesDef.ADVOCACY:
        //                 attendanceRates.setAdvRate(parseFloat(rateSplitArr[1].toString().trim()));
        //                 if ((rateType === CrimeDefs.INVPRECLASSID) && (rateSplitArr.length >= 3 && solicitorType === 'D')) {
        //                     attendanceRates.setUsAdvRate(parseFloat(rateSplitArr[2].toString().trim()));
        //                 }
        //                 break;
        //             case RateTypesDef.WAITING:
        //                 attendanceRates.setWaitRate(parseFloat(rateSplitArr[1].toString().trim()));
        //                 if ((rateType === CrimeDefs.INVESTIGATIONCLASSID || rateType === CrimeDefs.INVPOSTCLASSID)
        //                     && rateSubType === 2 && rateSplitArr.length >= 3 && solicitorType === 'D') {
        //                     attendanceRates.setUsWaitRate(parseFloat(rateSplitArr[2].toString().trim()));
        //                 }
        //                 if ((rateType === CrimeDefs.INVPRECLASSID) && (rateSplitArr.length >= 3 && solicitorType === 'D')) {
        //                     attendanceRates.setUsWaitRate(parseFloat(rateSplitArr[2].toString().trim()));
        //                 }
        //                 break;
        //             case RateTypesDef.TRAVELLING:
        //                 attendanceRates.setTravelRate(parseFloat(rateSplitArr[1].toString().trim()));
        //                 break;
        //             case RateTypesDef.PERMILE:
        //                 attendanceRates.setPerMileRate(parseFloat(rateSplitArr[1].toString().trim()));
        //                 break;
        //             case RateTypesDef.TRAVELTO:
        //                 attendanceRates.setTravelToRate(parseFloat(rateSplitArr[1].toString().trim()));
        //                 if (rateSplitArr.length >= 3 && solicitorType === 'D') {
        //                     attendanceRates.setUsTravelToRate(parseFloat(rateSplitArr[2].toString().trim()));
        //                 }
        //                 break;
        //             case RateTypesDef.TRAVELFROM:
        //                 attendanceRates.setTravelFromRate(parseFloat(rateSplitArr[1].toString().trim()));
        //                 if (rateSplitArr.length >= 3 && solicitorType === 'D') {
        //                     attendanceRates.setUsTravelFromRate(parseFloat(rateSplitArr[2].toString().trim()));
        //                 }
        //                 break;
        //             case RateTypesDef.ADVIASSIEXTRA:
        //                 if (isExtraRate) {
        //                     attendanceRates.setAdviAssi(parseFloat(rateSplitArr[1].toString().trim()));
        //                     if (rateSplitArr.length >= 3 && solicitorType === 'D') {
        //                         attendanceRates.setUsAdviAssi(parseFloat(rateSplitArr[2].toString().trim()));
        //                     }
        //                 }
        //                 break;
        //             case RateTypesDef.ADVIASSI:
        //                 if (isExtraRate) {
        //                     continue;
        //                 }
        //                 attendanceRates.setAdviAssi(parseFloat(rateSplitArr[1].toString().trim()));
        //                 if (rateSplitArr.length >= 3 && solicitorType === 'D') {
        //                     attendanceRates.setUsAdviAssi(parseFloat(rateSplitArr[2].toString().trim()));
        //                 }

        //                 break;
        //             case RateTypesDef.CALLSIN:
        //                 attendanceRates.setCallsInRate(parseFloat(rateSplitArr[1].toString().trim()));
        //                 if ((rateType === CrimeDefs.INVPRECLASSID) && (rateSplitArr.length >= 3 && solicitorType === 'D')) {
        //                     attendanceRates.setUsCallsInRate(parseFloat(rateSplitArr[2].toString().trim()));
        //                 }
        //                 break;
        //             case RateTypesDef.CALLSOUT:
        //                 attendanceRates.setCallsOutRate(parseFloat(rateSplitArr[1].toString().trim()));
        //                 if ((rateType === CrimeDefs.INVPRECLASSID) && (rateSplitArr.length >= 3 && solicitorType === 'D')) {
        //                     attendanceRates.setUsCallsOutRate(parseFloat(rateSplitArr[2].toString().trim()));
        //                 }
        //                 break;
        //             case RateTypesDef.LETIN:
        //                 attendanceRates.setLetterInRate(parseFloat(rateSplitArr[1].toString().trim()));
        //                 break;
        //             case RateTypesDef.LETOUT:
        //                 attendanceRates.setLetterOutRate(parseFloat(rateSplitArr[1].toString().trim()));
        //                 if ((rateType === CrimeDefs.INVPRECLASSID) && (rateSplitArr.length >= 3 && solicitorType === 'D')) {
        //                     attendanceRates.setUsLetterOutRate(parseFloat(rateSplitArr[2].toString().trim()));
        //                 }
        //                 break;
        //             case RateTypesDef.CDATTENDANCE: // Court duty attendance
        //                 attendanceRates.setCdAttRate(parseFloat(rateSplitArr[1].toString().trim()));
        //                 if (rateSplitArr.length >= 3) {
        //                     attendanceRates.setCdusAttRate(parseFloat(rateSplitArr[2].toString().trim()));
        //                 }
        //                 break;
        //             case RateTypesDef.TELADVICE:
        //                 if ((rateType === CrimeDefs.INVESTIGATIONCLASSID
        //                     || rateType === CrimeDefs.INVPOSTCLASSID) && rateSubType === 2) {
        //                     attendanceRates.setCallsInRate(parseFloat(rateSplitArr[1].toString().trim()));
        //                     attendanceRates.setCallsOutRate(parseFloat(rateSplitArr[1].toString().trim()));
        //                 }
        //                 break;
        //             case RateTypesDef.ATTWITHOUTCSL:
        //                 if (rateType === CrimeDefs.INVPRECLASSID) {
        //                     attendanceRates.setAttRate(parseFloat(rateSplitArr[1].toString().trim()));
        //                 }
        //                 break;
        //         }

        //     } else {
        //         return -6;
        //     }
        // }

        // Email out rate is same as letter out
        attendanceRates.setEmailOutRate(attendanceRates.getLetterOutRate());
        attendanceRates.setUsEmailOutRate(attendanceRates.getUsLetterOutRate());
        // End reading rate values
        return 1;
    }










}
