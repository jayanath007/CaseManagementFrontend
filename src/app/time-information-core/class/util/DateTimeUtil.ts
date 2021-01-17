import { TimeDTO } from '../core/TimeDTO';
import { forEach } from '@angular/router/src/utils/collection';

export class DateTimeUtil {

    public static extractTimeFromHHMMString(timestr: string): TimeDTO {

        if (timestr) {
            const elems: string[] = timestr.split(':');
            if (elems.length < 2) {
                return null;
            }
            const hrs = parseInt(elems[0], 10);
            const mins = parseInt(elems[1], 10);
            const dto = new TimeDTO(hrs, mins);
            return dto;
        }
        return new TimeDTO(0, 0);
    }


    public static addHHMMStringArr(strValArr: Array<string>): TimeDTO {
        let hrs = 0;
        let min = 0;

        strValArr.forEach((item) => {
            const timeDto = this.extractTimeFromHHMMString(item);
            hrs += timeDto.hrs;
            min += timeDto.min;
        });

        const roundHrs = min / 60;
        const roundMin = min % 60;

        hrs += parseInt(roundHrs.toString(), 10);
        min = parseInt(roundMin.toString(), 10);

        return new TimeDTO(hrs, min);

    }


}
