import { CourtDutyTimeRecord } from '../model/interface';

export function timeTotal(model: CourtDutyTimeRecord): number {
    let total = 0.00;
    if (model) {
        total = (Number(model.socialTimeVal) + Number(model.unSocialTimeVal));
        if (!model.doNotClaimTravel) {
            total += Number(model.travelVal);
        }
    }
    return total;
}

export function disbusmentTotal(model: CourtDutyTimeRecord): number {
    if (model) {
        return (Number(model.mileageValue) + Number(model.vatFares) + Number(model.nonVATFares) +
            Number(model.parking));
    } else {
        return 0.00;
    }
}

export function courtDutyTotal(model: CourtDutyTimeRecord): number {
    if (model) {
        return timeTotal(model) + disbusmentTotal(model);
    }
}
