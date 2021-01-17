import { createSelector } from '@ngrx/store';
import { TimeInformationModel, CrimeLookupData, RateResponce } from '../models/interfaces';
import { GradeList } from '../models/enum';
import { ColumnDef } from '../../core/lib/grid-model';
import { DatePipe } from '@angular/common';
import { Matter } from '../class/core/Matter';
import { AttendanceRates } from '../class/AttendanceRates';
import { uuid } from '../../utils/uuid';
import { AttType } from '../../core/lib/timeRecord';
import { SolTypeDef } from '../class/SolTypeDef';
import { CrimeDefs } from '../class/CrimeDefs';
import { CaseClass } from '../class/CaseClass';
import { LoockupItem, LookupType } from '../../shared';
import { DateTimeUtil } from './../class/util/DateTimeUtil';
import { InvestigationClass } from './../class/InvestigationClass';
import { CrimeTimeTypeDef } from './../class/CrimeTimeTypeDef';
import * as Actions from '../actions/core';
import { TimeInformationInputData, FeeEarner } from '../../core/lib/crime-managment';
import { CrimeTimeSettings } from './../../core/lib/crime-managment';
import { dpsNewDate } from '../../utils/javascriptDate';


export interface State {
    readonly [token: string]: TimeInformationState;
}
// readonly travelTo: string;

export interface FormViewModel {
    readonly claimLondonRatesVisible: boolean;
    readonly dutySolicitorVisible: boolean;
    readonly travelToVisible: boolean;
}

export interface TimeInformationState {
    readonly loadingFeeEarnerList: boolean;
    readonly loadingAttTypeList: boolean;
    readonly loadingCrimeRateFiles: boolean;
    readonly loadingTimeRecords: boolean;
    readonly loadingRatePrecentage: boolean;
    readonly isLoading: boolean;
    readonly feeEarnerList: FeeEarner[];
    readonly formViewModel: FormViewModel;
    readonly model: TimeInformationModel;
    readonly attTypes: AttType[];
    readonly gradeList: string[];
    readonly gridColumnDef: ColumnDef[];
    readonly timeRecordGridItem: TimeInformationModel[];
    readonly inputData: TimeInformationInputData;
    readonly matter: Matter;
    readonly classId: number;
    readonly ratesDataSource: RateResponce;
    readonly isUpdateRateFiles: boolean;
    readonly lookupData: CrimeLookupData;
    readonly settings: CrimeTimeSettings;
    readonly timeOffset: any;

}


const initialState: State = {};

