export class AttendanceRates {
    public attCLSRate = 0;		// CR01
    public confRate = 0;		// CR02
    public prepRate = 0;		// CR03
    public advRate = 0;			// CR04
    public waitRate = 0;		// CR05
    public travelRate = 0;	// CR06P
    public attRate = 0;		// CR07
    public perMileRate = 0;
    public usWaitRate = 0;
    public travelToRate = 0; // CR09
    public travelFromRate = 0; // CR08
    public adviAssi = 0;	// CR13
    public usAdviAssi = 0;
    public usTravelToRate = 0;
    public usTravelFromRate = 0;
    public callsInRate = 0;
    public callsOutRate = 0;
    public letterInRate = 0;
    public letterOutRate = 0;
    public cdAttRate = 0;		// CR10
    public cdusAttRate = 0;		// CR11
    public emailInRate = 0;		// EI
    public emailOutRate = 0;	// EO
    public excessTravel1 = 0;
    public errorCode = 0;
    public usPrepRate = 0; // added by CYR on 15.05.2017 for Investigation Pre Charge Class
    public usAdvRate = 0; // added by CYR on 15.05.2017 for Investigation Pre Charge Class
    public usCallsInRate = 0; // added by CYR on 15.05.2017 for Investigation Pre Charge Class
    public usCallsOutRate = 0; // added by CYR on 15.05.2017 for Investigation Pre Charge Class
    public usLetterOutRate = 0; // added by CYR on 15.05.2017 for Investigation Pre Charge Class
    public usEmailOutRate = 0; // added by CYR on 22.05.2017 for Investigation Pre Charge Class


    //  * error code is set zero or less than zero when failed to fetch rates
    //  * always validate error code before using rates
    // private int errorCode;

    public getAttCLSRate(): number {
        return this.attCLSRate;
    }
    public setAttCLSRate(attCLSRate: number) {
        this.attCLSRate = attCLSRate;
    }

    public getConfRate() {
        return this.confRate;
    }
    public setConfRate(confRate: number) {
        this.confRate = confRate;
    }

    public getPrepRate() {
        return this.prepRate;
    }
    public setPrepRate(prepRate) {
        this.prepRate = prepRate;
    }

    public getUsPrepRate() {
        return this.usPrepRate;
    }
    public setUsPrepRate(usPrepRate) {
        this.usPrepRate = usPrepRate;
    }

    public getAdvRate() {
        return this.advRate;
    }
    public setAdvRate(advRate) {
        this.advRate = advRate;
    }

    public getUsAdvRate() {
        return this.usAdvRate;
    }
    public setUsAdvRate(usAdvRate) {
        this.usAdvRate = usAdvRate;
    }


    public getWaitRate() {
        return this.waitRate;
    }
    public setWaitRate(waitRate) {
        this.waitRate = waitRate;
    }

    public getTravelRate() {
        return this.travelRate;
    }
    public setTravelRate(travelRate) {
        this.travelRate = travelRate;
    }

    public getAttRate() {
        return this.attRate;
    }
    public setAttRate(attRate) {
        this.attRate = attRate;
    }

    public getPerMileRate() {
        return this.perMileRate;
    }
    public setPerMileRate(perMileRate) {
        this.perMileRate = perMileRate;
    }

    public getUsWaitRate() {
        return this.usWaitRate;
    }
    public setUsWaitRate(usWaitRate) {
        this.usWaitRate = usWaitRate;
    }

    public getTravelToRate() {
        return this.travelToRate;
    }
    public setTravelToRate(travelToRate) {
        this.travelToRate = travelToRate;
    }
    public getTravelFromRate() {
        return this.travelFromRate;
    }
    public setTravelFromRate(travelFromRate) {
        this.travelFromRate = travelFromRate;
    }
    public getAdviAssi() {
        return this.adviAssi;
    }
    public setAdviAssi(adviAssi) {
        this.adviAssi = adviAssi;
    }
    public getUsAdviAssi() {
        return this.usAdviAssi;
    }
    public setUsAdviAssi(usAdviAssi) {
        this.usAdviAssi = usAdviAssi;
    }
    public getUsTravelToRate() {
        return this.usTravelToRate;
    }
    public setUsTravelToRate(usTravelToRate) {
        this.usTravelToRate = usTravelToRate;
    }
    public getUsTravelFromRate() {
        return this.usTravelFromRate;
    }
    public setUsTravelFromRate(usTravelFromRate) {
        this.usTravelFromRate = usTravelFromRate;
    }
    public getCallsInRate() {
        return this.callsInRate;
    }
    public setCallsInRate(callsInRate) {
        this.callsInRate = callsInRate;
    }

