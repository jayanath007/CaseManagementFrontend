import { User } from '../../auth';
import { RiskAssessmentData } from './interfaces';

export class RiskAssesmentRequest {
    constructor(public user: User, public data: RiskAssessmentData, public clientRef: string) {

    }

    public toPost(): RiskAssessmentData {
        if (this.data) {
            if (this.data.assessmentDetails) {
                if (!this.data.assessmentDetails.doneBy) {
                    this.data.assessmentDetails.doneBy = this.user.general.user;
                    this.data.assessmentDetails.date = new Date().toDpsString();
                } else {
                    this.data.assessmentDetails.overRiddenByBy = this.user.general.user;
                    this.data.assessmentDetails.overRiddenDate = new Date().toDpsString();
                }
            } else {
                this.data.assessmentDetails = {
                    doneBy: this.user.general.user,
                    overRiddenByBy: null,
                    overRiddenDate: null,
                    threshold: null,
                    date: new Date().toDpsString(),
                    id: 0,
                    matterRef: null,
                    clientRef: this.clientRef
                };
            }
        }
        return this.data;
    }
}