export function reducer(state = initialState, action: Actions.Any): State {
    const temp: any = {};
    switch (action.type) {

        case Actions.INIT_TIME_INFORMATION:
            temp[action.token] = setInitialData(state[action.token], action.payload, action.payload.timeOffset);
            return { ...state, ...temp };

        case Actions.GET_CRIME_RATE_FILES_SUCCESS:
            temp[action.token] = {
                ...state[action.token],
                ratesDataSource: action.payload.ratesDataSource,
                isUpdateRateFiles: false,
            };
            temp[action.token] = updateFormRates(temp[action.token], action.payload.timeOffset);
            return { ...state, ...temp };

        case Actions.ATT_TYPE_LIST_CHANGE:
            const currentFormModel = state[action.token].model;
            temp[action.token] = {
                ...state[action.token],
                model: newFormModel(state[action.token].settings,
                    currentFormModel.branchId, currentFormModel.fileId, currentFormModel.appId,
                    currentFormModel.classId, currentFormModel.mileageRate, action.payload.attTypeId, action.payload.timeOffset)
            };
            temp[action.token] = updateFormRates(temp[action.token], action.payload.timeOffset);
            return { ...state, ...temp };

        case Actions.RATE_CALCULATION_UPDATE:
            temp[action.token] = rateCalculationUpdate(state[action.token], action);
            return { ...state, ...temp };

        case Actions.TIME_INFORMATION_PARENT_MODEL_CHANGE:
            const updateWithParentModel = {
                ...state[action.token].model,
                attTypeId: action.payload.model.attTypeId,
                feeEarner: action.payload.model.feeEarner,
                date: action.payload.model.date,
                custTemplates: action.payload.model.custTemplates,
            };
            const newModel = totalValueCaculationUpdate(state[action.token], updateWithParentModel);
            temp[action.token] = {
                ...state[action.token],
                model: newModel,
            };
            return { ...state, ...temp };

        case Actions.TIME_INFORMATION_MODEL_CHANGE:
            const updateModel = totalValueCaculationUpdate(state[action.token], action.payload.model);
            temp[action.token] = {
                ...state[action.token],
                model: updateModel,
            };
            return { ...state, ...temp };

        case Actions.GET_CRIME_RATE_FILES:

            temp[action.token] = {
                ...state[action.token],
                isUpdateRateFiles: true,
            };
            return { ...state, ...temp };

        case Actions.GET_CRIME_RATE_FILES_FAIL:

            temp[action.token] = {
                ...state[action.token],
                isUpdateRateFiles: false,
            };
            return { ...state, ...temp };

        case Actions.LOAD_FEEEARNER_LIST:
            temp[action.token] = {
                ...state[action.token],
                loadingFeeEarnerList: true
            };
            return { ...state, ...temp };

        case Actions.LOAD_FEEEARNER_LIST_SUCCESS:
            temp[action.token] = {
                ...state[action.token],
                feeEarnerList: action.payload.feeEarnerList,
                loadingFeeEarnerList: false
            };
            return { ...state, ...temp };

        case Actions.LOAD_FEEEARNER_LIST_FAIL:
            temp[action.token] = {
                ...state[action.token],
                loadingFeeEarnerList: false
            };
            return { ...state, ...temp };

        case Actions.LOAD_ATT_TYPE_LIST:
            temp[action.token] = {
                ...state[action.token],
                loadingAttTypeList: true
            };
            return { ...state, ...temp };

        case Actions.LOAD_ATT_TYPE_LIST_SUCCESS:
            temp[action.token] = {
                ...state[action.token],
                attTypes: action.payload.attTypes,
                loadingAttTypeList: false
            };
            return { ...state, ...temp };
        case Actions.LOAD_ATT_TYPE_LIST_FAIL:
            temp[action.token] = {
                ...state[action.token],
                loadingAttTypeList: false
            };
            return { ...state, ...temp };


        case Actions.GET_ASSISTANCE_DATA:
            temp[action.token] = {
                ...state[action.token],
                isLoading: true,
            };
            return { ...state, ...temp };

        case Actions.GET_ASSISTANCE_DATA_FAIL:
            temp[action.token] = {
                ...state[action.token],
                isLoading: false,
            };
            return { ...state, ...temp };

        case Actions.GET_ASSISTANCE_DATA_SUCCESS:
            temp[action.token] = {
                ...state[action.token],
                model: {
                    ...state[action.token].model,
                    adciceAssistanceLimit: action.payload.adciceAssistanceLimit,
                    adciceAssistanceCurrentTotal: action.payload.adciceAssistanceCurrentTotal
                },
                isLoading: false,
            };
            return { ...state, ...temp };
        // case Actions.CHANGE_POLICE_STATION:
        //     temp[action.token] = {
        //         ...state[action.token],
        //         model: {
        //             ...state[action.token].model,
        //             policeSt: action.payload.nameAndID
        //         }
        //     };
        //     return { ...state, ...temp };

        case Actions.GET_TIME_RECORDS:
            temp[action.token] = {
                ...state[action.token],
                loadingTimeRecords: true
            };
            return { ...state, ...temp };
        case Actions.GET_TIME_RECORDS_SUCCESS:
            temp[action.token] = {
                ...state[action.token],
                timeRecordGridItem: action.payload.timeRecordGridItem,
                loadingTimeRecords: false
            };
            return { ...state, ...temp };
        case Actions.GET_TIME_RECORDS_FAIL:
            temp[action.token] = {
                ...state[action.token],
                loadingTimeRecords: false
            };
            return { ...state, ...temp };
        case Actions.SELECT_GRID_ITEM: {
            if (action.payload.item) {
                const editModel = modelConvertCurancy(action.payload.item);
                const newModelg = totalValueCaculationUpdate(state[action.token], editModel);
                temp[action.token] = {
                    ...state[action.token],
                    model: changeModelData(state[action.token], newModelg)
                };
                return { ...state, ...temp };
            } else {
                return state;
            }
        }
        case Actions.NEW_FORM:
            const currentModel = state[action.token].model;
            temp[action.token] = {
                ...state[action.token],
                model: newFormModel(state[action.token].settings,
                    currentModel.branchId, currentModel.fileId, currentModel.appId,
                    currentModel.classId, currentModel.mileage, currentModel.attTypeId,
                    action.payload.timeOffset)
            };
            temp[action.token] = updateFormRates(temp[action.token], action.payload.timeOffset);
            return { ...state, ...temp };
        case Actions.SAVE:
            temp[action.token] = {
                ...state[action.token],
                isLoading: true
            };
            return { ...state, ...temp };
        case Actions.SAVE_SUCCESS:
            temp[action.token] = {
                ...state[action.token],
                isLoading: false
            };
            return { ...state, ...temp };
        case Actions.SAVE_FAIL:
            temp[action.token] = {
                ...state[action.token],
                isLoading: false
            };
            return { ...state, ...temp };
        case Actions.GET_RATE_PRECENTAGE:
            temp[action.token] = {
                ...state[action.token],
                loadingRatePrecentage: true
            };
            return { ...state, ...temp };

        case Actions.GET_RATE_PRECENTAGE_FAIL:
            temp[action.token] = {
                ...state[action.token],
                loadingRatePrecentage: false
            };
            return { ...state, ...temp };
        case Actions.DELETE:
            temp[action.token] = {
                ...state[action.token],
                isLoading: true
            };
            return { ...state, ...temp };
        case Actions.DELETE_SUCCESS:
            temp[action.token] = {
                ...state[action.token],
                isLoading: false,
                timeRecordGridItem: state[action.token].timeRecordGridItem.filter(i => i.timeId !== state[action.token].model.timeId)
            };
            return { ...state, ...temp };
        case Actions.DELETE_FAIL:
            temp[action.token] = {
                ...state[action.token],
                isLoading: false
            };
            return { ...state, ...temp };
        // case Actions.SET_EDIT_DATA:
        //     const editRow = state[action.token].timeRecordGridItem.filter(i => i.timeId === state[action.token].inputData.crimeTimeId);
        //     temp[action.token] = {
        //         ...state[action.token],
        //         timeRecordGridItem: editRow,
        //         model: editRow ? changeModelData(state[action.token], editRow[0]) : state[action.token].model
        //     };
        //     return { ...state, ...temp };
        case Actions.GET_ATTENDEES_WORK_LOOKUP_DATA:
            temp[action.token] = { ...state[action.token], isLoading: true };
            return { ...state, ...temp };
        case Actions.GET_ATTENDEES_WORK_LOOKUP_DATA_SUCCESS:
            temp[action.token] = {
                ...state[action.token],
                lookupData: setLookupDataList(state[action.token].lookupData, action.data, action.lookupType),
                isLoading: false
            };

            return { ...state, ...temp };
        case Actions.GET_ATTENDEES_WORK_LOOKUP_DATA_FAIL:
            temp[action.token] = { ...state[action.token], isLoading: false };
            return { ...state, ...temp };
        case Actions.SELECT_LOOKUP_DATA:
            temp[action.token] = {
                ...state[action.token],
                model: setSelectedLookupData(state[action.token].model, action.lookupType, action.property, action.selectItem)
            };
            return { ...state, ...temp };
        case Actions.OPEN_LOOKUP_POPUP:
            temp[action.token] = {
                ...state[action.token],
                isLoading: false
            };
            return { ...state, ...temp };
        case Actions.SET_SETTINGS:
            temp[action.token] = updateFormRates({
                ...state[action.token],
                settings: action.setting,
                model: {
                    ...state[action.token].model,
                    londonRate: !state[action.token].inputData.isEdit ? action.setting.crimeSettings.IsCheckedLondonRate
                        : state[action.token].model.londonRate,
                    policeSt: action.setting.policeStation
                },

            }, action.timeOffset);
            return { ...state, ...temp };
        // case Actions.CLASS_CHANGE:
        //     temp[action.token] = {
        //         ...state[action.token],
        //         model: newFormModel(state[action.token].settings,
        //             currentFormModel.branchId, currentFormModel.fileId, currentFormModel.appId,
        //             action.classId, currentFormModel.mileageRate, action.payload.attTypeId, action.payload.timeOffset)
        //         model: { ...state[action.token].model, classId: action.classId }
        //     };
        //     return { ...state, ...temp };
        case Actions.FEE_EARNER_CHANGE:
            temp[action.token] = {
                ...state[action.token],
                model: {
                    ...state[action.token].model,
                    feeEarner: action.feeEarner ? action.feeEarner.userId : null,
                    grade: action.feeEarner && action.feeEarner.userCCGrade ? action.feeEarner.userCCGrade : GradeList.c
                }

            };
            return { ...state, ...temp };
        default:
            {
                return state;
            }
    }
}

function setInitialData(tiState: TimeInformationState,
    payload: { inputData: TimeInformationInputData, columnDef?: ColumnDef[] }, timeOffset):
    Partial<TimeInformationState> {
    const model = newFormModel(null, payload.inputData.branchId, payload.inputData.fileId, payload.inputData.appId,
        payload.inputData.classId, 0, 1, timeOffset);
    const matter = new Matter(+payload.inputData.fileId, 3, +payload.inputData.branchId, payload.inputData.ufnDate, timeOffset);

    return {
        ...tiState,
        timeOffset: timeOffset,
        loadingFeeEarnerList: false,
        loadingAttTypeList: false,
        loadingCrimeRateFiles: false,
        loadingTimeRecords: false,
        isLoading: false,
        formViewModel: { claimLondonRatesVisible: true, dutySolicitorVisible: false, travelToVisible: true, },
        model: model,
        gradeList: [GradeList.a, GradeList.b, GradeList.c],
        gridColumnDef: payload.columnDef,
        inputData: payload.inputData,
        matter: matter,
        classId: payload.inputData.classId,
        isUpdateRateFiles: true,
        timeRecordGridItem: [],
        feeEarnerList: [],
        settings: {
            crimeSettings: { IsCheckedLondonRate: false, IsCrimeSupervisor: false, IsClassClosed: false },
            mpu: 0,
            policeStation: '',
            repOderDate: '',
            ufnDate: payload.inputData.ufnDate
        },
        lookupData: {
            [LookupType.COURT]: [],
            [LookupType.LISTED_AS]: [],
            [LookupType.WORK_DONE]: [],
            [LookupType.COURT_CODES]: [],
            [LookupType.POLICE_ST_CODES]: [],
            [LookupType.HEARING_TYPES]: [],
            [LookupType.ATTENDEE_CODES]: [],
            [LookupType.NOTE_FIXTURE]: [],
            [LookupType.REASON]: [],
            [LookupType.PRISON_CODES]: [],
            [LookupType.LEADUFN_MATTERS]: [],
        }
    };
}

