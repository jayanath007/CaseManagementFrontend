import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ExplorerViewType } from '../../../safe-box-explorer-core/models/enum';
import { MatButtonToggleChange } from '@angular/material';

@Component({
  selector: 'dps-view-types',
  templateUrl: './view-types.component.html',
  styleUrls: ['./view-types.component.scss']
})
export class ViewTypesComponent implements OnInit {


  @Input() viewType: ExplorerViewType;

  @Output() onSeletViewTypes = new EventEmitter<{ viewType: ExplorerViewType }>();

  ExplorerViewType = ExplorerViewType;


  constructor() { }

  ngOnInit() {
  }

  seletViewTypes(event: MatButtonToggleChange) {

    this.onSeletViewTypes.emit({ viewType: event.value });
  }

}
