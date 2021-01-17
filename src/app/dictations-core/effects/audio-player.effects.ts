import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { DictationService } from '../services/dictations.service';
import * as AudioPlayer from '../actions/audio-player';
import { switchMap, map, catchError, tap, filter } from 'rxjs/operators';
import { of } from 'rxjs';
import { AppConfig } from '../../core';

@Injectable()
export class AudioPlayerEffects {
    constructor(private actions$: Actions, private store: Store<any>, private service: DictationService, private appConfig: AppConfig) { }

    @Effect()
    initAudioPlayer$ = this.actions$.pipe(ofType<AudioPlayer.InitAudioPlayer>(AudioPlayer.INIT_AUDIO_PLAYER),
        map((action) => new AudioPlayer.GetAudioUrl(action.jobId)));

    @Effect()
    getAudioUrl$ = this.actions$.pipe(ofType<AudioPlayer.GetAudioUrl>(AudioPlayer.GET_AUDIO_URL),
        switchMap((action) =>
            this.service.getDicatationFileDownloadTransferToken(action.jobId).pipe(
                map((result) => new AudioPlayer.GetAudioUrlSuccess(result)),
                catchError((error) => of(new AudioPlayer.GetAudioUrlFail(error))))
        ));
    @Effect({ dispatch: false })
    getAudioUrlFail$ = this.actions$.pipe(ofType<AudioPlayer.GetAudioUrlFail>(AudioPlayer.GET_AUDIO_URL_FAIL),
        filter((error) => window.opener && window.opener !== window),
        tap((error) => {
            alert('Something went wrong');
            // JSON.stringify(error, null, 4)
        }));


    @Effect()
    saveJob$ = this.actions$.pipe(ofType<AudioPlayer.SaveJob>(AudioPlayer.SAVE_JOB),
        switchMap((action) =>
            this.service.dictationFinishJobFunctions(action.jobId, 30).pipe(
                map((result) => new AudioPlayer.SaveJobSuccess(result)),
                catchError((error) => of(new AudioPlayer.GetAudioUrlFail(error))))
        ));


    @Effect()
    openWindowsMediaPlayer$ = this.actions$.pipe(ofType<AudioPlayer.GetAudioUrlSuccess>
        (AudioPlayer.GET_AUDIO_URL_SUCCESS), map((data) => {
            console.log(data);

            const url = `${this.appConfig.apiv3StorageProxy}/Download/${data.payload.fileName}?id=${data.payload.token}`;
            //  /storage-proxy/v1/
            return new AudioPlayer.SetAudioUrl(url);
        }));

}