function modelConvertCurancy(model: TimeInformationModel): TimeInformationModel {

    const mileageRate = convertCurancy(model.mileageRate);
    const travRate = convertCurancy(model.travRate);
    const prepRate = convertCurancy(model.prepRate);
    const attCslRate = convertCurancy(model.attCslRate);
    const advRate = convertCurancy(model.advRate);
    const attConfRate = convertCurancy(model.attConfRate);
    const attendanceRate = convertCurancy(model.attendanceRate);
    const advAssiRate = convertCurancy(model.advAssiRate);
    const waitRatePS = convertCurancy(model.waitRatePS);
    const travelToRate = convertCurancy(model.travelToRate);
    const travelFromRate = convertCurancy(model.travelFromRate);
    const waitRate = convertCurancy(model.waitRate);

    const travelVal = convertCurancy(model.travelVal);
    const waitingVal = convertCurancy(model.waitingVal);
    const prepVal = convertCurancy(model.prepVal);

    const mileage = convertCurancy(model.mileage);
    const mileageVal = convertCurancy(model.mileageVal);
    const vatFares = convertCurancy(model.vatFares);
    const vatFaresVal = convertCurancy(model.vatFaresVal);
    const nonVatFares = convertCurancy(model.nonVatFares);
    const nonVatFaresVal = convertCurancy(model.nonVatFaresVal);
    const parking = convertCurancy(model.parking);
    const parkingVal = convertCurancy(model.parkingVal);

    const newModel = {
        ...model,
        waitRatePS: waitRatePS,
        travRate: travRate,
        advRate: advRate,
        mileageRate: mileageRate,
        attConfRate: attConfRate,
        attendanceRate: attendanceRate,
        advAssiRate: advAssiRate,
        travelToRate: travelToRate,
        travelFromRate: travelFromRate,
        prepRate: prepRate,
        attCslRate: attCslRate,
        waitRate: waitRate,

        travelVal: travelVal,
        waitingVal: waitingVal,
        prepVal: prepVal,


        mileage: mileage,
        mileageVal: mileageVal,

        vatFares: vatFares,
        vatFaresVal: vatFaresVal,

        nonVatFares: nonVatFares,
        nonVatFaresVal: nonVatFaresVal,

        parking: parking,
        parkingVal: parkingVal,
    };

    return newModel;
}

function updateFormRates(state: TimeInformationState, timeOffset):
    TimeInformationState {
    const model = state.model;
    // if (model.timeId > 0) {
    //     return state;
    // }


    const solType = (model.ownSol) ? SolTypeDef.Own : SolTypeDef.Duty;
    let tempClassNo = state.classId;
    if (tempClassNo > CrimeDefs.DEFSENTCLASSID && tempClassNo < CrimeDefs.LGFSCLASSID) {
        tempClassNo = CrimeDefs.INVPOSTCLASSID;
    } else if (tempClassNo >= CrimeDefs.LGFSCLASSID && tempClassNo < CrimeDefs.AGFSCLASSID) {
        tempClassNo = CrimeDefs.LGFSCLASSID;
    }

    const attendanceRates = CaseClass.getAttendanceRates(state.matter,
        tempClassNo,
        model.attTypeId,
        model.grade,
        false,
        model.londonRate,
        model.initDuty,
        solType,
        state.ratesDataSource,
        timeOffset,
        state.settings.repOderDate);

    let mileageRate;
    if (model.timeId === 0) {
        if (model.classId === CrimeDefs.PROCLASSID) {
            mileageRate = model.mileageRate;
        } else {
            mileageRate = convertCurancy(attendanceRates.perMileRate);
        }
    } else {
        mileageRate = model.mileageRate;
    }

    // const mileageRate = model.timeId === 0 ? model.classId === CrimeDefs.PROCLASSID ?
    //     '0.45' : convertCurancy(attendanceRates.perMileRate) : model.mileageRate;
    const travRate = convertCurancy(attendanceRates.travelRate);
    const prepRate = convertCurancy(attendanceRates.prepRate);
    const attCslRate = convertCurancy(attendanceRates.attCLSRate);

    const advRate = convertCurancy(attendanceRates.advRate);
    const attConfRate = convertCurancy(attendanceRates.confRate);
    const attendanceRate = convertCurancy(attendanceRates.attRate);


    const adviAssiRate = convertCurancy(attendanceRates.adviAssi);
    const waitRatePS = convertCurancy(attendanceRates.waitRate);


    const travelToRate = convertCurancy(attendanceRates.travelToRate);
    const travelFromRate = convertCurancy(attendanceRates.travelFromRate);

    const waitRate = convertCurancy(attendanceRates.waitRate);


    return {
        ...state,
        model: {
            ...state.model,
            waitRatePS: waitRatePS,
            travRate: travRate,
            advRate: advRate,
            mileageRate: mileageRate,
            attConfRate: attConfRate,
            attendanceRate: attendanceRate,
            // travel: travel,
            advAssiRate: adviAssiRate,
            travelToRate: travelToRate,
            travelFromRate: travelFromRate,
            prepRate: prepRate,
            attCslRate: attCslRate,
            waitRate: waitRate,
        },
    };
}


function rateCalculationUpdate(state: TimeInformationState, action: Actions.RateCalculationUpdate): TimeInformationState {

    if (state.classId === CrimeDefs.INVESTIGATIONCLASSID) {
        // WorkPoliceStationTime();
        switch (state.model.attTypeId) {
            case 1:
                return adviAssiC1Calculation(state, action);
            case 2:
                return adviAssiC2Calculation(state, action);
            case 3:
                return adviAssiC3Calculation(state, action);
            case 4:
                return adviAssiC4Calculation(state, action);
        }
    } else if (state.classId === CrimeDefs.PROCLASSID) {
        switch (state.model.attTypeId) {
            case 1:
                return adviAssiRC1Calculation(state, action);
            case 2:
                return adviAssiRC2Calculation(state, action);
            case 3:
                return adviAssiRC3Calculation(state, action);
            case 4:
                return adviAssiRC4Calculation(state, action);
            case 5:
                return adviAssiRC5Calculation(state, action);
        }
    } else if (state.classId >= CrimeDefs.LGFSCLASSID && state.classId < CrimeDefs.AGFSCLASSID) {
        switch (state.model.attTypeId) {
            case 1:
                return adviAssiCC1Calculation(state, action);
            case 2:
                return adviAssiCC2Calculation(state, action);
        }

    } else if (state.classId >= CrimeDefs.AGFSCLASSID && state.classId < 120) {
        return adviAssiAGFSCalculation(state, action);
    } else {
        return state;
    }


}
function totalValueCaculationUpdate(state: TimeInformationState, model: TimeInformationModel): TimeInformationModel {

    if (state.classId === CrimeDefs.INVESTIGATIONCLASSID) {
        switch (state.model.attTypeId) {
            case 1:
                return adviAssiC1TotalValueCaculationUpdate(state, model);
            case 2:
                return adviAssiC2TotalValueCaculationUpdate(state, model);
            case 3:
                return adviAssiC3TotalValueCaculationUpdate(state, model);
            case 4:
                return adviAssiC4TotalValueCaculationUpdate(state, model);
        }
    } else if (state.classId === CrimeDefs.PROCLASSID) {
        return proceedingClassTotalValueCaculationUpdate(state, model);
    } else if (state.classId >= CrimeDefs.LGFSCLASSID && state.classId < CrimeDefs.AGFSCLASSID) {
        return lgfsClassTotalValueCaculationUpdate(state, model);
    } else if (state.classId >= CrimeDefs.AGFSCLASSID && state.classId < 120) {
        return agfsClassTotalValueCaculationUpdate(state, model);
    }

}

