export class TimeDTO {


    public hrs: number;
    public min: number;
    public errorCode: number;

    // public TimeDTO() {

    // }

    constructor(hrs: number, min: number) {
        // super();
        this.hrs = hrs;
        this.min = min;
    }

    public getHrs() {
        return this.hrs;
    }

    public setHrs(hrs) {
        this.hrs = hrs;
    }

    public getMin() {
        return this.min;
    }

    public setMin(min) {
        this.min = min;
    }

    public getErrorCode() {
        return this.errorCode;
    }

    public setErrorCode(errorCode) {
        this.errorCode = errorCode;
    }

    public add(dateTime) {
        if (dateTime) {
            const min = this.getMin() + dateTime.getMin();
            const newMin = min % 60;

            let hours = this.getHrs() + dateTime.getHrs();
            hours += ((min - newMin) / 60);

            if (hours > 23) {
                hours = hours - 24;
            }

            return new TimeDTO(hours, newMin);
        } else {
            return this;
        }
    }

    public subtract(dateTime) {
        let min = this.getMin() - dateTime.getMin();
        let hours = this.getHrs() - dateTime.getHrs();

        // hours > 0 && condition removed
        while (min < 0) {
            hours--;
            min = 60 + min;
        }

        // adjust below 00
        if (hours < 0) {
            hours = hours + 24;
        }

        return new TimeDTO(hours, min);
    }

    public compareTo(time) {
        if (this.getHrs() > time.getHrs()) {
            return 1;
        }

        if (this.getHrs() === time.getHrs()) {
            if (this.getMin() > time.getMin()) {
                return 1;
            }

            if (this.getMin() === time.getMin()) {
                return 0;
            }
        }

        return -1;
    }

    public toString() {
        return 'TimeDTO [hrs=' + this.hrs + ', min=' + this.min + ', errorCode=' + this.errorCode + ']';
    }

    public timeString() {

        const hrs = this.hrs < 10 ? '0' + this.hrs : this.hrs.toString();
        const min = this.min < 10 ? '0' + this.min : this.min.toString();

        return hrs + ':' + min;
    }
}


export function crimeTimeSubtract(startTime: TimeDTO, endTime: TimeDTO) {

    let min = startTime.min - endTime.min;
    let hours = startTime.hrs - endTime.hrs;

    // hours > 0 && condition removed
    while (min < 0) {
        hours--;
        min = 60 + min;
    }

    // adjust below 00
    if (hours < 0) {
        hours = hours + 24;
    }

    return new TimeDTO(hours, min);
}



