import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { UserWithRights } from '../../../file-security-rights-core';
import { ColumnDef, PaginatorDef } from '../../../core/lib/grid-model';
import { MatCheckboxChange } from '@angular/material';

@Component({
  selector: 'dps-file-security-rights-layout',
  templateUrl: './file-security-rights-layout.component.html',
  styleUrls: ['./file-security-rights-layout.component.scss']
})
export class FileSecurityRightsLayoutComponent implements OnInit {
  @Input() isLoading: boolean;

  @Input() matterId: number;
  @Input() users: UserWithRights[];
  @Input() originalUsers: UserWithRights[];
  @Input() gridColoumns: ColumnDef[];
  @Input() paginatorDef: PaginatorDef;

  @Output() close = new EventEmitter<any>();
  @Output() hasRightsChange = new EventEmitter<{ value: boolean, index: number }>();
  @Output() changeUsers = new EventEmitter<{ matterId: number, userListWithRights: UserWithRights[] }>();

  constructor() { }

  ngOnInit() {
  }
  onClose() {
    this.close.emit();
  }
  onOk() {
    const users = this.users.filter((value, index) => value.hasRights !== this.originalUsers[index].hasRights);
    if (users && users.length > 0) {
      this.changeUsers.emit({ matterId: this.matterId, userListWithRights: users });
    }
    this.close.emit();
  }
  onCancel() {
    this.close.emit();
  }
  onHasRightsChange(event: MatCheckboxChange, index: number) {
    this.hasRightsChange.emit({ value: event.checked, index: index });
  }
  getFxFlexProperty(index) {
    if (!this.gridColoumns) { return ''; }
    return this.gridColoumns[index]
      && this.gridColoumns[index].extras ? this.gridColoumns[index].extras.fxFlex : '';
  }
}