function adviAssiC1Calculation(state: TimeInformationState, action: Actions.RateCalculationUpdate): TimeInformationState {

    const updateModelState = { ...state, model: action.payload.model };
    const tempState = updateFormRates(updateModelState, action.payload.timeOffset);
    const model = tempState.model;
    const travelVal = timeMultiplyByRates(model.travel, model.travRate);
    const waitingVal = timeMultiplyByRates(model.waiting, model.waitRate);
    const prepVal = timeMultiplyByRates(model.prep, model.prepRate);

    const newModel: TimeInformationModel = {
        ...model,
        travelVal: travelVal,
        waitingVal: waitingVal,
        prepVal: prepVal,

    };

    const totalValueCaculationUpdateModel = adviAssiC1TotalValueCaculationUpdate(tempState, newModel);

    return { ...tempState, model: totalValueCaculationUpdateModel };

}
function adviAssiC2Calculation(state: TimeInformationState, action: Actions.RateCalculationUpdate): TimeInformationState {

    const investigation = new InvestigationClass();
    const model = action.payload.model;


    if (model.dutySol === false) {
        model.initDuty = false;
    }


    const timeDTO = investigation.calculateAdviAssiHrsMin(model.arrTime, model.depTime, model.waitPS);
    const adviAssi = timeDTO.timeString();

    if (timeDTO.getErrorCode() !== -1) {

        const solType = (model.ownSol) ? SolTypeDef.Own : SolTypeDef.Duty;

        timeDTO.timeString();
        // const rateChanges = state.rateChanges;

        const attendanceRates = CaseClass.getAttendanceRates(state.matter, state.classId, model.attTypeId, model.grade, false,
            model.londonRate,
            model.initDuty,
            solType,
            // rateChanges,
            state.ratesDataSource, action.payload.timeOffset,
            state.settings.repOderDate);

        const travelToCalValues = calculateTravelTo(model, investigation, attendanceRates, solType);
        const travelFromCalValues = calculateTravelFrom(model, investigation, attendanceRates, solType);
        const adviceAssistanceTimeCalValues = calculateTravelAdviceAssistanceTime(model, investigation, attendanceRates, solType);
        const waitTimeCalValues = calculateTravelWaitTime(model, investigation, attendanceRates, solType);



        const newModel = {
            ...model,

            travelToRate: travelToCalValues.rate,
            travToVal: travelToCalValues.total,

            travelFromRate: travelFromCalValues.rate,
            travFromVal: travelFromCalValues.total,


            adviAssi: adviAssi,
            feeErnHrsMin: adviAssi,
            advAssiRate: adviceAssistanceTimeCalValues.rate,
            advAssiVal: adviceAssistanceTimeCalValues.total,

            waitRatePS: waitTimeCalValues.rate,
            waitValPS: waitTimeCalValues.total,
            initDuty: model.initDuty
        };



        const updateModel = adviAssiC2TotalValueCaculationUpdate(state, newModel);

        return {
            ...state,
            model: updateModel,
        };
    } else {

        return {
            ...state,
            model: { ...model, adv: adviAssi, feeErnHrsMin: adviAssi },
        };
    }


}
function adviAssiC3Calculation(state: TimeInformationState, action: Actions.RateCalculationUpdate): TimeInformationState {

    const updateModelState = { ...state, model: action.payload.model };
    const tempState = updateFormRates(updateModelState, action.payload.timeOffset);
    const model = tempState.model;
    const travelVal = timeMultiplyByRates(model.travel, model.travRate);
    const waitingVal = timeMultiplyByRates(model.waiting, model.waitRate);
    const prepVal = timeMultiplyByRates(model.prep, model.prepRate);
    const attCslVal = timeMultiplyByRates(model.attCsl, model.attCslRate);
    const advVal = timeMultiplyByRates(model.adv, model.advRate);


    const newModel: TimeInformationModel = {
        ...model,
        travelVal: travelVal,
        waitingVal: waitingVal,
        prepVal: prepVal,
        attCslVal: attCslVal,
        advVal: advVal,
    };

    const totalValueCaculationUpdateModel = adviAssiC3TotalValueCaculationUpdate(tempState, newModel);

    return { ...tempState, model: totalValueCaculationUpdateModel };

}
function adviAssiC4Calculation(state: TimeInformationState, action: Actions.RateCalculationUpdate): TimeInformationState {

    const updateModelState = { ...state, model: action.payload.model };
    const tempState = updateFormRates(updateModelState, action.payload.timeOffset);
    const model = tempState.model;
    const travelVal = timeMultiplyByRates(model.travel, model.travRate);
    const waitingVal = timeMultiplyByRates(model.waiting, model.waitRate);
    const prepVal = timeMultiplyByRates(model.prep, model.prepRate);
    const attCslVal = timeMultiplyByRates(model.attCsl, model.attCslRate);
    const advVal = timeMultiplyByRates(model.adv, model.advRate);


    const newModel: TimeInformationModel = {
        ...model,
        travelVal: travelVal,
        waitingVal: waitingVal,
        prepVal: prepVal,
        attCslVal: attCslVal,
        advVal: advVal,
    };

    const totalValueCaculationUpdateModel = adviAssiC4TotalValueCaculationUpdate(tempState, newModel);

    return { ...tempState, model: totalValueCaculationUpdateModel };

}


/// Proceeding Class
function adviAssiRC1Calculation(state: TimeInformationState, action: Actions.RateCalculationUpdate): TimeInformationState {

    const updateModelState = { ...state, model: action.payload.model };
    const tempState = updateFormRates(updateModelState, action.payload.timeOffset);
    const model = tempState.model;
    const travelVal = timeMultiplyByRates(model.travel, model.travRate);
    const waitingVal = timeMultiplyByRates(model.waiting, model.waitRate);
    const prepVal = timeMultiplyByRates(model.prep, model.prepRate);
    const attendanceVal = timeMultiplyByRates(model.attendance, model.attendanceRate);

    const newModel: TimeInformationModel = {
        ...model,
        travelVal: travelVal,
        waitingVal: waitingVal,
        prepVal: prepVal,
        attendanceVal: attendanceVal

    };

    const totalValueCaculationUpdateModel = proceedingClassTotalValueCaculationUpdate(tempState, newModel);

    return { ...tempState, model: totalValueCaculationUpdateModel };

}
function adviAssiRC2Calculation(state: TimeInformationState, action: Actions.RateCalculationUpdate): TimeInformationState {
    const updateModelState = { ...state, model: action.payload.model };
    const tempState = updateFormRates(updateModelState, action.payload.timeOffset);
    const model = tempState.model;
    const newModel = {
        ...model,
        attCslVal: timeMultiplyByRates(model.attCsl, model.attCslRate),
        travelVal: timeMultiplyByRates(model.travel, model.travRate),
        waitingVal: timeMultiplyByRates(model.waiting, model.waitRate),
        prepVal: timeMultiplyByRates(model.prep, model.prepRate),
        advVal: timeMultiplyByRates(model.adv, model.advRate),
        attendanceVal: timeMultiplyByRates(model.attendance, model.attendanceRate)
    };
    const updateModel = proceedingClassTotalValueCaculationUpdate(tempState, newModel);
    return {
        ...tempState,
        model: updateModel,
    };
}

