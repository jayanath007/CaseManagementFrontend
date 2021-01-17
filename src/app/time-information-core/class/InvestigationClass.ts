import { CaseClass } from './CaseClass';
import { PoliceStationTotals } from './PoliceStationTotals';
import { AttendanceRates } from './AttendanceRates';
import { DateTimeUtil } from './util/DateTimeUtil';
import { CrimeTimeTypeDef } from './CrimeTimeTypeDef';
import { TimeDTO } from './core/TimeDTO';

export class InvestigationClass extends CaseClass {

    public getPoliceStationSocUnSocTotals(
        crimeTimeType: string,
        rates: AttendanceRates,
        solType: string,
        isDuty: boolean,
        isWeekend: boolean,
        arrivalTimeStr: string,
        depatureTimeStr: string,
        waitTimeStr: string,
        travelToTimeStr: string,
        travelFromTimeStr: string): PoliceStationTotals {

        let totals = new PoliceStationTotals();

        const arrivalTime = DateTimeUtil.extractTimeFromHHMMString(arrivalTimeStr);
        const depatureTime = DateTimeUtil.extractTimeFromHHMMString(depatureTimeStr);
        const waitTime = DateTimeUtil.extractTimeFromHHMMString(waitTimeStr);
        const travelToTime = DateTimeUtil.extractTimeFromHHMMString(travelToTimeStr);
        const travelFromTime = DateTimeUtil.extractTimeFromHHMMString(travelFromTimeStr);

        if (arrivalTime == null && depatureTime == null && waitTime == null && travelToTime == null && travelFromTime == null) {
            // failed to parse date
            totals.setErrorCode(-5);
            return totals;
        }

        switch (crimeTimeType) {

            case CrimeTimeTypeDef.TravelFromTimeType:
                totals = this.calculatePSSocialUnSocialTime(isDuty, isWeekend, depatureTime,
                    depatureTime.add(travelFromTime), rates.getTravelFromRate(),
                    rates.getUsTravelFromRate());
                totals.setSocRate(rates.getTravelFromRate());
                totals.setUnSocRate(rates.getUsTravelFromRate());
                break;
            case CrimeTimeTypeDef.TravelToTimeType:
                totals = this.calculatePSSocialUnSocialTime(isDuty, isWeekend,
                    arrivalTime.subtract(travelToTime), arrivalTime, rates.getTravelToRate(),
                    rates.getUsTravelToRate());
                totals.setSocRate(rates.getTravelToRate());
                totals.setUnSocRate(rates.getUsTravelToRate());
                break;
            case CrimeTimeTypeDef.WaitTimeType:
                totals = this.calculatePSSocialUnSocialTime(isDuty, isWeekend, arrivalTime,
                    arrivalTime.add(waitTime), rates.getWaitRate(), rates.getUsWaitRate());
                totals.setSocRate(rates.getWaitRate());
                totals.setUnSocRate(rates.getUsWaitRate());
                break;
            case CrimeTimeTypeDef.AdviceAssistanceTimeType:
                totals = this.calculatePSSocialUnSocialTime(isDuty, isWeekend, arrivalTime.add(waitTime),
                    depatureTime, rates.getAdviAssi(), rates.getUsAdviAssi());
                totals.setSocRate(rates.getAdviAssi());
                totals.setUnSocRate(rates.getUsAdviAssi());
                break;
        }

        return totals;
    }


