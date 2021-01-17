import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'dps-add-new-menue',
  templateUrl: './add-new-menue.component.html',
  styleUrls: ['./add-new-menue.component.scss']
})
export class AddNewMenueComponent implements OnInit {

  @Output() addNew = new EventEmitter();

  @ViewChild('contextMenu') contextMenu;

  constructor() { }

  ngOnInit() {
  }
  onAdd(type) {
    this.addNew.emit(type);
  }
}