function adviAssiRC3Calculation(state: TimeInformationState, action: Actions.RateCalculationUpdate): TimeInformationState {
    const updateModelState = { ...state, model: action.payload.model };
    const tempState = updateFormRates(updateModelState, action.payload.timeOffset);
    const model = tempState.model;
    const newModel = {
        ...model,
        travelVal: timeMultiplyByRates(model.travel, model.travRate),
        waitingVal: timeMultiplyByRates(model.waiting, model.waitRate),
        prepVal: timeMultiplyByRates(model.prep, model.prepRate),
        advVal: timeMultiplyByRates(model.adv, model.advRate),
        attendanceVal: timeMultiplyByRates(model.attendance, model.attendanceRate)
    };
    const updateModel = proceedingClassTotalValueCaculationUpdate(tempState, newModel);
    return {
        ...tempState,
        model: updateModel,
    };
}
function adviAssiRC4Calculation(state: TimeInformationState, action: Actions.RateCalculationUpdate): TimeInformationState {
    const updateModelState = { ...state, model: action.payload.model };
    const tempState = updateFormRates(updateModelState, action.payload.timeOffset);
    const model = tempState.model;
    const newModel = {
        ...model,
        travelVal: timeMultiplyByRates(model.travel, model.travRate),
        waitingVal: timeMultiplyByRates(model.waiting, model.waitRate),
        prepVal: timeMultiplyByRates(model.prep, model.prepRate),
        attendanceVal: timeMultiplyByRates(model.attendance, model.attendanceRate)
    };
    const updateModel = proceedingClassTotalValueCaculationUpdate(tempState, newModel);
    return {
        ...tempState,
        model: updateModel,
    };
}
function adviAssiRC5Calculation(state: TimeInformationState, action: Actions.RateCalculationUpdate): TimeInformationState {
    const updateModelState = { ...state, model: action.payload.model };
    const tempState = updateFormRates(updateModelState, action.payload.timeOffset);
    const model = tempState.model;
    const newModel = {
        ...model,
        attCslVal: timeMultiplyByRates(model.attCsl, model.attCslRate),
        travelVal: timeMultiplyByRates(model.travel, model.travRate),
        waitingVal: timeMultiplyByRates(model.waiting, model.waitRate),
        prepVal: timeMultiplyByRates(model.prep, model.prepRate),
        advVal: timeMultiplyByRates(model.adv, model.advRate),
        attendanceVal: timeMultiplyByRates(model.attendance, model.attendanceRate)
    };
    const updateModel = proceedingClassTotalValueCaculationUpdate(tempState, newModel);
    return {
        ...tempState,
        model: updateModel,
    };
}

/// LGFS Class
function adviAssiCC1Calculation(state: TimeInformationState, action: Actions.RateCalculationUpdate): TimeInformationState {

    const updateModelState = { ...state, model: action.payload.model };
    const tempState = updateFormRates(updateModelState, action.payload.timeOffset);
    const model = tempState.model;

    const travelVal = timeMultiplyByRates(model.travel, model.travRate);
    const waitingVal = timeMultiplyByRates(model.waiting, model.waitRate);
    const prepVal = timeMultiplyByRates(model.prep, model.prepRate);

    const newModel: TimeInformationModel = {
        ...model,
        travelVal: travelVal,
        waitingVal: waitingVal,
        prepVal: prepVal
    };

    const totalValueCaculationUpdateModel = lgfsClassTotalValueCaculationUpdate(tempState, newModel);

    return { ...tempState, model: totalValueCaculationUpdateModel };
}

function adviAssiCC2Calculation(state: TimeInformationState, action: Actions.RateCalculationUpdate): TimeInformationState {
    const updateModelState = { ...state, model: action.payload.model };
    const tempState = updateFormRates(updateModelState, action.payload.timeOffset);
    const model = tempState.model;

    const travelVal = timeMultiplyByRates(model.travel, model.travRate);
    const waitingVal = timeMultiplyByRates(model.waiting, model.waitRate);
    const prepVal = timeMultiplyByRates(model.prep, model.prepRate);
    const advVal = timeMultiplyByRates(model.adv, model.advRate);

    const newModel: TimeInformationModel = {
        ...model,
        travelVal: travelVal,
        waitingVal: waitingVal,
        prepVal: prepVal,
        advVal: advVal
    };

    const totalValueCaculationUpdateModel = lgfsClassTotalValueCaculationUpdate(tempState, newModel);
    return { ...tempState, model: totalValueCaculationUpdateModel };
}

/// AGFS Class
function adviAssiAGFSCalculation(state: TimeInformationState, action: Actions.RateCalculationUpdate): TimeInformationState {
    const updateModelState = { ...state, model: action.payload.model };
    const tempState = updateFormRates(updateModelState, action.payload.timeOffset);
    const model = tempState.model;

    const travelVal = timeMultiplyByRates(model.travel, model.travRate);
    const waitingVal = timeMultiplyByRates(model.waiting, model.waitRate);
    const prepVal = timeMultiplyByRates(model.prep, model.prepRate);
    const advVal = timeMultiplyByRates(model.adv, model.advRate);

    const newModel: TimeInformationModel = {
        ...model,
        travelVal: travelVal,
        waitingVal: waitingVal,
        prepVal: prepVal,
        advVal: advVal
    };

    const totalValueCaculationUpdateModel = agfsClassTotalValueCaculationUpdate(tempState, newModel);
    return { ...tempState, model: totalValueCaculationUpdateModel };
}


function getFeeErnRate(feeEarnerList, model: TimeInformationModel) {
    const selectedFeeErn = feeEarnerList.find((item) => {
        return item.userId === model.feeEarner;
    });
    const feeErnRate = (selectedFeeErn &&
        (selectedFeeErn.userRate !== undefined || selectedFeeErn.userRate !== null || selectedFeeErn.userRate !== '')
    ) ? selectedFeeErn.userRate.toString() : 0;

    return feeErnRate;
}

function disburesementsValuesUpdate(model: TimeInformationModel) {
    const newModel = {
        ...model,
        mileageVal: mileageValCaculation(model),
        vatFaresVal: convertCurancy(model.vatFares),
        nonVatFaresVal: convertCurancy(model.nonVatFares),
        parkingVal: convertCurancy(model.parking),
    };
    return newModel;
}



