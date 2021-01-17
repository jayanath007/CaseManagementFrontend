export class Utilities {

    public static GetFormattedDDMMYYYYDateStr(date: Date) {
        // dd/mm/yyyy
        const year = date.getFullYear().toString();
        let month = (date.getMonth() + 1).toString();
        if (month.length === 1) {
            month = '0' + month;
        }
        let day = date.getDate().toString();
        if (day.length === 1) {
            day = '0' + day;
        }
        return day + '/' + month + '/' + year;
    }
    public static GetDateObjectFromDDMMYYYYStr(dateString: string) {
        console.log(`dateString: ${dateString}`);
        if (dateString && dateString.split('/').length === 3) {
            const dateParts = dateString.split('/');
            return new Date(+dateParts[2], +dateParts[1] - 1, +dateParts[0]);
        }
        return null;
    }



    public static GetTimeFromString(checkTime: string) {// Tested
        if (checkTime.trim().length <= 0) {
            checkTime = '00:00';
        }
        checkTime = checkTime.replace(':', '');
        checkTime = checkTime.replace('.', '');
        if (checkTime.length <= 2) {
            checkTime += ':00';
        } else {
            let checkTimeHead: string;
            let checkTimeTail: string;
            checkTimeHead = checkTime.slice(0, checkTime.length - 2);
            checkTimeTail = checkTime.slice(checkTime.length - 2, checkTime.length);

            checkTime = checkTimeHead + ':' + checkTimeTail;
        }
        // now try validating, if not valid, will return 00:00
        const isValid = Utilities.IsValidTime(checkTime);
        if (!isValid) {
            checkTime = '00:00';
        }
        return checkTime;
    }

    public static IsUpperChar(text: string) {// Tested
        let isUpper = false;
        if (text[0] === text[0].toUpperCase() && this.IsLetter(text[0])) {
            isUpper = true;
        }
        return isUpper;
    }

    public static IsKeyChar(e) {// Tested
        const msg = (e.isChar) ? 'Key character was pressed.' : 'Not a key character was pressed.';
        alert(msg);
    }

    public static IsLowerChar(text: string) {// Tested
        let isLower = false;
        if (text[0] === text[0].toLowerCase() && this.IsLetter(text[0])) {
            isLower = true;
        }
        return isLower;
    }

    public static IsPunctuation(text: string) {// Tested
        let isPunctuation = false;
        const listOfPunctuations = '/[.,\/#!$%\^&\*;:{}=\-_`~()]/';
        if (text.indexOf(listOfPunctuations) !== -1) {
            isPunctuation = true;
        }
        return isPunctuation;
    }

    public static IsLetter(text: string) {// Tested
        return text.length === 1 && text.match(/[a-z]/i);
    }

    public static IsTextEquals(text1: string, text2: string): boolean {// Tested
        let equals = false;
        if (text1.localeCompare(text2) !== -1) {
            equals = true;
        }
        return equals;
    }

    public static IsValidTime(time: string) {// Tested
        let isValid = false;
        const regEx = /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/;
        isValid = regEx.test(time);
        return isValid;
    }

    public static atoi(txtVal: string): number {

        let retValStr = '';
        let retVal = 0;
        let sign = 1;
        let txtLength = 0;

        if (!txtVal || txtVal.length < 0) {
            return retVal;
        }

        if (txtVal[0] === '-') {
            sign = -1;
            txtVal = txtVal.substring(1);
        }

        txtLength = txtVal.length;

        for (let i = 0; i <= txtLength; i++) {
            if (this.IsInt(txtVal[i])) {
                retValStr = retValStr + txtVal[i];
            } else {
                break;
            }
        }

        if (retValStr) {
            retVal = parseInt(retValStr, 10);
        }

        return retVal * sign;
    }

    public static IsInt(value) {

        let isInt: boolean;
        if (!isNaN(value) && !isNaN(parseInt(value, 10))) {
            isInt = true;
        }
        return isInt;
    }

    public static IsNumeric(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }

}
