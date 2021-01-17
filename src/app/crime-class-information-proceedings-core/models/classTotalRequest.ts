import { CrimeClassIdentityViewModel } from '../../core/lib/timeRecord';
import { ProceedingClassInfoViewModal } from './interfaces';
import { DatePipe } from '@angular/common';

export class ClassTotalRequest {
    constructor(public crimeClassIdentityRequest: CrimeClassIdentityViewModel,
        public model: ProceedingClassInfoViewModal) {

    }



    public toPost() {
        let representationOrderWithdrawnDate = null;
        if (!!this.model.representationOrderWithdrawnDate) {
            representationOrderWithdrawnDate = new Date(this.model.representationOrderWithdrawnDate).toDpsString();
        }
        return {
            crimeClassIdentityRequest: this.crimeClassIdentityRequest,
            stagedReachedType: this.model.stageReached,
            caseType: this.model.caseType,
            isUrbanRates: this.model.isUrbanRates,
            isDoNotClaimVatChecked: this.model.doNotClaimVAT,
            isCommitedToCrownCourt: this.model.committedToCrownCourt,
            isROAppliedAndNotGranted: this.model.roNotGranted,
            representationOrderWithdrawnDate: representationOrderWithdrawnDate ,
            isExtradition: this.model.extradition,
            isEnhancedRates: this.model.isEnhancedRates,
            uplifts : {
                travUplifts: this.model.travUplifts,
                waitUplifts: this.model.waitUplifts,
                attUplifts: this.model.attUplifts,
                prepUplifts: this.model.prepUplifts,
                advoUplifts: this.model.advoUplifts,
                letterUplifts: this.model.letterUplifts,
                callsUplifts: this.model.callsUplifts
            }
        };
    }
}