function adviAssiC1TotalValueCaculationUpdate(state: TimeInformationState, model: TimeInformationModel): TimeInformationModel {

    const newModel = disburesementsValuesUpdate(model);

    const feeErnRate = getFeeErnRate(state.feeEarnerList, model);

    const totalValue =
        parseFloat(newModel.waitingVal) +
        parseFloat(newModel.prepVal) +
        parseFloat(newModel.travelVal) +
        parseFloat(newModel.mileageVal) +
        parseFloat(newModel.vatFaresVal) +
        parseFloat(newModel.nonVatFaresVal) +
        parseFloat(newModel.parkingVal);

    const totalValueLA =
        parseFloat(newModel.waitingVal) +
        parseFloat(newModel.prepVal) +
        parseFloat(newModel.travelVal);

    const disbursements =
        parseFloat(newModel.mileageVal) +
        parseFloat(newModel.vatFaresVal) +
        parseFloat(newModel.nonVatFaresVal) +
        parseFloat(newModel.parkingVal);


    return {
        ...newModel,
        totVal: convertCurancy(totalValue),
        totalValueLA: convertCurancy(totalValueLA),
        disbursements: convertCurancy(disbursements),
        feeErnRate: feeErnRate,
        feeErnVal: timeMultiplyByRates(newModel.prep, feeErnRate),
    };
}
function adviAssiC2TotalValueCaculationUpdate(state: TimeInformationState, model: TimeInformationModel): TimeInformationModel {

    const newModel = disburesementsValuesUpdate(model);

    const feeErnRate = getFeeErnRate(state.feeEarnerList, model);

    const totalValue =
        parseFloat(newModel.travToVal) +
        parseFloat(newModel.travFromVal) +
        parseFloat(newModel.advAssiVal) +
        parseFloat(newModel.waitValPS) +
        parseFloat(newModel.mileageVal) +
        parseFloat(newModel.vatFaresVal) +
        parseFloat(newModel.nonVatFaresVal) +
        parseFloat(newModel.parkingVal);

    const totalValueLA =
        parseFloat(newModel.travToVal) +
        parseFloat(newModel.travFromVal) +
        parseFloat(newModel.advAssiVal) +
        parseFloat(newModel.waitValPS);

    const disbursements =
        parseFloat(newModel.mileageVal) +
        parseFloat(newModel.vatFaresVal) +
        parseFloat(newModel.nonVatFaresVal) +
        parseFloat(newModel.parkingVal);

    return {
        ...newModel,
        totVal: convertCurancy(totalValue),
        totalValueLA: convertCurancy(totalValueLA),
        disbursements: convertCurancy(disbursements),
        feeErnVal: timeMultiplyByRates(newModel.feeErnHrsMin, feeErnRate),
        feeErnRate: feeErnRate,
    };
}
function adviAssiC3TotalValueCaculationUpdate(state: TimeInformationState, model: TimeInformationModel): TimeInformationModel {

    const newModel = disburesementsValuesUpdate(model);

    const feeErnRate = getFeeErnRate(state.feeEarnerList, model);

    const totalValueLA =
        parseFloat(newModel.waitingVal) +
        parseFloat(newModel.prepVal) +
        parseFloat(newModel.travelVal) +
        parseFloat(newModel.attCslVal) +
        parseFloat(newModel.advVal);


    const disbursements =
        parseFloat(newModel.mileageVal) +
        parseFloat(newModel.vatFaresVal) +
        parseFloat(newModel.nonVatFaresVal) +
        parseFloat(newModel.parkingVal);


    const totalValue = totalValueLA + disbursements;

    const totalfeeErnTime = DateTimeUtil.addHHMMStringArr([newModel.attCsl, newModel.prep, newModel.adv]).timeString();

    return {
        ...newModel,
        totVal: convertCurancy(totalValue),
        totalValueLA: convertCurancy(totalValueLA),
        disbursements: convertCurancy(disbursements),
        totalfeeErnTime: totalfeeErnTime,
        feeErnVal: timeMultiplyByRates(totalfeeErnTime, feeErnRate),
        feeErnRate: feeErnRate,
    };
}
function adviAssiC4TotalValueCaculationUpdate(state: TimeInformationState, model: TimeInformationModel): TimeInformationModel {
    const newModel = disburesementsValuesUpdate(model);

    const feeErnRate = getFeeErnRate(state.feeEarnerList, model);

    const totalValueLA =
        parseFloat(newModel.waitingVal) +
        parseFloat(newModel.prepVal) +
        parseFloat(newModel.travelVal) +
        parseFloat(newModel.attCslVal) +
        parseFloat(newModel.advVal);


    const disbursements =
        parseFloat(newModel.mileageVal) +
        parseFloat(newModel.vatFaresVal) +
        parseFloat(newModel.nonVatFaresVal) +
        parseFloat(newModel.parkingVal);


    const totalValue = totalValueLA + disbursements;

    const totalfeeErnTime = DateTimeUtil.addHHMMStringArr([newModel.attCsl, newModel.prep, newModel.adv]).timeString();

    return {
        ...newModel,
        totVal: convertCurancy(totalValue),
        totalValueLA: convertCurancy(totalValueLA),
        disbursements: convertCurancy(disbursements),
        totalfeeErnTime: totalfeeErnTime,
        feeErnVal: timeMultiplyByRates(totalfeeErnTime, feeErnRate),
        feeErnRate: feeErnRate,
    };
}

function proceedingClassTotalValueCaculationUpdate(state: TimeInformationState, model: TimeInformationModel): TimeInformationModel {

    const newModel = disburesementsValuesUpdate(model);

    const feeErnRate = getFeeErnRate(state.feeEarnerList, model);

    let totalValueLA =
        parseFloat(newModel.waitingVal) +
        parseFloat(newModel.prepVal) +
        parseFloat(newModel.travelVal) +
        parseFloat(newModel.attendanceVal);

    const disbursements =
        parseFloat(newModel.mileageVal) +
        parseFloat(newModel.vatFaresVal) +
        parseFloat(newModel.nonVatFaresVal) +
        parseFloat(newModel.parkingVal);

    let totalfeeErnTime = DateTimeUtil.addHHMMStringArr([newModel.attendance, newModel.prep]).timeString();

    if (newModel.attTypeId === 3) {
        totalValueLA = totalValueLA + parseFloat(newModel.advVal);
        totalfeeErnTime = DateTimeUtil.addHHMMStringArr([totalfeeErnTime, newModel.adv]).timeString();
    }
    if (newModel.attTypeId === 2 || newModel.attTypeId === 5) {
        totalValueLA = totalValueLA +
            parseFloat(newModel.attCslVal) +
            parseFloat(newModel.advVal);
        totalfeeErnTime = DateTimeUtil.addHHMMStringArr([totalfeeErnTime, newModel.attCsl, newModel.adv]).timeString();
    }

    const totalValue = totalValueLA + disbursements;



    return {
        ...newModel,
        totVal: convertCurancy(totalValue),
        totalValueLA: convertCurancy(totalValueLA),
        disbursements: convertCurancy(disbursements),
        feeErnRate: feeErnRate,
        feeErnVal: timeMultiplyByRates(totalfeeErnTime, feeErnRate),
    };
}

function lgfsClassTotalValueCaculationUpdate(state: TimeInformationState, model: TimeInformationModel): TimeInformationModel {

    let newModel = model;
    let disbursements = 0;
    let totalValueLA = 0;

    if (newModel.attTypeId === 1) {
        newModel = disburesementsValuesUpdate(model);
        disbursements =
            parseFloat(newModel.mileageVal) +
            parseFloat(newModel.vatFaresVal) +
            parseFloat(newModel.nonVatFaresVal) +
            parseFloat(newModel.parkingVal);
    }
    if (newModel.attTypeId === 2) {
        totalValueLA = totalValueLA + parseFloat(newModel.advVal);
    }

    totalValueLA +=
        parseFloat(newModel.waitingVal) +
        parseFloat(newModel.prepVal) +
        parseFloat(newModel.travelVal);

    const totalValue = totalValueLA + disbursements;
    return {
        ...newModel,
        totVal: convertCurancy(totalValue),
        totalValueLA: convertCurancy(totalValueLA),
        disbursements: convertCurancy(disbursements)
    };
}

function agfsClassTotalValueCaculationUpdate(state: TimeInformationState, model: TimeInformationModel): TimeInformationModel {

    // const newModel = disburesementsValuesUpdate(model);

    const feeErnRate = getFeeErnRate(state.feeEarnerList, model);

    const totalValue =
        parseFloat(model.waitingVal) +
        parseFloat(model.prepVal) +
        parseFloat(model.advVal) +
        parseFloat(model.travelVal);
    return {
        ...model,
        totVal: convertCurancy(totalValue),
        feeErnRate: feeErnRate
    };
}

function mileageValCaculation(newModel): string {
    return convertCurancy(isNumber(newModel.mileage) * parseFloat(newModel.mileageRate));
}

function timeMultiplyByRates(hrsMin, rate): string {
    const time = DateTimeUtil.extractTimeFromHHMMString(hrsMin);
    const hrs = !!time ? time.hrs + time.min / 60 : 0;
    const value = convertCurancy(hrs * isNumber(rate));
    return value;
}

