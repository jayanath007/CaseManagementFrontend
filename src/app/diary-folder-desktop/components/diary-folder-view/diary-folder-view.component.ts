import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'dps-diary-folder-view',
  templateUrl: './diary-folder-view.component.html',
  styleUrls: ['./diary-folder-view.component.scss']
})
export class DiaryFolderViewComponent implements OnInit {
  @Input() menuTreeItems: any;
  @Input() gridFontSize: any;

  constructor() { }

  ngOnInit() {
  }

}
