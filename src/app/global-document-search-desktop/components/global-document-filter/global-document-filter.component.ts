import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FilterType, Logic, DocTypes } from '../../../global-document-search-core/models/enum';
import {
  FilterViewModel,
  FilterItem, UpdateCol, DropdownListData
} from '../../../global-document-search-core/models/interface';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'dps-global-document-filter',
  templateUrl: './global-document-filter.component.html',
  styleUrls: ['./global-document-filter.component.scss']
})
export class GlobalDocumentFilterComponent implements OnInit {
  @Input() filterViewModel: FilterViewModel;
  @Input() feeEarnerList: DropdownListData[];
  @Input() appCodeList: DropdownListData[];
  @Input() filterRow: FilterItem;
  @Input() filterList: FilterItem[];

  // @Input() docType: { id: DocTypes, label: string }[];

  @Output() removeFilterRow = new EventEmitter<any>();
  @Output() addFilterRow = new EventEmitter<any>();
  @Output() filterItemChange = new EventEmitter<{ filterId: number, changeValue: any, changeCol: UpdateCol }>();
  FilterType = FilterType;
  Logic = Logic;
  docType = DocTypes;
  constructor(private datePipe: DatePipe) { }


  ngOnInit() {
  }

  onAddFilterRow(event) {
    event.stopPropagation();
    this.addFilterRow.emit();
  }

  onRemoveFilterRow(selectedFilter: FilterItem, $event) {
    event.stopPropagation();
    this.removeFilterRow.emit(selectedFilter.filterId);
  }

  filterFieldChange(selectedFilter: FilterItem, event) {

    this.filterItemChange.emit({ filterId: selectedFilter.filterId, changeValue: event.value, changeCol: UpdateCol.field });
  }

  filterTypeChange(selectedFilter: FilterItem, event) {

    this.filterItemChange.emit({ filterId: selectedFilter.filterId, changeValue: event.value, changeCol: UpdateCol.filterType });
  }

  changeFilterOperator(selectedFilter: FilterItem, event) {

    this.filterItemChange.emit({ filterId: selectedFilter.filterId, changeValue: event.value, changeCol: UpdateCol.operator });
  }

  changeFilterValue(selectedFilter: FilterItem, event) {

    let valuechange = null;
    if (selectedFilter.filterType === FilterType.FromDate) {


      const date = this.datePipe.transform(event.value, 'yyyy-MM-dd');
      valuechange = date + 'T00:00:00Z';


      //   valuechange = new Date(event.value).toISOString().split( '.' ).shift() + 'Z';
      // this.datePipe.transform(event.value, 'yyyy-MM-ddThh:mm:ssZ', 'UTC');
    } else {

      valuechange = event.value;
    }
    this.filterItemChange.emit({ filterId: selectedFilter.filterId, changeValue: valuechange, changeCol: UpdateCol.value });

  }



}

