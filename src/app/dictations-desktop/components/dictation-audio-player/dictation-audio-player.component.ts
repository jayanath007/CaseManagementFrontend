import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { AudioPlayerComponent } from '../../../shared';

@Component({
  selector: 'dps-dictation-audio-player',
  templateUrl: './dictation-audio-player.component.html',
  styleUrls: ['./dictation-audio-player.component.scss']
})
export class DictationAudioPlayerComponent implements OnInit {

  @Input() url: string;
  @Input() time: number;
  @Input() loading: boolean;

  @Output() saveJobAsDraft = new EventEmitter();
  @ViewChild(AudioPlayerComponent) audioPlayer: AudioPlayerComponent;

  constructor() { }

  ngOnInit() {
    document.addEventListener('Ctrl+Shift+1', (e) => {
      this.audioPlayer.onRewind();
    });
    document.addEventListener('Ctrl+Shift+2', (e) => {
      this.audioPlayer.onPlay();
    });
    document.addEventListener('Ctrl+Shift+3', (e) => {
      this.audioPlayer.onPause();
    });
    document.addEventListener('Ctrl+Shift+4', (e) => {
      this.audioPlayer.onForward();
    });
  }
  onSave() {
this.saveJobAsDraft.emit();
  }
  onOpenWord() {

  }
}