function convertCurancy(value) {
    const newValue = (Math.round(isNumber(value) * 100) / 100).toFixed(2);
    return newValue;
}

function isNumber(value): number {
    const newValue = ((value !== null && value !== '') && !isNaN(Number(value.toString()))) ? parseFloat(value) : 0;
    return newValue;
}
function calculateTravelTo(model: TimeInformationModel, investigation: InvestigationClass, attendanceRates: AttendanceRates, solType) {

    const policeStationTotals = investigation.getPoliceStationSocUnSocTotals(
        CrimeTimeTypeDef.TravelToTimeType,
        attendanceRates,
        solType,
        model.dutySol,
        model.weekEndWork,
        model.arrTime,
        model.depTime,
        model.waitPS,
        model.travelTo,
        model.travelFrom);

    let total: number;
    let rateStr;
    if (policeStationTotals.getSocMin() > 0 && policeStationTotals.getUnSocMin() > 0) {
        rateStr = 'SPLIT';
        total = policeStationTotals.getSocVal() + policeStationTotals.getUnSocVal();
    } else if (policeStationTotals.getUnSocMin() > 0) {
        rateStr = convertCurancy(policeStationTotals.getUnSocRate());
        total = policeStationTotals.getUnSocVal();
    } else {
        rateStr = convertCurancy(policeStationTotals.getSocRate());
        total = policeStationTotals.getSocVal();
    }

    return { total: convertCurancy(total), rate: rateStr };

}
function calculateTravelFrom(model: TimeInformationModel, investigation: InvestigationClass, attendanceRates: AttendanceRates, solType) {

    const policeStationTotals = investigation.getPoliceStationSocUnSocTotals(
        CrimeTimeTypeDef.TravelFromTimeType,
        attendanceRates,
        solType,
        model.dutySol,
        model.weekEndWork,
        model.arrTime,
        model.depTime,
        model.waitPS,
        model.travelTo,
        model.travelFrom);

    let total: number;
    let rateStr;
    if (policeStationTotals.getSocMin() > 0 && policeStationTotals.getUnSocMin() > 0) {
        rateStr = 'SPLIT';
        total = policeStationTotals.getSocVal() + policeStationTotals.getUnSocVal();
    } else if (policeStationTotals.getUnSocMin() > 0) {
        rateStr = convertCurancy(policeStationTotals.getUnSocRate());
        total = policeStationTotals.getUnSocVal();
    } else {
        rateStr = convertCurancy(policeStationTotals.getSocRate());
        total = policeStationTotals.getSocVal();
    }

    return { total: convertCurancy(total), rate: rateStr };

}
function calculateTravelWaitTime(model: TimeInformationModel,
    investigation: InvestigationClass, attendanceRates: AttendanceRates, solType) {

    const policeStationTotals = investigation.getPoliceStationSocUnSocTotals(
        CrimeTimeTypeDef.WaitTimeType,
        attendanceRates,
        solType,
        model.dutySol,
        model.weekEndWork,
        model.arrTime,
        model.depTime,
        model.waitPS,
        model.travelTo,
        model.travelFrom);

    let total: number;
    let rateStr;
    if (policeStationTotals.getSocMin() > 0 && policeStationTotals.getUnSocMin() > 0) {
        rateStr = 'SPLIT';
        total = policeStationTotals.getSocVal() + policeStationTotals.getUnSocVal();
    } else if (policeStationTotals.getUnSocMin() > 0) {
        rateStr = convertCurancy(policeStationTotals.getUnSocRate());
        total = policeStationTotals.getUnSocVal();
    } else {
        rateStr = convertCurancy(policeStationTotals.getSocRate());
        total = policeStationTotals.getSocVal();
    }

    return { total: convertCurancy(total), rate: rateStr };

}
function calculateTravelAdviceAssistanceTime(model: TimeInformationModel,
    investigation: InvestigationClass, attendanceRates: AttendanceRates, solType) {

    const policeStationTotals = investigation.getPoliceStationSocUnSocTotals(
        CrimeTimeTypeDef.AdviceAssistanceTimeType,
        attendanceRates,
        solType,
        model.dutySol,
        model.weekEndWork,
        model.arrTime,
        model.depTime,
        model.waitPS,
        model.travelTo,
        model.travelFrom);

    let total: number;
    let rateStr;
    if (policeStationTotals.getSocMin() > 0 && policeStationTotals.getUnSocMin() > 0) {
        rateStr = 'SPLIT';
        total = policeStationTotals.getSocVal() + policeStationTotals.getUnSocVal();
    } else if (policeStationTotals.getUnSocMin() > 0) {
        rateStr = convertCurancy(policeStationTotals.getUnSocRate());
        total = policeStationTotals.getUnSocVal();
    } else {
        rateStr = convertCurancy(policeStationTotals.getSocRate());
        total = policeStationTotals.getSocVal();
    }

    return { total: convertCurancy(total), rate: rateStr };

}



function newFormModel(setting: CrimeTimeSettings, branchId, fileId, appId: number, classId, mileageRate, attTypeId: number, timeOffset)
    : TimeInformationModel {

    let isLondanRateApply = setting ? setting.crimeSettings.IsCheckedLondonRate : false;

    if (classId === CrimeDefs.PROCLASSID && attTypeId !== 5) {
        isLondanRateApply = false;
    }

    return {
        branchId: branchId,
        fileId: fileId,
        appId: appId,
        classId: classId,
        ownSol: false,
        dutySol: true,
        timeId: 0,
        feeEarner: null,
        totVal: '0.00',
        diaryNote: 'Attendance Note',
        attTypeId: attTypeId,
        attTypeText: '',
        date: new DatePipe('en-US').transform(dpsNewDate(timeOffset), 'yyyy-MM-dd').toString(),
        mileageRate: classId === CrimeDefs.PROCLASSID ? '0.45' : mileageRate,
        vatFaresVal: '0.00',
        nonVatFaresVal: '0.00',
        parkingVal: '0.00',
        userControlText: '',
        custTemplates: false,
        prep: '',
        waitPS: null,
        travel: '',
        waiting: '',
        workDoneSep: '',
        court: '',
        attCsl: '',
        adv: '',
        attConf: '',
        result: '',
        morning: false,
        morningIn: '',
        morningOut: '',
        afternoon: false,
        aftIn: '',
        aftOut: '',
        attendance: '',
        attendees1: '',
        attendees2: '',
        attendees3: '',
        hearingTp1: '',
        hearingTp2: '',
        hearingTp3: '',
        policeSt: setting ? setting.policeStation : '',
        adviAssi: '',
        workCourt: '',
        workReasonTrv: '',
        reason: '',
        grade: GradeList.c,
        sectionRate: false,
        nextHearingDateCheck: false,
        nextHearingDate: new DatePipe('en-US').transform(dpsNewDate(timeOffset), 'yyyy-MM-dd').toString(),
        courtName: '',
        specialPrepRate: false,
        londonRate: isLondanRateApply,
        attendeesSep1: '',
        attendeesSep2: '',
        attendeesSep3: '',
        noteLn: '',
        claimCommittal: false,
        nextAppDateCheck: false,
        nextAppDate: new DatePipe('en-US').transform(dpsNewDate(timeOffset), 'yyyy-MM-dd').toString(),
        weekEndWork: false,
        initDuty: false,
        arrTime: null,
        depTime: null,
        attCslRate: '',
        attConfVal: '',
        attConfRate: '',
        attCslVal: '0.00',
        prepVal: '0.00',
        prepRate: '0.00',
        advVal: '0.00',
        advRate: '',
        advValue: '0.00',
        waitRate: '0.00',
        travelVal: '0.00',
        travRate: '0.00',
        attendanceVal: '0.00',
        attendanceRate: '0.00',
        travFromVal: '0.00',
        travToVal: '0.00',
        advAssiVal: '0.00',
        mileage: '0',
        mileageVal: '0.00',
        vatFares: '0.00',
        nonVatFares: '0.00',
        parking: '0.00',
        feeErnHrsMin: null,
        feeErnRate: '0.00',
        feeErnVal: '0.00',
        diaryRef: 0,
        travelFrom: null,
        guid: uuid(),
        waitRatePS: '0.00',
        advAssiRate: '0.00',
        waitValPS: '0.00',
        travelTo: null,
        totalValueLA: '0.00',
        disbursements: '0.00',
        waitingVal: '0.00',
        listedAs: ''

    };
}
function changeModelData(timeInfostate: TimeInformationState, item: TimeInformationModel):
    TimeInformationModel {
    return {
        ...item,
        branchId: timeInfostate.model.branchId,
        fileId: timeInfostate.model.fileId,
        classId: timeInfostate.model.classId,
        guid: uuid(),

    };
}

