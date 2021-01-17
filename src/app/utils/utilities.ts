export class Utilities {

    public static ConvertFromBase64Arithmetic(sValue): number {

        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
        let base10 = 0;
        let c;
        for (let index = sValue.length - 1, power = 0; index >= 0; index--, power++) {
            c = sValue[index];
            const i = alphabet.indexOf(c);
            const multiplier = parseInt(Math.pow(64, power).toString(), 10);
            base10 += i * multiplier;
        }
        return base10;
    }

    public static ConvertToBase64Arithmetic(i: number): string {

        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
        let num = i;
        let sb = '';
        do {
            sb = sb + alphabet[(num % 64)];
            num = parseInt((num / 64).toString(), 10);
        } while (num !== 0);
        return sb.split('').reverse().join('');
    }

    public static CreateDPSSubject(branchID: number, appID: number, fileID: number, companyCode: string, conversationID?: number): string {
        let subjectRef = '#DPS:';
        subjectRef += ((companyCode ? companyCode : 'ZZ') + ':');
        const matterCode = branchID.toString() + (appID < 10 ? ('0' + appID) : appID.toString()) + fileID;
        subjectRef += ((branchID > 9 ? '$' : '') + this.ConvertToBase64Arithmetic(parseInt(matterCode, 10)) + ':');
        subjectRef += (conversationID !== null ? this.ConvertToBase64Arithmetic(conversationID || 0) : 'z');
        return subjectRef + '#';
    }


    public static getOpenCaseTabKey(appID, fileID) {
        const tokenKey = '(DPS:' + ':' + appID + ':' + fileID + ')';
        return 'openCaseToken_' + btoa(tokenKey);
    }

}
