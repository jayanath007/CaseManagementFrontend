import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { Attendee } from '../../../core/lib/microsoft-graph';

@Component({
  selector: 'dps-attendee-item',
  templateUrl: './attendee-item.component.html',
  styleUrls: ['./attendee-item.component.scss']
})
export class AttendeeItemComponent implements OnInit, OnChanges {
  @Input() attendee: Attendee;
  @Input() hasRemove: boolean;

  @Output() remove = new EventEmitter();

  showProfileImg = false;

  constructor() { }

  ngOnInit() {
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.attendee) {
      this.showProfileImg = false;
    }
  }
  onRemove() {
    this.remove.emit(this.attendee);
  }
}