function setSelectedLookupData(model: TimeInformationModel, lookupType: LookupType, property: string, selectLookup: LoockupItem) {
    const temp = {};
    if (selectLookup) {
        let value = (selectLookup && selectLookup.name) ? selectLookup.name : '';
        if (lookupType === LookupType.ATTENDEE_CODES || lookupType === LookupType.HEARING_TYPES) {
            value = selectLookup.name.slice(0, 2);
        }
        temp[property] = value;
        return {
            ...model,
            ...temp
        };
    }
    return model;
}


function setLookupDataList(lookupData: CrimeLookupData, newData: LoockupItem[], lookupType: LookupType): CrimeLookupData {
    const temp = {};
    temp[lookupType] = newData;
    return { ...lookupData, ...temp };
}
export const getView = (tiState: State) => tiState;
export const getViewByToken = (token) => createSelector(getView, (views) => views[token]);
export const getIsLoadingByToken = (token) => createSelector(getViewByToken(token),
    (tiState) => {
        if (tiState && (tiState.loadingAttTypeList || tiState.loadingCrimeRateFiles ||
            tiState.loadingFeeEarnerList || tiState.isLoading || tiState.loadingRatePrecentage)) {
            return true;
        } else {
            return false;
        }
    });
export const getIsloadingTimeRecords = (token) => createSelector(getViewByToken(token),
    (tiState) => !!tiState ? tiState.loadingTimeRecords : false);

export const getFeeEarnerList = (token) => createSelector(getViewByToken(token),
    (tiState) => tiState ? tiState.feeEarnerList : []);

export const getFormViewModelByToken = (token) => createSelector(getViewByToken(token),
    (tiState) => tiState ? tiState.formViewModel : null);

export const getModelByToken = (token) => createSelector(getViewByToken(token),
    (tiState) => tiState ? tiState.model : null);

export const getSaveModelByToken = (token) => createSelector(getViewByToken(token),
    (tiState) => {
        if (tiState && tiState.model) {
            const solType = (tiState.model.ownSol) ? SolTypeDef.Own : SolTypeDef.Duty;
            const rate = CaseClass.getAttendanceRates(tiState.matter, tiState.classId, tiState.model.attTypeId, tiState.model.grade, false,
                tiState.model.londonRate,
                tiState.model.initDuty,
                solType,
                tiState.ratesDataSource, tiState.timeOffset,
                tiState.settings.repOderDate);
            const saveModel: TimeInformationModel = JSON.parse(JSON.stringify(tiState.model));
            saveModel.date = tiState.model.date ?
                new DatePipe('en-US').transform(tiState.model.date, 'dd/MM/yyyy HH:mm:ss').toString() : null;
            saveModel.nextAppDate = tiState.model.nextAppDate && tiState.model.nextAppDateCheck ?
                new DatePipe('en-US').transform(tiState.model.nextAppDate, 'dd/MM/yyyy HH:mm:ss').toString() : null;
            saveModel.nextHearingDate = tiState.model.nextHearingDate ?
                new DatePipe('en-US').transform(tiState.model.nextHearingDate, 'dd/MM/yyyy HH:mm:ss').toString() : null;
            saveModel.attTypeText = tiState.attTypes.find(i => i.attId === saveModel.attTypeId).attDescription;
            return {
                ...saveModel, CrimeSocialUnSocialRates: {
                    TravelToSocialRate: rate.travelToRate,
                    TravelFromSocialRate: rate.travelFromRate,
                    WaitSocialRatePS: rate.waitRate,
                    AdvAssiSocialRate: rate.adviAssi,
                    TravelToUnSocialRate: rate.usTravelToRate,
                    TravelFromUnSocialRate: rate.usTravelFromRate,
                    WaitUnSocialRatePS: rate.usWaitRate,
                    AdvAssiUnSocialRate: rate.usAdviAssi,
                }

            };
        } else {
            return null;
        }
    });
export const getCrimeClassIdentityViewModel = (token) => createSelector(getViewByToken(token),
    (tiState) => {
        if (tiState && tiState.model) {
            return {
                fileId: tiState.model.fileId,
                branchId: tiState.model.branchId,
                classId: tiState.model.classId,
            };
        }
        return null;
    });
export const getAttTypesList = (token) => createSelector(getViewByToken(token),
    (tiState) => tiState ? tiState.attTypes : []);
export const getGradeList = (token) => createSelector(getViewByToken(token),
    (tiState) => tiState ? tiState.gradeList : []);
export const getGridColumnDef = (token) => createSelector(getViewByToken(token),
    (tiState) => tiState ? tiState.gridColumnDef : []);
export const getTimeRecordGridItems = (token) => createSelector(getViewByToken(token),
    (tiState) => tiState.timeRecordGridItem);
export const getIsUpdateRateFiles = (token) => createSelector(getViewByToken(token),
    (tiState) => tiState ? tiState.isUpdateRateFiles : true);
export const getIsEditMode = (token) => createSelector(getViewByToken(token), (tiState) =>
    tiState && tiState.inputData && tiState.inputData.crimeTimeId > 0 ? true : false);
export const getIsEditTimId = (token) => createSelector(getViewByToken(token), (tiState) =>
    tiState && tiState.inputData ? tiState.inputData.crimeTimeId : 0);
export const getAttendeesAndWorkLookupData = (token: string, lookupType: LookupType) =>
    createSelector(getViewByToken(token), tiState => {
        return tiState ? tiState.lookupData[lookupType] : [];
    });
export const checkInitialDataLoadedForEdit = token => createSelector(getViewByToken(token), tiState => {
    if (!!tiState && !!tiState.feeEarnerList && !!tiState.attTypes && !!tiState.ratesDataSource && !!tiState.timeRecordGridItem &&
        tiState.inputData.crimeTimeId > 0 && !!tiState.timeRecordGridItem.find(i => i.timeId === tiState.inputData.crimeTimeId)) {
        return true;
    }
    return false;
});
export const getSettings = (token) => createSelector(getViewByToken(token),
    (tiState) => tiState ? tiState.settings : null);
export const getClassList = (token) => createSelector(getViewByToken(token),
    (tiState) => tiState ? tiState.inputData.classList : null);
export const getPopupInput = (token) => createSelector(getViewByToken(token),
    (tiState) => tiState ? tiState.inputData : null);
export const getMatter = (token) => createSelector(getViewByToken(token),
    (tiState) => tiState ? tiState.matter : null);



