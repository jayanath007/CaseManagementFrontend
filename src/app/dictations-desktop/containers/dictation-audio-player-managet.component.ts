import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { BaseDictationAudioPlayerManager } from '../../dictations-core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'dps-dictation-audio-player-manager',
    template: `
    <dps-dictation-audio-player
        [url]="url$|async"
        [time]="time$|async"
        [loading]="loading$|async"
        (saveJobAsDraft)="onSaveJobAsDraft()"
    >
    </dps-dictation-audio-player>
    `
})
export class DictationAudioPlayerManagerComponent extends BaseDictationAudioPlayerManager implements OnInit {

    constructor(store: Store<any>, private route: ActivatedRoute) {
        super(store);
    }

    ngOnInit() {
        this.route.params.subscribe((params: { jobId: string }) => {
            this.onInit(parseInt(params.jobId, 10));
            if (window.name === 'dps-dictation-audio-player') {
                document.title = `DPS Dictation Audio Player - ${params.jobId}`;
            }
        });
    }

    onSaveJobAsDraft() {

        this.saveJobAsDraft();

    }

}
