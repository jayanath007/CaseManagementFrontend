export class PoliceStationTotals {

    private socMin: number;
    private unSocMin: number;
    private socRate: number;
    private unSocRate: number;
    private socVal: number;
    private unSocVal: number;
    private errorCode: number;

    public getSocMin() {
        return this.socMin;
    }
    public setSocMin(socMin) {
        this.socMin = socMin;
    }
    public getUnSocMin() {
        return this.unSocMin;
    }
    public setUnSocMin(unSocMin) {
        this.unSocMin = unSocMin;
    }
    public getSocRate() {
        return this.socRate;
    }
    public setSocRate(socRate) {
        this.socRate = socRate;
    }
    public getUnSocRate() {
        return this.unSocRate;
    }
    public setUnSocRate(unSocRate) {
        this.unSocRate = unSocRate;
    }
    public getSocVal() {
        return this.socVal;
    }
    public setSocVal(socVal) {
        this.socVal = socVal;
    }
    public getUnSocVal() {
        return this.unSocVal;
    }
    public setUnSocVal(unSocVal) {
        this.unSocVal = unSocVal;
    }
    public getErrorCode() {
        return this.errorCode;
    }
    public setErrorCode(errorCode) {
        this.errorCode = errorCode;
    }


    public toString() {
        return 'PoliceStationTotals [socMin=' + this.socMin + ', unSocMin=' + this.unSocMin + ', socRate=' + this.socRate
            + ', unSocRate=' + this.unSocRate + ', socVal=' + this.socVal + ', unSocVal=' + this.unSocVal + ', errorCode='
            + this.errorCode + ']';
    }




}