    public getUsCallsInRate() {
        return this.callsInRate;
    }
    public setUsCallsInRate(usCallsInRate) {
        this.usCallsInRate = usCallsInRate;
    }
    public getCallsOutRate() {
        return this.callsOutRate;
    }
    public setCallsOutRate(callsOutRate) {
        this.callsOutRate = callsOutRate;
    }

    public getUsCallsOutRate() {
        return this.usCallsOutRate;
    }
    public setUsCallsOutRate(usCallsOutRate) {
        this.usCallsOutRate = usCallsOutRate;
    }

    public getLetterInRate() {
        return this.letterInRate;
    }
    public setLetterInRate(letterInRate) {
        this.letterInRate = letterInRate;
    }
    public getLetterOutRate() {
        return this.letterOutRate;
    }
    public setLetterOutRate(letterOutRate) {
        this.letterOutRate = letterOutRate;
    }
    public getUsLetterOutRate() {
        return this.usLetterOutRate;
    }
    public setUsLetterOutRate(usLetterOutRate) {
        this.usLetterOutRate = usLetterOutRate;
    }
    public getCdAttRate() {
        return this.cdAttRate;
    }
    public setCdAttRate(cdAttRate) {
        this.cdAttRate = cdAttRate;
    }
    public getCdusAttRate() {
        return this.cdusAttRate;
    }
    public setCdusAttRate(cdusAttRate) {
        this.cdusAttRate = cdusAttRate;
    }
    public getEmailInRate() {
        return this.emailInRate;
    }
    public setEmailInRate(emailInRate) {
        this.emailInRate = emailInRate;
    }
    public getEmailOutRate() {
        return this.emailOutRate;
    }
    public setEmailOutRate(emailOutRate) {
        this.emailOutRate = emailOutRate;
    }
    public getUsEmailOutRate() {
        return this.emailOutRate;
    }
    public setUsEmailOutRate(usEmailOutRate) {
        this.usEmailOutRate = usEmailOutRate;
    }
    public getExcessTravel1() {
        return this.excessTravel1;
    }
    public setExcessTravel1(excessTravel1) {
        this.excessTravel1 = excessTravel1;
    }
    public getErrorCode() {
        return this.errorCode;
    }
    public setErrorCode(errorCode) {
        this.errorCode = errorCode;
    }

    public toString() {
        return 'AttendanceRates [attCLSRate=' + this.attCLSRate + ', confRate=' + this.confRate + ', prepRate=' + this.prepRate
            + ', advRate=' + this.advRate + ', waitRate=' + this.waitRate + ', travelRate=' + this.travelRate + ', attRate='
            + this.attRate + ', perMileRate=' + this.perMileRate + ', usWaitRate=' + this.usWaitRate + ', travelToRate='
            + this.travelToRate + ', travelFromRate=' + this.travelFromRate + ', adviAssi=' + this.adviAssi + ', usAdviAssi='
            + this.usAdviAssi + ', usTravelToRate=' + this.usTravelToRate + ', usTravelFromRate=' + this.usTravelFromRate
            + ', callsInRate=' + this.callsInRate + ', callsOutRate=' + this.callsOutRate + ', letterInRate=' + this.letterInRate
            + ', letterOutRate=' + this.letterOutRate + ', cdAttRate=' + this.cdAttRate + ', cdusAttRate=' + this.cdusAttRate
            + ', emailInRate=' + this.emailInRate + ', emailOutRate=' + this.emailOutRate + ', excessTravel1=' + this.excessTravel1
            + ', errorCode=' + this.errorCode + ']';
    }


}
