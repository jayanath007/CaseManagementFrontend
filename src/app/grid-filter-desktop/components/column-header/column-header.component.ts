import { Component, OnInit, Input, Output, ChangeDetectionStrategy, EventEmitter } from '@angular/core';
import { ColumnDef } from '../../../core/lib/grid-model';
import { SortDirections } from '../../../odata';

@Component({
  selector: 'dps-column-header',
  templateUrl: './column-header.component.html',
  styleUrls: ['./column-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ColumnHeaderComponent implements OnInit {

  @Input() def: ColumnDef;
  @Input() filterAnchor;

  @Output() filterApply = new EventEmitter();
  @Output() filterClear = new EventEmitter();
  @Output() toggleSorting = new EventEmitter();

  sortDirection: SortDirections;

  constructor() { }

  ngOnInit() {

  }

  onFilterApply(filterGroup) {
    if (!(filterGroup.filters[0].value && filterGroup.filters[0].value.toString().trim())) {
      if (filterGroup.filters[1].value && filterGroup.filters[1].value.toString().trim()) {
        filterGroup.filters.reverse();
        // filterGroup.filters[0] = filterGroup.filters[1];
        // filterGroup.filters[1] = null;
      }
    }
    if (filterGroup && filterGroup.filters[0].value) {
      this.filterApply.emit({ filter: filterGroup, def: this.def });
    } else {
      this.onFilterClear(filterGroup);
    }
  }

  onFilterClear(filterGroup) {
    this.filterClear.emit({ filter: filterGroup, def: this.def });
  }

  onHeaderClick(event: MouseEvent) {
    if (event.defaultPrevented || this.def.extras.disableShort) {
      return;
    }
    this.toggleSorting.emit(this.def);
  }

}
