import { getLoading, getTime, getUrl } from './../reducers';
import { Store } from '@ngrx/store';
import { InitAudioPlayer, SaveJob } from '../actions/audio-player';
import { Observable, of } from 'rxjs';


export class BaseDictationAudioPlayerManager {

    loading$: Observable<boolean> = of(true);
    url$: Observable<string> = of(null);
    time$: Observable<number> = of(null);
    jobId: number;

    constructor(protected store: Store<any>) { }

    onInit(jobId: number) {
        this.store.dispatch(new InitAudioPlayer(jobId));
        this.loading$ = this.store.select(getLoading);
        this.url$ = this.store.select(getUrl);
        this.time$ = this.store.select(getTime);
        this.jobId = jobId;
    }

    saveJobAsDraft(){
        this.store.dispatch(new SaveJob(this.jobId));

    }
}
