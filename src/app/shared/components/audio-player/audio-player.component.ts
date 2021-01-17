import { Component, OnInit, Input, ViewChild, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
import { MatSliderChange } from '@angular/material';

@Component({
  selector: 'dps-audio-player',
  templateUrl: './audio-player.component.html',
  styleUrls: ['./audio-player.component.scss']
})
export class AudioPlayerComponent implements OnInit, OnChanges {

  @Input() src: string;
  @Input() time: number;

  @ViewChild('audio') audio: ElementRef<HTMLAudioElement>;

  loading = false;
  isPlaying = false;
  currentTime = 0;
  volume = 0.5;
  duration = 0;
  playbackSpeed = 1;
  rewineForwardTime = 5;
  speedList = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

  constructor() { }

  ngOnInit() {
    this.audio.nativeElement.addEventListener('playing', () => {
      this.isPlaying = true;
      this.duration = Math.floor(this.audio.nativeElement.duration);
    });
    this.audio.nativeElement.addEventListener('pause', () => {
      this.isPlaying = false;
    });
    this.audio.nativeElement.addEventListener('timeupdate', () => {
      this.currentTime = Math.floor(this.audio.nativeElement.currentTime);
    });
    this.audio.nativeElement.addEventListener('volume', () => {
      this.volume = Math.floor(this.audio.nativeElement.volume);
    });
    this.audio.nativeElement.addEventListener('loadstart', () => {
      this.loading = true;
    });
    this.audio.nativeElement.addEventListener('loadeddata', () => {
      this.loading = false;
      this.duration = Math.floor(this.audio.nativeElement.duration);
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.time) {
      this.currentTime = changes.time.currentValue > 0 ? changes.time.currentValue : 0;
      this.audio.nativeElement.currentTime = this.currentTime;
    }
  }

  onTimePosChange(event: MatSliderChange) {
    this.audio.nativeElement.currentTime = event.value;
  }

  onVolumePosChange(event: MatSliderChange) {
    this.volume = event.value === 0 ? 0 : event.value / 100;
    this.audio.nativeElement.volume = this.volume;
  }

  public onPlayPuse() {
    this.audio.nativeElement.paused ? this.onPlay() : this.onPause();
  }

  public onPlay() {
    this.audio.nativeElement.play();
  }

  public onPause() {
    this.audio.nativeElement.pause();
  }

  public onForward() {
    this.audio.nativeElement.currentTime += this.rewineForwardTime;
  }

  public onRewind() {
    this.audio.nativeElement.currentTime -= this.rewineForwardTime;
  }

  public onStart() {
    this.audio.nativeElement.currentTime = 0;
  }

  public onEnd() {
    this.audio.nativeElement.currentTime = this.duration;
  }

  public onVolumeOff() {
    this.volume = 0;
    this.audio.nativeElement.volume = this.volume;
  }

  public onMaxVolume() {
    this.volume = 1;
    this.audio.nativeElement.volume = this.volume;
  }

  public onVolumeUp() {
    if (this.volume < 1) {
      this.volume += 0.01;
    }
    this.audio.nativeElement.volume = this.volume;
  }

  public onVolumeDown() {
    if (this.volume < 0) {
      this.volume -= 0.01;
    }
    this.audio.nativeElement.volume = this.volume;
  }

  public onChangeSpeed(value) {
    this.playbackSpeed = value;
    this.audio.nativeElement.playbackRate = this.playbackSpeed;
  }

  formatLabel(value: number) {
    return Math.round(value);
  }

}
