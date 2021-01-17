import { ProgressSteps } from './enums';

export class TemplateProsessingState {

    constructor(public currentState = ProgressSteps.Invisible, public waitingForInput = false, public progressFlag = 0) {
    }

    public continue(state: ProgressSteps, waitingForInput = false) {
        // tslint:disable-next-line:no-bitwise
        return new TemplateProsessingState(state, waitingForInput, this.progressFlag | state);
    }

    public didProgress(state: number) {
        // tslint:disable-next-line:no-bitwise
        return (this.progressFlag & state) === state;
    }

    public isCurrentState(state: number) {
        return state === this.getState();
    }

    public getState() {
        return this.currentState;
    }
}
