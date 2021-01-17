import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'dps-meeting-response-coment-dialog',
  templateUrl: './meeting-response-coment-dialog.component.html',
  styleUrls: ['./meeting-response-coment-dialog.component.scss']
})
export class MeetingResponseComentDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
  }

}