    private calculatePSSocialUnSocialTime(isDuty: boolean, isWeekend: boolean,
        arrivalTime: TimeDTO, departureTime: TimeDTO,
        socRate: number, unSocRate: number): PoliceStationTotals {


        const totals = new PoliceStationTotals();
        totals.setSocMin(0);
        totals.setUnSocMin(0);
        const socStart = new TimeDTO(9, 30);
        const socEnd = new TimeDTO(17, 30);

        let unSocResetMin = 0;
        let totalsTillMidnight = null;

        if (arrivalTime.compareTo(departureTime) > 0) {
            const tempDepTime = new TimeDTO(23, 59);
            totalsTillMidnight = this.calculatePSSocialUnSocialTime(isDuty, isWeekend, arrivalTime, tempDepTime, socRate, unSocRate);

            unSocResetMin++;
            arrivalTime = new TimeDTO(0, 0);
        }

        if (!isWeekend && isDuty) {

            // Social or Unsocial
            if ((arrivalTime.compareTo(socStart) >= 0) && (arrivalTime.compareTo(socEnd) <= 0)) {

                if (departureTime.compareTo(socEnd) <= 0) {
                    const ts = departureTime.subtract(arrivalTime);
                    totals.setSocMin(ts.getHrs() * 60 + ts.getMin());
                } else {
                    let ts = socEnd.subtract(arrivalTime);
                    totals.setSocMin(ts.getHrs() * 60 + ts.getMin());
                    ts = departureTime.subtract(socEnd);
                    totals.setUnSocMin(ts.getHrs() * 60 + ts.getMin());
                }
            } else if (arrivalTime.compareTo(socEnd) > 0) {
                const ts = departureTime.subtract(arrivalTime);
                totals.setUnSocMin(ts.getHrs() * 60 + ts.getMin());
            } else {
                // arrivalTime before 09:30
                if ((departureTime.compareTo(socStart) >= 0) && (departureTime.compareTo(socEnd) <= 0)) {
                    let ts = departureTime.subtract(socStart);
                    totals.setSocMin(ts.getHrs() * 60 + ts.getMin());
                    ts = socStart.subtract(arrivalTime);
                    totals.setUnSocMin(ts.getHrs() * 60 + ts.getMin());
                } else if (departureTime.compareTo(socEnd) > 0) {
                    totals.setSocMin(8 * 60); // (17:30 - 9:30)
                    const ts = socStart.subtract(arrivalTime).add(departureTime.subtract(socEnd));
                    totals.setUnSocMin(ts.getHrs() * 60 + ts.getMin());
                } else {
                    const ts = departureTime.subtract(arrivalTime);
                    totals.setUnSocMin(ts.getHrs() * 60 + ts.getMin());
                }
            }
        } else if (isDuty) {
            // always UnSocial
            const ts = departureTime.subtract(arrivalTime);
            totals.setUnSocMin(ts.getHrs() * 60 + ts.getMin());
        } else {
            // Always Social
            const ts = departureTime.subtract(arrivalTime);
            totals.setSocMin(ts.getHrs() * 60 + ts.getMin());
        }

        // If the timer has been reset then the depature time should be 24.00.
        // However we can add only 23:59 to the structure
        // That extra minute should add to the unsocial minutes count
        if (isDuty) {
            totals.setUnSocMin(totals.getUnSocMin() + unSocResetMin);
        } else {
            totals.setSocMin(totals.getSocMin() + unSocResetMin);
        }

        /*
         * In existing code although it add the the totals soc/unsoc and totalsTillMidnigh soc/unsoc minutes, for the value
         * calculation it only uses the totals soc/unsoc value. Following the same logic
         * */
        let currentSocVal = (totals.getSocMin() / 60.0) * socRate;
        let currentUnSocVal = (totals.getUnSocMin() / 60.0) * unSocRate;
        if (totalsTillMidnight != null) {
            currentSocVal += totalsTillMidnight.getSocVal();
            currentUnSocVal += totalsTillMidnight.getUnSocVal();
        }
        totals.setSocVal(currentSocVal);
        totals.setUnSocVal(currentUnSocVal);

        if (totalsTillMidnight != null) {
            totals.setSocMin(totals.getSocMin() + totalsTillMidnight.getSocMin());
            totals.setUnSocMin(totals.getUnSocMin() + totalsTillMidnight.getUnSocMin());
        }

        return totals;
    }


    public calculateAdviAssiHrsMin(arrTimeStr: string, depTimeStr: string, waitTimeStr: string): TimeDTO {

        const arrTimeDTO = DateTimeUtil.extractTimeFromHHMMString(arrTimeStr);
        const depTimeDTO = DateTimeUtil.extractTimeFromHHMMString(depTimeStr);
        const waitTimeDTO = DateTimeUtil.extractTimeFromHHMMString(waitTimeStr);


        if (arrTimeDTO.compareTo(depTimeDTO) > 0) {
            depTimeDTO.setHrs(depTimeDTO.getHrs() + 24);
        }

        let adviAssiHrs = depTimeDTO.getHrs() - arrTimeDTO.getHrs() - waitTimeDTO.getHrs();
        let adviAssiMin = depTimeDTO.getMin() - arrTimeDTO.getMin() - waitTimeDTO.getMin();

        while (adviAssiHrs > 0 && adviAssiMin < 0) {
            adviAssiHrs--;
            adviAssiMin = 60 + adviAssiMin;
        }

        if (adviAssiHrs < 0 || adviAssiMin < 0) {
            adviAssiHrs = 0;
            adviAssiMin = 0;

            const timeDTOItem = new TimeDTO(adviAssiHrs, adviAssiMin);
            timeDTOItem.setErrorCode(-1);
            return timeDTOItem;
        }

        // timeDTO.setHrs(adviAssiHrs);
        // timeDTO.setMin(adviAssiMin);
        const timeDTO = new TimeDTO(adviAssiHrs, adviAssiMin);
        timeDTO.setErrorCode(1);
        return timeDTO;
    }



}
